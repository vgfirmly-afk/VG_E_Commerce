# Webhook Quick Reference

## Webhook Endpoints

### Payment Worker (Receives from PayPal)
- **Endpoint:** `POST /api/v1/webhooks/paypal`
- **Source:** PayPal
- **Events:** `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`, `CHECKOUT.ORDER.APPROVED`, `CHECKOUT.ORDER.COMPLETED`, `CHECKOUT.ORDER.CANCELLED`

### Checkout Worker (Receives from Payment Worker)
- **Endpoint:** `POST /api/v1/webhooks/payment-status`
- **Source:** Payment Worker
- **Action:** Updates checkout session payment status

### Inventory Worker (Receives from Payment Worker)
- **Endpoint:** `POST /api/v1/webhooks/payment-status`
- **Source:** Payment Worker
- **Action:** Deducts stock when payment is captured

### Fulfillment Worker (Receives from Payment Worker)
- **Endpoint:** `POST /api/v1/webhooks/fulfillment`
- **Source:** Payment Worker
- **Action:** Creates order/fulfillment record

## Configuration Checklist

### 1. Database Migrations
```bash
# Checkout Worker
cd backend/Checkout_Worker
wrangler d1 execute checkout_db --local --file=./migrations/002-add-payment-fields.sql
wrangler d1 execute checkout_db --remote --file=./migrations/002-add-payment-fields.sql
```

### 2. Frontend URLs (Payment Worker)
Add to `backend/Payment_worker/wrangler.toml`:
```toml
[vars]
FRONTEND_SUCCESS_URL = "https://your-frontend.com/payment/success"
FRONTEND_FAILURE_URL = "https://your-frontend.com/payment/failure"
```

### 3. PayPal Webhook URL
Configure in PayPal Dashboard:
```
https://w2-payment-worker.vg-firmly.workers.dev/api/v1/webhooks/paypal
```

### 4. Service Bindings
All service bindings are already configured in `wrangler.toml` files.

## Webhook Payload Examples

### Payment → Checkout
```json
{
  "checkout_session_id": "session-uuid",
  "payment_id": "payment-uuid",
  "payment_status": "captured",
  "payment_data": { ... }
}
```

### Payment → Inventory
```json
{
  "payment_id": "payment-uuid",
  "payment_status": "captured",
  "order_items": [
    { "sku_id": "sku-uuid", "quantity": 2, "order_id": "order-uuid" }
  ]
}
```

### Payment → Fulfillment
```json
{
  "checkout_session_id": "session-uuid",
  "payment_id": "payment-uuid",
  "user_id": "user-uuid",
  "order_data": { ... }
}
```

## Frontend URL Parameters

**Success URL:**
```
https://your-frontend.com/payment/success?checkout_session_id=xxx&token=yyy
```

**Failure URL:**
```
https://your-frontend.com/payment/failure?checkout_session_id=xxx&token=yyy
```

- `checkout_session_id`: Checkout session ID
- `token`: PayPal order ID (added by PayPal)

## Testing Commands

```bash
# Test Checkout Worker webhook
curl -X POST https://w2-checkout-worker.vg-firmly.workers.dev/api/v1/webhooks/payment-status \
  -H "Content-Type: application/json" \
  -d '{"checkout_session_id":"test","payment_id":"test","payment_status":"captured"}'

# Test Inventory Worker webhook
curl -X POST https://w2-inventory-worker.vg-firmly.workers.dev/api/v1/webhooks/payment-status \
  -H "Content-Type: application/json" \
  -d '{"payment_id":"test","payment_status":"captured","order_items":[{"sku_id":"test","quantity":1}]}'

# Test Fulfillment Worker webhook
curl -X POST https://w2-fullfillment-worker.vg-firmly.workers.dev/api/v1/webhooks/fulfillment \
  -H "Content-Type: application/json" \
  -d '{"checkout_session_id":"test","payment_id":"test","order_data":{"items":[],"subtotal":0,"total":0}}'
```

