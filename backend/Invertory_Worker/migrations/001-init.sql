-- Inventory Worker Database Schema
-- Tables for SKU stock management and stock history

-- SKU Stock table - Current stock for each SKU
CREATE TABLE IF NOT EXISTS sku_stock (
  sku_id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  sku_code TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  available_quantity INTEGER NOT NULL DEFAULT 0, -- Calculated: quantity - reserved_quantity
  low_stock_threshold INTEGER, -- Alert when stock falls below this
  status TEXT DEFAULT 'active', -- active, inactive, out_of_stock
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT,
  updated_by TEXT
);

-- Stock History table - Audit trail of all stock changes
CREATE TABLE IF NOT EXISTS stock_history (
  history_id TEXT PRIMARY KEY,
  sku_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  sku_code TEXT NOT NULL,
  change_type TEXT DEFAULT 'update', -- create, update, adjust, reserve, release, purchase
  quantity_before INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,
  reserved_before INTEGER NOT NULL DEFAULT 0,
  reserved_after INTEGER NOT NULL DEFAULT 0,
  adjustment_quantity INTEGER, -- Positive for increase, negative for decrease
  reason TEXT, -- Reason for stock change
  reservation_id TEXT, -- For tracking reservations
  changed_by TEXT,
  changed_at TEXT NOT NULL,
  FOREIGN KEY (sku_id) REFERENCES sku_stock(sku_id) ON DELETE CASCADE
);

-- Stock Reservations table - Track reserved stock (for cart/checkout)
CREATE TABLE IF NOT EXISTS stock_reservations (
  reservation_id TEXT PRIMARY KEY,
  sku_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  status TEXT DEFAULT 'active', -- active, completed, expired, cancelled
  expires_at TEXT, -- ISO date string (NULL means no expiry)
  created_at TEXT NOT NULL,
  completed_at TEXT,
  cancelled_at TEXT,
  FOREIGN KEY (sku_id) REFERENCES sku_stock(sku_id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sku_stock_product_id ON sku_stock(product_id);
CREATE INDEX IF NOT EXISTS idx_sku_stock_sku_code ON sku_stock(sku_code);
CREATE INDEX IF NOT EXISTS idx_sku_stock_status ON sku_stock(status);
CREATE INDEX IF NOT EXISTS idx_sku_stock_available_quantity ON sku_stock(available_quantity);
CREATE INDEX IF NOT EXISTS idx_stock_history_sku_id ON stock_history(sku_id);
CREATE INDEX IF NOT EXISTS idx_stock_history_changed_at ON stock_history(changed_at);
CREATE INDEX IF NOT EXISTS idx_stock_history_reservation_id ON stock_history(reservation_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_sku_id ON stock_reservations(sku_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_status ON stock_reservations(status);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_expires_at ON stock_reservations(expires_at);

