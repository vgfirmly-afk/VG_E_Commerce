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
    
    // Extract reason for history (not a column in sku_prices table)
    const reason = updates.reason;
    delete updates.reason; // Remove reason from updates as it's not a column in sku_prices
    
    // Build dynamic UPDATE query
    // Filter out fields that are not columns in sku_prices table
    const fields = Object.keys(updates).filter(key => 
      key !== 'sku_id' && 
      key !== 'product_id' && 
      key !== 'sku_code' &&
      key !== 'reason' // reason is only in price_history, not sku_prices
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
      reason: reason || 'Price update', // Use extracted reason
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
 * Get active promotion code (for calculation)
 * Note: Code matching is case-insensitive (should be normalized before calling)
 */
export async function getPromotionCode(code, env) {
  try {
    const now = new Date().toISOString();
    
    // Use UPPER() for case-insensitive matching
    const res = await env.PRICING_DB.prepare(
      `SELECT * FROM promotion_codes 
       WHERE UPPER(code) = UPPER(?) AND status = ? 
       AND valid_from <= ? AND valid_to >= ?`
    ).bind(code, 'active', now, now).first();
    
    if (res) {
      console.log('[DB] Promotion code found:', {
        code: res.code,
        status: res.status,
        valid_from: res.valid_from,
        valid_to: res.valid_to,
        now: now
      });
    } else {
      console.log('[DB] Promotion code not found or not valid:', {
        code,
        now,
        query: 'code=' + code + ', status=active, valid_from<=' + now + ', valid_to>=' + now
      });
    }
    
    return res || null;
  } catch (err) {
    logError('getPromotionCode: Database error', err, { code });
    throw err;
  }
}

/**
 * Get promotion code by ID (admin)
 */
export async function getPromotionCodeById(promotionId, env) {
  try {
    const res = await env.PRICING_DB.prepare(
      'SELECT * FROM promotion_codes WHERE promotion_id = ?'
    ).bind(promotionId).first();
    
    return res || null;
  } catch (err) {
    logError('getPromotionCodeById: Database error', err, { promotionId });
    throw err;
  }
}

/**
 * Get promotion code by code (admin - includes inactive)
 */
export async function getPromotionCodeByCode(code, env) {
  try {
    const res = await env.PRICING_DB.prepare(
      'SELECT * FROM promotion_codes WHERE code = ?'
    ).bind(code).first();
    
    return res || null;
  } catch (err) {
    logError('getPromotionCodeByCode: Database error', err, { code });
    throw err;
  }
}

/**
 * List all promotion codes (admin)
 */
export async function listPromotionCodes({ page = 1, limit = 20, status = null }, env) {
  try {
    const offset = (page - 1) * limit;
    let sql = 'SELECT * FROM promotion_codes';
    const params = [];
    
    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const res = await env.PRICING_DB.prepare(sql).bind(...params).all();
    
    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM promotion_codes';
    const countParams = [];
    if (status) {
      countSql += ' WHERE status = ?';
      countParams.push(status);
    }
    const countRes = await env.PRICING_DB.prepare(countSql).bind(...countParams).first();
    
    return {
      promotions: res?.results || [],
      page,
      limit,
      total: countRes?.total || 0
    };
  } catch (err) {
    logError('listPromotionCodes: Database error', err, { page, limit, status });
    throw err;
  }
}

/**
 * Create promotion code (admin)
 */
export async function createPromotionCode(promoData, userId, env) {
  try {
    const {
      code,
      name,
      description = null,
      discount_type,
      discount_value,
      min_purchase_amount = null,
      max_discount_amount = null,
      valid_from,
      valid_to,
      usage_limit = null,
      applicable_skus = null
    } = promoData;
    
    const promotionId = promoData.promotion_id || uuidv4();
    const now = new Date().toISOString();
    
    // Check if code already exists
    const existing = await getPromotionCodeByCode(code, env);
    if (existing) {
      throw new Error(`Promotion code '${code}' already exists`);
    }
    
    // Serialize applicable_skus if it's an array
    let applicableSkusStr = null;
    if (applicable_skus) {
      if (Array.isArray(applicable_skus)) {
        applicableSkusStr = JSON.stringify(applicable_skus);
      } else if (typeof applicable_skus === 'string') {
        applicableSkusStr = applicable_skus;
      }
    }
    
    const sql = `INSERT INTO promotion_codes (
      promotion_id, code, name, description, discount_type, discount_value,
      min_purchase_amount, max_discount_amount, valid_from, valid_to,
      usage_limit, usage_count, status, applicable_skus,
      created_at, updated_at, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    await env.PRICING_DB.prepare(sql).bind(
      promotionId,
      code,
      name,
      description,
      discount_type,
      discount_value,
      min_purchase_amount,
      max_discount_amount,
      valid_from,
      valid_to,
      usage_limit,
      0, // usage_count starts at 0
      'active',
      applicableSkusStr,
      now,
      now,
      userId || 'system'
    ).run();
    
    logger('promotion_code.created', { promotionId, code, name });
    return await getPromotionCodeById(promotionId, env);
  } catch (err) {
    logError('createPromotionCode: Database error', err, { promoData });
    throw err;
  }
}

/**
 * Update promotion code (admin)
 */
export async function updatePromotionCode(promotionId, updates, userId, env) {
  try {
    const existing = await getPromotionCodeById(promotionId, env);
    if (!existing) {
      throw new Error('Promotion code not found');
    }
    
    const now = new Date().toISOString();
    const updateFields = { ...updates };
    
    // Handle applicable_skus serialization
    if (updateFields.applicable_skus !== undefined) {
      if (Array.isArray(updateFields.applicable_skus)) {
        updateFields.applicable_skus = JSON.stringify(updateFields.applicable_skus);
      } else if (updateFields.applicable_skus === null) {
        updateFields.applicable_skus = null;
      }
    }
    
    // Build dynamic UPDATE query
    const fields = Object.keys(updateFields).filter(key => 
      key !== 'promotion_id' && key !== 'code' // Don't allow changing ID or code
    );
    
    if (fields.length === 0) {
      return existing;
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updateFields[field]);
    values.push(now, promotionId); // updated_at and WHERE clause
    
    const sql = `UPDATE promotion_codes SET ${setClause}, updated_at = ? WHERE promotion_id = ?`;
    
    await env.PRICING_DB.prepare(sql).bind(...values).run();
    
    logger('promotion_code.updated', { promotionId, updates: fields });
    return await getPromotionCodeById(promotionId, env);
  } catch (err) {
    logError('updatePromotionCode: Database error', err, { promotionId, updates });
    throw err;
  }
}

/**
 * Delete/deactivate promotion code (admin)
 */
export async function deletePromotionCode(promotionId, userId, env) {
  try {
    const existing = await getPromotionCodeById(promotionId, env);
    if (!existing) {
      throw new Error('Promotion code not found');
    }
    
    const now = new Date().toISOString();
    
    // Soft delete by setting status to inactive
    await env.PRICING_DB.prepare(
      'UPDATE promotion_codes SET status = ?, updated_at = ? WHERE promotion_id = ?'
    ).bind('inactive', now, promotionId).run();
    
    logger('promotion_code.deleted', { promotionId, code: existing.code });
    return true;
  } catch (err) {
    logError('deletePromotionCode: Database error', err, { promotionId });
    throw err;
  }
}

/**
 * Increment usage count for a promotion code
 */
export async function incrementPromotionUsage(code, env) {
  try {
    await env.PRICING_DB.prepare(
      'UPDATE promotion_codes SET usage_count = usage_count + 1 WHERE code = ?'
    ).bind(code).run();
    
    logger('promotion_code.usage_incremented', { code });
    return true;
  } catch (err) {
    logError('incrementPromotionUsage: Database error', err, { code });
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

