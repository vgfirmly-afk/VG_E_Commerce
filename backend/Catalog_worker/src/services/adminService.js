// services/adminService.js
// Admin-specific business logic for product and SKU management
import { v4 as uuidv4 } from 'uuid';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductById,
  getProductSkus,
  createSku,
  updateSku,
  deleteSku
} from '../db/db1.js';
import { logger, logError } from '../utils/logger.js';

/**
 * Invalidate product cache
 */
async function invalidateProductCache(productId, env) {
  try {
    if (env.CATALOG_KV) {
      await env.CATALOG_KV.delete(`product:${productId}`);
    }
  } catch (err) {
    logError('invalidateProductCache: Error', err, { productId });
  }
}

/**
 * Create product (admin)
 */
export async function createProductService(productData, userId, env) {
  try {
    const productId = productData.product_id || uuidv4();
    const now = new Date().toISOString();
    
    // Prepare product data
    // Note: JSON field consolidation is handled by consolidateProductFields in db1.js
    const product = {
      ...productData,
      product_id: productId,
      created_at: now,
      updated_at: now,
      created_by: userId,
      updated_by: userId,
    };
    
    // Create product (db1.js will handle JSON consolidation)
    await createProduct(product, env);
    
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
    return await getProductById(productId, env);
  } catch (err) {
    logError('createProductService: Error', err, { productData });
    throw err;
  }
}

/**
 * Update product (admin)
 */
export async function updateProductService(productId, updates, userId, env) {
  try {
    // Prepare updates
    // Note: JSON field consolidation is handled by consolidateProductFields in db1.js
    const preparedUpdates = {
      ...updates,
      updated_at: new Date().toISOString(),
      updated_by: userId,
    };
    
    // Update product (db1.js will handle JSON consolidation)
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
    return await getProductById(productId, env);
  } catch (err) {
    logError('updateProductService: Error', err, { productId, updates });
    throw err;
  }
}

/**
 * Delete product (admin)
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
 * Create SKU (admin)
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
 * Update SKU (admin)
 */
export async function updateSkuService(skuId, updates, productId, env) {
  try {
    const preparedUpdates = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    await updateSku(skuId, preparedUpdates, env);
    
    // Invalidate product cache
    await invalidateProductCache(productId, env);
    
    logger('sku.updated', { skuId, productId });
    return true;
  } catch (err) {
    logError('updateSkuService: Error', err, { skuId });
    throw err;
  }
}

/**
 * Delete SKU (admin)
 */
export async function deleteSkuService(skuId, productId, env) {
  try {
    await deleteSku(skuId, env);
    
    // Invalidate product cache
    await invalidateProductCache(productId, env);
    
    logger('sku.deleted', { skuId, productId });
    return true;
  } catch (err) {
    logError('deleteSkuService: Error', err, { skuId });
    throw err;
  }
}

/**
 * Upload product image to R2 (admin)
 */
export async function uploadProductImageService(productId, imageId, imageFile, env) {
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
    
    // Generate public URL path
    const publicUrl = `/api/v1/products/${productId}/images/${imageId}`;
    
    // Invalidate product cache
    await invalidateProductCache(productId, env);
    
    logger('product.image.uploaded', { productId, imageId, r2Path });
    return { imageId, r2Path, url: publicUrl };
  } catch (err) {
    logError('uploadProductImageService: Error', err, { productId, imageId });
    throw err;
  }
}

