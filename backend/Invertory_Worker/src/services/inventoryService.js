// services/inventoryService.js
import { logger, logError } from '../utils/logger.js';
import {
  getSkuStock,
  getSkuStocks,
  getProductStock,
  initializeSkuStock,
  updateSkuStock,
  adjustStockQuantity,
  reserveStock,
  releaseStock,
  getStockHistory
} from '../db/db1.js';

/**
 * Get stock for a single SKU
 */
export async function getStock(skuId, env) {
  try {
    const stock = await getSkuStock(skuId, env);
    if (!stock) {
      return null;
    }
    
    return {
      sku_id: stock.sku_id,
      product_id: stock.product_id,
      sku_code: stock.sku_code,
      quantity: stock.quantity,
      reserved_quantity: stock.reserved_quantity,
      available_quantity: stock.available_quantity,
      low_stock_threshold: stock.low_stock_threshold,
      status: stock.status,
      created_at: stock.created_at,
      updated_at: stock.updated_at
    };
  } catch (err) {
    logError('getStock: Service error', err, { skuId });
    throw err;
  }
}

/**
 * Get stock for multiple SKUs
 */
export async function getStocks(skuIds, env) {
  try {
    const stocks = await getSkuStocks(skuIds, env);
    return stocks.map(stock => ({
      sku_id: stock.sku_id,
      product_id: stock.product_id,
      sku_code: stock.sku_code,
      quantity: stock.quantity,
      reserved_quantity: stock.reserved_quantity,
      available_quantity: stock.available_quantity,
      low_stock_threshold: stock.low_stock_threshold,
      status: stock.status
    }));
  } catch (err) {
    logError('getStocks: Service error', err, { skuIds });
    throw err;
  }
}

/**
 * Get all stock for a product
 */
export async function getProductStocks(productId, env) {
  try {
    const stocks = await getProductStock(productId, env);
    return stocks.map(stock => ({
      sku_id: stock.sku_id,
      product_id: stock.product_id,
      sku_code: stock.sku_code,
      quantity: stock.quantity,
      reserved_quantity: stock.reserved_quantity,
      available_quantity: stock.available_quantity,
      low_stock_threshold: stock.low_stock_threshold,
      status: stock.status
    }));
  } catch (err) {
    logError('getProductStocks: Service error', err, { productId });
    throw err;
  }
}

/**
 * Initialize stock for a new SKU
 */
export async function initializeStock(stockData, env) {
  try {
    const stock = await initializeSkuStock(stockData, env);
    logger('stock.initialized', { skuId: stock.sku_id, quantity: stock.quantity });
    return stock;
  } catch (err) {
    logError('initializeStock: Service error', err, { stockData });
    throw err;
  }
}

/**
 * Update stock
 */
export async function updateStock(skuId, updates, userId, env) {
  try {
    const stock = await updateSkuStock(skuId, updates, userId, env);
    logger('stock.updated', { skuId, updates });
    return stock;
  } catch (err) {
    logError('updateStock: Service error', err, { skuId, updates });
    throw err;
  }
}

/**
 * Adjust stock quantity (increase or decrease)
 */
export async function adjustStock(skuId, adjustmentQuantity, userId, env, reason = 'Stock adjustment', reservationId = null) {
  try {
    const stock = await adjustStockQuantity(skuId, adjustmentQuantity, userId, env, reason, reservationId);
    logger('stock.adjusted', { skuId, adjustmentQuantity, availableQuantity: stock.available_quantity });
    return stock;
  } catch (err) {
    logError('adjustStock: Service error', err, { skuId, adjustmentQuantity });
    throw err;
  }
}

/**
 * Reserve stock (for cart/checkout)
 */
export async function reserveStockForCart(skuId, quantity, reservationId, userId, env, expiresAt = null) {
  try {
    const stock = await reserveStock(skuId, quantity, reservationId, userId, env, expiresAt);
    logger('stock.reserved', { skuId, quantity, reservationId, availableQuantity: stock.available_quantity });
    return stock;
  } catch (err) {
    logError('reserveStockForCart: Service error', err, { skuId, quantity, reservationId });
    throw err;
  }
}

/**
 * Release reserved stock
 */
export async function releaseReservedStock(skuId, reservationId, quantity, userId, env) {
  try {
    const stock = await releaseStock(skuId, reservationId, quantity, userId, env);
    logger('stock.released', { skuId, reservationId, quantity, availableQuantity: stock.available_quantity });
    return stock;
  } catch (err) {
    logError('releaseReservedStock: Service error', err, { skuId, reservationId, quantity });
    throw err;
  }
}

/**
 * Get stock history
 */
export async function getHistory(skuId, page, limit, env) {
  try {
    const history = await getStockHistory(skuId, page, limit, env);
    return history;
  } catch (err) {
    logError('getHistory: Service error', err, { skuId, page, limit });
    throw err;
  }
}

/**
 * Check stock availability for multiple SKUs
 */
export async function checkAvailability(skuIds, env) {
  try {
    const stocks = await getSkuStocks(skuIds, env);
    const availability = {};
    
    for (const stock of stocks) {
      availability[stock.sku_id] = {
        sku_id: stock.sku_id,
        available_quantity: stock.available_quantity,
        quantity: stock.quantity,
        reserved_quantity: stock.reserved_quantity,
        status: stock.status,
        in_stock: stock.available_quantity > 0
      };
    }
    
    // Include SKUs that weren't found
    for (const skuId of skuIds) {
      if (!availability[skuId]) {
        availability[skuId] = {
          sku_id: skuId,
          available_quantity: 0,
          quantity: 0,
          reserved_quantity: 0,
          status: 'not_found',
          in_stock: false
        };
      }
    }
    
    return availability;
  } catch (err) {
    logError('checkAvailability: Service error', err, { skuIds });
    throw err;
  }
}

/**
 * Deduct stock for order (called via webhook when payment is captured)
 */
export async function deductStockForOrder(skuId, quantity, orderId, env) {
  try {
    // Get current stock
    const stock = await getSkuStock(skuId, env);
    if (!stock) {
      throw new Error(`Stock not found for SKU: ${skuId}`);
    }
    
    // Check if enough stock is available
    if (stock.available_quantity < quantity) {
      throw new Error(`Insufficient stock for SKU ${skuId}. Available: ${stock.available_quantity}, Required: ${quantity}`);
    }
    
    // Deduct stock (negative adjustment)
    const reason = orderId ? `Order ${orderId} - Payment captured` : 'Payment captured';
    const adjustedStock = await adjustStockQuantity(
      skuId,
      -quantity, // Negative to deduct
      'system',
      env,
      reason,
      null
    );
    
    logger('stock.deducted_for_order', {
      skuId,
      quantity,
      orderId,
      remaining_quantity: adjustedStock.quantity,
      remaining_available: adjustedStock.available_quantity
    });
    
    return adjustedStock;
  } catch (err) {
    logError('deductStockForOrder: Service error', err, { skuId, quantity, orderId });
    throw err;
  }
}

