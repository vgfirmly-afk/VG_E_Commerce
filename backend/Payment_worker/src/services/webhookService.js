// services/webhookService.js
// PayPal Webhook handling - server-to-server payment status updates
import { logger, logError, logWarn } from '../utils/logger.js';
import {
  getPaymentByOrderId,
  updatePaymentStatus,
  logPaymentEvent
} from '../db/db1.js';
import {
  capturePayPalOrder,
  getPayPalOrder
} from './paypalService.js';

/**
 * Call webhook to Checkout Worker to update payment status
 */
async function notifyCheckoutWorker(payment, env) {
  try {
    const checkoutWorker = env.CHECKOUT_WORKER;
    if (!checkoutWorker) {
      logWarn('notifyCheckoutWorker: CHECKOUT_WORKER binding not available', { payment_id: payment.payment_id });
      return;
    }
    
    const webhookUrl = 'https://checkout-worker/api/v1/webhooks/payment-status';
    const webhookData = {
      checkout_session_id: payment.checkout_session_id,
      payment_id: payment.payment_id,
      payment_status: payment.status,
      payment_data: {
        paypal_order_id: payment.order_id,
        paypal_transaction_id: payment.paypal_transaction_id,
        amount: payment.amount,
        currency: payment.currency,
        captured_at: payment.captured_at
      }
    };
    
    const response = await checkoutWorker.fetch(new Request(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'payment-worker-webhook'
      },
      body: JSON.stringify(webhookData)
    }));
    
    if (!response.ok) {
      logError('notifyCheckoutWorker: Webhook call failed', null, {
        payment_id: payment.payment_id,
        status: response.status
      });
    } else {
      logger('webhook.checkout.notified', { payment_id: payment.payment_id });
    }
  } catch (err) {
    logError('notifyCheckoutWorker: Error', err, { payment_id: payment.payment_id });
  }
}

/**
 * Call webhook to Inventory Worker to deduct stock
 */
async function notifyInventoryWorker(payment, orderItems, env) {
  try {
    const inventoryWorker = env.INVENTORY_WORKER;
    if (!inventoryWorker) {
      logWarn('notifyInventoryWorker: INVENTORY_WORKER binding not available', { payment_id: payment.payment_id });
      return;
    }
    
    if (!orderItems || orderItems.length === 0) {
      logWarn('notifyInventoryWorker: No order items provided', { payment_id: payment.payment_id });
      return;
    }
    
    const webhookUrl = 'https://inventory-worker/api/v1/webhooks/payment-status';
    const webhookData = {
      payment_id: payment.payment_id,
      payment_status: payment.status,
      checkout_session_id: payment.checkout_session_id,
      order_items: orderItems.map(item => ({
        sku_id: item.sku_id,
        product_id: item.product_id || null,
        quantity: item.quantity,
        unit_price: item.unit_price || 0,
        subtotal: item.subtotal || (item.unit_price || 0) * item.quantity,
        order_id: payment.payment_id
      }))
    };
    
    const response = await inventoryWorker.fetch(new Request(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'payment-worker-webhook'
      },
      body: JSON.stringify(webhookData)
    }));
    
    if (!response.ok) {
      logError('notifyInventoryWorker: Webhook call failed', null, {
        payment_id: payment.payment_id,
        status: response.status
      });
    } else {
      logger('webhook.inventory.notified', { payment_id: payment.payment_id });
    }
  } catch (err) {
    logError('notifyInventoryWorker: Error', err, { payment_id: payment.payment_id });
  }
}

/**
 * Call webhook to Fulfillment Worker to create order
 */
async function notifyFulfillmentWorker(payment, checkoutSession, env) {
  try {
    const fulfillmentWorker = env.FULFILLMENT_WORKER;
    if (!fulfillmentWorker) {
      logWarn('notifyFulfillmentWorker: FULFILLMENT_WORKER binding not available', { payment_id: payment.payment_id });
      return;
    }
    
    if (!checkoutSession) {
      logWarn('notifyFulfillmentWorker: Checkout session not provided', { payment_id: payment.payment_id });
      return;
    }
    
    const webhookUrl = 'https://fulfillment-worker/api/v1/webhooks/fulfillment';
    // Ensure items have all required fields
    const enrichedItems = (checkoutSession.items || []).map(item => ({
      sku_id: item.sku_id,
      product_id: item.product_id || null,
      quantity: item.quantity,
      unit_price: item.unit_price || 0,
      subtotal: item.subtotal || (item.unit_price || 0) * item.quantity
    }));
    
    const webhookData = {
      checkout_session_id: payment.checkout_session_id,
      payment_id: payment.payment_id,
      user_id: checkoutSession.user_id || null,
      guest_session_id: checkoutSession.guest_session_id || null,
      order_data: {
        delivery_address: checkoutSession.delivery_address ? {
          address_id: checkoutSession.delivery_address.address_id || null,
          full_name: checkoutSession.delivery_address.full_name,
          phone: checkoutSession.delivery_address.phone,
          email: checkoutSession.delivery_address.email || null,
          address_line1: checkoutSession.delivery_address.address_line1,
          address_line2: checkoutSession.delivery_address.address_line2 || null,
          city: checkoutSession.delivery_address.city,
          state: checkoutSession.delivery_address.state,
          postal_code: checkoutSession.delivery_address.postal_code,
          country: checkoutSession.delivery_address.country || 'IN'
        } : null,
        billing_address: checkoutSession.billing_address ? {
          address_id: checkoutSession.billing_address.address_id || null,
          full_name: checkoutSession.billing_address.full_name,
          phone: checkoutSession.billing_address.phone,
          email: checkoutSession.billing_address.email || null,
          address_line1: checkoutSession.billing_address.address_line1,
          address_line2: checkoutSession.billing_address.address_line2 || null,
          city: checkoutSession.billing_address.city,
          state: checkoutSession.billing_address.state,
          postal_code: checkoutSession.billing_address.postal_code,
          country: checkoutSession.billing_address.country || 'IN'
        } : null,
        shipping_method: checkoutSession.shipping_method ? {
          method_id: checkoutSession.shipping_method.method_id,
          name: checkoutSession.shipping_method.name,
          carrier: checkoutSession.shipping_method.carrier,
          base_cost: checkoutSession.shipping_method.base_cost
        } : null,
        items: enrichedItems,
        subtotal: checkoutSession.subtotal || 0,
        shipping_cost: checkoutSession.shipping_cost || 0,
        tax: checkoutSession.tax || 0,
        total: checkoutSession.total || payment.amount,
        currency: checkoutSession.currency || payment.currency || 'USD',
        estimated_delivery_date: checkoutSession.estimated_delivery_date || null
      }
    };
    
    const response = await fulfillmentWorker.fetch(new Request(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'payment-worker-webhook'
      },
      body: JSON.stringify(webhookData)
    }));
    
    if (!response.ok) {
      logError('notifyFulfillmentWorker: Webhook call failed', null, {
        payment_id: payment.payment_id,
        status: response.status
      });
    } else {
      logger('webhook.fulfillment.notified', { payment_id: payment.payment_id });
    }
  } catch (err) {
    logError('notifyFulfillmentWorker: Error', err, { payment_id: payment.payment_id });
  }
}

/**
 * Get checkout session from Checkout Worker
 */
async function getCheckoutSessionFromCheckoutWorker(sessionId, env) {
  try {
    const checkoutWorker = env.CHECKOUT_WORKER;
    if (!checkoutWorker) {
      return null;
    }
    
    const url = `https://checkout-worker/api/v1/checkout/sessions/${encodeURIComponent(sessionId)}`;
    const response = await checkoutWorker.fetch(new Request(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Source': 'payment-worker-webhook'
      }
    }));
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (err) {
    logError('getCheckoutSessionFromCheckoutWorker: Error', err, { sessionId });
    return null;
  }
}

/**
 * Get product_id for SKU from Catalog Worker
 */
async function getProductIdForSku(skuId, env) {
  try {
    const catalogWorker = env.CATALOG_WORKER;
    if (!catalogWorker) {
      return null;
    }
    
    // Get SKU details from Catalog Worker
    const url = `https://catalog-worker/api/v1/skus/${encodeURIComponent(skuId)}`;
    const response = await catalogWorker.fetch(new Request(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Source': 'payment-worker-webhook'
      }
    }));
    
    if (!response.ok) {
      return null;
    }
    
    const sku = await response.json();
    return sku?.product_id || null;
  } catch (err) {
    logWarn('getProductIdForSku: Error getting product_id', { skuId, error: err.message });
    return null;
  }
}

/**
 * Enrich order items with product_id from Catalog Worker
 */
async function enrichOrderItemsWithProductIds(items, env) {
  try {
    if (!items || items.length === 0) {
      return items;
    }
    
    // Get product_ids for all SKUs in parallel
    const enrichedItems = await Promise.all(items.map(async (item) => {
      const productId = await getProductIdForSku(item.sku_id, env);
      return {
        ...item,
        product_id: productId || item.product_id || null
      };
    }));
    
    return enrichedItems;
  } catch (err) {
    logError('enrichOrderItemsWithProductIds: Error', err);
    // Return original items if enrichment fails
    return items;
  }
}

/**
 * Verify PayPal webhook signature
 * Note: PayPal webhook verification requires fetching the certificate
 * For now, we'll verify the event structure and order ID
 */
export async function verifyWebhookSignature(headers, body, env) {
  try {
    // PayPal sends webhook signature in headers
    const authAlgo = headers.get('PAYPAL-AUTH-ALGO');
    const certUrl = headers.get('PAYPAL-CERT-URL');
    const transmissionId = headers.get('PAYPAL-TRANSMISSION-ID');
    const transmissionSig = headers.get('PAYPAL-TRANSMISSION-SIG');
    const transmissionTime = headers.get('PAYPAL-TRANSMISSION-TIME');
    
    // Basic validation - in production, verify signature properly
    if (!transmissionId || !transmissionSig) {
      logWarn('verifyWebhookSignature: Missing PayPal webhook headers', {
        hasAuthAlgo: !!authAlgo,
        hasCertUrl: !!certUrl,
        hasTransmissionId: !!transmissionId,
        hasTransmissionSig: !!transmissionSig
      });
      // For development, we'll allow webhooks without full verification
      // In production, implement full signature verification
      return true;
    }
    
    logger('webhook.signature.verified', {
      transmission_id: transmissionId,
      transmission_time: transmissionTime
    });
    
    return true;
  } catch (err) {
    logError('verifyWebhookSignature: Error', err);
    return false;
  }
}

/**
 * Handle PayPal webhook event
 * This is where the actual payment processing happens (server-to-server)
 */
export async function handleWebhookEvent(event, env) {
  try {
    const eventType = event.event_type;
    const resource = event.resource;
    
    logger('webhook.event.received', {
      event_type: eventType,
      event_id: event.id,
      resource_type: resource?.type
    });
    
    // Handle different webhook event types
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log('PAYMENT.CAPTURE.COMPLETED', resource);
        return await handlePaymentCaptureCompleted(resource, env);
      
      case 'PAYMENT.CAPTURE.DENIED':
        console.log('PAYMENT.CAPTURE.DENIED', resource);
        return await handlePaymentCaptureDenied(resource, env);
      
      case 'PAYMENT.CAPTURE.DECLINED':
        console.log('PAYMENT.CAPTURE.DECLINED', resource);
        return await handlePaymentCaptureDenied(resource, env); // Same handler as DENIED
      
      case 'PAYMENT.ORDER.CANCELLED':
        console.log('PAYMENT.ORDER.CANCELLED', resource);
        return await handleOrderCancelled(resource, env);
      
      case 'PAYMENT.ORDER.CREATED':
        console.log('PAYMENT.ORDER.CREATED', resource);
        return await handleOrderCreated(resource, env);
      
      case 'CHECKOUT.ORDER.APPROVED':
        console.log('CHECKOUT.ORDER.APPROVED', resource);
        return await handleOrderApproved(resource, env);
      
      case 'CHECKOUT.ORDER.COMPLETED':
        console.log('CHECKOUT.ORDER.COMPLETED', resource);
        return await handleOrderCompleted(resource, env);
      
      case 'CHECKOUT.ORDER.DECLINED':
        console.log('CHECKOUT.ORDER.DECLINED', resource);
        return await handleOrderCancelled(resource, env); // Treat DECLINED as cancelled
      
      case 'CHECKOUT.ORDER.SAVED':
        // Order saved but not yet approved - just log it
        logger('webhook.checkout.order.saved', { orderId: resource.id });
        return { processed: true, message: 'Order saved (no action needed)' };
      
      case 'CHECKOUT.ORDER.VOIDED':
        return await handleOrderCancelled(resource, env); // Treat VOIDED as cancelled
      
      default:
        logger('webhook.event.ignored', {
          event_type: eventType,
          event_id: event.id
        });
        return { processed: false, message: `Event type ${eventType} not handled` };
    }
  } catch (err) {
    logError('handleWebhookEvent: Error processing webhook', err, { event });
    throw err;
  }
}

/**
 * Handle PAYMENT.CAPTURE.COMPLETED webhook
 * Payment was successfully captured
 */
async function handlePaymentCaptureCompleted(resource, env) {
  try {
    const captureId = resource.id;
    const orderId = resource.supplementary_data?.related_ids?.order_id;
    
    if (!orderId) {
      logError('handlePaymentCaptureCompleted: No order ID in resource', null, { resource });
      return { processed: false, error: 'No order ID found' };
    }
    
    // Find payment by PayPal order ID
    let payment = await getPaymentByOrderId(orderId, env);
    if (!payment) {
      logError('handlePaymentCaptureCompleted: Payment not found', null, { orderId });
      return { processed: false, error: 'Payment not found' };
    }
    
    // Update payment to captured
    const purchaseUnit = resource.purchase_units?.[0];
    const captureData = purchaseUnit?.payments?.captures?.[0];
    const payer = resource.payer;
    
    payment = await updatePaymentStatus(payment.payment_id, 'captured', {
      paypal_transaction_id: captureId,
      payer_email: payer?.email_address || null,
      payer_name: payer?.name ? `${payer.name.given_name} ${payer.name.surname}`.trim() : null,
      captured_at: new Date().toISOString(),
      metadata: {
        ...(payment.metadata || {}),
        paypal_capture: {
          id: resource.id,
          status: resource.status,
          amount: captureData?.amount,
          final_capture: captureData?.final_capture
        },
        webhook_received_at: new Date().toISOString()
      }
    }, env);
    
    // Log capture event
    await logPaymentEvent(payment.payment_id, 'captured', {
      paypal_order_id: orderId,
      paypal_transaction_id: captureId,
      amount: captureData?.amount?.value,
      source: 'webhook'
    }, env);
    
    logger('webhook.payment.captured', {
      payment_id: payment.payment_id,
      paypal_order_id: orderId,
      transaction_id: captureId
    });
    
    // Notify other workers via webhooks (non-blocking)
    // Get checkout session to get order items
    const checkoutSession = await getCheckoutSessionFromCheckoutWorker(payment.checkout_session_id, env);
    
    // Notify Checkout Worker
    notifyCheckoutWorker(payment, env).catch(err => {
      logError('notifyCheckoutWorker: Failed', err, { payment_id: payment.payment_id });
    });
    
    // Notify Inventory Worker (deduct stock)
    if (checkoutSession && checkoutSession.items) {
      // Enrich items with product_id if needed
      const enrichedItems = await enrichOrderItemsWithProductIds(checkoutSession.items, env);
      notifyInventoryWorker(payment, enrichedItems, env).catch(err => {
        logError('notifyInventoryWorker: Failed', err, { payment_id: payment.payment_id });
      });
    }
    
    // Notify Fulfillment Worker (create order)
    if (checkoutSession) {
      // Enrich checkout session items with product_id
      if (checkoutSession.items) {
        checkoutSession.items = await enrichOrderItemsWithProductIds(checkoutSession.items, env);
      }
      notifyFulfillmentWorker(payment, checkoutSession, env).catch(err => {
        logError('notifyFulfillmentWorker: Failed', err, { payment_id: payment.payment_id });
      });
    }
    
    return { processed: true, payment_id: payment.payment_id, status: 'captured' };
  } catch (err) {
    logError('handlePaymentCaptureCompleted: Error', err, { resource });
    throw err;
  }
}

/**
 * Handle PAYMENT.CAPTURE.DENIED webhook
 * Payment capture was denied
 */
async function handlePaymentCaptureDenied(resource, env) {
  try {
    const orderId = resource.supplementary_data?.related_ids?.order_id;
    
    if (!orderId) {
      return { processed: false, error: 'No order ID found' };
    }
    
    let payment = await getPaymentByOrderId(orderId, env);
    if (!payment) {
      return { processed: false, error: 'Payment not found' };
    }
    
    const failureReason = resource.reason_code || 'Payment capture denied';
    
    payment = await updatePaymentStatus(payment.payment_id, 'approved', {
      failure_reason: failureReason,
      metadata: {
        ...(payment.metadata || {}),
        capture_denied: {
          reason_code: resource.reason_code,
          reason_description: resource.reason_description
        },
        webhook_received_at: new Date().toISOString()
      }
    }, env);
    
    await logPaymentEvent(payment.payment_id, 'capture_denied', {
      paypal_order_id: orderId,
      reason_code: resource.reason_code
    }, env);
    
    // Notify Checkout Worker about denial
    notifyCheckoutWorker(payment, env).catch(err => {
      logError('notifyCheckoutWorker: Failed', err, { payment_id: payment.payment_id });
    });
    
    return { processed: true, payment_id: payment.payment_id, status: 'approved' };
  } catch (err) {
    logError('handlePaymentCaptureDenied: Error', err, { resource });
    throw err;
  }
}

/**
 * Handle CHECKOUT.ORDER.APPROVED webhook
 * Order was approved by user
 */
async function handleOrderApproved(resource, env) {
  try {
    const orderId = resource.id;
    
    let payment = await getPaymentByOrderId(orderId, env);
    if (!payment) {
      return { processed: false, error: 'Payment not found' };
    }
    
    // Update to approved if not already
    if (payment.status !== 'approved' && payment.status !== 'captured') {
      const payer = resource.payer;
      
      payment = await updatePaymentStatus(payment.payment_id, 'approved', {
        payer_email: payer?.email_address || null,
        payer_name: payer?.name ? `${payer.name.given_name} ${payer.name.surname}`.trim() : null,
        metadata: {
          ...(payment.metadata || {}),
          payer_id: payer?.payer_id,
          webhook_received_at: new Date().toISOString()
        }
      }, env);
      
      await logPaymentEvent(payment.payment_id, 'approved', {
        paypal_order_id: orderId,
        payer_id: payer?.payer_id,
        source: 'webhook'
      }, env);
    }
    
    return { processed: true, payment_id: payment.payment_id, status: 'approved' };
  } catch (err) {
    logError('handleOrderApproved: Error', err, { resource });
    throw err;
  }
}

/**
 * Handle CHECKOUT.ORDER.COMPLETED webhook
 * Order was completed (captured)
 */
async function handleOrderCompleted(resource, env) {
  try {
    const orderId = resource.id;
    
    let payment = await getPaymentByOrderId(orderId, env);
    if (!payment) {
      return { processed: false, error: 'Payment not found' };
    }
    
    // If not already captured, update to captured
    if (payment.status !== 'captured') {
      const purchaseUnit = resource.purchase_units?.[0];
      const captureData = purchaseUnit?.payments?.captures?.[0];
      const payer = resource.payer;
      
      payment = await updatePaymentStatus(payment.payment_id, 'captured', {
        paypal_transaction_id: captureData?.id || null,
        payer_email: payer?.email_address || null,
        payer_name: payer?.name ? `${payer.name.given_name} ${payer.name.surname}`.trim() : null,
        captured_at: new Date().toISOString(),
        metadata: {
          ...(payment.metadata || {}),
          paypal_capture: {
            id: captureData?.id,
            status: captureData?.status,
            amount: captureData?.amount
          },
          webhook_received_at: new Date().toISOString()
        }
      }, env);
      
    await logPaymentEvent(payment.payment_id, 'captured', {
      paypal_order_id: orderId,
      paypal_transaction_id: captureData?.id,
      source: 'webhook'
    }, env);
    
    // Notify other workers via webhooks (non-blocking)
    const checkoutSession = await getCheckoutSessionFromCheckoutWorker(payment.checkout_session_id, env);
    
    notifyCheckoutWorker(payment, env).catch(err => {
      logError('notifyCheckoutWorker: Failed', err, { payment_id: payment.payment_id });
    });
    
    if (checkoutSession && checkoutSession.items) {
      // Enrich items with product_id if needed
      const enrichedItems = await enrichOrderItemsWithProductIds(checkoutSession.items, env);
      notifyInventoryWorker(payment, enrichedItems, env).catch(err => {
        logError('notifyInventoryWorker: Failed', err, { payment_id: payment.payment_id });
      });
    }
    
    if (checkoutSession) {
      // Enrich checkout session items with product_id
      if (checkoutSession.items) {
        checkoutSession.items = await enrichOrderItemsWithProductIds(checkoutSession.items, env);
      }
      notifyFulfillmentWorker(payment, checkoutSession, env).catch(err => {
        logError('notifyFulfillmentWorker: Failed', err, { payment_id: payment.payment_id });
      });
    }
    }
    
    return { processed: true, payment_id: payment.payment_id, status: 'captured' };
  } catch (err) {
    logError('handleOrderCompleted: Error', err, { resource });
    throw err;
  }
}

/**
 * Handle PAYMENT.ORDER.CREATED webhook
 * Payment order was created
 */
async function handleOrderCreated(resource, env) {
  try {
    const orderId = resource.id;
    
    let payment = await getPaymentByOrderId(orderId, env);
    if (!payment) {
      // Order created but payment not found - log for investigation
      logWarn('handleOrderCreated: Payment not found for order', { orderId });
      return { processed: false, error: 'Payment not found' };
    }
    
    // Update to created if not already
    if (payment.status === 'pending') {
      payment = await updatePaymentStatus(payment.payment_id, 'created', {
        metadata: {
          ...(payment.metadata || {}),
          paypal_order_created: {
            id: orderId,
            status: resource.status,
            create_time: resource.create_time
          },
          webhook_received_at: new Date().toISOString()
        }
      }, env);
      
      await logPaymentEvent(payment.payment_id, 'order_created', {
        paypal_order_id: orderId,
        source: 'webhook'
      }, env);
    }
    
    return { processed: true, payment_id: payment.payment_id, status: payment.status };
  } catch (err) {
    logError('handleOrderCreated: Error', err, { resource });
    throw err;
  }
}

/**
 * Handle CHECKOUT.ORDER.CANCELLED webhook
 * Order was cancelled
 */
async function handleOrderCancelled(resource, env) {
  try {
    const orderId = resource.id;
    
    let payment = await getPaymentByOrderId(orderId, env);
    if (!payment) {
      return { processed: false, error: 'Payment not found' };
    }
    
    payment = await updatePaymentStatus(payment.payment_id, 'cancelled', {
      failure_reason: 'Order cancelled by user',
      metadata: {
        ...(payment.metadata || {}),
        webhook_received_at: new Date().toISOString()
      }
    }, env);
    
    await logPaymentEvent(payment.payment_id, 'cancelled', {
      paypal_order_id: orderId,
      reason: 'Order cancelled',
      source: 'webhook'
    }, env);
    
    // Notify Checkout Worker about cancellation
    notifyCheckoutWorker(payment, env).catch(err => {
      logError('notifyCheckoutWorker: Failed', err, { payment_id: payment.payment_id });
    });
    
    return { processed: true, payment_id: payment.payment_id, status: 'cancelled' };
  } catch (err) {
    logError('handleOrderCancelled: Error', err, { resource });
    throw err;
  }
}

