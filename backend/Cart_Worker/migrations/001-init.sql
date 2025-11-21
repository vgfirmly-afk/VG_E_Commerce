-- Cart Worker Database Schema
-- Tables for shopping carts and cart items

-- Carts table - Shopping carts for users (logged in or anonymous)
CREATE TABLE IF NOT EXISTS carts (
  cart_id TEXT PRIMARY KEY,
  user_id TEXT, -- NULL for anonymous carts, user ID for logged-in users
  session_id TEXT, -- For anonymous carts (browser session)
  status TEXT DEFAULT 'active', -- active, abandoned, completed
  currency TEXT DEFAULT 'USD',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  expires_at TEXT -- When cart expires (for cleanup)
);

-- Cart Items table - Items in each cart
-- Note: Only sku_id is stored. sku_code and product_id can be retrieved from sku_id via catalog service when needed.
-- unit_price should be fetched from pricing service when needed (not cached).
CREATE TABLE IF NOT EXISTS cart_items (
  item_id TEXT PRIMARY KEY,
  cart_id TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  currency TEXT DEFAULT 'USD',
  added_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE
);

-- Cart History table - Audit trail of cart changes
CREATE TABLE IF NOT EXISTS cart_history (
  history_id TEXT PRIMARY KEY,
  cart_id TEXT NOT NULL,
  action TEXT NOT NULL, -- add_item, remove_item, update_quantity, clear_cart, checkout
  sku_id TEXT,
  quantity_before INTEGER,
  quantity_after INTEGER,
  changed_by TEXT,
  changed_at TEXT NOT NULL,
  FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON carts(session_id);
CREATE INDEX IF NOT EXISTS idx_carts_status ON carts(status);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_sku_id ON cart_items(sku_id);
CREATE INDEX IF NOT EXISTS idx_cart_history_cart_id ON cart_history(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_history_changed_at ON cart_history(changed_at);

