-- Fulfillment Worker Database Schema
-- Tables for order fulfillment: orders, order_items, fulfillment_status, shipping_tracking

-- Orders table - Main order records
CREATE TABLE IF NOT EXISTS orders (
  order_id TEXT PRIMARY KEY,
  checkout_session_id TEXT NOT NULL,
  payment_id TEXT,
  user_id TEXT, -- NULL for guest orders
  guest_session_id TEXT, -- For guest orders
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  order_number TEXT UNIQUE NOT NULL, -- Human-readable order number (e.g., ORD-2024-001)
  delivery_address_id TEXT,
  billing_address_id TEXT,
  shipping_method_id TEXT,
  estimated_delivery_date TEXT,
  actual_delivery_date TEXT,
  subtotal REAL NOT NULL DEFAULT 0.00,
  shipping_cost REAL NOT NULL DEFAULT 0.00,
  tax REAL NOT NULL DEFAULT 0.00,
  total REAL NOT NULL DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Order items table - Items in each order
CREATE TABLE IF NOT EXISTS order_items (
  item_id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  product_id TEXT,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  subtotal REAL NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Fulfillment status table - Tracks fulfillment status changes
CREATE TABLE IF NOT EXISTS fulfillment_status (
  status_id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  notes TEXT,
  updated_by TEXT, -- User ID or system
  created_at TEXT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Shipping tracking table - Tracks shipping information
CREATE TABLE IF NOT EXISTS shipping_tracking (
  tracking_id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  carrier TEXT NOT NULL,
  tracking_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_transit', 'out_for_delivery', 'delivered', 'exception'
  estimated_delivery_date TEXT,
  actual_delivery_date TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_guest_session_id ON orders(guest_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_checkout_session_id ON orders(checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_sku_id ON order_items(sku_id);
CREATE INDEX IF NOT EXISTS idx_fulfillment_status_order_id ON fulfillment_status(order_id);
CREATE INDEX IF NOT EXISTS idx_fulfillment_status_status ON fulfillment_status(status);
CREATE INDEX IF NOT EXISTS idx_shipping_tracking_order_id ON shipping_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_shipping_tracking_tracking_number ON shipping_tracking(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipping_tracking_status ON shipping_tracking(status);

