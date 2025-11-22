// services/checkoutService.js
import { logger, logError, logWarn } from '../utils/logger.js';
import {
  createCheckoutSession,
  getCheckoutSession,
  updateCheckoutSession,
  saveAddress,
  getAddress,
  getShippingMethods,
  getShippingMethod,
  saveCheckoutItems,
  getCheckoutItems,
  reserveStockInKV,
  releaseAllStockForSession,
  checkStockAvailability,
  createShippingMethod as createShippingMethodDb,
  updateShippingMethod as updateShippingMethodDb,
  deleteShippingMethod as deleteShippingMethodDb,
  getAllShippingMethods as getAllShippingMethodsDb
} from '../db/db1.js';
// Removed serviceBinding import - using direct template literals like Cart Worker

/**
 * Get cart from Cart Worker via service binding
 */
async function getCartFromCartWorker(cartId, env) {
  try {
    const cartWorker = env.CART_WORKER;
    if (!cartWorker) {
      throw new Error('CART_WORKER binding not available');
    }
    
    // Use service binding - URL is just for routing, not an external HTTP call
    // Construct URL parts separately to avoid TLD validation during bundling
    const protocol = 'https';
    const hostname = 'cart-worker';
    const path = '/api/v1/cart/' + encodeURIComponent(cartId);
    const urlString = protocol + '://' + hostname + path;
    const cartRequest = new Request(urlString, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Source': 'checkout-worker-service-binding'
      }
    });
    
    // Service binding fetch - this goes through Cloudflare's internal routing, not external HTTP
    const response = await cartWorker.fetch(cartRequest);
    if (!response.ok) {
      throw new Error(`Failed to get cart: ${response.status}`);
    }
    
    return await response.json();
  } catch (err) {
    logError('getCartFromCartWorker: Error', err, { cartId });
    throw err;
  }
}

/**
 * Get price from Pricing Worker via service binding
 */
async function getPriceFromPricingWorker(skuId, env) {
  try {
    const pricingWorker = env.PRICING_WORKER;
    if (!pricingWorker) {
      logError('getPriceFromPricingWorker: PRICING_WORKER binding not available', null, { skuId });
      return null;
    }
    
    // Use service binding - URL is just for routing, not an external HTTP call
    // Construct URL parts separately to avoid TLD validation during bundling
    const protocol = 'https';
    const hostname = 'pricing-worker';
    const path = '/api/v1/prices/' + encodeURIComponent(skuId);
    const urlString = protocol + '://' + hostname + path;
    const priceRequest = new Request(urlString, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Source': 'checkout-worker-service-binding'
      }
    });
    
    // Service binding fetch - this goes through Cloudflare's internal routing, not external HTTP
    const response = await pricingWorker.fetch(priceRequest);
    if (!response.ok) {
      logError('getPriceFromPricingWorker: Failed to get price', null, {
        skuId,
        status: response.status
      });
      return null;
    }
    
    const priceData = await response.json();
    return priceData.effective_price || priceData.price || 0.00;
  } catch (err) {
    logError('getPriceFromPricingWorker: Error', err, { skuId });
    return null;
  }
}

/**
 * Calculate delivery date based on shipping method and pincode
 */
function calculateDeliveryDate(shippingMethod, pincode) {
  const now = new Date();
  const minDays = shippingMethod.min_delivery_days || 3;
  const maxDays = shippingMethod.max_delivery_days || 7;
  
  // Simple calculation - can be enhanced with pincode-based logic
  const deliveryDays = Math.ceil((minDays + maxDays) / 2);
  const deliveryDate = new Date(now);
  deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
  
  return deliveryDate.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}

/**
 * Update checkout session with payment status (called via webhook)
 */
export async function updateCheckoutSessionPaymentStatus(sessionId, paymentId, paymentStatus, paymentData, env) {
  try {
    const session = await getCheckoutSession(sessionId, env);
    if (!session) {
      throw new Error('Checkout session not found');
    }
    
    // Map payment status to checkout session status
    let sessionStatus = session.status;
    if (paymentStatus === 'captured') {
      sessionStatus = 'payment_completed';
    } else if (paymentStatus === 'cancelled' || paymentStatus === 'failed') {
      sessionStatus = 'payment_failed';
      // Release stock reservations if payment failed
      try {
        await releaseAllStockForSession(sessionId, null, env);
        logger('checkout.stock.released', { sessionId, reason: 'payment_failed' });
      } catch (err) {
        logError('updateCheckoutSessionPaymentStatus: Failed to release stock', err, { sessionId });
      }
    }
    
    // Update session with payment information
    const updates = {
      status: sessionStatus,
      payment_id: paymentId,
      payment_status: paymentStatus
    };
    
    await updateCheckoutSession(sessionId, updates, env);
    
    logger('checkout.payment_status.updated', { 
      sessionId, 
      paymentId, 
      paymentStatus,
      sessionStatus 
    });
    
    return await getCheckoutSession(sessionId, env);
  } catch (err) {
    logError('updateCheckoutSessionPaymentStatus: Service error', err, { sessionId, paymentStatus });
    throw err;
  }
}

/**
 * Create checkout session
 */
export async function createSession(cartId, userId, guestSessionId, env) {
  try {
    // Verify cart exists
    const cart = await getCartFromCartWorker(cartId, env);
    if (!cart) {
      throw new Error('Cart not found');
    }
    
    if (!cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Create checkout session
    const session = await createCheckoutSession(cartId, userId, guestSessionId, env);
    
    // Save cart items snapshot
    const checkoutItems = cart.items.map(item => ({
      sku_id: item.sku_id,
      quantity: item.quantity,
      unit_price: item.unit_price || 0,
      subtotal: (item.unit_price || 0) * item.quantity
    }));
    
    await saveCheckoutItems(session.session_id, checkoutItems, env);
    
    logger('checkout.session.created', { sessionId: session.session_id, cartId });
    return session;
  } catch (err) {
    logError('createSession: Service error', err, { cartId, userId });
    throw err;
  }
}

/**
 * Get checkout session
 */
export async function getSession(sessionId, env) {
  try {
    const session = await getCheckoutSession(sessionId, env);
    if (!session) {
      return null;
    }
    
    const items = await getCheckoutItems(sessionId, env);
    const deliveryAddress = session.delivery_address_id 
      ? await getAddress(session.delivery_address_id, env)
      : null;
    const billingAddress = session.billing_address_id
      ? await getAddress(session.billing_address_id, env)
      : null;
    const shippingMethod = session.shipping_method_id
      ? await getShippingMethod(session.shipping_method_id, env)
      : null;
    
    return {
      ...session,
      items,
      delivery_address: deliveryAddress,
      billing_address: billingAddress,
      shipping_method: shippingMethod
    };
  } catch (err) {
    logError('getSession: Service error', err, { sessionId });
    throw err;
  }
}

/**
 * Set delivery address
 */
export async function setDeliveryAddress(sessionId, addressData, useForBilling, userId, guestSessionId, env) {
  try {
    const session = await getCheckoutSession(sessionId, env);
    if (!session) {
      throw new Error('Checkout session not found');
    }
    
    // Save delivery address
    const deliveryAddress = await saveAddress(
      addressData,
      userId,
      guestSessionId,
      'delivery',
      env
    );
    
    // Update session
    const updates = {
      delivery_address_id: deliveryAddress.address_id,
      status: 'address_set'
    };
    
    // If use for billing, set billing address too
    if (useForBilling) {
      const billingAddress = await saveAddress(
        addressData,
        userId,
        guestSessionId,
        'billing',
        env
      );
      updates.billing_address_id = billingAddress.address_id;
    }
    
    await updateCheckoutSession(sessionId, updates, env);
    
    logger('checkout.delivery_address.set', { sessionId, addressId: deliveryAddress.address_id });
    return await getSession(sessionId, env);
  } catch (err) {
    logError('setDeliveryAddress: Service error', err, { sessionId });
    throw err;
  }
}

/**
 * Set billing address
 */
export async function setBillingAddress(sessionId, addressData, userId, guestSessionId, env) {
  try {
    const session = await getCheckoutSession(sessionId, env);
    if (!session) {
      throw new Error('Checkout session not found');
    }
    
    // Save billing address
    const billingAddress = await saveAddress(
      addressData,
      userId,
      guestSessionId,
      'billing',
      env
    );
    
    // Update session
    await updateCheckoutSession(sessionId, {
      billing_address_id: billingAddress.address_id
    }, env);
    
    logger('checkout.billing_address.set', { sessionId, addressId: billingAddress.address_id });
    return await getSession(sessionId, env);
  } catch (err) {
    logError('setBillingAddress: Service error', err, { sessionId });
    throw err;
  }
}

/**
 * Get available shipping methods
 */
export async function getAvailableShippingMethods(sessionId, env) {
  try {
    const session = await getCheckoutSession(sessionId, env);
    if (!session) {
      throw new Error('Checkout session not found');
    }
    
    if (!session.delivery_address_id) {
      throw new Error('Delivery address not set');
    }
    
    const deliveryAddress = await getAddress(session.delivery_address_id, env);
    if (!deliveryAddress) {
      throw new Error('Delivery address not found');
    }
    
    const methods = await getShippingMethods(deliveryAddress.postal_code, env);
    
    return methods.map(method => ({
      method_id: method.method_id,
      name: method.name,
      description: method.description,
      carrier: method.carrier,
      base_cost: method.base_cost,
      cost_per_kg: method.cost_per_kg,
      min_delivery_days: method.min_delivery_days,
      max_delivery_days: method.max_delivery_days
    }));
  } catch (err) {
    logError('getAvailableShippingMethods: Service error', err, { sessionId });
    throw err;
  }
}

/**
 * Select shipping method
 */
export async function selectShippingMethod(sessionId, methodId, env) {
  try {
    const session = await getCheckoutSession(sessionId, env);
    if (!session) {
      throw new Error('Checkout session not found');
    }
    
    if (!session.delivery_address_id) {
      throw new Error('Delivery address not set');
    }
    
    const shippingMethod = await getShippingMethod(methodId, env);
    if (!shippingMethod) {
      throw new Error('Shipping method not found');
    }
    
    const deliveryAddress = await getAddress(session.delivery_address_id, env);
    const deliveryDate = calculateDeliveryDate(shippingMethod, deliveryAddress.postal_code);
    
    // Calculate shipping cost (simplified - can be enhanced with weight calculation)
    const items = await getCheckoutItems(sessionId, env);
    const shippingCost = shippingMethod.base_cost; // Can add weight-based calculation
    
    await updateCheckoutSession(sessionId, {
      shipping_method_id: methodId,
      estimated_delivery_date: deliveryDate,
      shipping_cost: shippingCost,
      status: 'shipping_selected'
    }, env);
    
    logger('checkout.shipping_method.selected', { sessionId, methodId });
    return await getSession(sessionId, env);
  } catch (err) {
    logError('selectShippingMethod: Service error', err, { sessionId, methodId });
    throw err;
  }
}

/**
 * Get checkout summary (with stock check and reservation)
 */
export async function getSummary(sessionId, env) {
  try {
    const session = await getCheckoutSession(sessionId, env);
    if (!session) {
      throw new Error('Checkout session not found');
    }
    // console.log('session', session);
    if (!session.delivery_address_id) {
      throw new Error('Delivery address must be set');
    }
    if (!session.shipping_method_id) {
      throw new Error('Shipping method not set');
    }
    
    const items = await getCheckoutItems(sessionId, env);
    const deliveryAddress = await getAddress(session.delivery_address_id, env);
    const billingAddress = session.billing_address_id
      ? await getAddress(session.billing_address_id, env)
      : null;
    const shippingMethod = await getShippingMethod(session.shipping_method_id, env);
    
    // Check stock availability and reserve
    const stockChecks = {};
    const reservations = [];
    let allAvailable = true;
    const unavailableItems = [];
    
    for (const item of items) {
      const stockCheck = await checkStockAvailability(item.sku_id, item.quantity, env);
      stockChecks[item.sku_id] = stockCheck;
      
      if (!stockCheck.available) {
        allAvailable = false;
        unavailableItems.push({
          sku_id: item.sku_id,
          quantity: item.quantity,
          available: stockCheck.availableQuantity,
          reason: stockCheck.reason || 'Insufficient stock'
        });
      } else {
        // Reserve stock in KV
        const reservation = await reserveStockInKV(sessionId, item.sku_id, item.quantity, env);
        if (reservation.success) {
          reservations.push({ sku_id: item.sku_id, quantity: item.quantity });
        } else {
          allAvailable = false;
          unavailableItems.push({
            sku_id: item.sku_id,
            quantity: item.quantity,
            available: reservation.available,
            reason: reservation.reason || 'Reservation failed'
          });
        }
      }
    }
    
    // If stock not available, release any reservations made
    if (!allAvailable) {
      for (const reservation of reservations) {
        await releaseAllStockForSession(sessionId, [reservation.sku_id], env);
      }
      throw new Error('Some items are out of stock');
    }
    
    // Calculate totals with current prices
    let subtotal = 0;
    const itemDetails = [];
    
    for (const item of items) {
      const currentPrice = await getPriceFromPricingWorker(item.sku_id, env) || item.unit_price;
      const itemSubtotal = currentPrice * item.quantity;
      subtotal += itemSubtotal;
      
      itemDetails.push({
        sku_id: item.sku_id,
        quantity: item.quantity,
        unit_price: currentPrice,
        subtotal: itemSubtotal
      });
    }
    
    const shippingCost = session.shipping_cost || 0;
    const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST (can be configurable)
    const total = subtotal + shippingCost + tax;
    
    // Update session with totals
    await updateCheckoutSession(sessionId, {
      subtotal,
      shipping_cost: shippingCost,
      tax,
      total,
      status: 'summary_ready'
    }, env);
    
    return {
      session_id: sessionId,
      delivery_address: deliveryAddress,
      billing_address: billingAddress,
      shipping_method: shippingMethod,
      estimated_delivery_date: session.estimated_delivery_date,
      items: itemDetails,
      pricing: {
        subtotal,
        shipping_cost: shippingCost,
        tax,
        total,
        currency: session.currency || 'USD'
      },
      stock_status: {
        all_available: allAvailable,
        unavailable_items: unavailableItems
      }
    };
  } catch (err) {
    logError('getSummary: Service error', err, { sessionId });
    throw err;
  }
}

// ==================== Admin Shipping Method Management ====================

/**
 * Create shipping method (admin)
 */
export async function createShippingMethodService(methodData, env) {
  try {
    const method = await createShippingMethodDb(methodData, env);
    logger('shipping_method.created', { method_id: method.method_id });
    return method;
  } catch (err) {
    logError('createShippingMethodService: Service error', err, { methodData });
    throw err;
  }
}

/**
 * Update shipping method (admin)
 */
export async function updateShippingMethodService(methodId, updates, env) {
  try {
    const method = await updateShippingMethodDb(methodId, updates, env);
    logger('shipping_method.updated', { method_id: methodId });
    return method;
  } catch (err) {
    logError('updateShippingMethodService: Service error', err, { methodId, updates });
    throw err;
  }
}

/**
 * Delete shipping method (admin)
 */
export async function deleteShippingMethodService(methodId, env) {
  try {
    const result = await deleteShippingMethodDb(methodId, env);
    logger('shipping_method.deleted', { method_id: methodId });
    return result;
  } catch (err) {
    logError('deleteShippingMethodService: Service error', err, { methodId });
    throw err;
  }
}

/**
 * Get all shipping methods (admin)
 */
export async function getAllShippingMethodsService(env) {
  try {
    const methods = await getAllShippingMethodsDb(env);
    return methods;
  } catch (err) {
    logError('getAllShippingMethodsService: Service error', err);
    throw err;
  }
}

/**
 * Get shipping method by ID (admin)
 */
export async function getShippingMethodByIdService(methodId, env) {
  try {
    const method = await getShippingMethod(methodId, env);
    if (!method) {
      throw new Error('Shipping method not found');
    }
    return method;
  } catch (err) {
    logError('getShippingMethodByIdService: Service error', err, { methodId });
    throw err;
  }
}
