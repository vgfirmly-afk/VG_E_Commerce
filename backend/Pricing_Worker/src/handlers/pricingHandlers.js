// handlers/pricingHandlers.js
import * as pricingService from '../services/pricingService.js';
import { 
  validateSkuId,
  validateCalculateTotal,
  validatePriceHistoryQuery,
  validateSkuPriceUpdate
} from '../utils/validators.js';
import { logError } from '../utils/logger.js';

/**
 * GET /prices/:sku_id - Get price for a SKU
 */
export async function getPrice(request, env) {
  try {
    const skuId = request.params?.sku_id;
    
    // Validate SKU ID
    const { error: idError } = validateSkuId(skuId);
    if (idError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: idError.details?.[0]?.message || 'Invalid SKU ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const price = await pricingService.getPrice(skuId, env);
    
    if (!price) {
      return new Response(
        JSON.stringify({ error: 'not_found', message: 'Price not found for this SKU' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify(price),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('getPrice: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /prices/product/:product_id - Get all prices for a product
 */
export async function getProductPrices(request, env) {
  try {
    const productId = request.params?.product_id;
    
    if (!productId) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Product ID is required' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const prices = await pricingService.getProductPricing(productId, env);
    
    return new Response(
      JSON.stringify({ product_id: productId, prices }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('getProductPrices: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * POST /calculate-total - Calculate grand total from SKU IDs and quantities
 */
export async function calculateTotal(request, env) {
  try {
    const body = await request.json();
    
    // Validate request body
    const { error, value } = validateCalculateTotal(body);
    if (error) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Invalid request data',
          details: error.details.map(d => ({
            path: d.path.join('.'),
            message: d.message,
            type: d.type
          }))
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { items, promotion_code, currency } = value;
    const total = await pricingService.calculateGrandTotal(
      items, 
      promotion_code || null, 
      currency || 'USD', 
      env
    );
    
    return new Response(
      JSON.stringify(total),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('calculateTotal: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /prices/:sku_id/history - Get price history for a SKU
 */
export async function getHistory(request, env) {
  try {
    const skuId = request.params?.sku_id;
    
    // Validate SKU ID
    const { error: idError } = validateSkuId(skuId);
    if (idError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: idError.details?.[0]?.message || 'Invalid SKU ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get query parameters
    const url = new URL(request.url);
    const queryParams = {
      sku_id: skuId,
      page: parseInt(url.searchParams.get('page') || '1', 10),
      limit: parseInt(url.searchParams.get('limit') || '20', 10),
    };
    
    // Validate query params
    const { error: queryError } = validatePriceHistoryQuery(queryParams);
    if (queryError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Invalid query parameters',
          details: queryError.details 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const history = await pricingService.getHistory(skuId, queryParams, env);
    
    return new Response(
      JSON.stringify({
        sku_id: skuId,
        history,
        page: queryParams.page,
        limit: queryParams.limit,
        count: history.length
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('getHistory: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * POST /prices/:sku_id - Initialize or update SKU price (admin/service only)
 * Called by Catalog Worker when SKU is created
 */
export async function initializePrice(request, env) {
  try {
    const skuId = request.params?.sku_id;
    
    // Validate SKU ID
    const { error: idError } = validateSkuId(skuId);
    if (idError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: idError.details?.[0]?.message || 'Invalid SKU ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const body = await request.json();
    
    // Log received payload for debugging
    console.log('[Pricing Handler] Received price initialization payload:', {
      skuId,
      body,
      bodyKeys: Object.keys(body),
      timestamp: new Date().toISOString()
    });
    
    // Validate price data
    const { error, value } = validateSkuPriceUpdate(body);
    if (error) {
      console.error('[Pricing Handler] Validation error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Invalid price data',
          details: error.details 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get user from request (set by adminAuth middleware or service)
    const userId = request.user?.userId || 'Catalog system';
    
    // Log validated value
    console.log('[Pricing Handler] Validated price data:', {
      skuId,
      value,
      valueKeys: Object.keys(value),
      hasPrice: value.price !== undefined,
      price: value.price
    });
    
    // If price already exists, update it; otherwise initialize
    const { initializeSkuPrice, updateSkuPrice, getSkuPrice } = await import('../db/db1.js');
    const existing = await getSkuPrice(skuId, env);
    
    let price;
    if (existing) {
      console.log('[Pricing Handler] Price exists, updating:', { skuId, existingPrice: existing.price });
      price = await updateSkuPrice(skuId, value, userId, env);
    } else {
      // Initialize with provided data or defaults
      // Include all fields from body (sku_id, product_id, sku_code) and validated value (price fields)
      const initData = {
        sku_id: skuId,
        product_id: body.product_id || '',
        sku_code: body.sku_code || '',
        price: value.price !== undefined ? value.price : (body.price !== undefined ? body.price : 0.00),
        currency: value.currency || body.currency || 'USD',
        sale_price: value.sale_price !== undefined ? value.sale_price : (body.sale_price !== undefined ? body.sale_price : null),
        compare_at_price: value.compare_at_price !== undefined ? value.compare_at_price : (body.compare_at_price !== undefined ? body.compare_at_price : null),
        cost_price: value.cost_price !== undefined ? value.cost_price : (body.cost_price !== undefined ? body.cost_price : null),
        reason: body.reason || value.reason || 'Price synced from Catalog Worker'
      };
      
      console.log('[Pricing Handler] Initializing price with data:', initData);
      price = await initializeSkuPrice(initData, env);
    }
    
    console.log('[Pricing Handler] Price operation completed:', {
      skuId,
      wasExisting: !!existing,
      finalPrice: price?.price,
      status: existing ? 200 : 201
    });
    
    return new Response(
      JSON.stringify(price),
      { status: existing ? 200 : 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('initializePrice: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * PUT /prices/:sku_id - Update SKU price (admin only)
 */
export async function updatePrice(request, env) {
  try {
    const skuId = request.params?.sku_id;
    
    // Validate SKU ID
    const { error: idError } = validateSkuId(skuId);
    if (idError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: idError.details?.[0]?.message || 'Invalid SKU ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const body = await request.json();
    
    // Validate price data
    const { error, value } = validateSkuPriceUpdate(body);
    if (error) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Invalid price data',
          details: error.details 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get user from request (set by adminAuth middleware)
    const userId = request.user?.userId || 'system';
    
    const price = await pricingService.updatePrice(skuId, value, userId, env);
    
    return new Response(
      JSON.stringify(price),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('updatePrice: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * DELETE /prices/:sku_id - Delete/deactivate SKU price (admin only)
 */
export async function deletePrice(request, env) {
  try {
    const skuId = request.params?.sku_id;
    
    // Validate SKU ID
    const { error: idError } = validateSkuId(skuId);
    if (idError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: idError.details?.[0]?.message || 'Invalid SKU ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get user from request (set by adminAuth middleware)
    const userId = request.user?.userId || 'system';
    
    await pricingService.deletePrice(skuId, userId, env);
    
    return new Response(
      JSON.stringify({ message: 'Price deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('deletePrice: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

