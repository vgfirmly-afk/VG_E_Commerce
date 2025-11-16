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
  deleteSku,
  getSkuById
} from '../db/db1.js';
import { logger, logError } from '../utils/logger.js';
import { generateSlug, generateSkuCode, generateUniqueSlug } from '../utils/helpers.js';
import { slugExists } from '../db/db1.js';

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
    
    // Auto-generate unique slug from title (always generate, ignore user input)
    let slug = null;
    if (productData.title) {
      const baseSlug = generateSlug(productData.title);
      // Ensure slug is unique by checking database
      slug = await generateUniqueSlug(baseSlug, (s, excludeId) => slugExists(s, excludeId, env), null);
    }
    
    // Set default image if no image is provided
    const defaultImageUrl = 'https://cdni.iconscout.com/illustration/free/thumb/free-error-404-not-found-illustration-svg-download-png-12308353.png';
    let media = productData.media;
    
    // Check if image is provided in various formats
    const hasImage = productData.image_url || 
                     productData.product_images || 
                     (productData.media && typeof productData.media === 'object' && productData.media.image_url) ||
                     (productData.media && typeof productData.media === 'object' && productData.media.product_images);
    
    if (!hasImage) {
      // Set default image in media field
      const defaultImageData = {
        image_url: defaultImageUrl,
        product_images: [{
          image_id: 'default',
          url: defaultImageUrl,
          uploaded_at: now
        }]
      };
      
      // If media already exists, merge with default image
      if (productData.media && typeof productData.media === 'object') {
        media = {
          ...productData.media,
          ...defaultImageData
        };
      } else if (productData.media && typeof productData.media === 'string') {
        try {
          const parsedMedia = JSON.parse(productData.media);
          media = {
            ...parsedMedia,
            ...defaultImageData
          };
        } catch {
          media = defaultImageData;
        }
      } else {
        media = defaultImageData;
      }
    }
    
    // Prepare product data
    // Note: JSON field consolidation is handled by consolidateProductFields in db1.js
    const product = {
      ...productData,
      product_id: productId,
      slug: slug, // Always use auto-generated unique slug (ignores user input)
      media: media, // Include default image if no image provided
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
    // If title is being updated, auto-generate a new unique slug
    if (updates.title) {
      const baseSlug = generateSlug(updates.title);
      // Ensure slug is unique by checking database (exclude current product)
      const uniqueSlug = await generateUniqueSlug(baseSlug, (s, excludeId) => slugExists(s, excludeId, env), productId);
      updates.slug = uniqueSlug;
    }
    
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
    
    // Auto-generate SKU code (always generate, ignore user input)
    const skuCode = generateSkuCode();
    
    const sku = {
      sku_id: skuId,
      product_id: skuData.product_id,
      sku_code: skuCode, // Always use auto-generated SKU code
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
    // Remove sku_code and product_id from updates if provided (they come from URL params)
    const { sku_code, product_id, ...cleanUpdates } = updates;
    
    const preparedUpdates = {
      ...cleanUpdates,
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
    
    // Generate full public URL (R2 public access URL)
    // Format: https://pub-18e6a1004b7947968dd09e310be97e91.r2.dev/products/{productId}/{imageId}.jpg
    const publicUrl = `https://pub-18e6a1004b7947968dd09e310be97e91.r2.dev/${r2Path}`;
    
    // Save the publicUrl to the product's media JSON field in the database
    // Replace old image instead of adding to array
    const product = await getProductById(productId, env);
    if (product) {
      // Parse existing media JSON or create new
      let media = {};
      if (product.media) {
        try {
          media = typeof product.media === 'string' ? JSON.parse(product.media) : product.media;
        } catch {
          media = {};
        }
      }
      
      // Replace old image with new one (store as single image, not array)
      const imageData = {
        image_id: imageId,
        url: publicUrl,
        r2_path: r2Path,
        uploaded_at: new Date().toISOString()
      };
      
      // Store as single image_url (primary image) and also in product_images array for compatibility
      media.image_url = publicUrl;
      media.product_images = [imageData]; // Replace array with single image
      
      // Update the product's media field
      await updateProduct(productId, { media: JSON.stringify(media) }, env);
    }
    
    // Invalidate product cache
    await invalidateProductCache(productId, env);
    
    logger('product.image.uploaded', { productId, imageId, r2Path, publicUrl });
    return { imageId, r2Path, url: publicUrl };
  } catch (err) {
    logError('uploadProductImageService: Error', err, { productId, imageId });
    throw err;
  }
}

