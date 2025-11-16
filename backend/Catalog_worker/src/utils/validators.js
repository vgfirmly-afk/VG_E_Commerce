// utils/validators.js
import Joi from 'joi';

// Helper to validate JSON fields (accepts both object and JSON string)
const jsonField = Joi.alternatives().try(Joi.object(), Joi.string()).allow(null, '');

// Product creation/update schema - matches optimized schema with JSON consolidation
export const productSchema = Joi.object({
  product_id: Joi.string().optional(),
  title: Joi.string().min(1).max(500).required(),
  description: Joi.string().max(10000).allow(null, ''),
  short_description: Joi.string().max(500).allow(null, ''),
  slug: Joi.string().max(500).allow(null, '').optional(), // Optional - will be auto-generated from title
  
  // Consolidated identifiers JSON: {mpn, upc, ean, isbn, gtin, model_number, sku}
  identifiers: jsonField,
  // Backward compatibility - accept individual fields too
  mpn: Joi.string().max(100).allow(null, ''),
  upc: Joi.string().max(50).allow(null, ''),
  ean: Joi.string().max(50).allow(null, ''),
  isbn: Joi.string().max(50).allow(null, ''),
  gtin: Joi.string().max(50).allow(null, ''),
  model_number: Joi.string().max(100).allow(null, ''),
  sku: Joi.string().max(100).allow(null, ''),
  
  brand: Joi.string().max(200).allow(null, ''),
  manufacturer: Joi.string().max(200).allow(null, ''),
  default_sku: Joi.string().max(100).allow(null, ''),
  
  category: Joi.string().max(200).allow(null, ''),
  subcategory: Joi.string().max(200).allow(null, ''),
  categories: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  tags: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  
  status: Joi.string().valid('active', 'inactive', 'draft', 'archived').default('active'),
  visibility: Joi.string().valid('public', 'private', 'hidden').default('public'),
  featured: Joi.number().integer().valid(0, 1).default(0),
  new_arrival: Joi.number().integer().valid(0, 1).default(0),
  best_seller: Joi.number().integer().valid(0, 1).default(0),
  on_sale: Joi.number().integer().valid(0, 1).default(0),
  
  // Consolidated dimensions JSON: {weight, weight_unit, length, width, height, dimensions_unit, shipping_weight, shipping_class}
  dimensions: jsonField,
  // Backward compatibility
  weight: Joi.number().allow(null),
  weight_unit: Joi.string().max(10).default('g'),
  length: Joi.number().allow(null),
  width: Joi.number().allow(null),
  height: Joi.number().allow(null),
  dimensions_unit: Joi.string().max(10).default('cm'),
  shipping_weight: Joi.number().allow(null),
  shipping_class: Joi.string().max(100).allow(null, ''),
  
  color: Joi.string().max(100).allow(null, ''),
  colors: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  size: Joi.string().max(50).allow(null, ''),
  sizes: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  material: Joi.string().max(200).allow(null, ''),
  materials: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  pattern: Joi.string().max(100).allow(null, ''),
  style: Joi.string().max(100).allow(null, ''),
  gender: Joi.string().valid('men', 'women', 'unisex', 'kids').allow(null, ''),
  age_group: Joi.string().max(50).allow(null, ''),
  season: Joi.string().valid('spring', 'summer', 'fall', 'winter', 'all').allow(null, ''),
  country_of_origin: Joi.string().max(100).allow(null, ''),
  
  // Consolidated inventory JSON: {stock_status, stock_quantity, low_stock_threshold, manage_stock, allow_backorders, backorder_status, package_quantity, min_order_quantity, max_order_quantity}
  inventory: jsonField,
  // Backward compatibility
  stock_status: Joi.string().valid('in_stock', 'out_of_stock', 'backorder', 'preorder').allow(null, ''),
  stock_quantity: Joi.number().integer().allow(null),
  low_stock_threshold: Joi.number().integer().allow(null),
  manage_stock: Joi.number().integer().valid(0, 1).default(1),
  allow_backorders: Joi.number().integer().valid(0, 1).default(0),
  backorder_status: Joi.string().max(100).allow(null, ''),
  package_quantity: Joi.number().integer().default(1),
  min_order_quantity: Joi.number().integer().default(1),
  max_order_quantity: Joi.number().integer().allow(null),
  
  // Consolidated policies JSON: {warranty_period, warranty_type, return_policy, purchase_note}
  policies: jsonField,
  // Backward compatibility
  warranty_period: Joi.string().max(100).allow(null, ''),
  warranty_type: Joi.string().max(100).allow(null, ''),
  return_policy: Joi.string().max(1000).allow(null, ''),
  purchase_note: Joi.string().max(1000).allow(null, ''),
  
  // Consolidated SEO JSON: {meta_title, meta_description, meta_keywords, permalink, canonical_url}
  seo: jsonField,
  // Backward compatibility
  meta_title: Joi.string().max(200).allow(null, ''),
  meta_description: Joi.string().max(500).allow(null, ''),
  meta_keywords: Joi.string().max(500).allow(null, ''),
  permalink: Joi.string().max(1000).allow(null, ''),
  canonical_url: Joi.string().uri().allow(null, ''),
  
  rating_average: Joi.number().min(0).max(5).default(0),
  rating_count: Joi.number().integer().default(0),
  review_count: Joi.number().integer().default(0),
  view_count: Joi.number().integer().default(0),
  sales_count: Joi.number().integer().default(0),
  wishlist_count: Joi.number().integer().default(0),
  compare_count: Joi.number().integer().default(0),
  download_count: Joi.number().integer().default(0),
  total_sales: Joi.number().integer().default(0),
  average_rating: Joi.number().min(0).max(5).allow(null),
  
  product_type: Joi.string().valid('simple', 'variable', 'grouped', 'external').default('simple'),
  virtual_product: Joi.number().integer().valid(0, 1).default(0),
  downloadable_product: Joi.number().integer().valid(0, 1).default(0),
  external_product: Joi.number().integer().valid(0, 1).default(0),
  requires_shipping: Joi.number().integer().valid(0, 1).default(1),
  taxable: Joi.number().integer().valid(0, 1).default(1),
  tax_class: Joi.string().max(100).allow(null, ''),
  tax_status: Joi.string().valid('taxable', 'shipping', 'none').default('taxable'),
  shipping_required: Joi.number().integer().valid(0, 1).default(1),
  shipping_taxable: Joi.number().integer().valid(0, 1).default(1),
  reviews_allowed: Joi.number().integer().valid(0, 1).default(1),
  sold_individually: Joi.number().integer().valid(0, 1).default(0),
  purchase_only: Joi.number().integer().valid(0, 1).default(0),
  catalog_visibility: Joi.string().valid('visible', 'catalog', 'search', 'hidden').default('visible'),
  
  parent_id: Joi.string().allow(null, ''),
  menu_order: Joi.number().integer().default(0),
  
  // Consolidated product_relationships JSON: {grouped_products, upsell_ids, cross_sell_ids, related_products, accessories, replacement_parts}
  product_relationships: jsonField,
  // Backward compatibility
  grouped_products: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  upsell_ids: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  cross_sell_ids: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  related_products: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  accessories: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  replacement_parts: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  
  product_images: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  image_url: Joi.string().uri().allow(null, ''),
  image_alt: Joi.string().max(500).allow(null, ''),
  gallery_images: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  
  // Consolidated media JSON: {video_url, video_embed, downloadable_files, download_limit, download_expiry}
  media: jsonField,
  // Backward compatibility
  video_url: Joi.string().uri().allow(null, ''),
  video_embed: Joi.string().max(2000).allow(null, ''),
  downloadable_files: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  download_limit: Joi.number().integer().allow(null),
  download_expiry: Joi.number().integer().allow(null),
  
  product_attributes: jsonField,
  default_attributes: jsonField,
  variations: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  variation_data: jsonField,
  variant_data: jsonField,
  custom_fields: jsonField,
  social_data: jsonField,
  analytics_data: jsonField,
  pricing_data: jsonField,
  inventory_data: jsonField,
  shipping_data: jsonField,
  tax_data: jsonField,
  discount_data: jsonField,
  promotion_data: jsonField,
  bundle_data: jsonField,
  subscription_data: jsonField,
  membership_data: jsonField,
  gift_card_data: jsonField,
  auction_data: jsonField,
  rental_data: jsonField,
  booking_data: jsonField,
  event_data: jsonField,
  course_data: jsonField,
  service_data: jsonField,
  digital_data: jsonField,
  physical_data: jsonField,
  specifications: jsonField,
  features: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  benefits: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  use_cases: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  compatibility: jsonField,
  requirements: jsonField,
  included_items: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  
  // Consolidated care_instructions JSON: {care, washing, storage, safety_warnings}
  care_instructions: jsonField,
  // Backward compatibility
  washing_instructions: Joi.string().max(2000).allow(null, ''),
  storage_instructions: Joi.string().max(2000).allow(null, ''),
  safety_warnings: Joi.string().max(2000).allow(null, ''),
  
  certifications: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  awards: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  testimonials: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  faq: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  
  // Consolidated documentation JSON: {support_url, documentation_url, user_manual_url, installation_guide_url, video_tutorials}
  documentation: jsonField,
  // Backward compatibility
  support_url: Joi.string().uri().allow(null, ''),
  documentation_url: Joi.string().uri().allow(null, ''),
  user_manual_url: Joi.string().uri().allow(null, ''),
  installation_guide_url: Joi.string().uri().allow(null, ''),
  video_tutorials: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ''),
  
  product_url: Joi.string().uri().allow(null, ''),
  button_text: Joi.string().max(100).allow(null, ''),
  date_on_sale_from: Joi.string().isoDate().allow(null, ''),
  date_on_sale_to: Joi.string().isoDate().allow(null, ''),
  created_by: Joi.string().allow(null, ''),
  updated_by: Joi.string().allow(null, ''),
  // SKUs array (handled separately in service, but allow in schema)
  skus: Joi.array().items(Joi.object({
    sku_id: Joi.string().optional(),
    sku_code: Joi.string().required(),
    attributes: jsonField
  })).optional(),
});

// SKU schema
export const skuSchema = Joi.object({
  sku_id: Joi.string().optional(),
  product_id: Joi.string().required(),
  sku_code: Joi.string().optional(), // Optional - will be auto-generated
  attributes: jsonField,
});

// URL path parameter schemas
export const productIdSchema = Joi.string().min(1).max(100).required()
  .messages({
    'string.empty': 'Product ID is required',
    'any.required': 'Product ID is required'
  });

export const imageIdSchema = Joi.string().min(1).max(100).required()
  .messages({
    'string.empty': 'Image ID is required',
    'any.required': 'Image ID is required'
  });

export const skuIdSchema = Joi.string().min(1).max(100).required()
  .messages({
    'string.empty': 'SKU ID is required',
    'any.required': 'SKU ID is required'
  });

// Query params schema for GET /products
export const productsQuerySchema = Joi.object({
  q: Joi.string().max(500).allow(''),
  category: Joi.string().max(200).allow(''),
  page: Joi.number().integer().min(1).max(10000).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  featured: Joi.number().integer().valid(0, 1).allow(''),
  status: Joi.string().valid('active', 'inactive', 'draft', 'archived').allow(''),
});

// Query params schema for GET /search
export const searchQuerySchema = Joi.object({
  q: Joi.string().min(1).max(500).required()
    .messages({
      'string.empty': 'Search keyword (q) is required',
      'any.required': 'Search keyword (q) is required'
    }),
  category: Joi.string().max(200).allow(''),
  page: Joi.number().integer().min(1).max(10000).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

// Query params schema for GET /home
export const homePageQuerySchema = Joi.object({
  categories: Joi.string().max(1000).allow(''), // Comma-separated list
  limit: Joi.number().integer().min(1).max(100).default(10),
});

// SKU attributes schema - validates the structure of attributes JSON
export const skuAttributesSchema = Joi.object().pattern(
  Joi.string(),
  Joi.alternatives().try(
    Joi.string(),
    Joi.number(),
    Joi.boolean(),
    Joi.array(),
    Joi.object()
  )
).allow(null, {});

// Update schema - all fields optional (created separately because .fork() is not supported in Workers)
export const productUpdateSchema = productSchema;

export function validateProduct(data) {
  return productSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateProductUpdate(data) {
  // For updates, all fields are optional - validate but don't require any fields
  const result = productUpdateSchema.validate(data, { 
    abortEarly: false, 
    stripUnknown: true,
    allowUnknown: false
  });
  
  // If there are errors, filter out "required" errors since all fields are optional for updates
  if (result.error) {
    const filteredErrors = result.error.details.filter(detail => detail.type !== 'any.required');
    if (filteredErrors.length > 0) {
      return {
        error: {
          ...result.error,
          details: filteredErrors
        },
        value: result.value
      };
    }
    // If only "required" errors, return success
    return { error: null, value: result.value };
  }
  
  return result;
}

export function validateSku(data) {
  const result = skuSchema.validate(data, { abortEarly: false, stripUnknown: true });
  
  // If validation passed and attributes exist, validate attributes structure
  if (!result.error && data.attributes) {
    const attrsResult = validateSkuAttributes(data.attributes);
    if (attrsResult.error) {
      return {
        error: {
          ...attrsResult.error,
          details: [
            ...(result.error?.details || []),
            ...attrsResult.error.details
          ]
        },
        value: result.value
      };
    }
  }
  
  return result;
}

export function validateProductsQuery(params) {
  return productsQuerySchema.validate(params, { abortEarly: false, stripUnknown: true });
}

export function validateSearchQuery(params) {
  return searchQuerySchema.validate(params, { abortEarly: false, stripUnknown: true });
}

export function validateHomePageQuery(params) {
  return homePageQuerySchema.validate(params, { abortEarly: false, stripUnknown: true });
}

export function validateProductId(productId) {
  return productIdSchema.validate(productId);
}

export function validateImageId(imageId) {
  return imageIdSchema.validate(imageId);
}

export function validateSkuId(skuId) {
  return skuIdSchema.validate(skuId);
}

export function validateSkuAttributes(attributes) {
  // If attributes is a string, try to parse it first
  let attrs = attributes;
  if (typeof attributes === 'string') {
    try {
      attrs = JSON.parse(attributes);
    } catch {
      return { error: { details: [{ message: 'Invalid JSON in attributes field' }] }, value: null };
    }
  }
  return skuAttributesSchema.validate(attrs || {}, { abortEarly: false, stripUnknown: false });
}
