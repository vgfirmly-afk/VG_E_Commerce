-- Remove sku_code and unit_price columns from cart_items table
-- sku_code can be retrieved from sku_id via catalog service when needed
-- unit_price should be fetched from pricing service when needed (not cached)

ALTER TABLE cart_items DROP COLUMN sku_code;
ALTER TABLE cart_items DROP COLUMN unit_price;

