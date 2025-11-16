-- Migration: Add category column to products table
-- This adds a direct category column for easier querying and indexing

-- Add category column
ALTER TABLE products ADD COLUMN category TEXT;

-- Create index on category for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Optional: Migrate existing category data from metadata JSON to direct column
-- This updates products that have category in their metadata JSON
UPDATE products 
SET category = json_extract(metadata, '$.category')
WHERE category IS NULL 
  AND metadata IS NOT NULL 
  AND json_extract(metadata, '$.category') IS NOT NULL;

