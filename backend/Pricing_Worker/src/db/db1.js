// db/db1.js
// PRICING_DB helpers for SKU prices & price history
import { v4 as uuidv4 } from 'uuid';
import { logger, logError } from '../utils/logger.js';

/**
 * Get SKU price by SKU ID
 */
export async function getSkuPrice(skuId, env) {
  try {
    const res = await env.PRICING_DB.prepare(
      'SELECT * FROM sku_prices WHERE sku_id = ? AND status = ?'
    ).bind(skuId, 'active').first();
    return res || null;
  } catch (err) {
    logError('getSkuPrice: Database error', err, { skuId });
    throw err;
  }
}

/**
 * Initialize price for a new SKU (called by Catalog Worker when SKU is created)
 */
export async function initializeSkuPrice(skuData, env) {
  try {
    const { 
      sku_id, 
      product_id, 
      sku_code,
      price = 0.00,
      currency = 'USD',
      sale_price = null,
      compare_at_price = null,
      cost_price = null,
      reason = 'Initial price initialization'
    } = skuData;
    
    const now = new Date().toISOString();
    
    // Log the data being inserted
    console.log('[DB] initializeSkuPrice called with:', {
      sku_id,
      product_id,
      sku_code,
      price,
      currency,
      sale_price,
      compare_at_price,
      cost_price
    });
    
    // Check if price already exists
    const existing = await getSkuPrice(sku_id, env);
    if (existing) {
      logger('price.already_exists', { sku_id });
      return existing;
    }
    
    // Initialize with provided price data (not hardcoded defaults!)
    const sql = `INSERT INTO sku_prices (
      sku_id, product_id, sku_code, price, currency, 
      sale_price, compare_at_price, cost_price,
      status, valid_from, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    await env.PRICING_DB.prepare(sql).bind(
      sku_id,
      product_id,
      sku_code,
      price, // Use provided price, not hardcoded 0.00!
      currency, // Use provided currency, not hardcoded 'USD'!
      sale_price,
      compare_at_price,
      cost_price,
      'active',
      now,
      now,
      now
    ).run();
    
    // Create initial price history entry with actual price
    await createPriceHistory({
      sku_id,
      product_id,
      sku_code,
      price: price, // Use actual price, not 0.00!
      currency: currency, // Use actual currency, not 'USD'!
      change_type: 'create',
      reason: reason,
      changed_by: 'system'
    }, env);
    
    logger('price.initialized', { 
      sku_id, 
      product_id, 
      sku_code,
      price,
      currency
    });
    
    const inserted = await getSkuPrice(sku_id, env);
    console.log('[DB] Price inserted successfully:', {
      sku_id,
      insertedPrice: inserted?.price,
      insertedCurrency: inserted?.currency
    });
    
    return inserted;
  } catch (err) {
    logError('initializeSkuPrice: Database error', err, { skuData });
    throw err;
  }
}

/**
 * Get prices for multiple SKUs
 */
export async function getSkuPrices(skuIds, env) {
  try {
    if (!skuIds || skuIds.length === 0) return [];
    
    // Build IN clause with placeholders
    const placeholders = skuIds.map(() => '?').join(', ');
    const sql = `SELECT * FROM sku_prices WHERE sku_id IN (${placeholders}) AND status = ?`;
    
    const res = await env.PRICING_DB.prepare(sql).bind(...skuIds, 'active').all();
    return res?.results || [];
  } catch (err) {
    logError('getSkuPrices: Database error', err, { skuIds });
    throw err;
  }
}

/**
 * Get all prices for a product
 */
export async function getProductPrices(productId, env) {
  try {
    const res = await env.PRICING_DB.prepare(
      'SELECT * FROM sku_prices WHERE product_id = ? AND status = ? ORDER BY sku_code'
    ).bind(productId, 'active').all();
    return res?.results || [];
  } catch (err) {
    logError('getProductPrices: Database error', err, { productId });
    throw err;
  }
}

/**
 * Update SKU price
 */
export async function updateSkuPrice(skuId, priceData, userId, env) {
  try {
    // Get current price for history
    const currentPrice = await getSkuPrice(skuId, env);
    if (!currentPrice) {
      throw new Error('SKU price not found');
    }
    
    const now = new Date().toISOString();
    const updates = { ...priceData };
    
    // Build dynamic UPDATE query
    const fields = Object.keys(updates).filter(key => 
      key !== 'sku_id' && key !== 'product_id' && key !== 'sku_code'
    );
    
    if (fields.length === 0) {
      return currentPrice;
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    values.push(now, skuId); // updated_at and WHERE clause
    
    const sql = `UPDATE sku_prices SET ${setClause}, updated_at = ? WHERE sku_id = ? AND status = ?`;
    values.push('active');
    
    await env.PRICING_DB.prepare(sql).bind(...values).run();
    
    // Create price history entry
    await createPriceHistory({
      sku_id: skuId,
      product_id: currentPrice.product_id,
      sku_code: currentPrice.sku_code,
      price: updates.price !== undefined ? updates.price : currentPrice.price,
      currency: updates.currency || currentPrice.currency,
      sale_price: updates.sale_price !== undefined ? updates.sale_price : currentPrice.sale_price,
      compare_at_price: updates.compare_at_price !== undefined ? updates.compare_at_price : currentPrice.compare_at_price,
      cost_price: updates.cost_price !== undefined ? updates.cost_price : currentPrice.cost_price,
      change_type: 'update',
      reason: updates.reason || 'Price update',
      changed_by: userId || 'system'
    }, env);
    
    logger('price.updated', { skuId, price: updates.price });
    return await getSkuPrice(skuId, env);
  } catch (err) {
    logError('updateSkuPrice: Database error', err, { skuId, error: err.message });
    throw err;
  }
}

/**
 * Delete/Deactivate SKU price (soft delete)
 */
export async function deleteSkuPrice(skuId, userId, env) {
  try {
    const currentPrice = await getSkuPrice(skuId, env);
    if (!currentPrice) {
      throw new Error('SKU price not found');
    }
    
    const now = new Date().toISOString();
    
    // Soft delete by setting status to inactive
    await env.PRICING_DB.prepare(
      'UPDATE sku_prices SET status = ?, updated_at = ? WHERE sku_id = ?'
    ).bind('inactive', now, skuId).run();
    
    // Create price history entry
    await createPriceHistory({
      sku_id: skuId,
      product_id: currentPrice.product_id,
      sku_code: currentPrice.sku_code,
      price: currentPrice.price,
      currency: currentPrice.currency,
      sale_price: currentPrice.sale_price,
      compare_at_price: currentPrice.compare_at_price,
      cost_price: currentPrice.cost_price,
      change_type: 'delete',
      reason: 'Price deactivated',
      changed_by: userId || 'system'
    }, env);
    
    logger('price.deleted', { skuId });
    return true;
  } catch (err) {
    logError('deleteSkuPrice: Database error', err, { skuId });
    throw err;
  }
}

/**
 * Create price history entry
 */
export async function createPriceHistory(historyData, env) {
  try {
    const historyId = historyData.history_id || uuidv4();
    const now = new Date().toISOString();
    
    const sql = `INSERT INTO price_history (
      history_id, sku_id, product_id, sku_code, price, currency,
      sale_price, compare_at_price, cost_price, change_type, reason,
      changed_by, changed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    await env.PRICING_DB.prepare(sql).bind(
      historyId,
      historyData.sku_id,
      historyData.product_id,
      historyData.sku_code,
      historyData.price,
      historyData.currency || 'USD',
      historyData.sale_price || null,
      historyData.compare_at_price || null,
      historyData.cost_price || null,
      historyData.change_type || 'update',
      historyData.reason || null,
      historyData.changed_by || 'system',
      now
    ).run();
    
    logger('price_history.created', { historyId, sku_id: historyData.sku_id });
    return { history_id: historyId, ...historyData };
  } catch (err) {
    logError('createPriceHistory: Database error', err, { historyData });
    throw err;
  }
}

/**
 * Get price history for a SKU
 */
export async function getPriceHistory(skuId, { page = 1, limit = 20 }, env) {
  try {
    const offset = (page - 1) * limit;
    
    const res = await env.PRICING_DB.prepare(
      'SELECT * FROM price_history WHERE sku_id = ? ORDER BY changed_at DESC LIMIT ? OFFSET ?'
    ).bind(skuId, limit, offset).all();
    
    return res?.results || [];
  } catch (err) {
    logError('getPriceHistory: Database error', err, { skuId, page, limit });
    throw err;
  }
}

/**
 * Get active promotion code
 */
export async function getPromotionCode(code, env) {
  try {
    const now = new Date().toISOString();
    
    const res = await env.PRICING_DB.prepare(
      `SELECT * FROM promotion_codes 
       WHERE code = ? AND status = ? 
       AND valid_from <= ? AND valid_to >= ?`
    ).bind(code, 'active', now, now).first();
    
    return res || null;
  } catch (err) {
    logError('getPromotionCode: Database error', err, { code });
    throw err;
  }
}

/**
 * Calculate effective price for a SKU (considering sale price)
 */
export function calculateEffectivePrice(priceData) {
  if (!priceData) return null;
  
  // Use sale_price if available and valid, otherwise use regular price
  if (priceData.sale_price !== null && priceData.sale_price !== undefined) {
    return {
      original_price: priceData.price,
      sale_price: priceData.sale_price,
      effective_price: priceData.sale_price,
      currency: priceData.currency || 'USD'
    };
  }
  
  return {
    original_price: priceData.price,
    sale_price: null,
    effective_price: priceData.price,
    currency: priceData.currency || 'USD'
  };
}

