# Inventory Worker - Complete Functionality Review

## Overview

The Inventory Worker is responsible for managing SKU stock quantities, reservations, and inventory history. It ensures atomic transactions when multiple users try to purchase the same product simultaneously.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Inventory Worker                         │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Routers    │→ │   Handlers   │→ │   Services   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│         │                  │                  │            │
│         └──────────────────┼──────────────────┘            │
│                            ↓                                │
│                    ┌──────────────┐                        │
│                    │  Database    │                        │
│                    │  (D1/SQLite)│                        │
│                    └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### 1. `sku_stock` Table
Stores current stock information for each SKU:
- `sku_id` (PRIMARY KEY)
- `product_id`
- `sku_code`
- `quantity` - Total stock quantity
- `reserved_quantity` - Stock reserved for carts/checkout
- `available_quantity` - Calculated: `quantity - reserved_quantity`
- `low_stock_threshold` - Alert threshold
- `status` - 'active', 'inactive', 'out_of_stock'
- Timestamps and audit fields

### 2. `stock_history` Table
Audit trail of all stock changes:
- `history_id` (PRIMARY KEY)
- `sku_id` (FOREIGN KEY)
- `change_type` - 'create', 'update', 'adjust', 'reserve', 'release', 'purchase'
- `quantity_before` / `quantity_after`
- `reserved_before` / `reserved_after`
- `adjustment_quantity` - Positive for increase, negative for decrease
- `reservation_id` - Links to reservation
- `reason` - Reason for change
- `changed_by` / `changed_at`

### 3. `stock_reservations` Table
Tracks reserved stock for carts/checkout:
- `reservation_id` (PRIMARY KEY)
- `sku_id` (FOREIGN KEY)
- `quantity` - Reserved quantity
- `status` - 'active', 'completed', 'expired', 'cancelled'
- `expires_at` - Optional expiration time
- Timestamps

## API Endpoints

### Public Endpoints (No Authentication)

#### 1. GET `/api/v1/stock/:sku_id`
Get current stock for a single SKU.

**Response:**
```json
{
  "sku_id": "sku-123",
  "product_id": "prod-123",
  "sku_code": "SKU-123",
  "quantity": 100,
  "reserved_quantity": 10,
  "available_quantity": 90,
  "low_stock_threshold": 20,
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### 2. GET `/api/v1/stock/:sku_id/history?page=1&limit=20`
Get stock history for a SKU with pagination.

**Response:**
```json
{
  "history": [
    {
      "history_id": "hist-123",
      "sku_id": "sku-123",
      "change_type": "adjust",
      "quantity_before": 100,
      "quantity_after": 90,
      "reserved_before": 10,
      "reserved_after": 10,
      "adjustment_quantity": -10,
      "reason": "Purchase completed",
      "changed_by": "user-123",
      "changed_at": "2024-01-01T12:00:00Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 50
}
```

#### 3. POST `/api/v1/stock/check`
Check stock availability for multiple SKUs.

**Request:**
```json
{
  "sku_ids": ["sku-123", "sku-456", "sku-789"]
}
```

**Response:**
```json
{
  "availability": {
    "sku-123": {
      "sku_id": "sku-123",
      "available_quantity": 90,
      "quantity": 100,
      "reserved_quantity": 10,
      "status": "active",
      "in_stock": true
    },
    "sku-456": {
      "sku_id": "sku-456",
      "available_quantity": 0,
      "quantity": 0,
      "reserved_quantity": 0,
      "status": "out_of_stock",
      "in_stock": false
    }
  }
}
```

### Admin Endpoints (JWT Required)

#### 4. POST `/api/v1/stock/:sku_id`
Initialize stock for a new SKU.
- **Service Binding**: Allowed (from Catalog Worker)
- **Admin JWT**: Allowed

**Request:**
```json
{
  "product_id": "prod-123",
  "sku_code": "SKU-123",
  "quantity": 100,
  "low_stock_threshold": 20,
  "reason": "Initial stock"
}
```

#### 5. PUT `/api/v1/stock/:sku_id`
Update stock (admin only - JWT required).

**Request:**
```json
{
  "quantity": 150,
  "reserved_quantity": 5,
  "low_stock_threshold": 25,
  "status": "active",
  "reason": "Stock replenished"
}
```

#### 6. POST `/api/v1/stock/:sku_id/adjust`
Adjust stock quantity (increase or decrease).
- Positive quantity = increase
- Negative quantity = decrease

**Request:**
```json
{
  "quantity": -10,
  "reason": "Purchase completed",
  "reservation_id": "res-123"
}
```

### User/Service Endpoints (For Cart Operations)

#### 7. POST `/api/v1/stock/:sku_id/reserve`
Reserve stock for cart/checkout.

**Request:**
```json
{
  "quantity": 2,
  "reservation_id": "cart-reservation-123",
  "expires_at": "2024-01-01T13:00:00Z"
}
```

**Response:**
```json
{
  "sku_id": "sku-123",
  "quantity": 100,
  "reserved_quantity": 12,
  "available_quantity": 88,
  "status": "active"
}
```

#### 8. POST `/api/v1/stock/:sku_id/release`
Release reserved stock (when cart abandoned or purchase fails).

**Request:**
```json
{
  "reservation_id": "cart-reservation-123",
  "quantity": 2
}
```

## Key Features

### 1. Atomic Transactions

All stock operations use ACID transactions via `env.INVENTORY_DB.batch()`:

```javascript
await env.INVENTORY_DB.batch([
  // Update stock
  env.INVENTORY_DB.prepare('UPDATE sku_stock ...'),
  // Create history
  env.INVENTORY_DB.prepare('INSERT INTO stock_history ...')
]);
```

### 2. Optimistic Locking

Prevents race conditions when multiple users purchase simultaneously:

```javascript
// Only update if quantity hasn't changed
UPDATE sku_stock 
SET quantity = ?, available_quantity = ?
WHERE sku_id = ? AND quantity = ?  // Optimistic lock
```

### 3. Stock Reservation System

**Flow:**
1. User adds item to cart → `POST /stock/:sku_id/reserve`
2. Stock is reserved (available_quantity decreases)
3. User completes purchase → `POST /stock/:sku_id/adjust` (negative quantity)
4. Reservation is completed
5. If cart abandoned → `POST /stock/:sku_id/release`

**Benefits:**
- Prevents overselling
- Tracks cart items
- Supports expiration (expires_at)
- Atomic operations

### 4. Concurrent Purchase Protection

When two users try to buy the last item:

```
User A: GET stock → available: 1
User B: GET stock → available: 1
User A: RESERVE 1 → Success (available: 0)
User B: RESERVE 1 → Fails (Insufficient available stock)
```

The `reserveStock` function uses:
- Transaction with optimistic locking
- WHERE clause: `available_quantity >= ?`
- Post-update verification

### 5. Stock History Tracking

Every change is logged:
- **create**: Initial stock creation
- **update**: Admin stock update
- **adjust**: Quantity adjustment (purchase/restock)
- **reserve**: Stock reserved for cart
- **release**: Reserved stock released
- **purchase**: Stock purchased (via adjust with negative quantity)

## Stock Calculation Logic

```
available_quantity = quantity - reserved_quantity

Status Logic:
- If quantity > 0 AND status != 'inactive' → 'active'
- If quantity = 0 → 'out_of_stock'
- If status = 'inactive' → 'inactive' (regardless of quantity)
```

## Workflow Examples

### Workflow 1: New SKU Creation

```
1. Catalog Worker creates SKU
2. Catalog Worker calls:
   POST /api/v1/stock/:sku_id (Service Binding)
   {
     "product_id": "prod-123",
     "sku_code": "SKU-123",
     "quantity": 0
   }
3. Inventory Worker creates stock record
4. Stock initialized with quantity = 0
```

### Workflow 2: User Purchase Flow

```
1. User adds item to cart
   → POST /api/v1/stock/:sku_id/reserve
   → quantity: 100, reserved: 10, available: 90

2. User checks out
   → POST /api/v1/stock/:sku_id/adjust
   → { "quantity": -2, "reservation_id": "res-123" }
   → quantity: 98, reserved: 8, available: 90

3. If user abandons cart
   → POST /api/v1/stock/:sku_id/release
   → { "reservation_id": "res-123" }
   → quantity: 100, reserved: 8, available: 92
```

### Workflow 3: Concurrent Purchase Protection

```
Time    User A                    User B                    Stock State
─────────────────────────────────────────────────────────────────────
T1      GET stock                 -                         qty: 1, avail: 1
T2      -                         GET stock                 qty: 1, avail: 1
T3      RESERVE 1                 -                         qty: 1, reserved: 1, avail: 0
T4      -                         RESERVE 1                 ❌ Fails: Insufficient stock
T5      ADJUST -1                 -                         qty: 0, reserved: 0, avail: 0
```

## Authentication

### Service Binding (Only for Initial Stock Creation)
- **Endpoint**: `POST /api/v1/stock/:sku_id`
- **Header**: `X-Source: catalog-worker-service-binding`
- **Purpose**: Allow Catalog Worker to initialize stock when SKU is created

### JWT Authentication (For All Other Admin Endpoints)
- **Endpoints**: PUT, POST /adjust
- **Header**: `Authorization: Bearer <JWT_TOKEN>`
- **Requirement**: User must have `role: 'admin'` in JWT payload
- **Config**: Requires `JWT_PUBLIC_KEY` secret

### User Operations (Reserve/Release)
- **Endpoints**: POST /reserve, POST /release
- **Header**: `X-User-Id: <user_id>` (optional)
- **Purpose**: For cart operations

## Error Handling

All endpoints have try-catch blocks:
- Validation errors → 400 Bad Request
- Not found → 404 Not Found
- Insufficient stock → 400 Bad Request (with specific message)
- Authentication errors → 401 Unauthorized
- Internal errors → 500 Internal Server Error

## Validation

All requests are validated using Joi schemas:
- SKU ID validation
- Quantity validation (must be integer, >= 0)
- Reservation ID validation
- Date validation (ISO format)

## Performance Optimizations

1. **Indexes**: On `sku_id`, `product_id`, `status`, `available_quantity`
2. **Batch Operations**: Multiple SQL statements in single transaction
3. **Optimistic Locking**: Prevents unnecessary retries
4. **Efficient Queries**: Uses IN clause for multiple SKU lookups

## Testing Scenarios

### Test 1: Concurrent Reservations
```bash
# Terminal 1
curl -X POST /api/v1/stock/sku-123/reserve \
  -d '{"quantity": 1, "reservation_id": "res-1"}'

# Terminal 2 (simultaneously)
curl -X POST /api/v1/stock/sku-123/reserve \
  -d '{"quantity": 1, "reservation_id": "res-2"}'

# Expected: Only one succeeds if available_quantity = 1
```

### Test 2: Stock Adjustment
```bash
# Increase stock
curl -X POST /api/v1/stock/sku-123/adjust \
  -H "Authorization: Bearer <JWT>" \
  -d '{"quantity": 10, "reason": "Restocked"}'

# Decrease stock (purchase)
curl -X POST /api/v1/stock/sku-123/adjust \
  -H "Authorization: Bearer <JWT>" \
  -d '{"quantity": -2, "reason": "Purchase", "reservation_id": "res-123"}'
```

## Summary

✅ **Complete Features:**
- Stock initialization
- Stock updates
- Stock adjustments (increase/decrease)
- Stock reservations (for carts)
- Stock releases (cart abandonment)
- Stock history tracking
- Multi-SKU availability checks
- Atomic transactions
- Optimistic locking for concurrent safety
- Comprehensive error handling
- Input validation

✅ **Security:**
- Service binding for initial stock creation only
- JWT authentication for admin operations
- Proper authorization checks

✅ **Data Integrity:**
- ACID transactions
- Optimistic locking
- Audit trail (stock_history)
- Reservation tracking

The Inventory Worker is production-ready with proper atomic transactions, error handling, and authentication!

