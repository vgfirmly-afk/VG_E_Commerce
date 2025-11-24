// handlers/fulfillmentHandlers.js
import { logError } from "../utils/logger.js";
import * as fulfillmentService from "../services/fulfillmentService.js";
import {
  validateOrderId,
  validateCreateFulfillmentWebhook,
  validateUpdateFulfillmentStatus,
  validateAddShippingTracking,
  validateUpdateShippingTracking,
} from "../utils/validators.js";

/**
 * POST /webhooks/fulfillment - Handle fulfillment creation webhook
 * Called by Payment/Checkout Worker when payment is confirmed
 */
export async function handleFulfillmentWebhook(request, env) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Invalid JSON in request body",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Validate webhook data
    const { error, value } = validateCreateFulfillmentWebhook(body);
    if (error) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Invalid webhook data",
          details: error.details.map((d) => ({
            path: d.path.join("."),
            message: d.message,
            type: d.type,
          })),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const result = await fulfillmentService.createFulfillmentFromWebhook(
      value,
      env,
    );

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    logError("handleFulfillmentWebhook: Handler error", err);
    const status = err.message.includes("not found") ? 404 : 500;
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * GET /api/v1/orders/:order_id - Get order details by ID
 */
export async function getOrderById(request, env) {
  try {
    const orderId = request.params?.order_id;

    const { error: idError } = validateOrderId(orderId);
    if (idError) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: idError.details?.[0]?.message || "Invalid Order ID",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const order = await fulfillmentService.getOrderDetails(orderId, env);

    if (!order) {
      return new Response(
        JSON.stringify({
          error: "not_found",
          message: "Order not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    logError("getOrderById: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * GET /api/v1/orders - Get all orders for user
 */
export async function getUserOrders(request, env) {
  try {
    const userId = request.headers.get("X-User-Id") || null;
    const guestSessionId = request.headers.get("X-Session-Id") || null;

    if (!userId && !guestSessionId) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Either X-User-Id or X-Session-Id header is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Get pagination params
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    const orders = await fulfillmentService.getUserOrders(
      userId,
      guestSessionId,
      limit,
      offset,
      env,
    );

    return new Response(JSON.stringify({ orders, count: orders.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    logError("getUserOrders: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * PUT /api/v1/orders/:order_id/status - Update fulfillment status
 */
export async function updateFulfillmentStatus(request, env) {
  try {
    const orderId = request.params?.order_id;
    let body;

    try {
      body = await request.json();
    } catch (parseErr) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Invalid JSON in request body",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { error: idError } = validateOrderId(orderId);
    if (idError) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: idError.details?.[0]?.message || "Invalid Order ID",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { error, value } = validateUpdateFulfillmentStatus(body);
    if (error) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Invalid status update data",
          details: error.details.map((d) => ({
            path: d.path.join("."),
            message: d.message,
            type: d.type,
          })),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const userId = request.headers.get("X-User-Id") || "system";
    const order = await fulfillmentService.updateFulfillmentStatusService(
      orderId,
      value.status,
      value.notes,
      userId,
      env,
    );

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    logError("updateFulfillmentStatus: Handler error", err);
    const status = err.message.includes("not found") ? 404 : 500;
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * POST /api/v1/orders/:order_id/tracking - Add shipping tracking
 */
export async function addShippingTracking(request, env) {
  try {
    const orderId = request.params?.order_id;
    let body;

    try {
      body = await request.json();
    } catch (parseErr) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Invalid JSON in request body",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { error: idError } = validateOrderId(orderId);
    if (idError) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: idError.details?.[0]?.message || "Invalid Order ID",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { error, value } = validateAddShippingTracking(body);
    if (error) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Invalid tracking data",
          details: error.details.map((d) => ({
            path: d.path.join("."),
            message: d.message,
            type: d.type,
          })),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const tracking = await fulfillmentService.addShippingTrackingService(
      orderId,
      value,
      env,
    );

    return new Response(JSON.stringify(tracking), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    logError("addShippingTracking: Handler error", err);
    const status = err.message.includes("not found")
      ? 404
      : err.message.includes("already exists")
        ? 409
        : 500;
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * PUT /api/v1/tracking/:tracking_id - Update shipping tracking
 */
export async function updateShippingTracking(request, env) {
  try {
    const trackingId = request.params?.tracking_id;
    let body;

    try {
      body = await request.json();
    } catch (parseErr) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Invalid JSON in request body",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!trackingId) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Tracking ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { error, value } = validateUpdateShippingTracking(body);
    if (error) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Invalid tracking update data",
          details: error.details.map((d) => ({
            path: d.path.join("."),
            message: d.message,
            type: d.type,
          })),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const tracking = await fulfillmentService.updateShippingTrackingService(
      trackingId,
      value,
      env,
    );

    return new Response(JSON.stringify(tracking), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    logError("updateShippingTracking: Handler error", err);
    const status = err.message.includes("not found") ? 404 : 500;
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status, headers: { "Content-Type": "application/json" } },
    );
  }
}
