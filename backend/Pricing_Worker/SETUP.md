# Pricing Worker Setup Guide

## Overview
The Pricing Worker is a microservice responsible for managing SKU pricing, maintaining price history, and calculating totals. It communicates with the Catalog Worker via HTTP when SKUs are created.

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup

#### Create Local Database
```bash
wrangler d1 create pricing_db
```

#### Apply Migrations
```bash
# Local database
wrangler d1 execute pricing_db --local --file=./migrations/001-init.sql

# Remote database
wrangler d1 execute pricing_db --remote --file=./migrations/001-init.sql
```

### 3. Configuration

Update `wrangler.toml` with your database ID if different from the default.

### 4. Environment Variables & Security Configuration

The following environment variables can be set in `wrangler.toml` or as secrets:

#### Required for Inter-Worker Communication:
- `CATALOG_WORKER_URL` - Whitelisted Catalog Worker URL (e.g., `https://w2-catalog-worker.vg-firmly.workers.dev`)
  - Set in `wrangler.toml` under `[vars]`
  - The Pricing Worker will only accept requests from this whitelisted URL
- `PRICING_SERVICE_TOKEN` - Service token for inter-worker authentication (REQUIRED)
  - Set as a secret: `wrangler secret put PRICING_SERVICE_TOKEN`
  - Must match the token used by Catalog Worker
  - Example: `wrangler secret put PRICING_SERVICE_TOKEN` (you'll be prompted to enter the token)

#### Optional:
- `HONEYCOMB_API_KEY` - For OpenTelemetry tracing
- `HONEYCOMB_DATASET` - Honeycomb dataset name
- `PRICING_WORKER_URL` - Self-reference URL (set in Catalog Worker for inter-worker calls)
- `JWT_PUBLIC_KEY` - For JWT verification of regular admin requests (not inter-worker)

### 5. Security: Whitelisting Catalog Worker

The Pricing Worker implements security through:
1. **URL Whitelisting**: Only accepts requests from `CATALOG_WORKER_URL`
   - Validates `X-Source` header sent by Catalog Worker
   - Falls back to `Origin` or `Referer` headers
2. **Service Token**: Requires `PRICING_SERVICE_TOKEN` in Authorization header
   - Format: `Authorization: Bearer <PRICING_SERVICE_TOKEN>`

**Important**: Both Catalog Worker and Pricing Worker must share the same `PRICING_SERVICE_TOKEN` secret.

### 6. Configure Service Token (Required)

Both workers must share the same service token. Set it as a secret in both workers:

```bash
# In Pricing Worker directory
cd Pricing_Worker
wrangler secret put PRICING_SERVICE_TOKEN
# Enter your token when prompted

# In Catalog Worker directory  
cd Catalog_worker
wrangler secret put PRICING_SERVICE_TOKEN
# Enter the SAME token when prompted
```

### 7. Start Development Server
```bash
npm start
# Or
wrangler dev --local
```

The Pricing Worker will run on port 8788 by default.

## API Endpoints

### Public Endpoints

- `GET /api/v1/prices/:sku_id` - Get price for a SKU
- `GET /api/v1/prices/product/:product_id` - Get all prices for a product
- `POST /api/v1/calculate-total` - Calculate grand total from SKU IDs and quantities
- `GET /api/v1/prices/:sku_id/history` - Get price history for a SKU

### Admin/Service Endpoints

- `POST /api/v1/prices/:sku_id` - Initialize price (called by Catalog Worker)
- `PUT /api/v1/prices/:sku_id` - Update price (admin only)
- `DELETE /api/v1/prices/:sku_id` - Delete/deactivate price (admin only)

## Database Schema

### sku_prices
- `sku_id` (PRIMARY KEY)
- `product_id`
- `sku_code`
- `price` (REAL)
- `currency` (TEXT, default: 'USD')
- `sale_price` (REAL, nullable)
- `compare_at_price` (REAL, nullable)
- `cost_price` (REAL, nullable)
- `status` (active/inactive)
- `valid_from`, `valid_to`
- Timestamps and audit fields

### price_history
- `history_id` (PRIMARY KEY)
- `sku_id` (FOREIGN KEY)
- Price fields (same as sku_prices)
- `change_type` (create/update/delete)
- `reason`
- `changed_by`, `changed_at`

### promotion_codes
- `promotion_id` (PRIMARY KEY)
- `code` (UNIQUE)
- Discount configuration
- Validity dates
- Usage limits

## Inter-Worker Communication

When the Catalog Worker creates a SKU, it automatically calls the Pricing Worker to initialize the price:
- Endpoint: `POST /api/v1/prices/:sku_id`
- Default price: 0.00
- Default currency: USD

## Calculate Total Endpoint

Example request:
```json
POST /api/v1/calculate-total
{
  "items": [
    { "sku_id": "sku123", "quantity": 2 },
    { "sku_id": "sku456", "quantity": 1 }
  ],
  "promotion_code": "DISCOUNT10",
  "currency": "USD"
}
```

Response:
```json
{
  "items": [
    {
      "sku_id": "sku123",
      "sku_code": "SKU-...",
      "quantity": 2,
      "unit_price": 19.99,
      "original_price": 24.99,
      "sale_price": 19.99,
      "item_total": 39.98,
      "currency": "USD"
    }
  ],
  "subtotal": 59.97,
  "discount": 5.99,
  "promotion": {
    "code": "DISCOUNT10",
    "name": "10% Off",
    "discount_type": "percentage",
    "discount_value": 10
  },
  "total": 53.98,
  "currency": "USD"
}
```

