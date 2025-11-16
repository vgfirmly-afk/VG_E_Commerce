// services/catalogService.js
import { v4 as uuidv4 } from 'uuid';
import { 
  getProductById, 
  getProducts, 
  getProductsByCategory, 
  searchProducts,
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductSkus,
  createSku,
  updateSku,
  deleteSku
} from '../db/db1.js';
import { logger, logError } from '../utils/logger.js';
import { CACHE_TTL_SECONDS } from '../../config.js';

/**
 * Get product by ID with caching
 */
export async function getProduct(productId, env) {
  try {
    // Check cache first
    const cacheKey = `product:${productId}`;
    const cached = await env.CATALOG_KV?.get(cacheKey, 'json');
    if (cached) {
      logger('product.cache.hit', { productId });
      return cached;
    }
    
    // Get from database
    const product = await getProductById(productId, env);
    if (!product) {
      return null;
    }
    
    // Get SKUs
    const skus = await getProductSkus(productId, env);
    
    // Parse JSON fields
    const parsedProduct = parseProductJsonFields(product);
    parsedProduct.skus = skus.map(sku => ({
      ...sku,
      attributes: typeof sku.attributes === 'string' ? JSON.parse(sku.attributes || '{}') : sku.attributes
    }));
    
    // Cache the result
    if (env.CATALOG_KV) {
      await env.CATALOG_KV.put(cacheKey, JSON.stringify(parsedProduct), {
        expirationTtl: CACHE_TTL_SECONDS
      });
    }
    
    logger('product.fetched', { productId });
    return parsedProduct;
  } catch (err) {
    logError('getProduct: Error', err, { productId });
    throw err;
  }
}

/**
 * Get products list with pagination
 */
export async function listProducts(query, env) {
  try {
    const { q, category, page = 1, limit = 20, featured, status = 'active' } = query;
    
    let products;
    if (q) {
      // Search by keyword
      products = await searchProducts(q, { page, limit, category }, env);
    } else {
      // Regular list
      products = await getProducts({ category, page, limit, featured, status }, env);
    }
    
    // Parse JSON fields for each product
    const parsedProducts = products.map(parseProductJsonFields);
    
    // Get SKUs for each product (optional, can be lazy loaded)
    // For list view, we might not need all SKUs
    
    logger('products.listed', { count: parsedProducts.length, page, limit });
    return parsedProducts;
  } catch (err) {
    logError('listProducts: Error', err, { query });
    throw err;
  }
}

/**
 * Get products for home page by category
 */
export async function getHomePageProducts(categories = ['Electronics', 'Toys', 'Dress'], limit = 10, env) {
  try {
    const result = {};
    
    for (const category of categories) {
      const products = await getProductsByCategory(category, limit, env);
      result[category] = products.map(parseProductJsonFields);
    }
    
    logger('homepage.products.fetched', { categories: Object.keys(result) });
    return result;
  } catch (err) {
    logError('getHomePageProducts: Error', err, { categories });
    throw err;
  }
}

/**
 * Create product
 */
export async function createProductService(productData, userId, env) {
  try {
    const productId = productData.product_id || uuidv4();
    const now = new Date().toISOString();
    
    // Prepare product data
    const product = {
      ...productData,
      product_id: productId,
      created_at: now,
      updated_at: now,
      created_by: userId,
      updated_by: userId,
    };
    
    // Convert JSON fields to strings
    const preparedProduct = prepareProductJsonFields(product);
    
    // Create product
    await createProduct(preparedProduct, env);
    
    // Create SKUs if provided
    if (productData.skus && Array.isArray(productData.skus)) {
      for (const skuData of productData.skus) {
        await createSkuService({
          ...skuData,
          product_id: productId
        }, userId, env);
      }
    }
    
    // Invalidate cache
    await invalidateProductCache(productId, env);
    
    logger('product.created', { productId, title: product.title });
    return await getProduct(productId, env);
  } catch (err) {
    logError('createProductService: Error', err, { productData });
    throw err;
  }
}

/**
 * Update product
 */
export async function updateProductService(productId, updates, userId, env) {
  try {
    // Prepare updates
    const preparedUpdates = prepareProductJsonFields({
      ...updates,
      updated_at: new Date().toISOString(),
      updated_by: userId,
    });
    
    // Update product
    await updateProduct(productId, preparedUpdates, env);
    
    // Update SKUs if provided
    if (updates.skus && Array.isArray(updates.skus)) {
      // Delete existing SKUs and create new ones
      const existingSkus = await getProductSkus(productId, env);
      for (const sku of existingSkus) {
        await deleteSku(sku.sku_id, env);
      }
      
      for (const skuData of updates.skus) {
        await createSkuService({
          ...skuData,
          product_id: productId
        }, userId, env);
      }
    }
    
    // Invalidate cache
    await invalidateProductCache(productId, env);
    
    logger('product.updated', { productId });
    return await getProduct(productId, env);
  } catch (err) {
    logError('updateProductService: Error', err, { productId, updates });
    throw err;
  }
}

/**
 * Delete product
 */
export async function deleteProductService(productId, env) {
  try {
    await deleteProduct(productId, env);
    
    // Invalidate cache
    await invalidateProductCache(productId, env);
    
    logger('product.deleted', { productId });
    return true;
  } catch (err) {
    logError('deleteProductService: Error', err, { productId });
    throw err;
  }
}

/**
 * Upload product image to R2
 */
export async function uploadProductImage(productId, imageId, imageFile, env) {
  try {
    if (!env.CATALOG_IMG_BUCKET) {
      throw new Error('R2 bucket not configured');
    }
    
    const r2Path = `products/${productId}/${imageId}.jpg`;
    
    // Upload to R2
    await env.CATALOG_IMG_BUCKET.put(r2Path, imageFile, {
      httpMetadata: {
        contentType: 'image/jpeg',
      },
    });
    
    // Generate public URL (R2 public URLs need to be configured via custom domain or use signed URLs)
    // For now, return the path - you'll need to configure a custom domain or use signed URLs
    const publicUrl = `/api/v1/products/${productId}/images/${imageId}`;
    
    logger('product.image.uploaded', { productId, imageId, r2Path });
    return { imageId, r2Path, url: publicUrl };
  } catch (err) {
    logError('uploadProductImage: Error', err, { productId, imageId });
    throw err;
  }
}

/**
 * Get product image from R2
 */
export async function getProductImageUrl(productId, imageId, env) {
  try {
    if (!env.CATALOG_IMG_BUCKET) {
      throw new Error('R2 bucket not configured');
    }
    
    const r2Path = `products/${productId}/${imageId}.jpg`;
    
    // Check if object exists
    const object = await env.CATALOG_IMG_BUCKET.head(r2Path);
    if (!object) {
      return null;
    }
    
    // Get the object from R2
    const r2Object = await env.CATALOG_IMG_BUCKET.get(r2Path);
    if (!r2Object) {
      return null;
    }
    
    // Return the object (will be served directly)
    return r2Object;
  } catch (err) {
    logError('getProductImageUrl: Error', err, { productId, imageId });
    return null;
  }
}

/**
 * Create SKU
 */
export async function createSkuService(skuData, userId, env) {
  try {
    const skuId = skuData.sku_id || uuidv4();
    const now = new Date().toISOString();
    
    const sku = {
      sku_id: skuId,
      product_id: skuData.product_id,
      sku_code: skuData.sku_code,
      attributes: skuData.attributes || {},
      created_at: now,
      updated_at: now,
    };
    
    await createSku(sku, env);
    
    // Invalidate product cache
    await invalidateProductCache(skuData.product_id, env);
    
    logger('sku.created', { skuId, productId: skuData.product_id });
    return sku;
  } catch (err) {
    logError('createSkuService: Error', err, { skuData });
    throw err;
  }
}

/**
 * Update SKU
 */
export async function updateSkuService(skuId, updates, productId, env) {
  try {
    await updateSku(skuId, updates, env);
    
    // Invalidate product cache
    await invalidateProductCache(productId, env);
    
    logger('sku.updated', { skuId });
    return true;
  } catch (err) {
    logError('updateSkuService: Error', err, { skuId });
    throw err;
  }
}

/**
 * Delete SKU
 */
export async function deleteSkuService(skuId, productId, env) {
  try {
    await deleteSku(skuId, env);
    
    // Invalidate product cache
    await invalidateProductCache(productId, env);
    
    logger('sku.deleted', { skuId });
    return true;
  } catch (err) {
    logError('deleteSkuService: Error', err, { skuId });
    throw err;
  }
}

/**
 * Helper: Parse JSON fields in product
 */
function parseProductJsonFields(product) {
  const jsonFields = [
    'metadata', 'attributes', 'inventory', 'policies', 'seo', 'stats', 'flags',
    'relationships', 'media', 'variants', 'extended_data',
    'categories', 'tags', 'colors', 'sizes', 'materials', 'grouped_products',
    'upsell_ids', 'cross_sell_ids', 'related_products', 'product_images',
    'gallery_images', 'downloadable_files', 'product_attributes',
    'default_attributes', 'variations', 'variation_data', 'custom_fields',
    'seo_data', 'social_data', 'analytics_data', 'pricing_data',
    'inventory_data', 'shipping_data', 'tax_data', 'discount_data',
    'promotion_data', 'bundle_data', 'subscription_data', 'membership_data',
    'gift_card_data', 'auction_data', 'rental_data', 'booking_data',
    'event_data', 'course_data', 'service_data', 'digital_data',
    'physical_data', 'variant_data', 'specifications', 'features',
    'benefits', 'use_cases', 'compatibility', 'requirements',
    'included_items', 'accessories', 'replacement_parts', 'certifications',
    'awards', 'testimonials', 'faq', 'video_tutorials'
  ];
  
  const parsed = { ...product };
  
  for (const field of jsonFields) {
    if (parsed[field] && typeof parsed[field] === 'string') {
      try {
        parsed[field] = JSON.parse(parsed[field]);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }
  }
  
  return parsed;
}

/**
 * Helper: Prepare JSON fields for database storage
 */
function prepareProductJsonFields(product) {
  const jsonFields = [
    'categories', 'tags', 'colors', 'sizes', 'materials', 'grouped_products',
    'upsell_ids', 'cross_sell_ids', 'related_products', 'product_images',
    'gallery_images', 'downloadable_files', 'product_attributes',
    'default_attributes', 'variations', 'variation_data', 'custom_fields',
    'seo_data', 'social_data', 'analytics_data', 'pricing_data',
    'inventory_data', 'shipping_data', 'tax_data', 'discount_data',
    'promotion_data', 'bundle_data', 'subscription_data', 'membership_data',
    'gift_card_data', 'auction_data', 'rental_data', 'booking_data',
    'event_data', 'course_data', 'service_data', 'digital_data',
    'physical_data', 'variant_data', 'specifications', 'features',
    'benefits', 'use_cases', 'compatibility', 'requirements',
    'included_items', 'accessories', 'replacement_parts', 'certifications',
    'awards', 'testimonials', 'faq', 'video_tutorials'
  ];
  
  const prepared = { ...product };
  
  for (const field of jsonFields) {
    if (prepared[field] !== null && prepared[field] !== undefined) {
      if (typeof prepared[field] === 'object') {
        prepared[field] = JSON.stringify(prepared[field]);
      }
    }
  }
  
  return prepared;
}

/**
 * Helper: Invalidate product cache
 */
async function invalidateProductCache(productId, env) {
  if (env.CATALOG_KV) {
    await env.CATALOG_KV.delete(`product:${productId}`);
  }
}

