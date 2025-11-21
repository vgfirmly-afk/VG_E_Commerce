// handlers/checkoutHandlers.js
import { logError } from '../utils/logger.js';
import * as checkoutService from '../services/checkoutService.js';
import { validateSessionId, validateCartId } from '../utils/validators.js';

/**
 * POST /checkout/sessions - Create checkout session
 */
export async function createSession(request, env) {
  try {
    const body = request.validatedBody || {};
    const userId = request.headers.get('X-User-Id') || null;
    const guestSessionId = request.headers.get('X-Session-Id') || null;
    
    const { cart_id } = body;
    
    const { error: cartError } = validateCartId(cart_id);
    if (cartError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: cartError.details?.[0]?.message || 'Invalid Cart ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!userId && !guestSessionId) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Either X-User-Id or X-Session-Id header is required' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const session = await checkoutService.createSession(cart_id, userId, guestSessionId, env);
    
    return new Response(
      JSON.stringify(session),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('createSession: Handler error', err);
    const status = err.message.includes('not found') || err.message.includes('empty') ? 404 : 500;
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /checkout/sessions/:session_id - Get checkout session
 */
export async function getSession(request, env) {
  try {
    const sessionId = request.params?.session_id;
    
    const { error: sessionError } = validateSessionId(sessionId);
    if (sessionError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: sessionError.details?.[0]?.message || 'Invalid Session ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const session = await checkoutService.getSession(sessionId, env);
    
    if (!session) {
      return new Response(
        JSON.stringify({ 
          error: 'not_found', 
          message: 'Checkout session not found' 
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify(session),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('getSession: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * POST /checkout/sessions/:session_id/delivery-address - Set delivery address
 */
export async function setDeliveryAddress(request, env) {
  try {
    const sessionId = request.params?.session_id;
    const body = request.validatedBody || {};
    const userId = request.headers.get('X-User-Id') || null;
    const guestSessionId = request.headers.get('X-Session-Id') || null;
    
    const { error: sessionError } = validateSessionId(sessionId);
    if (sessionError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: sessionError.details?.[0]?.message || 'Invalid Session ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { use_for_billing = false } = body;
    
    const session = await checkoutService.setDeliveryAddress(
      sessionId,
      body,
      use_for_billing,
      userId,
      guestSessionId,
      env
    );
    
    return new Response(
      JSON.stringify(session),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('setDeliveryAddress: Handler error', err);
    const status = err.message.includes('not found') ? 404 : 500;
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * POST /checkout/sessions/:session_id/billing-address - Set billing address
 */
export async function setBillingAddress(request, env) {
  try {
    const sessionId = request.params?.session_id;
    const body = request.validatedBody || {};
    const userId = request.headers.get('X-User-Id') || null;
    const guestSessionId = request.headers.get('X-Session-Id') || null;
    
    const { error: sessionError } = validateSessionId(sessionId);
    if (sessionError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: sessionError.details?.[0]?.message || 'Invalid Session ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const session = await checkoutService.setBillingAddress(
      sessionId,
      body,
      userId,
      guestSessionId,
      env
    );
    
    return new Response(
      JSON.stringify(session),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('setBillingAddress: Handler error', err);
    const status = err.message.includes('not found') ? 404 : 500;
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /checkout/sessions/:session_id/shipping-methods - Get available shipping methods
 */
export async function getShippingMethods(request, env) {
  try {
    const sessionId = request.params?.session_id;
    
    const { error: sessionError } = validateSessionId(sessionId);
    if (sessionError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: sessionError.details?.[0]?.message || 'Invalid Session ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const methods = await checkoutService.getAvailableShippingMethods(sessionId, env);
    
    return new Response(
      JSON.stringify({ shipping_methods: methods }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('getShippingMethods: Handler error', err);
    const status = err.message.includes('not found') || err.message.includes('not set') ? 404 : 500;
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * POST /checkout/sessions/:session_id/shipping-method - Select shipping method
 */
export async function selectShippingMethod(request, env) {
  try {
    const sessionId = request.params?.session_id;
    const body = request.validatedBody || {};
    
    const { error: sessionError } = validateSessionId(sessionId);
    if (sessionError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: sessionError.details?.[0]?.message || 'Invalid Session ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { shipping_method_id } = body;
    if (!shipping_method_id) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'shipping_method_id is required' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const session = await checkoutService.selectShippingMethod(sessionId, shipping_method_id, env);
    
    return new Response(
      JSON.stringify(session),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('selectShippingMethod: Handler error', err);
    const status = err.message.includes('not found') || err.message.includes('not set') ? 404 : 500;
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /checkout/sessions/:session_id/summary - Get checkout summary
 */
export async function getSummary(request, env) {
  try {
    const sessionId = request.params?.session_id;
    
    const { error: sessionError } = validateSessionId(sessionId);
    if (sessionError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: sessionError.details?.[0]?.message || 'Invalid Session ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const summary = await checkoutService.getSummary(sessionId, env);
    
    return new Response(
      JSON.stringify(summary),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('getSummary: Handler error', err);
    const status = err.message.includes('out of stock') ? 400 : 
                   err.message.includes('not found') || err.message.includes('not set') ? 404 : 500;
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

