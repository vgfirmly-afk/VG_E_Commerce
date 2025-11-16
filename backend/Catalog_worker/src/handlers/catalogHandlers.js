// handlers/catalogHandlers.js
import * as catalogService from '../services/catalogService.js';
import { 
  validateProductsQuery,
  validateSearchQuery,
  validateHomePageQuery,
  validateProductId,
  validateImageId
} from '../utils/validators.js';
import { logger, logError } from '../utils/logger.js';
import { PRODUCTS_PER_PAGE, MAX_PRODUCTS_PER_PAGE } from '../../config.js';

/**
 * GET /products - List products with pagination and filters
 */
export async function listProducts(request, env) {
  try {
    const url = new URL(request.url);
    const queryParams = {
      q: url.searchParams.get('q') || '',
      category: url.searchParams.get('category') || '',
      page: parseInt(url.searchParams.get('page') || '1', 10),
      limit: Math.min(parseInt(url.searchParams.get('limit') || String(PRODUCTS_PER_PAGE), 10), MAX_PRODUCTS_PER_PAGE),
      featured: url.searchParams.get('featured') ? parseInt(url.searchParams.get('featured'), 10) : undefined,
      status: url.searchParams.get('status') || 'active',
    };
    
    // Validate query params
    const { error, value } = validateProductsQuery(queryParams);
    if (error) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Invalid query parameters',
          details: error.details 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const products = await catalogService.listProducts(value, env);
    
    return new Response(
      JSON.stringify({
        products: products.map(p => ({
          product_id: p.product_id,
          title: p.title,
          description: p.description,
          default_sku: p.default_sku,
          images: Array.isArray(p.product_images) ? p.product_images : (p.image_url ? [p.image_url] : []),
          categories: Array.isArray(p.categories) ? p.categories : (p.category ? [p.category] : []),
        })),
        page: value.page,
        limit: value.limit,
        count: products.length
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('listProducts: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /products/:product_id - Get full product details
 */
export async function getProduct(request, env) {
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
    
    const product = await catalogService.getProduct(productId, env);
    
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
    logError('getProduct: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /products/:product_id/images/:image_id - Serve product image from R2
 */
export async function getProductImage(request, env) {
  try {
    const productId = request.params?.product_id;
    const imageId = request.params?.image_id;
    
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
    
    // Validate image ID
    const { error: imageIdError } = validateImageId(imageId);
    if (imageIdError) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: imageIdError.details?.[0]?.message || 'Invalid image ID' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const r2Object = await catalogService.getProductImageUrl(productId, imageId, env);
    
    if (!r2Object) {
      return new Response(
        JSON.stringify({ error: 'not_found', message: 'Image not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Serve the R2 object directly
    return new Response(r2Object.body, {
      headers: {
        'Content-Type': r2Object.httpMetadata?.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (err) {
    logError('getProductImage: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /home - Get home page products by category (like Amazon)
 */
export async function getHomePage(request, env) {
  try {
    const url = new URL(request.url);
    const queryParams = {
      categories: url.searchParams.get('categories') || '',
      limit: url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit'), 10) : 10,
    };
    
    // Validate query parameters
    const { error, value } = validateHomePageQuery(queryParams);
    if (error) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Invalid query parameters',
          details: error.details 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const categories = value.categories 
      ? value.categories.split(',').map(c => c.trim()).filter(c => c.length > 0)
      : ['Electronics', 'Toys', 'Dress', 'Books', 'Sports'];
    
    const products = await catalogService.getHomePageProducts(categories, value.limit, env);
    
    return new Response(
      JSON.stringify(products),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('getHomePage: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /search?q=keyword - Search products by keyword
 */
export async function searchProductsHandler(request, env) {
  try {
    const url = new URL(request.url);
    const queryParams = {
      q: url.searchParams.get('q') || '',
      category: url.searchParams.get('category') || '',
      page: url.searchParams.get('page') ? parseInt(url.searchParams.get('page'), 10) : 1,
      limit: url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit'), 10) : PRODUCTS_PER_PAGE,
    };
    
    // Validate search query parameters
    const { error, value } = validateSearchQuery(queryParams);
    if (error) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Invalid search parameters',
          details: error.details 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const products = await catalogService.listProducts({ q: value.q, category: value.category, page: value.page, limit: value.limit }, env);
    
    return new Response(
      JSON.stringify({
        products: products.map(p => ({
          product_id: p.product_id,
          title: p.title,
          description: p.description,
          default_sku: p.default_sku,
          images: Array.isArray(p.product_images) ? p.product_images : (p.image_url ? [p.image_url] : []),
          categories: Array.isArray(p.categories) ? p.categories : (p.category ? [p.category] : []),
        })),
        page: value.page,
        limit: value.limit,
        count: products.length,
        keyword: value.q
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('searchProductsHandler: Handler error', err);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

