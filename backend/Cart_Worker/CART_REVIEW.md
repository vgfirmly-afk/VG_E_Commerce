# Cart Worker - Code Review & Fixes

## Overview
The Cart Worker manages shopping carts for both logged-in users and anonymous sessions. It integrates with Pricing Worker for prices and Inventory Worker for stock availability.

## Issues Found & Fixed

### ✅ 1. validateBody Middleware Issue (FIXED)
**Problem**: The `validateBody` middleware was receiving validation functions (`validateAddItem`, `validateUpdateQuantity`) instead of Joi schemas, causing `schema.validate is not a function` errors.

**Solution**: Removed `validateBody` middleware usage and implemented inline validation in route handlers, similar to Inventory_Worker fix.

**Files Changed**:
- `src/routers/cart.js` - Removed middleware, added inline validation
- `src/handlers/cartHandlers.js` - Updated to use `request.validatedBody`

### ✅ 2. Request Body Consumption (FIXED)
**Problem**: Handlers were calling `await request.json()` after middleware already consumed the body stream.

**Solution**: Handlers now use `request.validatedBody` which is set by the route handler after validation.

**Files Changed**:
- `src/handlers/cartHandlers.js` - `addItem()` and `updateQuantity()` now use `request.validatedBody`

### ✅ 3. Null Check in getCart (FIXED)
**Problem**: Missing null check after `getOrCreateCart()` call.

**Solution**: Added null check to prevent errors if cart creation fails.

**Files Changed**:
- `src/services/cartService.js` - Added null check in `getCart()`

## Architecture Review

### ✅ Database Schema
The schema is well-designed with:
- `carts` table for cart metadata
- `cart_items` table for items in carts
- `cart_history` table for audit trail
- Proper indexes for performance
- Foreign key constraints with CASCADE delete

### ✅ Service Bindings
Correctly configured in `wrangler.toml`:
- `PRICING_WORKER` - For getting prices
- `INVENTORY_WORKER` - For checking stock availability

### ✅ Integration Points

#### Pricing Worker Integration
- **Location**: `src/services/cartService.js::getPriceFromPricingWorker()`
- **Method**: Service binding fetch to `/api/v1/prices/:sku_id`
- **Status**: ✅ Working correctly
- **Note**: Uses `effective_price` or `price` field from response

#### Inventory Worker Integration
- **Location**: `src/services/cartService.js::checkStockFromInventoryWorker()`
- **Method**: Service binding fetch to `/api/v1/stock/:sku_id`
- **Status**: ✅ Working correctly
- **Note**: Checks `available_quantity` against requested quantity

## Recommendations for Improvement

### 🔄 1. Stock Reservation (RECOMMENDED)
**Current**: Cart checks stock availability but doesn't reserve it.

**Recommendation**: When adding items to cart, call Inventory Worker's reserve endpoint:
```javascript
// In addItem() function
const reserveRequest = new Request(`https://inventory-worker/api/v1/stock/${skuId}/reserve`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Source': 'cart-worker-service-binding',
    'X-User-Id': userId || sessionId
  },
  body: JSON.stringify({
    quantity: quantity,
    reservation_id: `cart-${cartId}-${skuId}`,
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
  })
});
```

**Benefits**:
- Prevents overselling when multiple users add same item
- Ensures stock is available at checkout
- Can release reservation if cart is abandoned

### 🔄 2. Enhanced Price Calculation (RECOMMENDED)
**Current**: `calculateTotal()` fetches individual prices and calculates manually.

**Recommendation**: Use Pricing Worker's `calculate-total` endpoint which supports:
- Promotion codes
- Bulk pricing
- Tax calculations
- Discounts

```javascript
// In calculateTotal() function
const calculateRequest = new Request(`https://pricing-worker/api/v1/calculate-total`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Source': 'cart-worker-service-binding'
  },
  body: JSON.stringify({
    items: items.map(item => ({
      sku_id: item.sku_id,
      quantity: item.quantity
    })),
    promotion_code: cart.promotion_code // If stored in cart
  })
});
```

### 🔄 3. Product ID and SKU Code Handling (RECOMMENDED)
**Current**: `addItem()` expects `product_id` and `sku_code` from request body, but validator only validates `sku_id` and `quantity`.

**Recommendation**: 
- Option A: Fetch from Catalog Worker when adding item
- Option B: Store in cart_items table when item is added (already done)
- Option C: Make `product_id` and `sku_code` optional and fetch if not provided

**Current Implementation**: The handler accepts these fields but they're optional. Consider adding validation or fetching logic.

### 🔄 4. Error Handling Improvements
**Current**: Basic error handling with generic messages.

**Recommendation**: 
- Add specific error codes (e.g., `INSUFFICIENT_STOCK`, `PRICE_FETCH_FAILED`)
- Return more detailed error messages
- Add retry logic for service binding calls

### 🔄 5. Cart Expiration & Cleanup
**Current**: Carts have `expires_at` field but no cleanup mechanism.

**Recommendation**: 
- Add scheduled task to mark expired carts as 'abandoned'
- Release reserved stock for abandoned carts
- Consider using Durable Objects or Cron Triggers for cleanup

### 🔄 6. Cart Merging for Logged-in Users
**Current**: When user logs in, existing anonymous cart is not merged.

**Recommendation**: 
- On login, merge anonymous cart (by session_id) with user's existing cart
- Combine items, update quantities
- Preserve cart history

## API Endpoints Review

### ✅ GET /api/v1/cart
- **Purpose**: Get or create cart for user/session
- **Status**: ✅ Working
- **Headers Required**: `X-User-Id` OR `X-Session-Id`
- **Note**: Creates cart if doesn't exist

### ✅ GET /api/v1/cart/:cart_id
- **Purpose**: Get cart by ID
- **Status**: ✅ Working
- **Returns**: Cart with items

### ✅ GET /api/v1/cart/:cart_id/total
- **Purpose**: Calculate cart total
- **Status**: ✅ Working
- **Note**: Fetches current prices from Pricing Worker

### ✅ POST /api/v1/cart/:cart_id/items
- **Purpose**: Add item to cart
- **Status**: ✅ Fixed (validation issue resolved)
- **Body**: `{ sku_id, quantity, product_id?, sku_code? }`
- **Checks**: Stock availability before adding
- **Note**: Updates quantity if item already exists

### ✅ PUT /api/v1/cart/:cart_id/items/:item_id
- **Purpose**: Update item quantity
- **Status**: ✅ Fixed (validation issue resolved)
- **Body**: `{ quantity }` (0 to remove)
- **Checks**: Stock availability if quantity > 0

### ✅ DELETE /api/v1/cart/:cart_id/items/:item_id
- **Purpose**: Remove item from cart
- **Status**: ✅ Working

### ✅ DELETE /api/v1/cart/:cart_id
- **Purpose**: Clear all items from cart
- **Status**: ✅ Working

## Testing Recommendations

1. **Unit Tests**: Test each service function with mocked dependencies
2. **Integration Tests**: Test with actual service bindings (staging environment)
3. **Load Tests**: Test concurrent cart operations
4. **Edge Cases**:
   - Adding item when stock becomes unavailable
   - Price changes while item is in cart
   - Cart expiration scenarios
   - Concurrent updates to same cart

## Security Considerations

1. ✅ **Cart Ownership**: Carts are tied to `user_id` or `session_id`
2. ⚠️ **Authorization**: No explicit authorization checks - relies on correct `user_id`/`session_id` headers
3. ⚠️ **Rate Limiting**: No rate limiting implemented
4. ✅ **Input Validation**: Joi validation in place (after fixes)

## Performance Considerations

1. ✅ **Database Indexes**: Proper indexes on foreign keys and lookup fields
2. ⚠️ **N+1 Queries**: `calculateTotal()` makes one request per item to Pricing Worker
3. 🔄 **Caching**: Consider caching prices for short duration
4. ✅ **Service Bindings**: Using service bindings (faster than HTTP)

## Summary

### Fixed Issues ✅
1. validateBody middleware usage
2. Request body consumption
3. Null check in getCart

### Working Well ✅
1. Database schema design
2. Service binding integration
3. Stock availability checking
4. Price fetching
5. Cart history logging

### Recommended Improvements 🔄
1. Stock reservation on add to cart
2. Use Pricing Worker's calculate-total endpoint
3. Better product_id/sku_code handling
4. Cart merging for logged-in users
5. Cart expiration cleanup
6. Enhanced error handling

## Next Steps

1. ✅ **Completed**: Fixed validation and request body issues
2. 🔄 **Recommended**: Implement stock reservation
3. 🔄 **Recommended**: Integrate with Pricing Worker's calculate-total endpoint
4. 🔄 **Optional**: Add cart merging logic
5. 🔄 **Optional**: Implement cart cleanup cron job

