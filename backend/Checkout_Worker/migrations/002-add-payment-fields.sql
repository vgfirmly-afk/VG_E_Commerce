-- Add payment fields to checkout_sessions table
ALTER TABLE checkout_sessions ADD COLUMN payment_id TEXT;
ALTER TABLE checkout_sessions ADD COLUMN payment_status TEXT;

-- Add index for payment_id
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_payment_id ON checkout_sessions(payment_id);

