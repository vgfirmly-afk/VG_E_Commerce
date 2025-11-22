// handlers/paymentHandlers.js
import { logError } from '../utils/logger.js';
import * as paymentService from '../services/paymentService.js';
import { validatePaymentId, validateCapturePayment } from '../utils/validators.js';

/**
 * POST /payments - Create payment intent
 */
export async function createPayment(request, env) {
  try {
    const body = request.validatedBody || {};
    
    const payment = await paymentService.createPaymentIntent(body, env);
    
    return new Response(
      JSON.stringify(payment),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('createPayment: Handler error', err);
    const status = err.message.includes('not configured') ? 500 : 
                   err.message.includes('not found') ? 404 : 500;
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * POST /payments/:payment_id/capture - Capture payment
 */
export async function capturePayment(request, env) {
  try {
    const paymentId = request.params?.payment_id;
    const body = request.validatedBody || {};
    
    const { error: idError } = validatePaymentId(paymentId);
    if (idError) {
      return new Response(
        JSON.stringify({
          error: 'validation_error',
          message: idError.details?.[0]?.message || 'Invalid payment ID'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { error, value } = validateCapturePayment(body);
    if (error) {
      return new Response(
        JSON.stringify({
          error: 'validation_error',
          message: 'Invalid capture data',
          details: error.details.map(d => ({
            path: d.path.join('.'),
            message: d.message
          }))
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const result = await paymentService.capturePayment(paymentId, value.order_id, env);
    
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('capturePayment: Handler error', err);
    const status = err.message.includes('not found') ? 404 : 
                   err.message.includes('cannot be captured') ? 400 : 500;
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /payments/:payment_id - Get payment status
 */
export async function getPayment(request, env) {
  try {
    const paymentId = request.params?.payment_id;
    
    const { error: idError } = validatePaymentId(paymentId);
    if (idError) {
      return new Response(
        JSON.stringify({
          error: 'validation_error',
          message: idError.details?.[0]?.message || 'Invalid payment ID'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const payment = await paymentService.getPaymentStatus(paymentId, env);
    
    return new Response(
      JSON.stringify(payment),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('getPayment: Handler error', err);
    const status = err.message.includes('not found') ? 404 : 500;
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /payments/callback/success - Handle PayPal success callback
 * Query params: token (PayPal order ID), PayerID
 */
export async function handlePayPalSuccess(request, env) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    const payerId = url.searchParams.get('PayerID');
    
    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'validation_error',
          message: 'Missing required parameter: token (PayPal order ID)'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const result = await paymentService.handlePayPalCallback(token, payerId, true, env);
    
    return new Response(
      JSON.stringify(result),
      { status: result.success ? 200 : 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('handlePayPalSuccess: Handler error', err);
    const status = err.message.includes('not found') ? 404 : 500;
    return new Response(
      JSON.stringify({
        success: false,
        error: 'internal_error',
        message: err.message
      }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /payments/callback/failure - Handle PayPal failure/cancel callback
 * Query params: token (PayPal order ID), PayerID (optional)
 */
export async function handlePayPalFailure(request, env) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    const payerId = url.searchParams.get('PayerID');
    
    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'validation_error',
          message: 'Missing required parameter: token (PayPal order ID)'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const result = await paymentService.handlePayPalCallback(token, payerId, false, env);
    
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('handlePayPalFailure: Handler error', err);
    const status = err.message.includes('not found') ? 404 : 500;
    return new Response(
      JSON.stringify({
        success: false,
        error: 'internal_error',
        message: err.message
      }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

