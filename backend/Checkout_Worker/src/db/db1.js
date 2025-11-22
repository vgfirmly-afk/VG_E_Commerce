// db/db1.js
// CHECKOUT_DB helpers for checkout process
import { v4 as uuidv4 } from 'uuid';
import { logger, logError } from '../utils/logger.js';
import { RESERVATION_TTL_SECONDS, CHECKOUT_SESSION_TTL_SECONDS } from '../../config.js';
// Removed serviceBinding import - using direct template literals like Cart Worker

/**
 * Get checkout session by ID
 */
export async function getCheckoutSession(sessionId, env) {
  try {
    const session = await env.CHECKOUT_DB.prepare(
      'SELECT * FROM checkout_sessions WHERE session_id = ?'
    ).bind(sessionId).first();
    return session || null;
  } catch (err) {
    logError('getCheckoutSession: Database error', err, { sessionId });
    throw err;
  }
}

/**
 * Create checkout session
 */
export async function createCheckoutSession(cartId, userId, guestSessionId, env) {
  try {
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + CHECKOUT_SESSION_TTL_SECONDS * 1000).toISOString();
    const sessionId = uuidv4();
    
    await env.CHECKOUT_DB.prepare(`
      INSERT INTO checkout_sessions (
        session_id, cart_id, user_id, guest_session_id, status,
        currency, expires_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      sessionId,
      cartId,
      userId || null,
      guestSessionId || null,
      'pending',
      'USD',
      expiresAt,
      now,
      now
    ).run();
    
    logger('checkout.session.created', { sessionId, cartId, userId });
    return await getCheckoutSession(sessionId, env);
  } catch (err) {
    logError('createCheckoutSession: Database error', err, { cartId, userId });
    throw err;
  }
}

/**
 * Update checkout session
 */
export async function updateCheckoutSession(sessionId, updates, env) {
  try {
    const now = new Date().toISOString();
    const fields = [];
    const values = [];
    
    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.delivery_address_id !== undefined) {
      fields.push('delivery_address_id = ?');
      values.push(updates.delivery_address_id);
    }
    if (updates.billing_address_id !== undefined) {
      fields.push('billing_address_id = ?');
      values.push(updates.billing_address_id);
    }
    if (updates.shipping_method_id !== undefined) {
      fields.push('shipping_method_id = ?');
      values.push(updates.shipping_method_id);
    }
    if (updates.estimated_delivery_date !== undefined) {
      fields.push('estimated_delivery_date = ?');
      values.push(updates.estimated_delivery_date);
    }
    if (updates.subtotal !== undefined) {
      fields.push('subtotal = ?');
      values.push(updates.subtotal);
    }
    if (updates.shipping_cost !== undefined) {
      fields.push('shipping_cost = ?');
      values.push(updates.shipping_cost);
    }
    if (updates.tax !== undefined) {
      fields.push('tax = ?');
      values.push(updates.tax);
    }
    if (updates.total !== undefined) {
      fields.push('total = ?');
      values.push(updates.total);
    }
    
    fields.push('updated_at = ?');
    values.push(now);
    values.push(sessionId);
    
    await env.CHECKOUT_DB.prepare(`
      UPDATE checkout_sessions 
      SET ${fields.join(', ')}
      WHERE session_id = ?
    `).bind(...values).run();
    
    return await getCheckoutSession(sessionId, env);
  } catch (err) {
    logError('updateCheckoutSession: Database error', err, { sessionId, updates });
    throw err;
  }
}

/**
 * Create or update address
 */
export async function saveAddress(addressData, userId, sessionId, type, env) {
  try {
    const now = new Date().toISOString();
    const addressId = addressData.address_id || uuidv4();
    
    // Check if address exists
    const existing = await env.CHECKOUT_DB.prepare(
      'SELECT * FROM addresses WHERE address_id = ?'
    ).bind(addressId).first();
    
    if (existing) {
      // Update existing address
      await env.CHECKOUT_DB.prepare(`
        UPDATE addresses 
        SET full_name = ?, phone = ?, email = ?, address_line1 = ?, address_line2 = ?,
            city = ?, state = ?, postal_code = ?, country = ?, is_default = ?, updated_at = ?
        WHERE address_id = ?
      `).bind(
        addressData.full_name,
        addressData.phone,
        addressData.email || null,
        addressData.address_line1,
        addressData.address_line2 || null,
        addressData.city,
        addressData.state,
        addressData.postal_code,
        addressData.country || 'IN',
        addressData.is_default ? 1 : 0,
        now,
        addressId
      ).run();
    } else {
      // Create new address
      await env.CHECKOUT_DB.prepare(`
        INSERT INTO addresses (
          address_id, user_id, session_id, type, full_name, phone, email,
          address_line1, address_line2, city, state, postal_code, country,
          is_default, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        addressId,
        userId || null,
        sessionId || null,
        type,
        addressData.full_name,
        addressData.phone,
        addressData.email || null,
        addressData.address_line1,
        addressData.address_line2 || null,
        addressData.city,
        addressData.state,
        addressData.postal_code,
        addressData.country || 'IN',
        addressData.is_default ? 1 : 0,
        now,
        now
      ).run();
    }
    
    return await getAddress(addressId, env);
  } catch (err) {
    logError('saveAddress: Database error', err, { userId, type });
    throw err;
  }
}

/**
 * Get address by ID
 */
export async function getAddress(addressId, env) {
  try {
    const address = await env.CHECKOUT_DB.prepare(
      'SELECT * FROM addresses WHERE address_id = ?'
    ).bind(addressId).first();
    return address || null;
  } catch (err) {
    logError('getAddress: Database error', err, { addressId });
    throw err;
  }
}

/**
 * Get shipping methods (filtered by pincode if provided)
 */
export async function getShippingMethods(pincode, env) {
  try {
    const methods = await env.CHECKOUT_DB.prepare(
      'SELECT * FROM shipping_methods WHERE is_active = 1 ORDER BY base_cost ASC'
    ).all();
    
    if (!methods?.results) return [];
    
    // Filter by pincode if provided
    if (pincode) {
      return methods.results.filter(method => {
        if (!method.applicable_pincodes) return true; // All pincodes
        try {
          const pincodes = JSON.parse(method.applicable_pincodes);
          return pincodes.includes('*') || pincodes.includes(pincode);
        } catch {
          return true; // If parsing fails, include the method
        }
      });
    }
    
    return methods.results;
  } catch (err) {
    logError('getShippingMethods: Database error', err, { pincode });
    throw err;
  }
}

/**
 * Get shipping method by ID
 */
export async function getShippingMethod(methodId, env) {
  try {
    const method = await env.CHECKOUT_DB.prepare(
      'SELECT * FROM shipping_methods WHERE method_id = ?'
    ).bind(methodId).first();
    return method || null;
  } catch (err) {
    logError('getShippingMethod: Database error', err, { methodId });
    throw err;
  }
}

/**
 * Create shipping method (admin)
 */
export async function createShippingMethod(methodData, env) {
  try {
    const methodId = uuidv4();
    const now = new Date().toISOString();
    
    await env.CHECKOUT_DB.prepare(`
      INSERT INTO shipping_methods (
        method_id, name, description, carrier, base_cost, cost_per_kg,
        min_delivery_days, max_delivery_days, is_active, applicable_pincodes,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      methodId,
      methodData.name,
      methodData.description || null,
      methodData.carrier,
      methodData.base_cost || 0.00,
      methodData.cost_per_kg || 0.00,
      methodData.min_delivery_days || 3,
      methodData.max_delivery_days || 7,
      methodData.is_active !== undefined ? (methodData.is_active ? 1 : 0) : 1,
      methodData.applicable_pincodes ? JSON.stringify(methodData.applicable_pincodes) : null,
      now,
      now
    ).run();
    
    return await getShippingMethod(methodId, env);
  } catch (err) {
    logError('createShippingMethod: Database error', err, { methodData });
    throw err;
  }
}

/**
 * Update shipping method (admin)
 */
export async function updateShippingMethod(methodId, updates, env) {
  try {
    const now = new Date().toISOString();
    const existing = await getShippingMethod(methodId, env);
    if (!existing) {
      throw new Error('Shipping method not found');
    }
    
    const updateFields = [];
    const bindValues = [];
    
    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      bindValues.push(updates.name);
    }
    if (updates.description !== undefined) {
      updateFields.push('description = ?');
      bindValues.push(updates.description || null);
    }
    if (updates.carrier !== undefined) {
      updateFields.push('carrier = ?');
      bindValues.push(updates.carrier);
    }
    if (updates.base_cost !== undefined) {
      updateFields.push('base_cost = ?');
      bindValues.push(updates.base_cost);
    }
    if (updates.cost_per_kg !== undefined) {
      updateFields.push('cost_per_kg = ?');
      bindValues.push(updates.cost_per_kg);
    }
    if (updates.min_delivery_days !== undefined) {
      updateFields.push('min_delivery_days = ?');
      bindValues.push(updates.min_delivery_days);
    }
    if (updates.max_delivery_days !== undefined) {
      updateFields.push('max_delivery_days = ?');
      bindValues.push(updates.max_delivery_days);
    }
    if (updates.is_active !== undefined) {
      updateFields.push('is_active = ?');
      bindValues.push(updates.is_active ? 1 : 0);
    }
    if (updates.applicable_pincodes !== undefined) {
      updateFields.push('applicable_pincodes = ?');
      bindValues.push(updates.applicable_pincodes ? JSON.stringify(updates.applicable_pincodes) : null);
    }
    
    if (updateFields.length === 0) {
      return existing; // No updates
    }
    
    updateFields.push('updated_at = ?');
    bindValues.push(now);
    bindValues.push(methodId);
    
    await env.CHECKOUT_DB.prepare(`
      UPDATE shipping_methods 
      SET ${updateFields.join(', ')}
      WHERE method_id = ?
    `).bind(...bindValues).run();
    
    return await getShippingMethod(methodId, env);
  } catch (err) {
    logError('updateShippingMethod: Database error', err, { methodId, updates });
    throw err;
  }
}

/**
 * Delete shipping method (admin) - Soft delete by setting is_active = 0
 */
export async function deleteShippingMethod(methodId, env) {
  try {
    const existing = await getShippingMethod(methodId, env);
    if (!existing) {
      throw new Error('Shipping method not found');
    }
    
    const now = new Date().toISOString();
    await env.CHECKOUT_DB.prepare(`
      UPDATE shipping_methods 
      SET is_active = 0, updated_at = ?
      WHERE method_id = ?
    `).bind(now, methodId).run();
    
    return { success: true, method_id: methodId };
  } catch (err) {
    logError('deleteShippingMethod: Database error', err, { methodId });
    throw err;
  }
}

/**
 * Get all shipping methods (admin - includes inactive)
 */
export async function getAllShippingMethods(env) {
  try {
    const methods = await env.CHECKOUT_DB.prepare(
      'SELECT * FROM shipping_methods ORDER BY created_at DESC'
    ).all();
    
    return methods?.results || [];
  } catch (err) {
    logError('getAllShippingMethods: Database error', err);
    throw err;
  }
}

/**
 * Save checkout items (snapshot of cart items)
 */
export async function saveCheckoutItems(sessionId, items, env) {
  try {
    const now = new Date().toISOString();
    
    // Delete existing items for this session
    await env.CHECKOUT_DB.prepare(
      'DELETE FROM checkout_items WHERE session_id = ?'
    ).bind(sessionId).run();
    
    // Insert new items
    for (const item of items) {
      const itemId = uuidv4();
      await env.CHECKOUT_DB.prepare(`
        INSERT INTO checkout_items (
          item_id, session_id, sku_id, quantity, unit_price, subtotal, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        itemId,
        sessionId,
        item.sku_id,
        item.quantity,
        item.unit_price,
        item.subtotal,
        now
      ).run();
    }
    
    return await getCheckoutItems(sessionId, env);
  } catch (err) {
    logError('saveCheckoutItems: Database error', err, { sessionId });
    throw err;
  }
}

/**
 * Get checkout items
 */
export async function getCheckoutItems(sessionId, env) {
  try {
    const res = await env.CHECKOUT_DB.prepare(
      'SELECT * FROM checkout_items WHERE session_id = ?'
    ).bind(sessionId).all();
    return res?.results || [];
  } catch (err) {
    logError('getCheckoutItems: Database error', err, { sessionId });
    throw err;
  }
}

/**
 * Stock Reservation Functions using KV for temporary reservations
 */

/**
 * Get reserved quantity from KV for a SKU
 */
async function getKVReservedQuantity(skuId, env) {
  try {
    if (!env.CHECKOUT_KV) return 0;
    
    const key = `reservation:${skuId}`;
    const data = await env.CHECKOUT_KV.get(key, 'json');
    
    if (!data) return 0;
    
    // Sum all active reservations
    let totalReserved = 0;
    const now = Date.now();
    
    for (const reservation of data.reservations || []) {
      if (reservation.expiresAt > now && reservation.status === 'active') {
        totalReserved += reservation.quantity;
      }
    }
    
    return totalReserved;
  } catch (err) {
    logError('getKVReservedQuantity: KV error', err, { skuId });
    return 0; // Fail safe - assume no reservations
  }
}

/**
 * Reserve stock in KV (temporary reservation during checkout)
 * Returns true if reservation successful, false if insufficient stock
 */
export async function reserveStockInKV(sessionId, skuId, quantity, env) {
  try {
    if (!env.CHECKOUT_KV) {
      throw new Error('CHECKOUT_KV not available');
    }
    
    const key = `reservation:${skuId}`;
    const now = Date.now();
    const expiresAt = now + (RESERVATION_TTL_SECONDS * 1000);
    
    // Get current reservations
    let data = await env.CHECKOUT_KV.get(key, 'json');
    if (!data) {
      data = { reservations: [] };
    }
    
    // Clean up expired reservations
    data.reservations = (data.reservations || []).filter(
      r => r.expiresAt > now && r.status === 'active'
    );
    
    // Get available quantity from Inventory Worker via service binding
    const inventoryWorker = env.INVENTORY_WORKER;
    if (!inventoryWorker) {
      throw new Error('INVENTORY_WORKER binding not available');
    }
    
    // Use service binding - URL is just for routing, not an external HTTP call
    // Construct URL parts separately to avoid TLD validation during bundling
    const protocol = 'https';
    const hostname = 'inventory-worker';
    const path = '/api/v1/stock/' + encodeURIComponent(skuId);
    const urlString = protocol + '://' + hostname + path;
    const stockRequest = new Request(urlString, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Source': 'checkout-worker-service-binding'
      }
    });
    
    // Service binding fetch - this goes through Cloudflare's internal routing, not external HTTP
    const stockResponse = await inventoryWorker.fetch(stockRequest);
    if (!stockResponse.ok) {
      throw new Error(`Failed to get stock: ${stockResponse.status}`);
    }
    
    const stockData = await stockResponse.json();
    const d1AvailableQuantity = stockData.available_quantity || 0;
    
    // Calculate total reserved in KV
    const kvReservedQuantity = data.reservations.reduce(
      (sum, r) => sum + (r.status === 'active' ? r.quantity : 0),
      0
    );
    
    // Calculate actual available: D1 available - KV reserved
    const actualAvailable = d1AvailableQuantity - kvReservedQuantity;
    
    // Check if we can reserve
    if (actualAvailable < quantity) {
      logger('stock.reservation.failed', {
        skuId,
        requested: quantity,
        d1Available: d1AvailableQuantity,
        kvReserved: kvReservedQuantity,
        actualAvailable
      });
      return { success: false, available: actualAvailable, reason: 'Insufficient stock' };
    }
    
    // Add new reservation
    const reservation = {
      sessionId,
      skuId,
      quantity,
      reservedAt: now,
      expiresAt,
      status: 'active'
    };
    
    data.reservations.push(reservation);
    
    // Save back to KV with TTL
    await env.CHECKOUT_KV.put(key, JSON.stringify(data), {
      expirationTtl: RESERVATION_TTL_SECONDS
    });
    
    logger('stock.reserved.kv', {
      skuId,
      quantity,
      sessionId,
      expiresAt: new Date(expiresAt).toISOString()
    });
    
    return { success: true, reserved: quantity };
  } catch (err) {
    logError('reserveStockInKV: Error', err, { sessionId, skuId, quantity });
    throw err;
  }
}

/**
 * Release stock reservation from KV
 */
export async function releaseStockFromKV(sessionId, skuId, env) {
  try {
    if (!env.CHECKOUT_KV) return;
    
    const key = `reservation:${skuId}`;
    const data = await env.CHECKOUT_KV.get(key, 'json');
    
    if (!data || !data.reservations) return;
    
    // Remove reservations for this session
    data.reservations = data.reservations.filter(
      r => r.sessionId !== sessionId
    );
    
    // Save back to KV
    if (data.reservations.length > 0) {
      await env.CHECKOUT_KV.put(key, JSON.stringify(data));
    } else {
      await env.CHECKOUT_KV.delete(key);
    }
    
    logger('stock.released.kv', { skuId, sessionId });
  } catch (err) {
    logError('releaseStockFromKV: Error', err, { sessionId, skuId });
    // Don't throw - this is cleanup, shouldn't fail the request
  }
}

/**
 * Release all stock reservations for a session
 */
export async function releaseAllStockForSession(sessionId, skuIds, env) {
  try {
    for (const skuId of skuIds) {
      await releaseStockFromKV(sessionId, skuId, env);
    }
  } catch (err) {
    logError('releaseAllStockForSession: Error', err, { sessionId });
  }
}

/**
 * Check stock availability considering KV reservations
 */
export async function checkStockAvailability(skuId, quantity, env) {
  try {
    // Get available quantity from Inventory Worker via service binding
    const inventoryWorker = env.INVENTORY_WORKER;
    if (!inventoryWorker) {
      throw new Error('INVENTORY_WORKER binding not available');
    }
    
    // Use service binding - URL is just for routing, not an external HTTP call
    // Construct URL parts separately to avoid TLD validation during bundling
    const protocol = 'https';
    const hostname = 'inventory-worker';
    const path = '/api/v1/stock/' + encodeURIComponent(skuId);
    const urlString = protocol + '://' + hostname + path;
    const stockRequest = new Request(urlString, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Source': 'checkout-worker-service-binding'
      }
    });
    
    // Service binding fetch - this goes through Cloudflare's internal routing, not external HTTP
    const stockResponse = await inventoryWorker.fetch(stockRequest);
    if (!stockResponse.ok) {
      return { available: false, reason: 'Stock check failed' };
    }
    
    const stockData = await stockResponse.json();
    const d1AvailableQuantity = stockData.available_quantity || 0;
    
    // Get KV reserved quantity
    const kvReservedQuantity = await getKVReservedQuantity(skuId, env);
    
    // Calculate actual available
    const actualAvailable = d1AvailableQuantity - kvReservedQuantity;
    
    return {
      available: actualAvailable >= quantity,
      availableQuantity: actualAvailable,
      d1Available: d1AvailableQuantity,
      kvReserved: kvReservedQuantity,
      requested: quantity
    };
  } catch (err) {
    logError('checkStockAvailability: Error', err, { skuId, quantity });
    return { available: false, reason: err.message };
  }
}

