// services/paymentService.js
import { logger, logError, logWarn } from '../utils/logger.js';
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
    
    // Create PayPal order
    const paypalOrder = await createPayPalOrder({
      checkout_session_id: paymentData.checkout_session_id,
      amount: paymentData.amount,
      currency: paymentData.currency || 'USD',
      intent: paymentData.intent || 'CAPTURE',
      return_url: paymentData.return_url,
      cancel_url: paymentData.cancel_url,
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
 * Extracts token (order ID) and PayerID from query parameters
 */
export async function handlePayPalCallback(token, payerId, isSuccess, env) {
  try {
    if (!token) {
      throw new Error('PayPal token (order ID) is required');
    }
    
    // Find payment by PayPal order ID (token)
    let payment = await getPaymentByOrderId(token, env);
    if (!payment) {
      throw new Error(`Payment not found for PayPal order ID: ${token}`);
    }
    
    if (isSuccess) {
      // User approved the payment
      if (!payerId) {
        throw new Error('PayerID is required for successful payment');
      }
      
      // Update payment to approved status
      if (payment.status !== 'approved' && payment.status !== 'captured') {
        payment = await updatePaymentStatus(payment.payment_id, 'approved', {
          payer_email: null, // Will be updated when we capture
          metadata: {
            ...(payment.metadata || {}),
            payer_id: payerId,
            callback_received_at: new Date().toISOString()
          }
        }, env);
        
        // Log approval event
        await logPaymentEvent(payment.payment_id, 'approved', {
          paypal_order_id: token,
          payer_id: payerId
        }, env);
      }
      
      // Verify order status before capturing
      try {
        const paypalOrder = await getPayPalOrder(token, env);
        
        // Check if order is in APPROVED state
        if (paypalOrder.status !== 'APPROVED') {
          logWarn('handlePayPalCallback: Order not in APPROVED state', {
            order_id: token,
            current_status: paypalOrder.status,
            payer_id: payerId
          });
          
          // Update payment with current PayPal status
          payment = await updatePaymentStatus(payment.payment_id, 'approved', {
            metadata: {
              ...(payment.metadata || {}),
              payer_id: payerId,
              paypal_order_status: paypalOrder.status,
              callback_received_at: new Date().toISOString()
            }
          }, env);
          
          return {
            success: false,
            message: `Payment approved but order is in ${paypalOrder.status} state. Cannot capture yet.`,
            error: `Order status: ${paypalOrder.status}. Expected: APPROVED`,
            payment: {
              payment_id: payment.payment_id,
              checkout_session_id: payment.checkout_session_id,
              status: payment.status,
              amount: payment.amount,
              currency: payment.currency,
              paypal_order_id: payment.order_id,
              paypal_order_status: paypalOrder.status
            }
          };
        }
      } catch (orderCheckErr) {
        logError('handlePayPalCallback: Failed to verify order status', orderCheckErr, { token, payerId });
        // Continue with capture attempt anyway
      }
      
      // Automatically capture the payment
      try {
        const capture = await capturePayPalOrder(token, env);
        const purchaseUnit = capture.purchase_units?.[0];
        const captureData = purchaseUnit?.payments?.captures?.[0];
        const payer = capture.payer;
        
        // Update payment to captured
        payment = await updatePaymentStatus(payment.payment_id, 'captured', {
          paypal_transaction_id: captureData?.id || null,
          payer_email: payer?.email_address || null,
          payer_name: payer?.name ? `${payer.name.given_name} ${payer.name.surname}`.trim() : null,
          captured_at: new Date().toISOString(),
          metadata: {
            ...(payment.metadata || {}),
            payer_id: payerId,
            paypal_capture: {
              id: capture.id,
              status: capture.status,
              capture_id: captureData?.id,
              amount: captureData?.amount,
              final_capture: captureData?.final_capture
            }
          }
        }, env);
        
        // Log capture event
        await logPaymentEvent(payment.payment_id, 'captured', {
          paypal_order_id: token,
          paypal_transaction_id: captureData?.id,
          payer_id: payerId,
          amount: captureData?.amount?.value
        }, env);
        
        logger('payment.callback.success', {
          payment_id: payment.payment_id,
          paypal_order_id: token,
          payer_id: payerId,
          transaction_id: captureData?.id
        });
        
        return {
          success: true,
          message: 'Payment captured successfully',
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
          }
        };
      } catch (captureErr) {
        logError('handlePayPalCallback: Capture failed', captureErr, { token, payerId });
        
        // Parse PayPal error details
        let errorDetails = {};
        try {
          const errorMatch = captureErr.message.match(/\{.*\}/);
          if (errorMatch) {
            errorDetails = JSON.parse(errorMatch[0]);
          }
        } catch (parseErr) {
          // Ignore parse errors
        }
        
        // Update payment with failure reason
        const failureReason = errorDetails.details?.[0]?.description || 
                             errorDetails.message || 
                             captureErr.message;
        
        payment = await updatePaymentStatus(payment.payment_id, 'approved', {
          failure_reason: `Capture failed: ${failureReason}`,
          metadata: {
            ...(payment.metadata || {}),
            payer_id: payerId,
            capture_error: {
              name: errorDetails.name,
              issue: errorDetails.details?.[0]?.issue,
              description: errorDetails.details?.[0]?.description,
              debug_id: errorDetails.debug_id,
              message: errorDetails.message
            },
            capture_failed_at: new Date().toISOString()
          }
        }, env);
        
        // Log capture failure event
        await logPaymentEvent(payment.payment_id, 'capture_failed', {
          paypal_order_id: token,
          payer_id: payerId,
          error: errorDetails
        }, env);
        
        // Payment was approved but capture failed
        return {
          success: false,
          message: 'Payment approved but capture failed',
          error: failureReason,
          error_details: {
            issue: errorDetails.details?.[0]?.issue,
            description: errorDetails.details?.[0]?.description,
            debug_id: errorDetails.debug_id,
            help_link: errorDetails.links?.[0]?.href
          },
          payment: {
            payment_id: payment.payment_id,
            checkout_session_id: payment.checkout_session_id,
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
            paypal_order_id: payment.order_id,
            failure_reason: payment.failure_reason
          },
          retry_info: {
            message: 'Payment is in approved state. You can retry capture using POST /api/v1/payments/:payment_id/capture',
            payment_id: payment.payment_id
          }
        };
      }
    } else {
      // User cancelled or payment failed
      payment = await updatePaymentStatus(payment.payment_id, 'cancelled', {
        failure_reason: 'User cancelled payment or payment failed',
        metadata: {
          ...(payment.metadata || {}),
          callback_received_at: new Date().toISOString(),
          payer_id: payerId || null
        }
      }, env);
      
      // Log cancellation event
      await logPaymentEvent(payment.payment_id, 'cancelled', {
        paypal_order_id: token,
        payer_id: payerId || null,
        reason: 'User cancelled or payment failed'
      }, env);
      
      logger('payment.callback.failure', {
        payment_id: payment.payment_id,
        paypal_order_id: token,
        payer_id: payerId || null
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

