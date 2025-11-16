// db/db1.js
// CATALOG_DB helpers for products & skus
import { logger, logError } from '../utils/logger.js';

/**
 * Consolidate flat fields into JSON fields for optimized 60-column schema
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
  
  // 1. Consolidate metadata (identifiers, brand, manufacturer, default_sku, category, subcategory, categories, tags)
  if (!consolidated.metadata) {
    const metadata = {};
    if (consolidated.mpn || consolidated.upc || consolidated.ean || consolidated.isbn || 
        consolidated.gtin || consolidated.model_number || consolidated.sku) {
      metadata.identifiers = {
        mpn: consolidated.mpn,
        upc: consolidated.upc,
        ean: consolidated.ean,
        isbn: consolidated.isbn,
        gtin: consolidated.gtin,
        model_number: consolidated.model_number,
        sku: consolidated.sku
      };
      delete consolidated.mpn;
      delete consolidated.upc;
      delete consolidated.ean;
      delete consolidated.isbn;
      delete consolidated.gtin;
      delete consolidated.model_number;
      delete consolidated.sku;
    }
    if (consolidated.brand) { metadata.brand = consolidated.brand; delete consolidated.brand; }
    if (consolidated.manufacturer) { metadata.manufacturer = consolidated.manufacturer; delete consolidated.manufacturer; }
    if (consolidated.default_sku) { metadata.default_sku = consolidated.default_sku; delete consolidated.default_sku; }
    if (consolidated.category) { metadata.category = consolidated.category; delete consolidated.category; }
    if (consolidated.subcategory) { metadata.subcategory = consolidated.subcategory; delete consolidated.subcategory; }
    if (consolidated.categories) { metadata.categories = parseJson(consolidated.categories); delete consolidated.categories; }
    if (consolidated.tags) { metadata.tags = parseJson(consolidated.tags); delete consolidated.tags; }
    if (Object.keys(metadata).length > 0) {
      consolidated.metadata = typeof consolidated.metadata === 'object' ? JSON.stringify({ ...parseJson(consolidated.metadata), ...metadata }) : JSON.stringify(metadata);
    }
  } else if (typeof consolidated.metadata === 'object') {
    consolidated.metadata = JSON.stringify(consolidated.metadata);
  }
  
  // 2. Consolidate attributes (dimensions, color, colors, size, sizes, material, materials, pattern, style, gender, age_group, season, country_of_origin)
  if (!consolidated.attributes) {
    const attributes = {};
    if (consolidated.weight || consolidated.length || consolidated.width || consolidated.height || 
        consolidated.shipping_weight || consolidated.shipping_class) {
      attributes.dimensions = {
        weight: consolidated.weight,
        weight_unit: consolidated.weight_unit || 'g',
        length: consolidated.length,
        width: consolidated.width,
        height: consolidated.height,
        dimensions_unit: consolidated.dimensions_unit || 'cm',
        shipping_weight: consolidated.shipping_weight,
        shipping_class: consolidated.shipping_class
      };
      delete consolidated.weight; delete consolidated.weight_unit; delete consolidated.length;
      delete consolidated.width; delete consolidated.height; delete consolidated.dimensions_unit;
      delete consolidated.shipping_weight; delete consolidated.shipping_class;
    }
    ['color', 'colors', 'size', 'sizes', 'material', 'materials', 'pattern', 'style', 
     'gender', 'age_group', 'season', 'country_of_origin'].forEach(field => {
      if (consolidated[field]) {
        attributes[field] = parseJson(consolidated[field]);
        delete consolidated[field];
      }
    });
    if (Object.keys(attributes).length > 0) {
      consolidated.attributes = typeof consolidated.attributes === 'object' ? JSON.stringify({ ...parseJson(consolidated.attributes), ...attributes }) : JSON.stringify(attributes);
    }
  } else if (typeof consolidated.attributes === 'object') {
    consolidated.attributes = JSON.stringify(consolidated.attributes);
  }
  
  // 3. Consolidate inventory
  if (!consolidated.inventory && (consolidated.stock_status || consolidated.stock_quantity !== undefined || 
      consolidated.low_stock_threshold !== undefined || consolidated.manage_stock !== undefined || 
      consolidated.allow_backorders !== undefined || consolidated.backorder_status || 
      consolidated.package_quantity !== undefined || consolidated.min_order_quantity !== undefined || 
      consolidated.max_order_quantity !== undefined)) {
    consolidated.inventory = JSON.stringify({
      stock_status: consolidated.stock_status,
      stock_quantity: consolidated.stock_quantity,
      low_stock_threshold: consolidated.low_stock_threshold,
      manage_stock: consolidated.manage_stock,
      allow_backorders: consolidated.allow_backorders,
      backorder_status: consolidated.backorder_status,
      package_quantity: consolidated.package_quantity,
      min_order_quantity: consolidated.min_order_quantity,
      max_order_quantity: consolidated.max_order_quantity
    });
    ['stock_status', 'stock_quantity', 'low_stock_threshold', 'manage_stock', 'allow_backorders', 
     'backorder_status', 'package_quantity', 'min_order_quantity', 'max_order_quantity'].forEach(f => delete consolidated[f]);
  } else if (consolidated.inventory && typeof consolidated.inventory === 'object') {
    consolidated.inventory = JSON.stringify(consolidated.inventory);
  }
  
  // 4. Consolidate policies
  if (!consolidated.policies && (consolidated.warranty_period || consolidated.warranty_type || 
      consolidated.return_policy || consolidated.purchase_note)) {
    consolidated.policies = JSON.stringify({
      warranty_period: consolidated.warranty_period,
      warranty_type: consolidated.warranty_type,
      return_policy: consolidated.return_policy,
      purchase_note: consolidated.purchase_note
    });
    ['warranty_period', 'warranty_type', 'return_policy', 'purchase_note'].forEach(f => delete consolidated[f]);
  } else if (consolidated.policies && typeof consolidated.policies === 'object') {
    consolidated.policies = JSON.stringify(consolidated.policies);
  }
  
  // 5. Consolidate SEO
  if (!consolidated.seo && (consolidated.meta_title || consolidated.meta_description || 
      consolidated.meta_keywords || consolidated.permalink || consolidated.canonical_url)) {
    consolidated.seo = JSON.stringify({
      meta_title: consolidated.meta_title,
      meta_description: consolidated.meta_description,
      meta_keywords: consolidated.meta_keywords,
      permalink: consolidated.permalink,
      canonical_url: consolidated.canonical_url
    });
    ['meta_title', 'meta_description', 'meta_keywords', 'permalink', 'canonical_url'].forEach(f => delete consolidated[f]);
  } else if (consolidated.seo && typeof consolidated.seo === 'object') {
    consolidated.seo = JSON.stringify(consolidated.seo);
  }
  
  // 6. Consolidate stats (ratings and counts)
  if (!consolidated.stats && (consolidated.rating_average !== undefined || consolidated.rating_count !== undefined || 
      consolidated.review_count !== undefined || consolidated.view_count !== undefined || 
      consolidated.sales_count !== undefined || consolidated.wishlist_count !== undefined || 
      consolidated.compare_count !== undefined || consolidated.download_count !== undefined || 
      consolidated.total_sales !== undefined || consolidated.average_rating !== undefined)) {
    consolidated.stats = JSON.stringify({
      rating_average: consolidated.rating_average,
      rating_count: consolidated.rating_count,
      review_count: consolidated.review_count,
      view_count: consolidated.view_count,
      sales_count: consolidated.sales_count,
      wishlist_count: consolidated.wishlist_count,
      compare_count: consolidated.compare_count,
      download_count: consolidated.download_count,
      total_sales: consolidated.total_sales,
      average_rating: consolidated.average_rating
    });
    ['rating_average', 'rating_count', 'review_count', 'view_count', 'sales_count', 
     'wishlist_count', 'compare_count', 'download_count', 'total_sales', 'average_rating'].forEach(f => delete consolidated[f]);
  } else if (consolidated.stats && typeof consolidated.stats === 'object') {
    consolidated.stats = JSON.stringify(consolidated.stats);
  }
  
  // 7. Consolidate flags (product type and boolean flags)
  if (!consolidated.flags && (consolidated.product_type || consolidated.virtual_product !== undefined || 
      consolidated.downloadable_product !== undefined || consolidated.external_product !== undefined || 
      consolidated.requires_shipping !== undefined || consolidated.taxable !== undefined || 
      consolidated.tax_class || consolidated.tax_status || consolidated.shipping_required !== undefined || 
      consolidated.shipping_taxable !== undefined || consolidated.reviews_allowed !== undefined || 
      consolidated.sold_individually !== undefined || consolidated.purchase_only !== undefined || 
      consolidated.catalog_visibility)) {
    consolidated.flags = JSON.stringify({
      product_type: consolidated.product_type,
      virtual_product: consolidated.virtual_product,
      downloadable_product: consolidated.downloadable_product,
      external_product: consolidated.external_product,
      requires_shipping: consolidated.requires_shipping,
      taxable: consolidated.taxable,
      tax_class: consolidated.tax_class,
      tax_status: consolidated.tax_status,
      shipping_required: consolidated.shipping_required,
      shipping_taxable: consolidated.shipping_taxable,
      reviews_allowed: consolidated.reviews_allowed,
      sold_individually: consolidated.sold_individually,
      purchase_only: consolidated.purchase_only,
      catalog_visibility: consolidated.catalog_visibility
    });
    ['product_type', 'virtual_product', 'downloadable_product', 'external_product', 'requires_shipping', 
     'taxable', 'tax_class', 'tax_status', 'shipping_required', 'shipping_taxable', 'reviews_allowed', 
     'sold_individually', 'purchase_only', 'catalog_visibility'].forEach(f => delete consolidated[f]);
  } else if (consolidated.flags && typeof consolidated.flags === 'object') {
    consolidated.flags = JSON.stringify(consolidated.flags);
  }
  
  // 8. Consolidate relationships
  if (!consolidated.relationships && (consolidated.parent_id || consolidated.menu_order !== undefined || 
      consolidated.grouped_products || consolidated.upsell_ids || consolidated.cross_sell_ids || 
      consolidated.related_products || consolidated.accessories || consolidated.replacement_parts)) {
    consolidated.relationships = JSON.stringify({
      parent_id: consolidated.parent_id,
      menu_order: consolidated.menu_order,
      grouped_products: parseJson(consolidated.grouped_products),
      upsell_ids: parseJson(consolidated.upsell_ids),
      cross_sell_ids: parseJson(consolidated.cross_sell_ids),
      related_products: parseJson(consolidated.related_products),
      accessories: parseJson(consolidated.accessories),
      replacement_parts: parseJson(consolidated.replacement_parts)
    });
    ['parent_id', 'menu_order', 'grouped_products', 'upsell_ids', 'cross_sell_ids', 
     'related_products', 'accessories', 'replacement_parts'].forEach(f => delete consolidated[f]);
  } else if (consolidated.relationships && typeof consolidated.relationships === 'object') {
    consolidated.relationships = JSON.stringify(consolidated.relationships);
  }
  
  // 9. Consolidate media
  if (!consolidated.media && (consolidated.product_images || consolidated.image_url || 
      consolidated.image_alt || consolidated.gallery_images || consolidated.video_url || 
      consolidated.video_embed || consolidated.downloadable_files || consolidated.download_limit !== undefined || 
      consolidated.download_expiry !== undefined)) {
    consolidated.media = JSON.stringify({
      product_images: parseJson(consolidated.product_images),
      image_url: consolidated.image_url,
      image_alt: consolidated.image_alt,
      gallery_images: parseJson(consolidated.gallery_images),
      video_url: consolidated.video_url,
      video_embed: consolidated.video_embed,
      downloadable_files: parseJson(consolidated.downloadable_files),
      download_limit: consolidated.download_limit,
      download_expiry: consolidated.download_expiry
    });
    ['product_images', 'image_url', 'image_alt', 'gallery_images', 'video_url', 'video_embed', 
     'downloadable_files', 'download_limit', 'download_expiry'].forEach(f => delete consolidated[f]);
  } else if (consolidated.media && typeof consolidated.media === 'object') {
    consolidated.media = JSON.stringify(consolidated.media);
  }
  
  // 10. Consolidate variants
  if (!consolidated.variants && (consolidated.product_attributes || consolidated.default_attributes || 
      consolidated.variations || consolidated.variation_data || consolidated.variant_data)) {
    consolidated.variants = JSON.stringify({
      product_attributes: parseJson(consolidated.product_attributes),
      default_attributes: parseJson(consolidated.default_attributes),
      variations: parseJson(consolidated.variations),
      variation_data: parseJson(consolidated.variation_data),
      variant_data: parseJson(consolidated.variant_data)
    });
    ['product_attributes', 'default_attributes', 'variations', 'variation_data', 'variant_data'].forEach(f => delete consolidated[f]);
  } else if (consolidated.variants && typeof consolidated.variants === 'object') {
    consolidated.variants = JSON.stringify(consolidated.variants);
  }
  
  // 11. Consolidate extended_data (everything else)
  const extendedFields = ['custom_fields', 'social_data', 'analytics_data', 'pricing_data', 
    'inventory_data', 'shipping_data', 'tax_data', 'discount_data', 'promotion_data', 
    'bundle_data', 'subscription_data', 'membership_data', 'gift_card_data', 'auction_data', 
    'rental_data', 'booking_data', 'event_data', 'course_data', 'service_data', 'digital_data', 
    'physical_data', 'specifications', 'features', 'benefits', 'use_cases', 'compatibility', 
    'requirements', 'included_items', 'care_instructions', 'certifications', 'awards', 
    'testimonials', 'faq', 'documentation', 'product_url', 'button_text', 'date_on_sale_from', 
    'date_on_sale_to', 'washing_instructions', 'storage_instructions', 'safety_warnings', 
    'support_url', 'documentation_url', 'user_manual_url', 'installation_guide_url', 'video_tutorials'];
  
  if (!consolidated.extended_data) {
    const extended = {};
    extendedFields.forEach(field => {
      if (consolidated[field] !== undefined) {
        extended[field] = parseJson(consolidated[field]);
        delete consolidated[field];
      }
    });
    if (Object.keys(extended).length > 0) {
      consolidated.extended_data = JSON.stringify(extended);
    }
  } else if (typeof consolidated.extended_data === 'object') {
    consolidated.extended_data = JSON.stringify(consolidated.extended_data);
  }
  
  return consolidated;
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
      // Category is now in metadata JSON, search in metadata field
      sql += ' AND (json_extract(metadata, "$.category") = ? OR json_extract(metadata, "$.categories") LIKE ? OR metadata LIKE ?)';
      bindings.push(category, `%${category}%`, `%${category}%`);
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
      'SELECT * FROM products WHERE deleted = 0 AND status = ? AND (json_extract(metadata, "$.category") = ? OR json_extract(metadata, "$.categories") LIKE ? OR metadata LIKE ?) ORDER BY featured DESC, created_at DESC LIMIT ?'
    ).bind('active', category, `%${category}%`, `%${category}%`, limit).all();
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
      sql += ' AND (json_extract(metadata, "$.category") = ? OR json_extract(metadata, "$.categories") LIKE ? OR metadata LIKE ?)';
      bindings.push(category, `%${category}%`, `%${category}%`);
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
 * Create product
 */
export async function createProduct(product, env) {
  try {
    // Consolidate fields into JSON structure
    const consolidated = consolidateProductFields(product);
    
    // Add timestamps if not provided
    if (!consolidated.created_at) consolidated.created_at = new Date().toISOString();
    if (!consolidated.updated_at) consolidated.updated_at = new Date().toISOString();
    
    // Build dynamic SQL for all fields
    const fields = Object.keys(consolidated);
    const placeholders = fields.map(() => '?').join(', ');
    const values = fields.map(field => consolidated[field]);
    
    const sql = `INSERT INTO products (${fields.join(', ')}) VALUES (${placeholders})`;
    await env.CATALOG_DB.prepare(sql).bind(...values).run();
    
    logger('product.created', { productId: consolidated.product_id, title: consolidated.title });
    return consolidated;
  } catch (err) {
    logError('createProduct: Database error', err, { productId: product.product_id });
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
    
    // Consolidate fields into JSON structure
    const consolidated = consolidateProductFields(updates);
    
    const setFields = Object.keys(consolidated);
    if (setFields.length === 0) return await getProductById(productId, env);
    
    const setClause = setFields.map(field => `${field} = ?`).join(', ');
    const values = setFields.map(field => consolidated[field]);
    
    // Add updated_at and productId to the values
    const sql = `UPDATE products SET ${setClause}, updated_at = ? WHERE product_id = ? AND deleted = 0`;
    values.push(new Date().toISOString());
    values.push(productId);
    
    await env.CATALOG_DB.prepare(sql).bind(...values).run();
    
    logger('product.updated', { productId });
    return await getProductById(productId, env);
  } catch (err) {
    logError('updateProduct: Database error', err, { productId });
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
