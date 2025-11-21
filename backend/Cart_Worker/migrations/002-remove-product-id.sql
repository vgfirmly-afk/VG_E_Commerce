-- Remove product_id column from cart_items table
-- product_id can be retrieved from sku_id via catalog service when needed

ALTER TABLE cart_items DROP COLUMN product_id;

