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
 * Check Pricing Worker health endpoint using Service Binding
 */
async function checkPricingWorkerHealth(env) {
  try {
    // Use service binding if available, otherwise fall back to HTTP
    const pricingWorker = env.PRICING_WORKER;
    
    if (pricingWorker) {
      // Use service binding (direct Worker-to-Worker call)
      logger('price.health.check', { 
        method: 'service_binding',
        endpoint: '/_/health',
        timestamp: new Date().toISOString()
      });
      
      const healthRequest = new Request('https://pricing-worker/_/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const healthResponse = await pricingWorker.fetch(healthRequest);
      const text = await healthResponse.text().catch(() => '');
      let parsedBody = text;
      try { 
        parsedBody = JSON.parse(text); 
      } catch (e) { 
        parsedBody = text;
      }

      const isHealthy = healthResponse.ok && parsedBody && parsedBody.ok === true;

      if (!isHealthy) {
        logError('syncPriceToPricingWorker: Pricing Worker health check failed (service binding)', null, {
          status: healthResponse.status,
          statusText: healthResponse.statusText,
          responseBody: parsedBody,
          expected: { ok: true }
        });
        return { healthy: false, status: healthResponse.status, response: parsedBody };
      }

      logger('price.health.ok', { 
        method: 'service_binding',
        status: healthResponse.status,
        response: parsedBody
      });
      return { healthy: true, status: healthResponse.status, response: parsedBody };
    } else {
      // Fallback: Service binding not available, skip health check
      logger('price.health.check', { 
        method: 'service_binding_not_available',
        note: 'PRICING_WORKER binding not found, skipping health check'
      });
      return { healthy: true, status: 200, response: { ok: true }, skipCheck: true };
    }
  } catch (err) {
    logError('syncPriceToPricingWorker: Health check error', err, {
      method: 'service_binding',
      errorType: err.name,
      errorMessage: err.message,
      stack: err.stack
    });
    return { healthy: false, error: err.message };
  }
}

/**
 * Call Pricing Worker to initialize or update SKU price using Service Binding (async/non-blocking)
 */
async function syncPriceToPricingWorker(skuId, productId, skuCode, priceData, env) {
  try {
    // Use service binding if available (preferred method)
    const pricingWorker = env.PRICING_WORKER;
    
    if (pricingWorker) {
      // Use service binding - direct Worker-to-Worker call (no HTTP overhead)
      logger('price.sync.attempt', {
        skuId,
        method: 'service_binding',
        endpoint: `/api/v1/prices/${skuId}`,
        timestamp: new Date().toISOString()
      });
      
      // Build payload from actual inputs (fall back to sensible defaults)
      const pricePayload = {
        sku_id: skuId,
        product_id: productId,
        sku_code: skuCode,
        price: priceData.price !== undefined ? priceData.price : 0.00,
        currency: priceData.currency || 'USD',
        sale_price: priceData.sale_price !== undefined ? priceData.sale_price : null,
        compare_at_price: priceData.compare_at_price !== undefined ? priceData.compare_at_price : null,
        cost_price: priceData.cost_price !== undefined ? priceData.cost_price : null,
        reason: priceData.reason || 'Price synced from Catalog Worker'
      };

      // Log the payload being sent
      logger('price.sync.payload', {
        skuId,
        payload: pricePayload,
        payloadString: JSON.stringify(pricePayload),
        priceData: priceData
      });

      // First, check Pricing Worker health using service binding
      const healthCheck = await checkPricingWorkerHealth(env);
      
      if (!healthCheck.healthy && !healthCheck.skipCheck) {
        logError('syncPriceToPricingWorker: Pricing Worker is not healthy, skipping price sync', null, {
          skuId,
          healthCheck,
          reason: 'Health check failed - Pricing Worker may be down or unreachable'
        });
        return Promise.resolve();
      }

      // Create request for service binding
      // Note: URL can be any valid URL format - service binding handles routing internally
      const pricingRequest = new Request(`https://pricing-worker/api/v1/prices/${encodeURIComponent(skuId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Service bindings are internal and secure - no auth token needed
          'X-Source': 'catalog-worker-service-binding'
        },
        body: JSON.stringify(pricePayload)
      });

      const pricingPromise = pricingWorker.fetch(pricingRequest).then(async (response) => {
        const text = await response.text().catch(() => '');
        let parsedBody = text;
        try { 
          parsedBody = JSON.parse(text); 
        } catch (e) { 
          parsedBody = text;
        }

        if (!response.ok) {
          logError('syncPriceToPricingWorker: Failed to sync price (service binding)', null, {
            skuId,
            status: response.status,
            statusText: response.statusText,
            endpoint: `/api/v1/prices/${skuId}`,
            responseBody: parsedBody
          });
        } else {
          logger('price.synced', { 
            skuId, 
            method: 'service_binding',
            status: response.status
          });
        }

        return { ok: response.ok, status: response.status, body: parsedBody };
      }).catch((err) => {
        logError('syncPriceToPricingWorker: Service binding error', err, { 
          skuId,
          errorType: err.name,
          errorMessage: err.message
        });
      });

      return pricingPromise;
    } else {
      // Fallback: Service binding not available, use HTTP fetch
      logger('price.sync.attempt', {
        skuId,
        method: 'http_fallback',
        note: 'PRICING_WORKER binding not found, using HTTP fetch'
      });
      
      const pricingWorkerUrl = (env.PRICING_WORKER_URL || 'https://w2-pricing-worker.vg-firmly.workers.dev').replace(/\/$/, '');
      const catalogWorkerUrl = (env.CATALOG_WORKER_URL || 'https://w2-catalog-worker.vg-firmly.workers.dev').replace(/\/$/, '');
      
      if (!env.PRICING_SERVICE_TOKEN) {
        logError('syncPriceToPricingWorker: PRICING_SERVICE_TOKEN not configured', null, { skuId });
        return Promise.resolve();
      }
      
      // Health check using HTTP
      const healthCheck = await checkPricingWorkerHealthHTTP(pricingWorkerUrl, env);
      
      if (!healthCheck.healthy) {
        logError('syncPriceToPricingWorker: Pricing Worker is not healthy, skipping price sync', null, {
          skuId,
          healthCheck,
          reason: 'Health check failed - Pricing Worker may be down or unreachable'
        });
        return Promise.resolve();
      }
      
      const authHeader = `Bearer ${env.PRICING_SERVICE_TOKEN}`;

      const pricePayload = {
        sku_id: skuId,
        product_id: productId,
        sku_code: skuCode,
        price: priceData.price !== undefined ? priceData.price : 0.00,
        currency: priceData.currency || 'USD',
        sale_price: priceData.sale_price !== undefined ? priceData.sale_price : null,
        compare_at_price: priceData.compare_at_price !== undefined ? priceData.compare_at_price : null,
        cost_price: priceData.cost_price !== undefined ? priceData.cost_price : null,
        reason: priceData.reason || 'Price synced from Catalog Worker'
      };

      const pricingEndpoint = `${pricingWorkerUrl}/api/v1/prices/${encodeURIComponent(skuId)}`;

      return fetch(pricingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
          'X-Source': catalogWorkerUrl
        },
        body: JSON.stringify(pricePayload)
      }).then(async (response) => {
        const text = await response.text().catch(() => '');
        let parsedBody = text;
        try { parsedBody = JSON.parse(text); } catch (e) { parsedBody = text; }

        if (!response.ok) {
          logError('syncPriceToPricingWorker: Failed to sync price (HTTP fallback)', null, {
            skuId,
            status: response.status,
            statusText: response.statusText,
            endpoint: pricingEndpoint,
            responseBody: parsedBody
          });
        } else {
          logger('price.synced', { skuId, method: 'http_fallback', endpoint: pricingEndpoint });
        }

        return { ok: response.ok, status: response.status, body: parsedBody };
      }).catch((err) => {
        logError('syncPriceToPricingWorker: HTTP fetch error', err, { skuId });
      });
    }
  } catch (err) {
    logError('syncPriceToPricingWorker: Error setting up price sync', err, { skuId });
    return Promise.resolve();
  }
}

/**
 * HTTP fallback health check (used when service binding is not available)
 */
async function checkPricingWorkerHealthHTTP(pricingWorkerUrl, env) {
  try {
    const baseUrl = pricingWorkerUrl.replace(/\/$/, '');
    const healthEndpoint = `${baseUrl}/_/health`;
    
    const healthResponse = await fetch(healthEndpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const text = await healthResponse.text().catch(() => '');
    let parsedBody = text;
    try { 
      parsedBody = JSON.parse(text); 
    } catch (e) { 
      parsedBody = text;
    }

    const isHealthy = healthResponse.ok && parsedBody && parsedBody.ok === true;
    return { healthy: isHealthy, status: healthResponse.status, response: parsedBody };
  } catch (err) {
    return { healthy: false, error: err.message };
  }
}


/**
 * Create product (admin)
 */
export async function createProductService(productData, userId, env, ctx = null) {
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
        }, userId, env, ctx);
        // Note: createSkuService will automatically initialize price in Pricing Worker
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
 * Call Inventory Worker to initialize stock for a new SKU using Service Binding (async/non-blocking)
 */
async function syncStockToInventoryWorker(skuId, productId, skuCode, env) {
  try {
    const inventoryWorker = env.INVENTORY_WORKER;
    
    if (inventoryWorker) {
      // Use service binding
      logger('stock.sync.attempt', {
        skuId,
        method: 'service_binding',
        endpoint: `/api/v1/stock/${skuId}`,
        timestamp: new Date().toISOString()
      });
      
      const stockPayload = {
        sku_id: skuId,
        product_id: productId,
        sku_code: skuCode,
        quantity: 0, // Default stock is 0
        reason: 'Stock initialized from Catalog Worker'
      };
      
      const inventoryRequest = new Request(`https://inventory-worker/api/v1/stock/${encodeURIComponent(skuId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Source': 'catalog-worker-service-binding'
        },
        body: JSON.stringify(stockPayload)
      });
      
      const inventoryPromise = inventoryWorker.fetch(inventoryRequest).then(async (response) => {
        const text = await response.text().catch(() => '');
        let parsedBody = text;
        try { 
          parsedBody = JSON.parse(text); 
        } catch (e) { 
          parsedBody = text;
        }
        
        if (!response.ok) {
          logError('syncStockToInventoryWorker: Failed to sync stock (service binding)', null, {
            skuId,
            status: response.status,
            statusText: response.statusText,
            endpoint: `/api/v1/stock/${skuId}`,
            responseBody: parsedBody
          });
        } else {
          logger('stock.synced', { 
            skuId, 
            method: 'service_binding',
            status: response.status
          });
        }
        
        return { ok: response.ok, status: response.status, body: parsedBody };
      }).catch((err) => {
        logError('syncStockToInventoryWorker: Service binding error', err, { 
          skuId,
          errorType: err.name,
          errorMessage: err.message
        });
      });
      
      return inventoryPromise;
    } else {
      // Fallback: Service binding not available
      logger('stock.sync.attempt', {
        skuId,
        method: 'service_binding_not_available',
        note: 'INVENTORY_WORKER binding not found, skipping stock sync'
      });
      return Promise.resolve();
    }
  } catch (err) {
    logError('syncStockToInventoryWorker: Error setting up stock sync', err, { skuId });
    return Promise.resolve();
  }
}

/**
 * Create SKU (admin)
 */
export async function createSkuService(skuData, userId, env, ctx = null) {
  try {
    const skuId = skuData.sku_id || uuidv4();
    const now = new Date().toISOString();
    
    // Auto-generate SKU code (always generate, ignore user input)
    const skuCode = generateSkuCode();
    
    // Extract price fields from skuData (if provided by admin)
    const priceFields = {
      price: skuData.price,
      currency: skuData.currency,
      sale_price: skuData.sale_price,
      compare_at_price: skuData.compare_at_price,
      cost_price: skuData.cost_price,
      reason: `Price set during SKU creation by ${userId}`
    };
    
    const sku = {
      sku_id: skuId,
      product_id: skuData.product_id,
      sku_code: skuCode, // Always use auto-generated SKU code
      attributes: skuData.attributes || {},
      created_at: now,
      updated_at: now,
    };
    
    await createSku(sku, env);
    
    // Sync price to Pricing Worker (async/non-blocking)
    // Use ctx.waitUntil() to ensure the async fetch completes even after response is sent
    const priceSyncPromise = syncPriceToPricingWorker(skuId, skuData.product_id, skuCode, priceFields, env);
    if (ctx && ctx.waitUntil) {
      ctx.waitUntil(priceSyncPromise);
    }
    
    // Sync stock to Inventory Worker (async/non-blocking)
    // Use ctx.waitUntil() to ensure the async fetch completes even after response is sent
    const stockSyncPromise = syncStockToInventoryWorker(skuId, skuData.product_id, skuCode, env);
    if (ctx && ctx.waitUntil) {
      ctx.waitUntil(stockSyncPromise);
    }
    
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
export async function updateSkuService(skuId, updates, productId, userId, env, ctx = null) {
  try {
    // Extract price fields from updates if provided
    const { 
      sku_code, 
      product_id, 
      price,
      currency,
      sale_price,
      compare_at_price,
      cost_price,
      ...cleanUpdates 
    } = updates;
    
    const preparedUpdates = {
      ...cleanUpdates,
      updated_at: new Date().toISOString(),
    };
    
    await updateSku(skuId, preparedUpdates, env);
    
    // If price fields are provided, sync to Pricing Worker (async/non-blocking)
    const hasPriceFields = price !== undefined || 
                          currency !== undefined || 
                          sale_price !== undefined || 
                          compare_at_price !== undefined || 
                          cost_price !== undefined;
    
    if (hasPriceFields) {
      // Get SKU details to get sku_code
      const sku = await getSkuById(skuId, env);
      if (sku) {
        const priceFields = {
          price,
          currency,
          sale_price,
          compare_at_price,
          cost_price,
          reason: `Price updated by ${userId || 'admin'}`
        };
        
        // Sync price to Pricing Worker (async/non-blocking)
        // Use ctx.waitUntil() to ensure the async fetch completes even after response is sent
        const priceSyncPromise = syncPriceToPricingWorker(skuId, productId, sku.sku_code, priceFields, env);
        if (ctx && ctx.waitUntil) {
          ctx.waitUntil(priceSyncPromise);
        }
      }
    }
    
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

