// db/db1.js
// FULFILLMENT_DB helpers for fulfillment process
import { v4 as uuidv4 } from 'uuid';
import { logger, logError } from '../utils/logger.js';

/**
 * Generate order number (e.g., ORD-2024-001)
 */
function generateOrderNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `ORD-${year}${month}${day}-${random}`;
}

/**
 * Create order from checkout session
 */
export async function createOrder(orderData, env) {
  try {
    const now = new Date().toISOString();
    const orderId = uuidv4();
    const orderNumber = generateOrderNumber();
    
    const {
      checkout_session_id,
      payment_id,
      user_id,
      guest_session_id,
      delivery_address_id,
      billing_address_id,
      shipping_method_id,
      estimated_delivery_date,
      subtotal,
      shipping_cost,
      tax,
      total,
      currency = 'USD',
      notes
    } = orderData;
    
    await env.FULLFILLMENT_DB.prepare(`
      INSERT INTO orders (
        order_id, checkout_session_id, payment_id, user_id, guest_session_id,
        status, order_number, delivery_address_id, billing_address_id,
        shipping_method_id, estimated_delivery_date,
        subtotal, shipping_cost, tax, total, currency, notes,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      orderId,
      checkout_session_id,
      payment_id || null,
      user_id || null,
      guest_session_id || null,
      'confirmed', // Start with confirmed status
      orderNumber,
      delivery_address_id || null,
      billing_address_id || null,
      shipping_method_id || null,
      estimated_delivery_date || null,
      subtotal,
      shipping_cost,
      tax,
      total,
      currency,
      notes || null,
      now,
      now
    ).run();
    
    // Create initial fulfillment status
    await createFulfillmentStatus(orderId, 'confirmed', 'Order created from checkout', 'system', env);
    
    logger('order.created', { orderId, orderNumber, checkout_session_id });
    return await getOrder(orderId, env);
  } catch (err) {
    logError('createOrder: Database error', err, { orderData });
    throw err;
  }
}

/**
 * Get order by ID
 */
export async function getOrder(orderId, env) {
  try {
    const order = await env.FULLFILLMENT_DB.prepare(
      'SELECT * FROM orders WHERE order_id = ?'
    ).bind(orderId).first();
    return order || null;
  } catch (err) {
    logError('getOrder: Database error', err, { orderId });
    throw err;
  }
}

/**
 * Get order by order number
 */
export async function getOrderByOrderNumber(orderNumber, env) {
  try {
    const order = await env.FULLFILLMENT_DB.prepare(
      'SELECT * FROM orders WHERE order_number = ?'
    ).bind(orderNumber).first();
    return order || null;
  } catch (err) {
    logError('getOrderByOrderNumber: Database error', err, { orderNumber });
    throw err;
  }
}

/**
 * Get orders by user ID
 */
export async function getOrdersByUserId(userId, limit = 50, offset = 0, env) {
  try {
    const orders = await env.FULLFILLMENT_DB.prepare(`
      SELECT * FROM orders 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).bind(userId, limit, offset).all();
    
    return orders.results || [];
  } catch (err) {
    logError('getOrdersByUserId: Database error', err, { userId });
    throw err;
  }
}

/**
 * Get orders by guest session ID
 */
export async function getOrdersByGuestSessionId(guestSessionId, limit = 50, offset = 0, env) {
  try {
    const orders = await env.FULLFILLMENT_DB.prepare(`
      SELECT * FROM orders 
      WHERE guest_session_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).bind(guestSessionId, limit, offset).all();
    
    return orders.results || [];
  } catch (err) {
    logError('getOrdersByGuestSessionId: Database error', err, { guestSessionId });
    throw err;
  }
}

/**
 * Update order
 */
export async function updateOrder(orderId, updates, env) {
  try {
    const now = new Date().toISOString();
    const fields = [];
    const values = [];
    
    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.estimated_delivery_date !== undefined) {
      fields.push('estimated_delivery_date = ?');
      values.push(updates.estimated_delivery_date);
    }
    if (updates.actual_delivery_date !== undefined) {
      fields.push('actual_delivery_date = ?');
      values.push(updates.actual_delivery_date);
    }
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updates.notes);
    }
    
    if (fields.length === 0) {
      return await getOrder(orderId, env);
    }
    
    fields.push('updated_at = ?');
    values.push(now);
    values.push(orderId);
    
    await env.FULLFILLMENT_DB.prepare(`
      UPDATE orders 
      SET ${fields.join(', ')} 
      WHERE order_id = ?
    `).bind(...values).run();
    
    logger('order.updated', { orderId, updates });
    return await getOrder(orderId, env);
  } catch (err) {
    logError('updateOrder: Database error', err, { orderId, updates });
    throw err;
  }
}

/**
 * Create order item
 */
export async function createOrderItem(orderId, itemData, env) {
  try {
    const now = new Date().toISOString();
    const itemId = uuidv4();
    
    const {
      sku_id,
      product_id,
      quantity,
      unit_price,
      subtotal
    } = itemData;
    
    await env.FULLFILLMENT_DB.prepare(`
      INSERT INTO order_items (
        item_id, order_id, sku_id, product_id, quantity, unit_price, subtotal, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      itemId,
      orderId,
      sku_id,
      product_id || null,
      quantity,
      unit_price,
      subtotal,
      now
    ).run();
    
    return await getOrderItem(itemId, env);
  } catch (err) {
    logError('createOrderItem: Database error', err, { orderId, itemData });
    throw err;
  }
}

/**
 * Get order item by ID
 */
export async function getOrderItem(itemId, env) {
  try {
    const item = await env.FULLFILLMENT_DB.prepare(
      'SELECT * FROM order_items WHERE item_id = ?'
    ).bind(itemId).first();
    return item || null;
  } catch (err) {
    logError('getOrderItem: Database error', err, { itemId });
    throw err;
  }
}

/**
 * Get order items by order ID
 */
export async function getOrderItems(orderId, env) {
  try {
    const items = await env.FULLFILLMENT_DB.prepare(
      'SELECT * FROM order_items WHERE order_id = ? ORDER BY created_at ASC'
    ).bind(orderId).all();
    
    return items.results || [];
  } catch (err) {
    logError('getOrderItems: Database error', err, { orderId });
    throw err;
  }
}

/**
 * Create fulfillment status
 */
export async function createFulfillmentStatus(orderId, status, notes, updatedBy, env) {
  try {
    const now = new Date().toISOString();
    const statusId = uuidv4();
    
    await env.FULLFILLMENT_DB.prepare(`
      INSERT INTO fulfillment_status (
        status_id, order_id, status, notes, updated_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      statusId,
      orderId,
      status,
      notes || null,
      updatedBy || 'system',
      now
    ).run();
    
    return await getFulfillmentStatus(statusId, env);
  } catch (err) {
    logError('createFulfillmentStatus: Database error', err, { orderId, status });
    throw err;
  }
}

/**
 * Get fulfillment status by ID
 */
export async function getFulfillmentStatus(statusId, env) {
  try {
    const status = await env.FULLFILLMENT_DB.prepare(
      'SELECT * FROM fulfillment_status WHERE status_id = ?'
    ).bind(statusId).first();
    return status || null;
  } catch (err) {
    logError('getFulfillmentStatus: Database error', err, { statusId });
    throw err;
  }
}

/**
 * Get fulfillment statuses by order ID
 */
export async function getFulfillmentStatuses(orderId, env) {
  try {
    const statuses = await env.FULLFILLMENT_DB.prepare(
      'SELECT * FROM fulfillment_status WHERE order_id = ? ORDER BY created_at ASC'
    ).bind(orderId).all();
    
    return statuses.results || [];
  } catch (err) {
    logError('getFulfillmentStatuses: Database error', err, { orderId });
    throw err;
  }
}

/**
 * Create shipping tracking
 */
export async function createShippingTracking(orderId, trackingData, env) {
  try {
    const now = new Date().toISOString();
    const trackingId = uuidv4();
    
    const {
      carrier,
      tracking_number,
      status = 'pending',
      estimated_delivery_date,
      notes
    } = trackingData;
    
    await env.FULLFILLMENT_DB.prepare(`
      INSERT INTO shipping_tracking (
        tracking_id, order_id, carrier, tracking_number, status,
        estimated_delivery_date, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      trackingId,
      orderId,
      carrier,
      tracking_number,
      status,
      estimated_delivery_date || null,
      notes || null,
      now,
      now
    ).run();
    
    logger('shipping_tracking.created', { trackingId, orderId, tracking_number });
    return await getShippingTracking(trackingId, env);
  } catch (err) {
    logError('createShippingTracking: Database error', err, { orderId, trackingData });
    throw err;
  }
}

/**
 * Get shipping tracking by ID
 */
export async function getShippingTracking(trackingId, env) {
  try {
    const tracking = await env.FULLFILLMENT_DB.prepare(
      'SELECT * FROM shipping_tracking WHERE tracking_id = ?'
    ).bind(trackingId).first();
    return tracking || null;
  } catch (err) {
    logError('getShippingTracking: Database error', err, { trackingId });
    throw err;
  }
}

/**
 * Get shipping tracking by order ID
 */
export async function getShippingTrackingByOrderId(orderId, env) {
  try {
    const tracking = await env.FULLFILLMENT_DB.prepare(
      'SELECT * FROM shipping_tracking WHERE order_id = ? ORDER BY created_at DESC LIMIT 1'
    ).bind(orderId).first();
    return tracking || null;
  } catch (err) {
    logError('getShippingTrackingByOrderId: Database error', err, { orderId });
    throw err;
  }
}

/**
 * Update shipping tracking
 */
export async function updateShippingTracking(trackingId, updates, env) {
  try {
    const now = new Date().toISOString();
    const fields = [];
    const values = [];
    
    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.estimated_delivery_date !== undefined) {
      fields.push('estimated_delivery_date = ?');
      values.push(updates.estimated_delivery_date);
    }
    if (updates.actual_delivery_date !== undefined) {
      fields.push('actual_delivery_date = ?');
      values.push(updates.actual_delivery_date);
    }
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updates.notes);
    }
    
    if (fields.length === 0) {
      return await getShippingTracking(trackingId, env);
    }
    
    fields.push('updated_at = ?');
    values.push(now);
    values.push(trackingId);
    
    await env.FULLFILLMENT_DB.prepare(`
      UPDATE shipping_tracking 
      SET ${fields.join(', ')} 
      WHERE tracking_id = ?
    `).bind(...values).run();
    
    logger('shipping_tracking.updated', { trackingId, updates });
    return await getShippingTracking(trackingId, env);
  } catch (err) {
    logError('updateShippingTracking: Database error', err, { trackingId, updates });
    throw err;
  }
}

