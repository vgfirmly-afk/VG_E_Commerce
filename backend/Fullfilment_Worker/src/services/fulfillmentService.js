// services/fulfillmentService.js
import { logger, logError, logWarn } from "../utils/logger.js";
import {
  createOrder,
  getOrder,
  getOrderByOrderNumber,
  getOrdersByUserId,
  getOrdersByGuestSessionId,
  updateOrder,
  createOrderItem,
  getOrderItems,
  createFulfillmentStatus,
  getFulfillmentStatuses,
  createShippingTracking,
  getShippingTrackingByOrderId,
  updateShippingTracking,
} from "../db/db1.js";

/**
 * Get checkout session from Checkout Worker via service binding
 */
async function getCheckoutSessionFromCheckoutWorker(sessionId, env) {
  try {
    const checkoutWorker = env.CHECKOUT_WORKER;
    if (!checkoutWorker) {
      throw new Error("CHECKOUT_WORKER binding not available");
    }

    // Use service binding - URL is just for routing, not an external HTTP call
    const protocol = "https";
    const hostname = "checkout-worker";
    const path = "/api/v1/checkout/sessions/" + encodeURIComponent(sessionId);
    const urlString = protocol + "://" + hostname + path;
    const checkoutRequest = new Request(urlString, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Source": "fulfillment-worker-service-binding",
      },
    });

    // Service binding fetch - this goes through Cloudflare's internal routing, not external HTTP
    const response = await checkoutWorker.fetch(checkoutRequest);
    if (!response.ok) {
      throw new Error(`Failed to get checkout session: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    logError("getCheckoutSessionFromCheckoutWorker: Error", err, { sessionId });
    throw err;
  }
}

/**
 * Get product details from Catalog Worker via service binding
 */
async function getProductFromCatalogWorker(productId, env) {
  try {
    const catalogWorker = env.CATALOG_WORKER;
    if (!catalogWorker) {
      logWarn(
        "getProductFromCatalogWorker: CATALOG_WORKER binding not available",
        { productId },
      );
      return null;
    }

    const protocol = "https";
    const hostname = "catalog-worker";
    const path = "/api/v1/products/" + encodeURIComponent(productId);
    const urlString = protocol + "://" + hostname + path;
    const catalogRequest = new Request(urlString, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Source": "fulfillment-worker-service-binding",
      },
    });

    const response = await catalogWorker.fetch(catalogRequest);
    if (!response.ok) {
      logWarn("getProductFromCatalogWorker: Failed to get product", {
        productId,
        status: response.status,
      });
      return null;
    }

    return await response.json();
  } catch (err) {
    logWarn("getProductFromCatalogWorker: Error", {
      productId,
      error: err.message,
    });
    return null;
  }
}

/**
 * Create fulfillment from webhook (called by Payment/Checkout Worker)
 */
export async function createFulfillmentFromWebhook(webhookData, env) {
  try {
    const {
      checkout_session_id,
      payment_id,
      user_id,
      guest_session_id,
      order_data,
    } = webhookData;

    // Verify checkout session exists (optional - can be removed if not needed)
    let checkoutSession = null;
    try {
      checkoutSession = await getCheckoutSessionFromCheckoutWorker(
        checkout_session_id,
        env,
      );
    } catch (err) {
      logWarn(
        "createFulfillmentFromWebhook: Could not verify checkout session",
        { checkout_session_id, error: err.message },
      );
      // Continue anyway - webhook data is trusted
    }

    // Extract address IDs from order_data if available
    const delivery_address_id = order_data.delivery_address?.address_id || null;
    const billing_address_id = order_data.billing_address?.address_id || null;
    const shipping_method_id = order_data.shipping_method?.method_id || null;

    // Create order
    const order = await createOrder(
      {
        checkout_session_id,
        payment_id,
        user_id,
        guest_session_id,
        delivery_address_id,
        billing_address_id,
        shipping_method_id,
        estimated_delivery_date: order_data.estimated_delivery_date || null,
        subtotal: order_data.subtotal,
        shipping_cost: order_data.shipping_cost,
        tax: order_data.tax,
        total: order_data.total,
        currency: order_data.currency || "USD",
        notes: `Order created from checkout session ${checkout_session_id}`,
      },
      env,
    );

    // Create order items
    const orderItems = [];
    for (const item of order_data.items || []) {
      const orderItem = await createOrderItem(
        order.order_id,
        {
          sku_id: item.sku_id,
          product_id: item.product_id || null,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
        },
        env,
      );
      orderItems.push(orderItem);
    }

    logger("fulfillment.created", {
      orderId: order.order_id,
      orderNumber: order.order_number,
      checkout_session_id,
      payment_id,
      itemCount: orderItems.length,
    });

    return {
      order_id: order.order_id,
      order_number: order.order_number,
      status: order.status,
      items: orderItems,
      created_at: order.created_at,
    };
  } catch (err) {
    logError("createFulfillmentFromWebhook: Service error", err, {
      webhookData,
    });
    throw err;
  }
}

/**
 * Get order with full details
 */
export async function getOrderDetails(orderId, env) {
  try {
    const order = await getOrder(orderId, env);
    if (!order) {
      return null;
    }

    // Get order items
    const items = await getOrderItems(orderId, env);

    // Enrich items with product details (optional)
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        let product = null;
        if (item.product_id) {
          product = await getProductFromCatalogWorker(item.product_id, env);
        }
        return {
          ...item,
          product: product
            ? {
                product_id: product.product_id,
                name: product.name,
                description: product.description,
                image_url: product.image_url,
              }
            : null,
        };
      }),
    );

    // Get fulfillment status history
    const statusHistory = await getFulfillmentStatuses(orderId, env);

    // Get shipping tracking
    const shippingTracking = await getShippingTrackingByOrderId(orderId, env);

    return {
      ...order,
      items: enrichedItems,
      status_history: statusHistory,
      shipping_tracking: shippingTracking,
    };
  } catch (err) {
    logError("getOrderDetails: Service error", err, { orderId });
    throw err;
  }
}

/**
 * Get orders for user
 */
export async function getUserOrders(
  userId,
  guestSessionId,
  limit = 50,
  offset = 0,
  env,
) {
  try {
    let orders = [];

    if (userId) {
      orders = await getOrdersByUserId(userId, limit, offset, env);
    } else if (guestSessionId) {
      orders = await getOrdersByGuestSessionId(
        guestSessionId,
        limit,
        offset,
        env,
      );
    } else {
      throw new Error("Either user_id or guest_session_id is required");
    }

    // Enrich orders with item counts
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const items = await getOrderItems(order.order_id, env);
        const shippingTracking = await getShippingTrackingByOrderId(
          order.order_id,
          env,
        );

        return {
          ...order,
          item_count: items.length,
          has_tracking: !!shippingTracking,
        };
      }),
    );

    return enrichedOrders;
  } catch (err) {
    logError("getUserOrders: Service error", err, { userId, guestSessionId });
    throw err;
  }
}

/**
 * Update fulfillment status
 */
export async function updateFulfillmentStatusService(
  orderId,
  status,
  notes,
  updatedBy,
  env,
) {
  try {
    const order = await getOrder(orderId, env);
    if (!order) {
      throw new Error("Order not found");
    }

    // Update order status
    await updateOrder(orderId, { status }, env);

    // Create status history entry
    await createFulfillmentStatus(orderId, status, notes, updatedBy, env);

    logger("fulfillment.status.updated", { orderId, status, updatedBy });
    return await getOrderDetails(orderId, env);
  } catch (err) {
    logError("updateFulfillmentStatusService: Service error", err, {
      orderId,
      status,
    });
    throw err;
  }
}

/**
 * Add shipping tracking
 */
export async function addShippingTrackingService(orderId, trackingData, env) {
  try {
    const order = await getOrder(orderId, env);
    if (!order) {
      throw new Error("Order not found");
    }

    // Check if tracking already exists
    const existing = await getShippingTrackingByOrderId(orderId, env);
    if (existing) {
      throw new Error("Shipping tracking already exists for this order");
    }

    const tracking = await createShippingTracking(orderId, trackingData, env);

    // Update order status to 'shipped' if not already
    if (order.status !== "shipped" && order.status !== "delivered") {
      await updateOrder(orderId, { status: "shipped" }, env);
      await createFulfillmentStatus(
        orderId,
        "shipped",
        "Shipping tracking added",
        "system",
        env,
      );
    }

    logger("shipping_tracking.added", {
      orderId,
      trackingId: tracking.tracking_id,
    });
    return tracking;
  } catch (err) {
    logError("addShippingTrackingService: Service error", err, {
      orderId,
      trackingData,
    });
    throw err;
  }
}

/**
 * Update shipping tracking
 */
export async function updateShippingTrackingService(trackingId, updates, env) {
  try {
    const { getShippingTracking, updateShippingTracking } = await import(
      "../db/db1.js"
    );

    const tracking = await getShippingTracking(trackingId, env);
    if (!tracking) {
      throw new Error("Shipping tracking not found");
    }

    const updated = await updateShippingTracking(trackingId, updates, env);

    // If status is 'delivered', update order status
    if (updates.status === "delivered" && updates.actual_delivery_date) {
      await updateOrder(
        tracking.order_id,
        {
          status: "delivered",
          actual_delivery_date: updates.actual_delivery_date,
        },
        env,
      );
      await createFulfillmentStatus(
        tracking.order_id,
        "delivered",
        "Order delivered",
        "system",
        env,
      );
    }

    logger("shipping_tracking.updated", { trackingId, updates });
    return updated;
  } catch (err) {
    logError("updateShippingTrackingService: Service error", err, {
      trackingId,
      updates,
    });
    throw err;
  }
}
