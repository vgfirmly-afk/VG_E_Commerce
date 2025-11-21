-- Checkout Worker Database Schema
-- Tables for checkout process: addresses, shipping methods, checkout sessions

-- Addresses table - User delivery and billing addresses
CREATE TABLE IF NOT EXISTS addresses (
  address_id TEXT PRIMARY KEY,
  user_id TEXT, -- NULL for guest checkout
  session_id TEXT, -- For guest checkout
  type TEXT NOT NULL, -- 'delivery' or 'billing'
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'IN',
  is_default BOOLEAN DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Shipping methods table - Available shipping options
CREATE TABLE IF NOT EXISTS shipping_methods (
  method_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  carrier TEXT NOT NULL, -- 'standard', 'express', 'overnight', etc.
  base_cost REAL NOT NULL DEFAULT 0.00,
  cost_per_kg REAL DEFAULT 0.00,
  min_delivery_days INTEGER NOT NULL DEFAULT 3,
  max_delivery_days INTEGER NOT NULL DEFAULT 7,
  is_active BOOLEAN DEFAULT 1,
  applicable_pincodes TEXT, -- JSON array of pincodes or '*' for all
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Checkout sessions table - Tracks checkout process state
CREATE TABLE IF NOT EXISTS checkout_sessions (
  session_id TEXT PRIMARY KEY,
  cart_id TEXT NOT NULL,
  user_id TEXT, -- NULL for guest checkout
  guest_session_id TEXT, -- For guest checkout
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'address_set', 'shipping_selected', 'summary_ready', 'completed', 'expired', 'cancelled'
  delivery_address_id TEXT,
  billing_address_id TEXT,
  shipping_method_id TEXT,
  estimated_delivery_date TEXT,
  subtotal REAL NOT NULL DEFAULT 0.00,
  shipping_cost REAL NOT NULL DEFAULT 0.00,
  tax REAL NOT NULL DEFAULT 0.00,
  total REAL NOT NULL DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Checkout items table - Items in checkout session (snapshot of cart items)
CREATE TABLE IF NOT EXISTS checkout_items (
  item_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  subtotal REAL NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES checkout_sessions(session_id) ON DELETE CASCADE
);

-- Stock reservations table - Tracks reserved stock for checkout sessions
CREATE TABLE IF NOT EXISTS stock_reservations (
  reservation_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reserved_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'confirmed', 'released', 'expired'
  FOREIGN KEY (session_id) REFERENCES checkout_sessions(session_id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_session_id ON addresses(session_id);
CREATE INDEX IF NOT EXISTS idx_addresses_type ON addresses(type);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_cart_id ON checkout_sessions(cart_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user_id ON checkout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status ON checkout_sessions(status);
CREATE INDEX IF NOT EXISTS idx_checkout_items_session_id ON checkout_items(session_id);
CREATE INDEX IF NOT EXISTS idx_checkout_items_sku_id ON checkout_items(sku_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_session_id ON stock_reservations(session_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_sku_id ON stock_reservations(sku_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_status ON stock_reservations(status);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_expires_at ON stock_reservations(expires_at);

