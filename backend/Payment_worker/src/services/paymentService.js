// services/paymentService.js
import { logger, logError } from '../utils/logger.js';
import {
  createPayment,
  getPayment,
  getPaymentBySessionId,
  getPaymentByOrderId,
  updatePaymentStatus,
  logPaymentEvent
} from '../db/db1.js';
import {
  createPayPalOrder,
  capturePayPalOrder,
  getPayPalOrder
} from './paypalService.js';
import { getFrontendUrls } from '../../config.js';

/**
 * Create payment intent and initialize PayPal order
 */
export async function createPaymentIntent(paymentData, env) {
  try {
    // Check if payment already exists for this session
    const existing = await getPaymentBySessionId(paymentData.checkout_session_id, env);
    if (existing) {
      // If payment exists and is in a valid state, return it
      if (['pending', 'created'].includes(existing.status)) {
        logger('payment.intent.exists', { 
          payment_id: existing.payment_id,
          checkout_session_id: paymentData.checkout_session_id
        });
        return existing;
      }
    }
    
    // Get frontend URLs from config
    const frontendUrls = getFrontendUrls(env);
    
    // Build success and failure URLs with checkout_session_id
    // PayPal will add token (order ID) to the return URL automatically
    const checkoutSessionId = paymentData.checkout_session_id;
    const successUrl = paymentData.return_url || 
      `${frontendUrls.successUrl}?checkout_session_id=${encodeURIComponent(checkoutSessionId)}`;
    const failureUrl = paymentData.cancel_url || 
      `${frontendUrls.failureUrl}?checkout_session_id=${encodeURIComponent(checkoutSessionId)}`;
    
    // Create PayPal order
    const paypalOrder = await createPayPalOrder({
      checkout_session_id: checkoutSessionId,
      amount: paymentData.amount,
      currency: paymentData.currency || 'USD',
      intent: paymentData.intent || 'CAPTURE',
      return_url: successUrl,
      cancel_url: failureUrl,
      description: paymentData.description,
      brand_name: 'VG-Ecommerce'
    }, env);
    
    // Create payment record
    const payment = await createPayment({
      checkout_session_id: paymentData.checkout_session_id,
      order_id: paypalOrder.id,
      intent: paymentData.intent || 'CAPTURE',
      status: paypalOrder.status === 'CREATED' ? 'created' : 'pending',
      amount: paymentData.amount,
      currency: paymentData.currency || 'USD',
      metadata: {
        ...paymentData.metadata,
        paypal_order: {
          id: paypalOrder.id,
          status: paypalOrder.status,
          links: paypalOrder.links
        }
      }
    }, env);
    
    // Log payment event
    await logPaymentEvent(payment.payment_id, 'created', {
      paypal_order_id: paypalOrder.id,
      amount: paymentData.amount,
      currency: paymentData.currency
    }, env);
    
    // Find approval URL from PayPal order links
    const approvalLink = paypalOrder.links?.find(link => link.rel === 'approve');
    const approvalUrl = approvalLink?.href || null;
    
    logger('payment.intent.created', { 
      payment_id: payment.payment_id,
      paypal_order_id: paypalOrder.id,
      status: payment.status
    });
    
    return {
      ...payment,
      approval_url: approvalUrl,
      paypal_order_id: paypalOrder.id
    };
  } catch (err) {
    logError('createPaymentIntent: Service error', err, { paymentData });
    throw err;
  }
}

/**
 * Capture payment (after user approval)
 */
export async function capturePayment(paymentId, orderId, env) {
  try {
    // Get payment record
    let payment = await getPayment(paymentId, env);
    if (!payment) {
      // Try to find by order_id if payment_id not found
      if (orderId) {
        payment = await getPaymentByOrderId(orderId, env);
      }
      if (!payment) {
        throw new Error('Payment not found');
      }
    }
    
    // Validate payment can be captured
    if (payment.status === 'captured') {
      logger('payment.already_captured', { payment_id: payment.payment_id });
      return payment;
    }
    
    if (!['created', 'approved'].includes(payment.status)) {
      throw new Error(`Payment cannot be captured. Current status: ${payment.status}`);
    }
    
    // Use order_id from payment or provided orderId
    const paypalOrderId = payment.order_id || orderId;
    if (!paypalOrderId) {
      throw new Error('PayPal order ID not found');
    }
    
    // Capture PayPal order
    const capture = await capturePayPalOrder(paypalOrderId, env);
    
    // Extract transaction details
    const purchaseUnit = capture.purchase_units?.[0];
    const captureData = purchaseUnit?.payments?.captures?.[0];
    const payer = capture.payer;
    
    // Update payment status
    const updates = {
      status: 'captured',
      paypal_transaction_id: captureData?.id || null,
      payer_email: payer?.email_address || null,
      payer_name: payer?.name ? `${payer.name.given_name} ${payer.name.surname}`.trim() : null,
      captured_at: new Date().toISOString(),
      metadata: {
        ...(payment.metadata || {}),
        paypal_capture: {
          id: capture.id,
          status: capture.status,
          capture_id: captureData?.id,
          amount: captureData?.amount,
          final_capture: captureData?.final_capture
        }
      }
    };
    
    payment = await updatePaymentStatus(payment.payment_id, 'captured', updates, env);
    
    // Log payment event
    await logPaymentEvent(payment.payment_id, 'captured', {
      paypal_order_id: paypalOrderId,
      paypal_transaction_id: captureData?.id,
      amount: captureData?.amount?.value
    }, env);
    
    logger('payment.captured', { 
      payment_id: payment.payment_id,
      paypal_order_id: paypalOrderId,
      transaction_id: captureData?.id
    });
    
    return payment;
  } catch (err) {
    logError('capturePayment: Service error', err, { paymentId, orderId });
    throw err;
  }
}

/**
 * Get payment status
 */
export async function getPaymentStatus(paymentId, env) {
  try {
    let payment = await getPayment(paymentId, env);
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    // If payment has PayPal order_id, sync status from PayPal
    if (payment.order_id && ['created', 'approved'].includes(payment.status)) {
      try {
        const paypalOrder = await getPayPalOrder(payment.order_id, env);
        
        // Update status based on PayPal order status
        if (paypalOrder.status === 'APPROVED' && payment.status !== 'approved') {
          payment = await updatePaymentStatus(payment.payment_id, 'approved', {
            payer_email: paypalOrder.payer?.email_address,
            payer_name: paypalOrder.payer?.name ? 
              `${paypalOrder.payer.name.given_name} ${paypalOrder.payer.name.surname}`.trim() : null
          }, env);
        } else if (paypalOrder.status === 'COMPLETED' && payment.status !== 'captured') {
          // Order was completed externally
          const purchaseUnit = paypalOrder.purchase_units?.[0];
          const captureData = purchaseUnit?.payments?.captures?.[0];
          
          payment = await updatePaymentStatus(payment.payment_id, 'captured', {
            paypal_transaction_id: captureData?.id || null,
            captured_at: new Date().toISOString()
          }, env);
        }
      } catch (err) {
        // Don't fail if PayPal sync fails, just log
        logError('getPaymentStatus: Failed to sync PayPal status', err, { paymentId });
      }
    }
    
    return payment;
  } catch (err) {
    logError('getPaymentStatus: Service error', err, { paymentId });
    throw err;
  }
}

/**
 * Handle PayPal callback (success or failure)
 * NOTE: These are FRONTEND-ONLY endpoints for displaying status to users
 * Actual payment processing happens via webhooks (server-to-server)
 * 
 * This function just retrieves and returns payment status for display
 */
export async function handlePayPalCallback(token, payerId, isSuccess, env) {
  try {
    if (!token) {
      throw new Error('PayPal token (order ID) is required');
    }
    
    // Find payment by PayPal order ID (token)
    const payment = await getPaymentByOrderId(token, env);
    if (!payment) {
      throw new Error(`Payment not found for PayPal order ID: ${token}`);
    }
    
    // Just return the current payment status for frontend display
    // Webhooks handle the actual status updates (server-to-server)
    if (isSuccess) {
      logger('payment.callback.success.display', {
        payment_id: payment.payment_id,
        paypal_order_id: token,
        current_status: payment.status
      });
      
      return {
        success: true,
        message: 'Payment status retrieved',
        payment: {
          payment_id: payment.payment_id,
          checkout_session_id: payment.checkout_session_id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          paypal_order_id: payment.order_id,
          paypal_transaction_id: payment.paypal_transaction_id,
          payer_email: payment.payer_email,
          payer_name: payment.payer_name,
          captured_at: payment.captured_at
        },
        note: 'Payment status is updated via webhooks. If status is not updated yet, please wait a moment and refresh.'
      };
    } else {
      logger('payment.callback.failure.display', {
        payment_id: payment.payment_id,
        paypal_order_id: token,
        current_status: payment.status
      });
      
      return {
        success: false,
        message: 'Payment was cancelled or failed',
        payment: {
          payment_id: payment.payment_id,
          checkout_session_id: payment.checkout_session_id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          paypal_order_id: payment.order_id,
          failure_reason: payment.failure_reason
        }
      };
    }
  } catch (err) {
    logError('handlePayPalCallback: Service error', err, { token, payerId, isSuccess });
    throw err;
  }
}

