// handlers/adminHandlers.js
// Admin-specific handlers for product and SKU management
import { v4 as uuidv4 } from 'uuid';
import * as adminService from '../services/adminService.js';
import { 
  validateProduct, 
  validateProductUpdate, 
  validateProductId,
  validateSku,
  validateSkuId,
  validateImageId
} from '../utils/validators.js';
import { logError } from '../utils/logger.js';

/**
 * POST /products - Create product (admin only)
 */
export async function createProduct(request, env) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Invalid JSON in request body',
          details: [{ field: 'body', message: err.message }]
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate product data (skus are now allowed in schema)
    const { error, value } = validateProduct(body);
    if (error) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Invalid product data',
          details: error.details.map(d => ({
            field: d.path.join('.') || 'root',
            message: d.message,
            type: d.type
          }))
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get user from request (set by adminAuth middleware)
    const userId = request.user?.userId || 'system';
    
    // Get ctx from request if available (passed through router)
    const ctx = request.ctx || null;
    
    const product = await adminService.createProductService(value, userId, env, ctx);
    
    return new Response(
      JSON.stringify(product),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('createProduct: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * PUT /products/:product_id - Update product (admin only)
 */
export async function updateProduct(request, env) {
  try {
    const productId = request.params?.product_id;
    
    // Validate product ID
    const { error: idError } = validateProductId(productId);
    if (idError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: idError.details?.[0]?.message || 'Invalid product ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const body = await request.json();
    
    // Validate product data (all fields optional for update)
    const { error, value } = validateProductUpdate(body);
    if (error) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Invalid product data',
          details: error.details 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get user from request (set by adminAuth middleware)
    const userId = request.user?.userId || 'system';
    
    const product = await adminService.updateProductService(productId, value, userId, env);
    
    if (!product) {
      return new Response(
        JSON.stringify({ error: 'not_found', message: 'Product not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify(product),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('updateProduct: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * DELETE /products/:product_id - Delete product (admin only)
 */
export async function deleteProduct(request, env) {
  try {
    const productId = request.params?.product_id;
    
    // Validate product ID
    const { error: idError } = validateProductId(productId);
    if (idError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: idError.details?.[0]?.message || 'Invalid product ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    await adminService.deleteProductService(productId, env);
    
    return new Response(
      JSON.stringify({ message: 'Product deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('deleteProduct: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * POST /products/:product_id/skus - Create SKU (admin only)
 */
export async function createSku(request, env) {
  try {
    const productId = request.params?.product_id;
    
    // Validate product ID
    const { error: idError } = validateProductId(productId);
    if (idError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: idError.details?.[0]?.message || 'Invalid product ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const body = await request.json();
    
    // Add product_id to body
    const skuData = {
      ...body,
      product_id: productId
    };
    
    // Validate SKU data
    const { error, value } = validateSku(skuData);
    if (error) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Invalid SKU data',
          details: error.details 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get user from request (set by adminAuth middleware)
    const userId = request.user?.userId || 'system';
    
    // Get ctx from request if available (passed through router)
    const ctx = request.ctx || null;
    
    const sku = await adminService.createSkuService(value, userId, env, ctx);
    
    return new Response(
      JSON.stringify(sku),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('createSku: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * PUT /products/:product_id/skus/:sku_id - Update SKU (admin only)
 */
export async function updateSku(request, env) {
  try {
    const productId = request.params?.product_id;
    const skuId = request.params?.sku_id;
    
    // Validate product ID
    const { error: productIdError } = validateProductId(productId);
    if (productIdError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: productIdError.details?.[0]?.message || 'Invalid product ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate SKU ID
    const { error: skuIdError } = validateSkuId(skuId);
    if (skuIdError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: skuIdError.details?.[0]?.message || 'Invalid SKU ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const body = await request.json();
    
    // Remove sku_code and product_id from body (they come from URL params, not user input)
    const { sku_code, product_id, ...cleanBody } = body;
    
    // Validate SKU data (without sku_code and product_id)
    const { error, value } = validateSku({ ...cleanBody, product_id: productId });
    if (error) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Invalid SKU data',
          details: error.details 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Remove sku_code and product_id from value (they're not updatable)
    const { sku_code: _, product_id: __, ...updates } = value;
    
    // Get user from request (set by adminAuth middleware)
    const userId = request.user?.userId || 'system';
    
    // Get ctx from request if available (passed through router)
    const ctx = request.ctx || null;
    
    await adminService.updateSkuService(skuId, updates, productId, userId, env, ctx);
    
    return new Response(
      JSON.stringify({ message: 'SKU updated successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('updateSku: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * DELETE /products/:product_id/skus/:sku_id - Delete SKU (admin only)
 */
export async function deleteSku(request, env) {
  try {
    const productId = request.params?.product_id;
    const skuId = request.params?.sku_id;
    
    // Validate product ID
    const { error: productIdError } = validateProductId(productId);
    if (productIdError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: productIdError.details?.[0]?.message || 'Invalid product ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate SKU ID
    const { error: skuIdError } = validateSkuId(skuId);
    if (skuIdError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: skuIdError.details?.[0]?.message || 'Invalid SKU ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    await adminService.deleteSkuService(skuId, productId, env);
    
    return new Response(
      JSON.stringify({ message: 'SKU deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('deleteSku: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * POST /products/:product_id/images - Upload product image (admin only)
 */
export async function uploadProductImage(request, env) {
  try {
    const productId = request.params?.product_id;
    
    // Validate product ID
    const { error: idError } = validateProductId(productId);
    if (idError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: idError.details?.[0]?.message || 'Invalid product ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get form data
    const formData = await request.formData();
    const imageFile = formData.get('image');
    
    // Auto-generate image ID (always generate, ignore user input)
    const imageId = uuidv4();
    
    if (!imageFile) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Image file is required' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const result = await adminService.uploadProductImageService(
      productId, 
      imageId, 
      await imageFile.arrayBuffer(), 
      env
    );
    
    return new Response(
      JSON.stringify(result),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('uploadProductImage: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

