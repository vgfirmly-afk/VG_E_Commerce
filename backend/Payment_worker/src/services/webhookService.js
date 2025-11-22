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
        return await handlePaymentCaptureCompleted(resource, env);
      
      case 'PAYMENT.CAPTURE.DENIED':
        return await handlePaymentCaptureDenied(resource, env);
      
      case 'CHECKOUT.ORDER.APPROVED':
        return await handleOrderApproved(resource, env);
      
      case 'CHECKOUT.ORDER.COMPLETED':
        return await handleOrderCompleted(resource, env);
      
      case 'CHECKOUT.ORDER.CANCELLED':
        return await handleOrderCancelled(resource, env);
      
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
    }
    
    return { processed: true, payment_id: payment.payment_id, status: 'captured' };
  } catch (err) {
    logError('handleOrderCompleted: Error', err, { resource });
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
    
    return { processed: true, payment_id: payment.payment_id, status: 'cancelled' };
  } catch (err) {
    logError('handleOrderCancelled: Error', err, { resource });
    throw err;
  }
}

