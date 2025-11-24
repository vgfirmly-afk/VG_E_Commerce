# Promotion Code Logic - How It Works

## Overview

The promotion code system in Pricing Worker allows you to apply discounts to cart totals. It supports both percentage-based and fixed-amount discounts with various validation rules.

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  POST /api/v1/calculate-total                                │
│  { items: [...], promotion_code: "SAVE20" }                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Calculate Subtotal                                      │
│     - Get prices for all SKUs                               │
│     - Apply sale prices if available                        │
│     - Calculate: item_total = effective_price × quantity   │
│     - Sum all item totals = subtotal                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Validate Promotion Code (if provided)                   │
│     - Check if code exists                                  │
│     - Check status = 'active'                               │
│     - Check valid_from <= now <= valid_to                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Check Applicability Rules                                │
│     ✓ SKU Applicability:                                    │
│       - If applicable_skus is NULL → applies to all SKUs    │
│       - If applicable_skus is array → check if any SKU      │
│         in cart matches                                     │
│     ✓ Minimum Purchase:                                     │
│       - If min_purchase_amount set → subtotal must be >=   │
│     ✓ Usage Limit:                                          │
│       - If usage_limit set → usage_count must be < limit   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Calculate Discount                                      │
│     IF discount_type = 'percentage':                         │
│       discount = (subtotal × discount_value) / 100          │
│       IF max_discount_amount set:                           │
│         discount = min(discount, max_discount_amount)        │
│                                                              │
│     IF discount_type = 'fixed_amount':                      │
│       discount = discount_value                              │
│       discount = min(discount, subtotal)  // Can't exceed   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Increment Usage Count                                    │
│     - Update usage_count = usage_count + 1                  │
│     - This happens AFTER successful application              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Calculate Final Total                                    │
│     total = max(0, subtotal - discount)                     │
│                                                              │
│     Return:                                                  │
│     {                                                       │
│       items: [...],                                         │
│       subtotal: 100.00,                                     │
│       discount: 20.00,                                      │
│       promotion: { code, name, discount_type, ... },        │
│       total: 80.00,                                         │
│       currency: "USD"                                       │
│     }                                                       │
└─────────────────────────────────────────────────────────────┘
```

## Promotion Code Fields

### Required Fields

- **code**: Unique promotion code (e.g., "SAVE20", "FLAT10")
- **name**: Display name (e.g., "20% Off Sale")
- **discount_type**: Either `"percentage"` or `"fixed_amount"`
- **discount_value**: The discount amount
  - For percentage: `20` means 20%
  - For fixed_amount: `10.00` means $10 off
- **valid_from**: Start date (ISO format)
- **valid_to**: End date (ISO format)

### Optional Fields

- **min_purchase_amount**: Minimum cart total required (e.g., `50.00`)
- **max_discount_amount**: Maximum discount cap for percentage (e.g., `100.00`)
- **usage_limit**: Maximum number of times code can be used (NULL = unlimited)
- **applicable_skus**: JSON array of SKU IDs (NULL = applies to all SKUs)
- **description**: Human-readable description

## Examples

### Example 1: Percentage Discount (20% Off)

**Promotion Code:**

```json
{
  "code": "SAVE20",
  "name": "20% Off Sale",
  "discount_type": "percentage",
  "discount_value": 20,
  "min_purchase_amount": 50.0,
  "max_discount_amount": 100.0,
  "valid_from": "2024-01-01T00:00:00Z",
  "valid_to": "2024-12-31T23:59:59Z",
  "usage_limit": 1000
}
```

**Cart:**

```json
{
  "items": [{ "sku_id": "sku-123", "quantity": 2 }],
  "promotion_code": "SAVE20"
}
```

**Calculation:**

1. Subtotal: $100.00 (2 × $50.00)
2. Check: Subtotal ($100) >= min_purchase ($50) ✓
3. Discount: ($100 × 20) / 100 = $20.00
4. Check: $20 <= max_discount ($100) ✓
5. Total: $100 - $20 = **$80.00**

### Example 2: Fixed Amount Discount ($10 Off)

**Promotion Code:**

```json
{
  "code": "FLAT10",
  "name": "$10 Off",
  "discount_type": "fixed_amount",
  "discount_value": 10.0,
  "min_purchase_amount": 25.0,
  "valid_from": "2024-01-01T00:00:00Z",
  "valid_to": "2024-12-31T23:59:59Z"
}
```

**Cart:**

```json
{
  "items": [{ "sku_id": "sku-456", "quantity": 1 }],
  "promotion_code": "FLAT10"
}
```

**Calculation:**

1. Subtotal: $30.00
2. Check: Subtotal ($30) >= min_purchase ($25) ✓
3. Discount: $10.00 (fixed)
4. Check: $10 <= subtotal ($30) ✓
5. Total: $30 - $10 = **$20.00**

### Example 3: SKU-Specific Promotion

**Promotion Code:**

```json
{
  "code": "SPECIAL50",
  "name": "50% Off Selected Items",
  "discount_type": "percentage",
  "discount_value": 50,
  "applicable_skus": ["sku-123", "sku-789"],
  "valid_from": "2024-01-01T00:00:00Z",
  "valid_to": "2024-12-31T23:59:59Z"
}
```

**Cart:**

```json
{
  "items": [
    { "sku_id": "sku-123", "quantity": 1 }, // ✓ In applicable_skus
    { "sku_id": "sku-456", "quantity": 1 } // ✗ Not in applicable_skus
  ],
  "promotion_code": "SPECIAL50"
}
```

**Calculation:**

1. Subtotal: $100.00 ($50 + $50)
2. Check: Cart contains sku-123 (in applicable_skus) ✓
3. Discount: ($100 × 50) / 100 = $50.00
4. Total: $100 - $50 = **$50.00**

**Note:** The discount applies to the entire cart total, not just the applicable SKUs.

## Validation Rules

### 1. Code Must Be Active

- `status = 'active'`
- `valid_from <= current_time <= valid_to`

### 2. SKU Applicability

- If `applicable_skus` is `NULL` → applies to all SKUs
- If `applicable_skus` is an array → at least one SKU in cart must be in the array

### 3. Minimum Purchase

- If `min_purchase_amount` is set → cart subtotal must be >= this amount
- If not met, promotion is not applied

### 4. Usage Limit

- If `usage_limit` is set → `usage_count` must be < `usage_limit`
- If limit reached, promotion is not applied
- Usage count is incremented AFTER successful application

### 5. Discount Caps

- **Percentage discounts**: Can be capped with `max_discount_amount`
- **Fixed amount**: Automatically capped at subtotal (can't discount more than total)

## API Endpoints

### Calculate Total with Promotion

```http
POST /api/v1/calculate-total
Content-Type: application/json

{
  "items": [
    { "sku_id": "sku-123", "quantity": 2 }
  ],
  "promotion_code": "SAVE20",
  "currency": "USD"
}
```

**Response:**

```json
{
  "items": [
    {
      "sku_id": "sku-123",
      "sku_code": "SKU-123",
      "quantity": 2,
      "unit_price": 50.0,
      "original_price": 50.0,
      "sale_price": null,
      "item_total": 100.0,
      "currency": "USD"
    }
  ],
  "subtotal": 100.0,
  "discount": 20.0,
  "promotion": {
    "code": "SAVE20",
    "name": "20% Off Sale",
    "discount_type": "percentage",
    "discount_value": 20
  },
  "total": 80.0,
  "currency": "USD"
}
```

## Important Notes

1. **Usage Count Increment**: The usage count is incremented AFTER the promotion is successfully applied. If the calculation fails for any reason, the count is not incremented.

2. **Sale Prices**: The promotion is applied to the subtotal AFTER sale prices are already considered. So if an item has a sale price, the promotion applies to that sale price, not the original price.

3. **Multiple Items**: The promotion applies to the entire cart total, not per item.

4. **Error Handling**: If the promotion code is invalid, expired, or doesn't meet requirements, the calculation proceeds without the discount (no error thrown).

5. **Currency**: All amounts are in the specified currency. The promotion code doesn't have its own currency field.

## Database Schema

```sql
CREATE TABLE promotion_codes (
  promotion_id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL,        -- 'percentage' or 'fixed_amount'
  discount_value REAL NOT NULL,        -- 20 for 20%, or 10.00 for $10
  min_purchase_amount REAL,           -- Minimum cart total required
  max_discount_amount REAL,           -- Max discount cap (for percentage)
  valid_from TEXT NOT NULL,           -- ISO date string
  valid_to TEXT NOT NULL,             -- ISO date string
  usage_limit INTEGER,                -- NULL = unlimited
  usage_count INTEGER DEFAULT 0,      -- Current usage count
  status TEXT DEFAULT 'active',       -- 'active', 'inactive', 'expired'
  applicable_skus TEXT,                -- JSON array or NULL
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT
);
```

## Admin Operations

- **Create**: `POST /api/v1/promotion-codes` (admin only)
- **List**: `GET /api/v1/promotion-codes?status=active&page=1&limit=20` (admin only)
- **Get**: `GET /api/v1/promotion-codes/:promotion_id` (admin only)
- **Update**: `PUT /api/v1/promotion-codes/:promotion_id` (admin only)
- **Delete**: `DELETE /api/v1/promotion-codes/:promotion_id` (admin only - soft delete)
