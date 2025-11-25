// services/catalogService.js
import { v4 as uuidv4 } from "uuid";
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
  deleteSku,
} from "../db/db1.js";
import { logger, logError } from "../utils/logger.js";
import { CACHE_TTL_SECONDS } from "../../config.js";

/**
 * Fetch all prices for a product from Pricing Worker using service binding
 */
async function fetchProductPrices(productId, env) {
  try {
    const pricingWorker = env.PRICING_WORKER;

    if (pricingWorker) {
      // Use service binding (direct Worker-to-Worker call)
      const pricingRequest = new Request(
        `https://pricing-worker/api/v1/prices/product/${encodeURIComponent(productId)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const pricingResponse = await pricingWorker.fetch(pricingRequest);

      if (!pricingResponse.ok) {
        const errorText = await pricingResponse.text().catch(() => "");
        logError("fetchProductPrices: Pricing Worker request failed", null, {
          productId,
          status: pricingResponse.status,
          statusText: pricingResponse.statusText,
          errorBody: errorText,
        });
        return [];
      }

      const pricingData = await pricingResponse.json();
      const prices = pricingData.prices || [];
      logger("price.fetch.success", { productId, priceCount: prices.length });
      return prices;
    } else {
      // Fallback: Service binding not available
      logger("price.fetch.attempt", {
        productId,
        method: "service_binding_not_available",
        note: "PRICING_WORKER binding not found, skipping price fetch",
      });
      return [];
    }
  } catch (err) {
    logError("fetchProductPrices: Error", err, {
      productId,
      errorMessage: err.message,
      errorStack: err.stack,
    });
    return [];
  }
}

/**
 * Fetch all stock for a product from Inventory Worker using service binding
 */
async function fetchProductStock(productId, env) {
  try {
    const inventoryWorker = env.INVENTORY_WORKER;

    if (inventoryWorker) {
      // Use service binding (direct Worker-to-Worker call)
      const inventoryRequest = new Request(
        `https://inventory-worker/api/v1/stock/product/${encodeURIComponent(productId)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const inventoryResponse = await inventoryWorker.fetch(inventoryRequest);

      if (!inventoryResponse.ok) {
        const errorText = await inventoryResponse.text().catch(() => "");
        logError("fetchProductStock: Inventory Worker request failed", null, {
          productId,
          status: inventoryResponse.status,
          statusText: inventoryResponse.statusText,
          errorBody: errorText,
        });
        return [];
      }

      const stockData = await inventoryResponse.json();
      const stocks = stockData.stocks || [];
      logger("stock.fetch.success", { productId, stockCount: stocks.length });
      return stocks;
    } else {
      // Fallback: Service binding not available
      logger("stock.fetch.attempt", {
        productId,
        method: "service_binding_not_available",
        note: "INVENTORY_WORKER binding not found, skipping stock fetch",
      });
      return [];
    }
  } catch (err) {
    logError("fetchProductStock: Error", err, {
      productId,
      errorMessage: err.message,
      errorStack: err.stack,
    });
    return [];
  }
}

/**
 * Get product by ID with caching and enriched SKU data (prices and stock)
 * @param {string} productId - Product ID
 * @param {Object} env - Environment
 * @param {boolean} skipEnrichment - If true, skip fetching prices and stocks
 */
export async function getProduct(productId, env, skipEnrichment = false) {
  try {
    let parsedProduct;
    let skus;

    // If skipEnrichment is true, bypass cache to avoid returning enriched cached data
    if (skipEnrichment) {
      // Get from database directly (no cache)
      const product = await getProductById(productId, env);
      if (!product) {
        return null;
      }

      // Get SKUs
      skus = await getProductSkus(productId, env);

      // Parse JSON fields
      parsedProduct = parseProductJsonFields(product);
      parsedProduct.skus = skus.map((sku) => ({
        ...sku,
        attributes:
          typeof sku.attributes === "string"
            ? JSON.parse(sku.attributes || "{}")
            : sku.attributes,
      }));

      // Return early without enrichment
      return parsedProduct;
    }

    // Normal flow with caching and enrichment
    const cacheKey = `product:${productId}`;
    let cached = await env.CATALOG_KV?.get(cacheKey, "json");
    let shouldCache = false;
    let fromCache = false;

    if (cached) {
      logger("product.cache.hit", { productId });
      fromCache = true;
      // Use cached product data - it already includes enriched SKUs with prices and stock
      parsedProduct = cached;
      skus = cached.skus || [];
      
      // Check if cached SKUs already have price and stock data
      const hasEnrichedData = cached.skus && cached.skus.length > 0 && 
        cached.skus.some(sku => sku.price || sku.stock);
      
      if (hasEnrichedData) {
        // Cached data is already enriched, return it immediately
        logger("product.cache.enriched.hit", { productId });
        return parsedProduct;
      }
      
      // Cached data exists but not enriched, we'll enrich it below
      // But we still have the base product and SKUs from cache
      shouldCache = true; // Cache the enriched result
    } else {
      // Cache miss - get from database
      logger("product.cache.miss", { productId });
      const product = await getProductById(productId, env);
      if (!product) {
        return null;
      }

      // Get SKUs
      skus = await getProductSkus(productId, env);

      // Parse JSON fields
      parsedProduct = parseProductJsonFields(product);
      parsedProduct.skus = skus.map((sku) => ({
        ...sku,
        attributes:
          typeof sku.attributes === "string"
            ? JSON.parse(sku.attributes || "{}")
            : sku.attributes,
      }));
      
      shouldCache = true; // Cache the enriched result
    }

    // Fetch prices and stock in parallel using service bindings (only if not already enriched)
    const [prices, stocks] = await Promise.all([
      fetchProductPrices(productId, env),
      fetchProductStock(productId, env),
    ]);

    // Create maps for quick lookup by sku_id
    const priceMap = new Map();
    prices.forEach((price) => {
      priceMap.set(price.sku_id, price);
    });

    const stockMap = new Map();
    stocks.forEach((stock) => {
      stockMap.set(stock.sku_id, stock);
    });

    // Merge price and stock data into each SKU
    // Use skus from cache if available, otherwise use parsedProduct.skus
    const skusToEnrich = skus.length > 0 ? skus : parsedProduct.skus || [];
    parsedProduct.skus = skusToEnrich.map((sku) => {
      const skuData = {
        ...sku,
        attributes:
          typeof sku.attributes === "string"
            ? JSON.parse(sku.attributes || "{}")
            : sku.attributes,
      };

      // Add price data if available
      const price = priceMap.get(sku.sku_id);
      if (price) {
        skuData.price = {
          price: price.price,
          currency: price.currency || "USD",
          sale_price: price.sale_price,
          compare_at_price: price.compare_at_price,
          cost_price: price.cost_price,
          effective_price: price.effective_price || price.price,
          original_price: price.original_price || price.price,
        };
      }

      // Add stock data if available
      const stock = stockMap.get(sku.sku_id);
      if (stock) {
        skuData.stock = {
          quantity: stock.quantity,
          reserved_quantity: stock.reserved_quantity,
          available_quantity: stock.available_quantity,
          low_stock_threshold: stock.low_stock_threshold,
          status: stock.status,
        };
      }

      return skuData;
    });

    // Cache the enriched result (either from DB or enriched from cache)
    if (env.CATALOG_KV && shouldCache) {
      await env.CATALOG_KV.put(cacheKey, JSON.stringify(parsedProduct), {
        expirationTtl: CACHE_TTL_SECONDS,
      });
      logger("product.cached", { productId, fromCache });
    }

    logger("product.fetched", {
      productId,
      skuCount: parsedProduct.skus.length,
      hasPrices: prices.length > 0,
      hasStocks: stocks.length > 0,
    });
    return parsedProduct;
  } catch (err) {
    logError("getProduct: Error", err, { productId });
    throw err;
  }
}

/**
 * Get products list with pagination
 */
export async function listProducts(query, env) {
  try {
    const {
      q,
      category,
      page = 1,
      limit = 20,
      featured,
      status = "active",
    } = query;

    let result;
    if (q) {
      // Search by keyword
      result = await searchProducts(q, { page, limit, category }, env);
    } else {
      // Regular list
      result = await getProducts(
        { category, page, limit, featured, status },
        env,
      );
    }

    // Parse JSON fields for each product
    const parsedProducts = (result.products || []).map(parseProductJsonFields);

    // Get SKUs for each product (optional, can be lazy loaded)
    // For list view, we might not need all SKUs

    logger("products.listed", { count: parsedProducts.length, page, limit, total: result.total });
    return {
      products: parsedProducts,
      total: result.total || 0,
    };
  } catch (err) {
    logError("listProducts: Error", err, { query });
    throw err;
  }
}

/**
 * Get products for home page by category
 */
export async function getHomePageProducts(
  categories = ["Electronics", "Toys", "Dress"],
  limit = 10,
  env,
) {
  try {
    const result = {};

    for (const category of categories) {
      const products = await getProductsByCategory(category, limit, env);
      result[category] = products.map(parseProductJsonFields);
    }

    logger("homepage.products.fetched", { categories: Object.keys(result) });
    return result;
  } catch (err) {
    logError("getHomePageProducts: Error", err, { categories });
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
        await createSkuService(
          {
            ...skuData,
            product_id: productId,
          },
          userId,
          env,
        );
      }
    }

    // Invalidate cache
    await invalidateProductCache(productId, env);

    logger("product.created", { productId, title: product.title });
    return await getProduct(productId, env);
  } catch (err) {
    logError("createProductService: Error", err, { productData });
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
        await createSkuService(
          {
            ...skuData,
            product_id: productId,
          },
          userId,
          env,
        );
      }
    }

    // Invalidate cache
    await invalidateProductCache(productId, env);

    logger("product.updated", { productId });
    return await getProduct(productId, env);
  } catch (err) {
    logError("updateProductService: Error", err, { productId, updates });
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

    logger("product.deleted", { productId });
    return true;
  } catch (err) {
    logError("deleteProductService: Error", err, { productId });
    throw err;
  }
}

/**
 * Upload product image to R2
 */
export async function uploadProductImage(productId, imageId, imageFile, env) {
  try {
    if (!env.CATALOG_IMG_BUCKET) {
      throw new Error("R2 bucket not configured");
    }

    const r2Path = `products/${productId}/${imageId}.jpg`;

    // Upload to R2
    await env.CATALOG_IMG_BUCKET.put(r2Path, imageFile, {
      httpMetadata: {
        contentType: "image/jpeg",
      },
    });

    // Generate public URL (R2 public URLs need to be configured via custom domain or use signed URLs)
    // For now, return the path - you'll need to configure a custom domain or use signed URLs
    const publicUrl = `/api/v1/products/${productId}/images/${imageId}`;

    // Invalidate cache since product media has changed
    await invalidateProductCache(productId, env);

    logger("product.image.uploaded", { productId, imageId, r2Path });
    return { imageId, r2Path, url: publicUrl };
  } catch (err) {
    logError("uploadProductImage: Error", err, { productId, imageId });
    throw err;
  }
}

/**
 * Get product image from R2
 */
export async function getProductImageUrl(productId, imageId, env) {
  try {
    if (!env.CATALOG_IMG_BUCKET) {
      throw new Error("R2 bucket not configured");
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
    logError("getProductImageUrl: Error", err, { productId, imageId });
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

    logger("sku.created", { skuId, productId: skuData.product_id });
    return sku;
  } catch (err) {
    logError("createSkuService: Error", err, { skuData });
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

    logger("sku.updated", { skuId });
    return true;
  } catch (err) {
    logError("updateSkuService: Error", err, { skuId });
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

    logger("sku.deleted", { skuId });
    return true;
  } catch (err) {
    logError("deleteSkuService: Error", err, { skuId });
    throw err;
  }
}

/**
 * Helper: Parse JSON fields in product
 */
function parseProductJsonFields(product) {
  const jsonFields = [
    "metadata",
    "attributes",
    "inventory",
    "policies",
    "seo",
    "stats",
    "flags",
    "relationships",
    "media",
    "variants",
    "extended_data",
    "categories",
    "tags",
    "colors",
    "sizes",
    "materials",
    "grouped_products",
    "upsell_ids",
    "cross_sell_ids",
    "related_products",
    "product_images",
    "gallery_images",
    "downloadable_files",
    "product_attributes",
    "default_attributes",
    "variations",
    "variation_data",
    "custom_fields",
    "seo_data",
    "social_data",
    "analytics_data",
    "pricing_data",
    "inventory_data",
    "shipping_data",
    "tax_data",
    "discount_data",
    "promotion_data",
    "bundle_data",
    "subscription_data",
    "membership_data",
    "gift_card_data",
    "auction_data",
    "rental_data",
    "booking_data",
    "event_data",
    "course_data",
    "service_data",
    "digital_data",
    "physical_data",
    "variant_data",
    "specifications",
    "features",
    "benefits",
    "use_cases",
    "compatibility",
    "requirements",
    "included_items",
    "accessories",
    "replacement_parts",
    "certifications",
    "awards",
    "testimonials",
    "faq",
    "video_tutorials",
  ];

  const parsed = { ...product };

  for (const field of jsonFields) {
    if (parsed[field] && typeof parsed[field] === "string") {
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
    "categories",
    "tags",
    "colors",
    "sizes",
    "materials",
    "grouped_products",
    "upsell_ids",
    "cross_sell_ids",
    "related_products",
    "product_images",
    "gallery_images",
    "downloadable_files",
    "product_attributes",
    "default_attributes",
    "variations",
    "variation_data",
    "custom_fields",
    "seo_data",
    "social_data",
    "analytics_data",
    "pricing_data",
    "inventory_data",
    "shipping_data",
    "tax_data",
    "discount_data",
    "promotion_data",
    "bundle_data",
    "subscription_data",
    "membership_data",
    "gift_card_data",
    "auction_data",
    "rental_data",
    "booking_data",
    "event_data",
    "course_data",
    "service_data",
    "digital_data",
    "physical_data",
    "variant_data",
    "specifications",
    "features",
    "benefits",
    "use_cases",
    "compatibility",
    "requirements",
    "included_items",
    "accessories",
    "replacement_parts",
    "certifications",
    "awards",
    "testimonials",
    "faq",
    "video_tutorials",
  ];

  const prepared = { ...product };

  for (const field of jsonFields) {
    if (prepared[field] !== null && prepared[field] !== undefined) {
      if (typeof prepared[field] === "object") {
        prepared[field] = JSON.stringify(prepared[field]);
      }
    }
  }

  return prepared;
}

/**
 * Helper: Invalidate product cache
 * Removes the product from KV cache when product or SKU data is modified
 */
async function invalidateProductCache(productId, env) {
  try {
    if (env.CATALOG_KV) {
      const cacheKey = `product:${productId}`;
      await env.CATALOG_KV.delete(cacheKey);
      logger("product.cache.invalidated", { productId, cacheKey });
    }
  } catch (err) {
    logError("invalidateProductCache: Error", err, { productId });
    // Don't throw - cache invalidation failure shouldn't break the operation
  }
}
