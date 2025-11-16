-- Products table - optimized to 60 columns for D1 compatibility
-- Essential fields are separate columns for indexing/querying
-- Additional data is stored in JSON fields for flexibility
CREATE TABLE IF NOT EXISTS products (
  -- Core identification (5 columns)
  product_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  slug TEXT UNIQUE,
  
  -- Product identifiers and categorization (consolidated into metadata JSON)
  metadata TEXT, -- JSON: {identifiers: {mpn, upc, ean, isbn, gtin, model_number, sku}, brand, manufacturer, default_sku, category, subcategory, categories, tags}
  
  -- Status and visibility (6 columns)
  status TEXT DEFAULT 'active',
  visibility TEXT DEFAULT 'public',
  featured INTEGER DEFAULT 0,
  new_arrival INTEGER DEFAULT 0,
  best_seller INTEGER DEFAULT 0,
  on_sale INTEGER DEFAULT 0,
  
  -- Physical attributes (consolidated into attributes JSON)
  attributes TEXT, -- JSON: {dimensions: {weight, weight_unit, length, width, height, dimensions_unit, shipping_weight, shipping_class}, color, colors, size, sizes, material, materials, pattern, style, gender, age_group, season, country_of_origin}
  
  -- Inventory and stock (consolidated into inventory JSON)
  inventory TEXT, -- JSON: {stock_status, stock_quantity, low_stock_threshold, manage_stock, allow_backorders, backorder_status, package_quantity, min_order_quantity, max_order_quantity}
  
  -- Warranty and policies (consolidated into policies JSON)
  policies TEXT, -- JSON: {warranty_period, warranty_type, return_policy, purchase_note}
  
  -- SEO and metadata (consolidated into seo JSON)
  seo TEXT, -- JSON: {meta_title, meta_description, meta_keywords, permalink, canonical_url}
  
  -- Ratings and counts (consolidated into stats JSON)
  stats TEXT, -- JSON: {rating_average, rating_count, review_count, view_count, sales_count, wishlist_count, compare_count, download_count, total_sales, average_rating}
  
  -- Product type and flags (consolidated into flags JSON)
  flags TEXT, -- JSON: {product_type, virtual_product, downloadable_product, external_product, requires_shipping, taxable, tax_class, tax_status, shipping_required, shipping_taxable, reviews_allowed, sold_individually, purchase_only, catalog_visibility}
  
  -- Product relationships (consolidated into relationships JSON)
  relationships TEXT, -- JSON: {parent_id, menu_order, grouped_products, upsell_ids, cross_sell_ids, related_products, accessories, replacement_parts}
  
  -- Images and media (consolidated into media JSON)
  media TEXT, -- JSON: {product_images, image_url, image_alt, gallery_images, video_url, video_embed, downloadable_files, download_limit, download_expiry}
  
  -- Product attributes and variations (consolidated into variants JSON)
  variants TEXT, -- JSON: {product_attributes, default_attributes, variations, variation_data, variant_data}
  
  -- Extended product data (consolidated into extended_data JSON)
  extended_data TEXT, -- JSON: {custom_fields, social_data, analytics_data, pricing_data, inventory_data, shipping_data, tax_data, discount_data, promotion_data, bundle_data, subscription_data, membership_data, gift_card_data, auction_data, rental_data, booking_data, event_data, course_data, service_data, digital_data, physical_data, specifications, features, benefits, use_cases, compatibility, requirements, included_items, care_instructions, certifications, awards, testimonials, faq, documentation, product_url, button_text, date_on_sale_from, date_on_sale_to}
  
  -- Timestamps and audit (7 columns)
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT,
  updated_by TEXT,
  published_at TEXT,
  deleted_at TEXT,
  deleted INTEGER DEFAULT 0
);

-- SKUs table for product variations
CREATE TABLE IF NOT EXISTS skus (
  sku_id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  sku_code TEXT NOT NULL,
  attributes TEXT, -- JSON object for SKU-specific attributes (size, color, etc.)
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_skus_product_id ON skus(product_id);
CREATE INDEX IF NOT EXISTS idx_skus_sku_code ON skus(sku_code);
