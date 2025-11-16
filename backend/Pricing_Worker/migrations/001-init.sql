-- Pricing Worker Database Schema
-- Tables for SKU pricing and price history

-- SKU Prices table - Current price for each SKU
CREATE TABLE IF NOT EXISTS sku_prices (
  sku_id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  sku_code TEXT NOT NULL,
  price REAL NOT NULL DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  sale_price REAL,
  compare_at_price REAL,
  cost_price REAL,
  status TEXT DEFAULT 'active', -- active, inactive
  valid_from TEXT NOT NULL, -- ISO date string
  valid_to TEXT, -- ISO date string (NULL means no expiry)
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT,
  updated_by TEXT
);

-- Price History table - Audit trail of all price changes
CREATE TABLE IF NOT EXISTS price_history (
  history_id TEXT PRIMARY KEY,
  sku_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  sku_code TEXT NOT NULL,
  price REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  sale_price REAL,
  compare_at_price REAL,
  cost_price REAL,
  change_type TEXT DEFAULT 'update', -- create, update, delete
  reason TEXT, -- Reason for price change
  changed_by TEXT,
  changed_at TEXT NOT NULL,
  FOREIGN KEY (sku_id) REFERENCES sku_prices(sku_id) ON DELETE CASCADE
);

-- Promotion Codes table - For discount codes (if needed in future)
CREATE TABLE IF NOT EXISTS promotion_codes (
  promotion_id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL, -- percentage, fixed_amount
  discount_value REAL NOT NULL,
  min_purchase_amount REAL,
  max_discount_amount REAL,
  valid_from TEXT NOT NULL,
  valid_to TEXT NOT NULL,
  usage_limit INTEGER, -- NULL means unlimited
  usage_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- active, inactive, expired
  applicable_skus TEXT, -- JSON array of SKU IDs (NULL means all SKUs)
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sku_prices_product_id ON sku_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_sku_prices_sku_code ON sku_prices(sku_code);
CREATE INDEX IF NOT EXISTS idx_sku_prices_status ON sku_prices(status);
CREATE INDEX IF NOT EXISTS idx_price_history_sku_id ON price_history(sku_id);
CREATE INDEX IF NOT EXISTS idx_price_history_changed_at ON price_history(changed_at);
CREATE INDEX IF NOT EXISTS idx_promotion_codes_code ON promotion_codes(code);
CREATE INDEX IF NOT EXISTS idx_promotion_codes_status ON promotion_codes(status);

