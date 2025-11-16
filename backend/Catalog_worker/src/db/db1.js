// db/db1.js
// CATALOG_DB helpers for products & skus
import { logger, logError } from '../utils/logger.js';

/**
 * Valid database columns for products table (whitelist)
 * This ensures we never try to insert invalid columns
 */
const VALID_PRODUCT_COLUMNS = new Set([
  'product_id', 'title', 'description', 'short_description', 'slug',
  'category', 'metadata', 'status', 'visibility', 'featured', 'new_arrival', 'best_seller', 'on_sale',
  'attributes', 'inventory', 'policies', 'seo', 'stats', 'flags',
  'relationships', 'media', 'variants', 'extended_data',
  'created_at', 'updated_at', 'created_by', 'updated_by', 'published_at', 'deleted_at', 'deleted'
]);

/**
 * Consolidate flat fields into JSON fields for optimized 60-column schema
 * Always merges flat fields into JSON, even if JSON field already exists
 */
function consolidateProductFields(product) {
  const consolidated = { ...product };
  
  // Helper to parse JSON strings
  const parseJson = (val) => {
    if (!val) return val;
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch { return val; }
    }
    return val;
  };
  
  // Handle category - keep as direct column (not in metadata) for easy querying
  // If category is provided in metadata JSON, extract it to the direct column
  if (consolidated.metadata && typeof consolidated.metadata === 'object') {
    if (consolidated.metadata.category !== undefined && consolidated.category === undefined) {
      consolidated.category = consolidated.metadata.category;
    }
  }
  // If category is provided as a flat field, keep it as a direct column (don't delete it)
  // category stays as a direct column for easy querying and indexing
  // Note: category can be null, empty string, or a value - all are valid
  
  // 1. Consolidate metadata (identifiers, brand, manufacturer, default_sku, subcategory, categories, tags)
  // Note: category is now a direct column, not in metadata
  // Always check for flat fields, even if metadata already exists
  const existingMetadata = parseJson(consolidated.metadata) || {};
  const metadata = { ...existingMetadata };
  let metadataChanged = false;
  
  if (consolidated.mpn || consolidated.upc || consolidated.ean || consolidated.isbn || 
      consolidated.gtin || consolidated.model_number || consolidated.sku) {
    metadata.identifiers = {
      ...(existingMetadata.identifiers || {}),
      mpn: consolidated.mpn || existingMetadata.identifiers?.mpn,
      upc: consolidated.upc || existingMetadata.identifiers?.upc,
      ean: consolidated.ean || existingMetadata.identifiers?.ean,
      isbn: consolidated.isbn || existingMetadata.identifiers?.isbn,
      gtin: consolidated.gtin || existingMetadata.identifiers?.gtin,
      model_number: consolidated.model_number || existingMetadata.identifiers?.model_number,
      sku: consolidated.sku || existingMetadata.identifiers?.sku
    };
    delete consolidated.mpn;
    delete consolidated.upc;
    delete consolidated.ean;
    delete consolidated.isbn;
    delete consolidated.gtin;
    delete consolidated.model_number;
    delete consolidated.sku;
    metadataChanged = true;
  }
  if (consolidated.brand !== undefined) { metadata.brand = consolidated.brand; delete consolidated.brand; metadataChanged = true; }
  if (consolidated.manufacturer !== undefined) { metadata.manufacturer = consolidated.manufacturer; delete consolidated.manufacturer; metadataChanged = true; }
  if (consolidated.default_sku !== undefined) { metadata.default_sku = consolidated.default_sku; delete consolidated.default_sku; metadataChanged = true; }
  // category is now a direct column - don't put it in metadata
  if (consolidated.subcategory !== undefined) { metadata.subcategory = consolidated.subcategory; delete consolidated.subcategory; metadataChanged = true; }
  if (consolidated.categories !== undefined) { metadata.categories = parseJson(consolidated.categories); delete consolidated.categories; metadataChanged = true; }
  if (consolidated.tags !== undefined) { metadata.tags = parseJson(consolidated.tags); delete consolidated.tags; metadataChanged = true; }
  
  // Remove category from metadata if it exists there (since it's now a direct column)
  if (metadata.category) {
    if (!consolidated.category) {
      consolidated.category = metadata.category;
    }
    delete metadata.category;
    metadataChanged = true;
  }
  
  if (metadataChanged || typeof consolidated.metadata === 'object') {
    consolidated.metadata = JSON.stringify(metadata);
  } else if (typeof consolidated.metadata === 'string') {
    // Already a JSON string, keep it
  }
  
  // 2. Consolidate attributes (dimensions, color, colors, size, sizes, material, materials, pattern, style, gender, age_group, season, country_of_origin)
  // Always check for flat fields, even if attributes already exists
  const existingAttributes = parseJson(consolidated.attributes) || {};
  const attributes = { ...existingAttributes };
  let attributesChanged = false;
  
  // Check for dimension fields
  if (consolidated.weight !== undefined || consolidated.weight_unit !== undefined || 
      consolidated.length !== undefined || consolidated.width !== undefined || 
      consolidated.height !== undefined || consolidated.dimensions_unit !== undefined || 
      consolidated.shipping_weight !== undefined || consolidated.shipping_class !== undefined) {
    attributes.dimensions = {
      ...(existingAttributes.dimensions || {}),
      weight: consolidated.weight !== undefined ? consolidated.weight : existingAttributes.dimensions?.weight,
      weight_unit: consolidated.weight_unit !== undefined ? consolidated.weight_unit : (existingAttributes.dimensions?.weight_unit || 'g'),
      length: consolidated.length !== undefined ? consolidated.length : existingAttributes.dimensions?.length,
      width: consolidated.width !== undefined ? consolidated.width : existingAttributes.dimensions?.width,
      height: consolidated.height !== undefined ? consolidated.height : existingAttributes.dimensions?.height,
      dimensions_unit: consolidated.dimensions_unit !== undefined ? consolidated.dimensions_unit : (existingAttributes.dimensions?.dimensions_unit || 'cm'),
      shipping_weight: consolidated.shipping_weight !== undefined ? consolidated.shipping_weight : existingAttributes.dimensions?.shipping_weight,
      shipping_class: consolidated.shipping_class !== undefined ? consolidated.shipping_class : existingAttributes.dimensions?.shipping_class
    };
    delete consolidated.weight;
    delete consolidated.weight_unit;
    delete consolidated.length;
    delete consolidated.width;
    delete consolidated.height;
    delete consolidated.dimensions_unit;
    delete consolidated.shipping_weight;
    delete consolidated.shipping_class;
    attributesChanged = true;
  }
  
  // Check for other attribute fields
  ['color', 'colors', 'size', 'sizes', 'material', 'materials', 'pattern', 'style', 
   'gender', 'age_group', 'season', 'country_of_origin'].forEach(field => {
    if (consolidated[field] !== undefined) {
      attributes[field] = parseJson(consolidated[field]);
      delete consolidated[field];
      attributesChanged = true;
    }
  });
  
  if (attributesChanged || typeof consolidated.attributes === 'object') {
    consolidated.attributes = JSON.stringify(attributes);
  } else if (typeof consolidated.attributes === 'string') {
    // Already a JSON string, keep it
  }
  
  // 3. Consolidate inventory - always merge flat fields
  const existingInventory = parseJson(consolidated.inventory) || {};
  const inventoryFields = ['stock_status', 'stock_quantity', 'low_stock_threshold', 'manage_stock', 
    'allow_backorders', 'backorder_status', 'package_quantity', 'min_order_quantity', 'max_order_quantity'];
  let inventoryChanged = false;
  
  inventoryFields.forEach(field => {
    if (consolidated[field] !== undefined) {
      existingInventory[field] = consolidated[field];
      delete consolidated[field];
      inventoryChanged = true;
    }
  });
  
  if (inventoryChanged || typeof consolidated.inventory === 'object') {
    consolidated.inventory = JSON.stringify(existingInventory);
  }
  
  // 4. Consolidate policies - always merge flat fields
  const existingPolicies = parseJson(consolidated.policies) || {};
  const policyFields = ['warranty_period', 'warranty_type', 'return_policy', 'purchase_note'];
  let policiesChanged = false;
  
  policyFields.forEach(field => {
    if (consolidated[field] !== undefined) {
      existingPolicies[field] = consolidated[field];
      delete consolidated[field];
      policiesChanged = true;
    }
  });
  
  if (policiesChanged || typeof consolidated.policies === 'object') {
    consolidated.policies = JSON.stringify(existingPolicies);
  }
  
  // 5. Consolidate SEO - always merge flat fields
  const existingSeo = parseJson(consolidated.seo) || {};
  const seoFields = ['meta_title', 'meta_description', 'meta_keywords', 'permalink', 'canonical_url'];
  let seoChanged = false;
  
  seoFields.forEach(field => {
    if (consolidated[field] !== undefined) {
      existingSeo[field] = consolidated[field];
      delete consolidated[field];
      seoChanged = true;
    }
  });
  
  if (seoChanged || typeof consolidated.seo === 'object') {
    consolidated.seo = JSON.stringify(existingSeo);
  }
  
  // 6. Consolidate stats (ratings and counts) - always merge flat fields
  const existingStats = parseJson(consolidated.stats) || {};
  const statsFields = ['rating_average', 'rating_count', 'review_count', 'view_count', 'sales_count', 
    'wishlist_count', 'compare_count', 'download_count', 'total_sales', 'average_rating'];
  let statsChanged = false;
  
  statsFields.forEach(field => {
    if (consolidated[field] !== undefined) {
      existingStats[field] = consolidated[field];
      delete consolidated[field];
      statsChanged = true;
    }
  });
  
  if (statsChanged || typeof consolidated.stats === 'object') {
    consolidated.stats = JSON.stringify(existingStats);
  }
  
  // 7. Consolidate flags (product type and boolean flags) - always merge flat fields
  const existingFlags = parseJson(consolidated.flags) || {};
  const flagsFields = ['product_type', 'virtual_product', 'downloadable_product', 'external_product', 
    'requires_shipping', 'taxable', 'tax_class', 'tax_status', 'shipping_required', 'shipping_taxable', 
    'reviews_allowed', 'sold_individually', 'purchase_only', 'catalog_visibility'];
  let flagsChanged = false;
  
  flagsFields.forEach(field => {
    if (consolidated[field] !== undefined) {
      existingFlags[field] = consolidated[field];
      delete consolidated[field];
      flagsChanged = true;
    }
  });
  
  if (flagsChanged || typeof consolidated.flags === 'object') {
    consolidated.flags = JSON.stringify(existingFlags);
  }
  
  // 8. Consolidate relationships - always merge flat fields
  const existingRelationships = parseJson(consolidated.relationships) || {};
  const relationshipFields = ['parent_id', 'menu_order', 'grouped_products', 'upsell_ids', 
    'cross_sell_ids', 'related_products', 'accessories', 'replacement_parts'];
  let relationshipsChanged = false;
  
  relationshipFields.forEach(field => {
    if (consolidated[field] !== undefined) {
      existingRelationships[field] = parseJson(consolidated[field]);
      delete consolidated[field];
      relationshipsChanged = true;
    }
  });
  
  if (relationshipsChanged || typeof consolidated.relationships === 'object') {
    consolidated.relationships = JSON.stringify(existingRelationships);
  }
  
  // 9. Consolidate media - always merge flat fields
  const existingMedia = parseJson(consolidated.media) || {};
  const mediaFields = ['product_images', 'image_url', 'image_alt', 'gallery_images', 'video_url', 
    'video_embed', 'downloadable_files', 'download_limit', 'download_expiry'];
  let mediaChanged = false;
  
  mediaFields.forEach(field => {
    if (consolidated[field] !== undefined) {
      existingMedia[field] = parseJson(consolidated[field]);
      delete consolidated[field];
      mediaChanged = true;
    }
  });
  
  if (mediaChanged || typeof consolidated.media === 'object') {
    consolidated.media = JSON.stringify(existingMedia);
  }
  
  // 10. Consolidate variants - always merge flat fields
  const existingVariants = parseJson(consolidated.variants) || {};
  const variantFields = ['product_attributes', 'default_attributes', 'variations', 'variation_data', 'variant_data'];
  let variantsChanged = false;
  
  variantFields.forEach(field => {
    if (consolidated[field] !== undefined) {
      existingVariants[field] = parseJson(consolidated[field]);
      delete consolidated[field];
      variantsChanged = true;
    }
  });
  
  if (variantsChanged || typeof consolidated.variants === 'object') {
    consolidated.variants = JSON.stringify(existingVariants);
  }
  
  // 11. Consolidate extended_data (everything else) - always merge flat fields
  const existingExtended = parseJson(consolidated.extended_data) || {};
  const extendedFields = ['custom_fields', 'social_data', 'analytics_data', 'pricing_data', 
    'inventory_data', 'shipping_data', 'tax_data', 'discount_data', 'promotion_data', 
    'bundle_data', 'subscription_data', 'membership_data', 'gift_card_data', 'auction_data', 
    'rental_data', 'booking_data', 'event_data', 'course_data', 'service_data', 'digital_data', 
    'physical_data', 'specifications', 'features', 'benefits', 'use_cases', 'compatibility', 
    'requirements', 'included_items', 'care_instructions', 'certifications', 'awards', 
    'testimonials', 'faq', 'documentation', 'product_url', 'button_text', 'date_on_sale_from', 
    'date_on_sale_to', 'washing_instructions', 'storage_instructions', 'safety_warnings', 
    'support_url', 'documentation_url', 'user_manual_url', 'installation_guide_url', 'video_tutorials'];
  let extendedChanged = false;
  
  extendedFields.forEach(field => {
    if (consolidated[field] !== undefined) {
      existingExtended[field] = parseJson(consolidated[field]);
      delete consolidated[field];
      extendedChanged = true;
    }
  });
  
  if (extendedChanged || typeof consolidated.extended_data === 'object') {
    consolidated.extended_data = JSON.stringify(existingExtended);
  }
  
  return consolidated;
}

/**
 * Check if a slug exists in the database
 */
export async function slugExists(slug, excludeProductId = null, env) {
  try {
    if (!slug) return false;
    let sql = 'SELECT COUNT(*) as count FROM products WHERE slug = ? AND deleted = 0';
    const bindings = [slug];
    
    if (excludeProductId) {
      sql += ' AND product_id != ?';
      bindings.push(excludeProductId);
    }
    
    const res = await env.CATALOG_DB.prepare(sql).bind(...bindings).first();
    return (res?.count || 0) > 0;
  } catch (err) {
    logError('slugExists: Database error', err, { slug });
    throw err;
  }
}

/**
 * Get product by ID
 */
export async function getProductById(productId, env) {
  try {
    const res = await env.CATALOG_DB.prepare('SELECT * FROM products WHERE product_id = ? AND deleted = 0')
      .bind(productId)
      .first();
    return res || null;
  } catch (err) {
    logError('getProductById: Database error', err, { productId });
    throw err;
  }
}

/**
 * Get all products with pagination and filters
 */
export async function getProducts({ category, search, page = 1, limit = 20, featured, status = 'active' }, env) {
  try {
    let sql = 'SELECT * FROM products WHERE deleted = 0';
    const bindings = [];
    
    if (status) {
      sql += ' AND status = ?';
      bindings.push(status);
    }
    
    if (category) {
      // Category is now a direct column for fast querying
      sql += ' AND category = ?';
      bindings.push(category);
    }
    
    if (featured !== undefined) {
      sql += ' AND featured = ?';
      bindings.push(featured ? 1 : 0);
    }
    
    if (search) {
      // Brand is now in metadata JSON, search in title, description, and metadata
      sql += ' AND (title LIKE ? OR description LIKE ? OR json_extract(metadata, "$.brand") LIKE ? OR metadata LIKE ?)';
      const searchTerm = `%${search}%`;
      bindings.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    bindings.push(limit, (page - 1) * limit);
    
    const res = await env.CATALOG_DB.prepare(sql).bind(...bindings).all();
    return res?.results || [];
  } catch (err) {
    logError('getProducts: Database error', err, { category, search, page, limit });
    throw err;
  }
}

/**
 * Get products by category (for home page)
 */
export async function getProductsByCategory(category, limit = 10, env) {
  try {
    const res = await env.CATALOG_DB.prepare(
      'SELECT * FROM products WHERE deleted = 0 AND status = ? AND category = ? ORDER BY featured DESC, created_at DESC LIMIT ?'
    ).bind('active', category, limit).all();
    return res?.results || [];
  } catch (err) {
    logError('getProductsByCategory: Database error', err, { category, limit });
    throw err;
  }
}

/**
 * Search products by keyword
 */
export async function searchProducts(keyword, { page = 1, limit = 20, category }, env) {
  try {
    // Brand and tags are now in metadata JSON
    let sql = 'SELECT * FROM products WHERE deleted = 0 AND status = ? AND (title LIKE ? OR description LIKE ? OR json_extract(metadata, "$.brand") LIKE ? OR json_extract(metadata, "$.tags") LIKE ? OR metadata LIKE ?)';
    const bindings = ['active'];
    const searchTerm = `%${keyword}%`;
    bindings.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    
    if (category) {
      // Category is now a direct column for fast querying
      sql += ' AND category = ?';
      bindings.push(category);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    bindings.push(limit, (page - 1) * limit);
    
    const res = await env.CATALOG_DB.prepare(sql).bind(...bindings).all();
    return res?.results || [];
  } catch (err) {
    logError('searchProducts: Database error', err, { keyword, page, limit });
    throw err;
  }
}

/**
 * Convert all object/array values to JSON strings for D1 compatibility
 * D1 only accepts: null, number, string, or JSON string (not JavaScript objects)
 */
function stringifyJsonFields(data) {
  const result = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      result[key] = value;
    } else if (value instanceof Date) {
      // Convert Date objects to ISO string
      result[key] = value.toISOString();
    } else if (typeof value === 'string') {
      // Already a string - check if it's valid JSON (from consolidateProductFields)
      // If it looks like JSON, verify it's valid, otherwise keep as is
      if ((value.startsWith('{') || value.startsWith('[')) && value.length > 1) {
        try {
          JSON.parse(value);
          result[key] = value; // Valid JSON string, keep as is
        } catch {
          // Not valid JSON, keep as regular string
          result[key] = value;
        }
      } else {
        // Regular string, keep as is
        result[key] = value;
      }
    } else if (typeof value === 'object') {
      // Convert objects and arrays to JSON strings
      try {
        result[key] = JSON.stringify(value);
      } catch (err) {
        console.error(`Failed to stringify field ${key}:`, err);
        result[key] = String(value);
      }
    } else {
      // Primitive value (number, boolean) - keep as is
      result[key] = value;
    }
  }
  return result;
}

/**
 * Create product
 */
export async function createProduct(product, env) {
  try {
    // Extract skus if present (they're handled separately, not stored in products table)
    const { skus, ...productWithoutSkus } = product;
    
    // Consolidate fields into JSON structure
    const consolidated = consolidateProductFields(productWithoutSkus);
    
    // Add timestamps if not provided
    if (!consolidated.created_at) consolidated.created_at = new Date().toISOString();
    if (!consolidated.updated_at) consolidated.updated_at = new Date().toISOString();
    
    // Ensure all object/array values are JSON strings (D1 doesn't accept objects)
    const stringified = stringifyJsonFields(consolidated);
    
    // Filter to only valid database columns (whitelist)
    const validFields = Object.keys(stringified).filter(key => {
      // Only include fields that exist in the VALID_PRODUCT_COLUMNS whitelist
      return VALID_PRODUCT_COLUMNS.has(key);
    });
    
    // Ensure category is included if it was provided (even if empty string or null)
    // This handles the case where category might be filtered out during consolidation
    // Check both original product and consolidated to catch category from any source
    if (product.category !== undefined && !validFields.includes('category')) {
      // Category was provided in the original input, ensure it's included
      validFields.push('category');
      stringified.category = consolidated.category !== undefined ? consolidated.category : product.category;
    } else if (consolidated.category !== undefined && !validFields.includes('category')) {
      // Category was set during consolidation (e.g., from metadata), ensure it's included
      validFields.push('category');
      stringified.category = consolidated.category;
    }
    
    // Build dynamic SQL for all fields
    const fields = validFields;
    const placeholders = fields.map(() => '?').join(', ');
    const values = fields.map(field => {
      const value = stringified[field];
      // Final safety check: if it's still an object, stringify it
      if (value !== null && value !== undefined && typeof value === 'object') {
        return JSON.stringify(value);
      }
      return value;
    });
    
    const sql = `INSERT INTO products (${fields.join(', ')}) VALUES (${placeholders})`;
    await env.CATALOG_DB.prepare(sql).bind(...values).run();
    
    logger('product.created', { productId: stringified.product_id, title: stringified.title });
    return stringified;
  } catch (err) {
    logError('createProduct: Database error', err, { productId: product.product_id, error: err.message });
    throw err;
  }
}

/**
 * Update product
 */
export async function updateProduct(productId, updates, env) {
  try {
    const fields = Object.keys(updates);
    if (fields.length === 0) return null;
    
    // Extract skus if present (they're handled separately)
    const { skus, ...updatesWithoutSkus } = updates;
    
    // Consolidate fields into JSON structure
    const consolidated = consolidateProductFields(updatesWithoutSkus);
    
    // Ensure all object/array values are JSON strings (D1 doesn't accept objects)
    const stringified = stringifyJsonFields(consolidated);
    
    // Filter to only valid database columns (whitelist)
    const validFields = Object.keys(stringified).filter(key => {
      // Only include fields that exist in the VALID_PRODUCT_COLUMNS whitelist
      return VALID_PRODUCT_COLUMNS.has(key);
    });
    
    // Ensure category is included if it was provided in updates (even if empty string or null)
    if (updates.category !== undefined && !validFields.includes('category')) {
      // Category was provided in the updates, ensure it's included
      validFields.push('category');
      stringified.category = consolidated.category !== undefined ? consolidated.category : updates.category;
    } else if (consolidated.category !== undefined && !validFields.includes('category')) {
      // Category was set during consolidation (e.g., from metadata), ensure it's included
      validFields.push('category');
      stringified.category = consolidated.category;
    }
    
    if (validFields.length === 0) return await getProductById(productId, env);
    
    const setClause = validFields.map(field => `${field} = ?`).join(', ');
    const values = validFields.map(field => {
      const value = stringified[field];
      // Final safety check: if it's still an object, stringify it
      if (value !== null && value !== undefined && typeof value === 'object') {
        return JSON.stringify(value);
      }
      return value;
    });
    
    // Add updated_at and productId to the values
    const sql = `UPDATE products SET ${setClause}, updated_at = ? WHERE product_id = ? AND deleted = 0`;
    values.push(new Date().toISOString());
    values.push(productId);
    
    await env.CATALOG_DB.prepare(sql).bind(...values).run();
    
    logger('product.updated', { productId });
    return await getProductById(productId, env);
  } catch (err) {
    logError('updateProduct: Database error', err, { productId, error: err.message });
    throw err;
  }
}

/**
 * Delete product (soft delete)
 */
export async function deleteProduct(productId, env) {
  try {
    await env.CATALOG_DB.prepare('UPDATE products SET deleted = 1, deleted_at = ? WHERE product_id = ?')
      .bind(new Date().toISOString(), productId)
      .run();
    
    logger('product.deleted', { productId });
    return true;
  } catch (err) {
    logError('deleteProduct: Database error', err, { productId });
    throw err;
  }
}

/**
 * Get SKUs for a product
 */
export async function getProductSkus(productId, env) {
  try {
    const res = await env.CATALOG_DB.prepare('SELECT * FROM skus WHERE product_id = ?')
      .bind(productId)
      .all();
    return res?.results || [];
  } catch (err) {
    logError('getProductSkus: Database error', err, { productId });
    throw err;
  }
}

/**
 * Get SKU by ID
 */
export async function getSkuById(skuId, env) {
  try {
    const res = await env.CATALOG_DB.prepare('SELECT * FROM skus WHERE sku_id = ?')
      .bind(skuId)
      .first();
    return res || null;
  } catch (err) {
    logError('getSkuById: Database error', err, { skuId });
    throw err;
  }
}

/**
 * Create SKU
 */
export async function createSku(sku, env) {
  try {
    const sql = `INSERT INTO skus (sku_id, product_id, sku_code, attributes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`;
    await env.CATALOG_DB.prepare(sql).bind(
      sku.sku_id,
      sku.product_id,
      sku.sku_code,
      typeof sku.attributes === 'string' ? sku.attributes : JSON.stringify(sku.attributes || {}),
      sku.created_at || new Date().toISOString(),
      sku.updated_at || new Date().toISOString()
    ).run();
    
    logger('sku.created', { skuId: sku.sku_id, productId: sku.product_id });
    return sku;
  } catch (err) {
    logError('createSku: Database error', err, { skuId: sku.sku_id });
    throw err;
  }
}

/**
 * Update SKU
 */
export async function updateSku(skuId, updates, env) {
  try {
    const fields = Object.keys(updates);
    if (fields.length === 0) return null;
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => {
      if (field === 'attributes' && typeof updates[field] === 'object') {
        return JSON.stringify(updates[field]);
      }
      return updates[field];
    });
    values.push(new Date().toISOString(), skuId);
    
    const sql = `UPDATE skus SET ${setClause}, updated_at = ? WHERE sku_id = ?`;
    await env.CATALOG_DB.prepare(sql).bind(...values).run();
    
    logger('sku.updated', { skuId });
    return true;
  } catch (err) {
    logError('updateSku: Database error', err, { skuId });
    throw err;
  }
}

/**
 * Delete SKU
 */
export async function deleteSku(skuId, env) {
  try {
    await env.CATALOG_DB.prepare('DELETE FROM skus WHERE sku_id = ?')
      .bind(skuId)
      .run();
    
    logger('sku.deleted', { skuId });
    return true;
  } catch (err) {
    logError('deleteSku: Database error', err, { skuId });
    throw err;
  }
}

/**
 * Get SKUs by attribute filter
 * @param {Object} filters - Object with attribute filters, e.g., { size: 'L', color: 'red' }
 * @param {string} productId - Optional product_id to filter by
 * @param {Object} env - Environment with CATALOG_DB
 * @returns {Promise<Array>} Array of matching SKUs
 * 
 * Example usage:
 * - getSkusByAttributes({ size: 'L', color: 'red' }, env)
 * - getSkusByAttributes({ size: 'M' }, 'product123', env)
 */
export async function getSkusByAttributes(filters = {}, productId = null, env) {
  try {
    let sql = 'SELECT * FROM skus WHERE 1=1';
    const bindings = [];
    
    // Filter by product_id if provided
    if (productId) {
      sql += ' AND product_id = ?';
      bindings.push(productId);
    }
    
    // Filter by attributes using json_extract
    // Example: json_extract(attributes, '$.size') = 'L'
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        sql += ` AND json_extract(attributes, '$.${key}') = ?`;
        bindings.push(value);
      }
    });
    
    const res = await env.CATALOG_DB.prepare(sql).bind(...bindings).all();
    return res?.results || [];
  } catch (err) {
    logError('getSkusByAttributes: Database error', err, { filters, productId });
    throw err;
  }
}

/**
 * Search SKUs by attribute value (LIKE search)
 * Useful for partial matches or searching in arrays
 * @param {string} attributeKey - The attribute key to search (e.g., 'size', 'color')
 * @param {string} searchValue - The value to search for (supports LIKE patterns)
 * @param {string} productId - Optional product_id to filter by
 * @param {Object} env - Environment with CATALOG_DB
 * @returns {Promise<Array>} Array of matching SKUs
 * 
 * Example usage:
 * - searchSkusByAttribute('color', 'red', env)
 * - searchSkusByAttribute('size', '%L%', 'product123', env) // partial match
 */
export async function searchSkusByAttribute(attributeKey, searchValue, productId = null, env) {
  try {
    let sql = 'SELECT * FROM skus WHERE json_extract(attributes, ?) LIKE ?';
    const bindings = [`$.${attributeKey}`, `%${searchValue}%`];
    
    if (productId) {
      sql += ' AND product_id = ?';
      bindings.push(productId);
    }
    
    const res = await env.CATALOG_DB.prepare(sql).bind(...bindings).all();
    return res?.results || [];
  } catch (err) {
    logError('searchSkusByAttribute: Database error', err, { attributeKey, searchValue, productId });
    throw err;
  }
}

/**
 * Get SKU by specific attribute value (exact match)
 * @param {string} attributeKey - The attribute key (e.g., 'size', 'color')
 * @param {string} attributeValue - The exact value to match
 * @param {string} productId - Optional product_id to filter by
 * @param {Object} env - Environment with CATALOG_DB
 * @returns {Promise<Object|null>} First matching SKU or null
 */
export async function getSkuByAttribute(attributeKey, attributeValue, productId = null, env) {
  try {
    let sql = 'SELECT * FROM skus WHERE json_extract(attributes, ?) = ?';
    const bindings = [`$.${attributeKey}`, attributeValue];
    
    if (productId) {
      sql += ' AND product_id = ?';
      bindings.push(productId);
    }
    
    sql += ' LIMIT 1';
    
    const res = await env.CATALOG_DB.prepare(sql).bind(...bindings).first();
    return res || null;
  } catch (err) {
    logError('getSkuByAttribute: Database error', err, { attributeKey, attributeValue, productId });
    throw err;
  }
}
