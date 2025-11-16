// services/pricingService.js
// Business logic for pricing operations
import { 
  getSkuPrice, 
  getSkuPrices, 
  getProductPrices, 
  updateSkuPrice, 
  deleteSkuPrice,
  getPriceHistory,
  getPromotionCode,
  calculateEffectivePrice
} from '../db/db1.js';
import { logger, logError } from '../utils/logger.js';

/**
 * Get SKU price with effective price calculation
 */
export async function getPrice(skuId, env) {
  try {
    const priceData = await getSkuPrice(skuId, env);
    if (!priceData) {
      return null;
    }
    
    const effective = calculateEffectivePrice(priceData);
    return {
      ...priceData,
      ...effective
    };
  } catch (err) {
    logError('getPrice: Error', err, { skuId });
    throw err;
  }
}

/**
 * Get prices for multiple SKUs
 */
export async function getPrices(skuIds, env) {
  try {
    const prices = await getSkuPrices(skuIds, env);
    return prices.map(priceData => ({
      ...priceData,
      ...calculateEffectivePrice(priceData)
    }));
  } catch (err) {
    logError('getPrices: Error', err, { skuIds });
    throw err;
  }
}

/**
 * Get all prices for a product
 */
export async function getProductPricing(productId, env) {
  try {
    const prices = await getProductPrices(productId, env);
    return prices.map(priceData => ({
      ...priceData,
      ...calculateEffectivePrice(priceData)
    }));
  } catch (err) {
    logError('getProductPricing: Error', err, { productId });
    throw err;
  }
}

/**
 * Calculate grand total from SKU IDs and quantities
 */
export async function calculateGrandTotal(items, promotionCode = null, currency = 'USD', env) {
  try {
    const skuIds = items.map(item => item.sku_id);
    const prices = await getSkuPrices(skuIds, env);
    
    // Create a map for quick lookup
    const priceMap = new Map();
    prices.forEach(price => {
      priceMap.set(price.sku_id, calculateEffectivePrice(price));
    });
    
    // Calculate subtotal
    let subtotal = 0;
    const itemDetails = [];
    
    for (const item of items) {
      const priceData = priceMap.get(item.sku_id);
      if (!priceData) {
        logError('calculateGrandTotal: SKU price not found', null, { sku_id: item.sku_id });
        continue; // Skip items without price
      }
      
      const itemTotal = priceData.effective_price * item.quantity;
      subtotal += itemTotal;
      
      itemDetails.push({
        sku_id: item.sku_id,
        sku_code: priceData.sku_code,
        quantity: item.quantity,
        unit_price: priceData.effective_price,
        original_price: priceData.original_price,
        sale_price: priceData.sale_price,
        item_total: itemTotal,
        currency: priceData.currency || currency
      });
    }
    
    // Apply promotion code if provided
    let discount = 0;
    let discountAmount = 0;
    let promotion = null;
    
    if (promotionCode) {
      const promo = await getPromotionCode(promotionCode, env);
      if (promo && promo.status === 'active') {
        // Check if promotion applies to any of the SKUs
        let applicable = true;
        if (promo.applicable_skus) {
          try {
            const applicableSkus = typeof promo.applicable_skus === 'string' 
              ? JSON.parse(promo.applicable_skus) 
              : promo.applicable_skus;
            applicable = skuIds.some(skuId => applicableSkus.includes(skuId));
          } catch {
            // If parsing fails, assume all SKUs
          }
        }
        
        // Check minimum purchase amount
        if (promo.min_purchase_amount && subtotal < promo.min_purchase_amount) {
          applicable = false;
        }
        
        // Check usage limit
        if (promo.usage_limit && promo.usage_count >= promo.usage_limit) {
          applicable = false;
        }
        
        if (applicable) {
          promotion = {
            code: promo.code,
            name: promo.name,
            discount_type: promo.discount_type,
            discount_value: promo.discount_value
          };
          
          if (promo.discount_type === 'percentage') {
            discountAmount = (subtotal * promo.discount_value) / 100;
            
            // Apply max discount limit if set
            if (promo.max_discount_amount && discountAmount > promo.max_discount_amount) {
              discountAmount = promo.max_discount_amount;
            }
          } else if (promo.discount_type === 'fixed_amount') {
            discountAmount = promo.discount_value;
            if (discountAmount > subtotal) {
              discountAmount = subtotal; // Can't discount more than total
            }
          }
        }
      }
    }
    
    // Calculate final total
    const total = Math.max(0, subtotal - discountAmount);
    
    logger('grand_total.calculated', { 
      item_count: items.length, 
      subtotal, 
      discount: discountAmount, 
      total 
    });
    
    return {
      items: itemDetails,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discountAmount.toFixed(2)),
      promotion: promotion,
      total: parseFloat(total.toFixed(2)),
      currency: currency
    };
  } catch (err) {
    logError('calculateGrandTotal: Error', err, { items, promotionCode });
    throw err;
  }
}

/**
 * Update SKU price (admin)
 */
export async function updatePrice(skuId, priceData, userId, env) {
  try {
    const updated = await updateSkuPrice(skuId, priceData, userId, env);
    logger('price.updated', { skuId, price: priceData.price });
    return updated;
  } catch (err) {
    logError('updatePrice: Error', err, { skuId, priceData });
    throw err;
  }
}

/**
 * Delete/deactivate SKU price (admin)
 */
export async function deletePrice(skuId, userId, env) {
  try {
    await deleteSkuPrice(skuId, userId, env);
    logger('price.deleted', { skuId });
    return true;
  } catch (err) {
    logError('deletePrice: Error', err, { skuId });
    throw err;
  }
}

/**
 * Get price history for a SKU
 */
export async function getHistory(skuId, query, env) {
  try {
    const history = await getPriceHistory(skuId, query, env);
    logger('price_history.fetched', { skuId, count: history.length });
    return history;
  } catch (err) {
    logError('getHistory: Error', err, { skuId, query });
    throw err;
  }
}

