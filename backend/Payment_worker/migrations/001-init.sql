-- Payment Worker Database Schema
-- Tables for payment processing and transaction management

-- Payment transactions table
CREATE TABLE IF NOT EXISTS payments (
  payment_id TEXT PRIMARY KEY,
  checkout_session_id TEXT NOT NULL,
  order_id TEXT, -- PayPal order ID
  intent TEXT NOT NULL, -- 'CAPTURE' or 'AUTHORIZE'
  status TEXT NOT NULL, -- 'pending', 'created', 'approved', 'captured', 'failed', 'cancelled', 'refunded'
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payer_email TEXT,
  payer_name TEXT,
  paypal_transaction_id TEXT, -- PayPal capture/authorization ID
  failure_reason TEXT,
  metadata TEXT, -- JSON string for additional data
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  captured_at TEXT
);

-- Payment events/audit log
CREATE TABLE IF NOT EXISTS payment_events (
  event_id TEXT PRIMARY KEY,
  payment_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'created', 'approved', 'captured', 'failed', 'refunded'
  event_data TEXT, -- JSON string
  created_at TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_session ON payments(checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payment_events_payment ON payment_events(payment_id);

