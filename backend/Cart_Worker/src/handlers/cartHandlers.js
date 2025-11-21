// handlers/cartHandlers.js
import { logError } from '../utils/logger.js';
import * as cartService from '../services/cartService.js';
import { validateCartId, validateItemId } from '../utils/validators.js';

/**
 * GET /cart - Get or create cart
 */
export async function getCart(request, env) {
  try {
    // Get user ID from header (if logged in) or session ID (for anonymous)
    const userId = request.headers.get('X-User-Id') || null;
    const sessionId = request.headers.get('X-Session-Id') || null;
    
    if (!userId && !sessionId) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Either X-User-Id or X-Session-Id header is required' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const cart = await cartService.getCart(userId, sessionId, env);
    
    return new Response(
      JSON.stringify(cart),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('getCart: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /cart/:cart_id - Get cart by ID
 */
export async function getCartById(request, env) {
  try {
    const cartId = request.params?.cart_id;
    
    const { error: idError } = validateCartId(cartId);
    if (idError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: idError.details?.[0]?.message || 'Invalid Cart ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const cart = await cartService.getCartByIdService(cartId, env);
    
    if (!cart) {
      return new Response(
        JSON.stringify({ 
          error: 'not_found', 
          message: `Cart not found: ${cartId}` 
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify(cart),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('getCartById: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * POST /cart/:cart_id/items - Add item to cart
 */
export async function addItem(request, env) {
  try {
    const cartId = request.params?.cart_id;
    
    // Use validated body from middleware (already parsed and validated)
    const body = request.validatedBody || {};
    
    const { error: idError } = validateCartId(cartId);
    if (idError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: idError.details?.[0]?.message || 'Invalid Cart ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { sku_id, quantity } = body;
    
    if (!sku_id || !quantity) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'sku_id and quantity are required' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const item = await cartService.addItem(cartId, sku_id, quantity, env);
    
    return new Response(
      JSON.stringify(item),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('addItem: Handler error', err);
    const status = err.message.includes('Insufficient') || err.message.includes('stock') ? 400 : 500;
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * PUT /cart/:cart_id/items/:item_id - Update item quantity
 */
export async function updateQuantity(request, env) {
  try {
    const cartId = request.params?.cart_id;
    const itemId = request.params?.item_id;
    
    // Use validated body from middleware (already parsed and validated)
    const body = request.validatedBody || {};
    
    const { error: idError } = validateCartId(cartId);
    if (idError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: idError.details?.[0]?.message || 'Invalid Cart ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { error: itemError } = validateItemId(itemId);
    if (itemError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: itemError.details?.[0]?.message || 'Invalid Item ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { quantity, delta } = body;
    
    // Pass both quantity and delta to service - service will handle the logic
    const item = await cartService.updateQuantity(itemId, quantity, delta, env);
    
    if (item === null) {
      // Item was removed (quantity = 0)
      return new Response(
        JSON.stringify({ message: 'Item removed from cart' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify(item),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('updateQuantity: Handler error', err);
    const status = err.message.includes('Insufficient') || err.message.includes('stock') ? 400 : 500;
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * DELETE /cart/:cart_id/items/:item_id - Remove item from cart
 */
export async function removeItem(request, env) {
  try {
    const cartId = request.params?.cart_id;
    const itemId = request.params?.item_id;
    
    const { error: idError } = validateCartId(cartId);
    if (idError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: idError.details?.[0]?.message || 'Invalid Cart ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { error: itemError } = validateItemId(itemId);
    if (itemError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: itemError.details?.[0]?.message || 'Invalid Item ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    await cartService.removeItem(itemId, env);
    
    return new Response(
      JSON.stringify({ message: 'Item removed from cart' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('removeItem: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * DELETE /cart/:cart_id - Clear cart
 */
export async function clearCart(request, env) {
  try {
    const cartId = request.params?.cart_id;
    
    const { error: idError } = validateCartId(cartId);
    if (idError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: idError.details?.[0]?.message || 'Invalid Cart ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    await cartService.clear(cartId, env);
    
    return new Response(
      JSON.stringify({ message: 'Cart cleared' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('clearCart: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /cart/:cart_id/total - Calculate cart total
 */
export async function getTotal(request, env) {
  try {
    const cartId = request.params?.cart_id;
    
    const { error: idError } = validateCartId(cartId);
    if (idError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: idError.details?.[0]?.message || 'Invalid Cart ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const total = await cartService.calculateTotal(cartId, env);
    
    return new Response(
      JSON.stringify(total),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('getTotal: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

