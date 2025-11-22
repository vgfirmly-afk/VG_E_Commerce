# Webhook Setup Guide - Complete Configuration

This guide provides step-by-step instructions for setting up webhooks across all workers in the e-commerce microservices architecture.

## Overview

The webhook system enables real-time updates across workers when payment status changes:

1. **Payment Worker** receives PayPal webhooks
2. **Payment Worker** calls webhooks to:
   - **Checkout Worker** - Updates checkout session payment status
   - **Inventory Worker** - Deducts stock when payment is captured
   - **Fulfillment Worker** - Creates order/fulfillment when payment is captured

## Architecture Flow

```
PayPal Webhook
    ↓
Payment Worker (receives webhook)
    ↓
    ├─→ Checkout Worker (update payment status)
    ├─→ Inventory Worker (deduct stock)
    └─→ Fulfillment Worker (create order)
```

## Step-by-Step Setup

### Step 1: Database Migrations

#### Checkout Worker
Apply migration to add payment fields:

```bash
cd backend/Checkout_Worker
wrangler d1 execute checkout_db --local --file=./migrations/002-add-payment-fields.sql
wrangler d1 execute checkout_db --remote --file=./migrations/002-add-payment-fields.sql
```

### Step 2: Service Bindings Configuration

#### Payment Worker (`wrangler.toml`)
Already configured with:
- `CHECKOUT_WORKER`
- `INVENTORY_WORKER`
- `FULFILLMENT_WORKER`

#### Checkout Worker (`wrangler.toml`)
No additional bindings needed (receives webhooks from Payment Worker)

#### Inventory Worker (`wrangler.toml`)
No additional bindings needed (receives webhooks from Payment Worker)

#### Fulfillment Worker (`wrangler.toml`)
Already configured with:
- `CHECKOUT_WORKER`
- `CATALOG_WORKER`

### Step 3: Frontend URLs Configuration

#### Payment Worker (`wrangler.toml`)

Add frontend URLs to `[vars]` section:

```toml
[vars]
FRONTEND_SUCCESS_URL = "https://your-frontend-domain.com/payment/success"
FRONTEND_FAILURE_URL = "https://your-frontend-domain.com/payment/failure"
```

**For local development:**
```toml
FRONTEND_SUCCESS_URL = "http://localhost:5173/payment/success"
FRONTEND_FAILURE_URL = "http://localhost:5173/payment/failure"
```

**Note:** Success and failure URLs automatically include `checkout_session_id` and `payment_id` as query parameters:
- Success: `?checkout_session_id=xxx&payment_id=yyy`
- Failure: `?checkout_session_id=xxx&payment_id=yyy`

### Step 4: PayPal Webhook Configuration

#### 4.1 Configure PayPal Webhook URL

1. Log in to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Navigate to your app
3. Go to **Webhooks** section
4. Click **Add Webhook**
5. Enter webhook URL:
   ```
   https://w2-payment-worker.vg-firmly.workers.dev/api/v1/webhooks/paypal
   ```
6. Select event types:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `CHECKOUT.ORDER.APPROVED`
   - `CHECKOUT.ORDER.COMPLETED`
   - `CHECKOUT.ORDER.CANCELLED`
7. Save webhook configuration

#### 4.2 For Local Development (using ngrok)

1. Start ngrok:
   ```bash
   ngrok http 8787
   ```

2. Use ngrok URL in PayPal webhook:
   ```
   https://your-ngrok-url.ngrok.io/api/v1/webhooks/paypal
   ```

3. Update `wrangler.toml` if needed for local testing

### Step 5: Deploy All Workers

Deploy all workers to ensure service bindings are active:

```bash
# Payment Worker
cd backend/Payment_worker
wrangler publish

# Checkout Worker
cd backend/Checkout_Worker
wrangler publish

# Inventory Worker
cd backend/Invertory_Worker
wrangler publish

# Fulfillment Worker
cd backend/Fullfilment_Worker
wrangler publish
```

### Step 6: Verify Webhook Endpoints

Test each webhook endpoint:

#### Checkout Worker Webhook
```bash
curl -X POST https://w2-checkout-worker.vg-firmly.workers.dev/api/v1/webhooks/payment-status \
  -H "Content-Type: application/json" \
  -H "X-Source: payment-worker" \
  -d '{
    "checkout_session_id": "test-session-id",
    "payment_id": "test-payment-id",
    "payment_status": "captured",
    "payment_data": {
      "amount": 100.00,
      "currency": "USD"
    }
  }'
```

#### Inventory Worker Webhook
```bash
curl -X POST https://w2-inventory-worker.vg-firmly.workers.dev/api/v1/webhooks/payment-status \
  -H "Content-Type: application/json" \
  -H "X-Source: payment-worker" \
  -d '{
    "payment_id": "test-payment-id",
    "payment_status": "captured",
    "order_items": [
      {
        "sku_id": "test-sku-id",
        "quantity": 2,
        "order_id": "test-order-id"
      }
    ]
  }'
```

#### Fulfillment Worker Webhook
```bash
curl -X POST https://w2-fullfillment-worker.vg-firmly.workers.dev/api/v1/webhooks/fulfillment \
  -H "Content-Type: application/json" \
  -H "X-Source: payment-worker" \
  -d '{
    "checkout_session_id": "test-session-id",
    "payment_id": "test-payment-id",
    "user_id": "user-123",
    "order_data": {
      "items": [
        {
          "sku_id": "test-sku-id",
          "quantity": 2,
          "unit_price": 50.00,
          "subtotal": 100.00
        }
      ],
      "subtotal": 100.00,
      "shipping_cost": 5.00,
      "tax": 18.00,
      "total": 123.00,
      "currency": "USD"
    }
  }'
```

## Webhook Endpoints Summary

### Payment Worker
- **Receives:** `POST /api/v1/webhooks/paypal` (from PayPal)
- **Calls:**
  - Checkout Worker: `POST /api/v1/webhooks/payment-status`
  - Inventory Worker: `POST /api/v1/webhooks/payment-status`
  - Fulfillment Worker: `POST /api/v1/webhooks/fulfillment`

### Checkout Worker
- **Receives:** `POST /api/v1/webhooks/payment-status` (from Payment Worker)
- **Action:** Updates checkout session payment status

### Inventory Worker
- **Receives:** `POST /api/v1/webhooks/payment-status` (from Payment Worker)
- **Action:** Deducts stock when payment is captured

### Fulfillment Worker
- **Receives:** `POST /api/v1/webhooks/fulfillment` (from Payment Worker)
- **Action:** Creates order/fulfillment record

## Webhook Payloads

### Payment Worker → Checkout Worker
```json
{
  "checkout_session_id": "session-uuid",
  "payment_id": "payment-uuid",
  "payment_status": "captured|failed|cancelled",
  "payment_data": {
    "paypal_order_id": "paypal-order-id",
    "paypal_transaction_id": "transaction-id",
    "amount": 100.00,
    "currency": "USD",
    "captured_at": "2024-12-01T10:00:00Z"
  }
}
```

### Payment Worker → Inventory Worker
```json
{
  "payment_id": "payment-uuid",
  "payment_status": "captured",
  "order_items": [
    {
      "sku_id": "sku-uuid",
      "quantity": 2,
      "order_id": "order-uuid"
    }
  ]
}
```

### Payment Worker → Fulfillment Worker
```json
{
  "checkout_session_id": "session-uuid",
  "payment_id": "payment-uuid",
  "user_id": "user-uuid",
  "guest_session_id": null,
  "order_data": {
    "delivery_address": { ... },
    "billing_address": { ... },
    "shipping_method": { ... },
    "items": [
      {
        "sku_id": "sku-uuid",
        "product_id": "product-uuid",
        "quantity": 2,
        "unit_price": 50.00,
        "subtotal": 100.00
      }
    ],
    "subtotal": 100.00,
    "shipping_cost": 5.00,
    "tax": 18.00,
    "total": 123.00,
    "currency": "USD",
    "estimated_delivery_date": "2024-12-25"
  }
}
```

## Frontend Integration

### Success URL Parameters
When payment succeeds, frontend receives:
```
https://your-frontend.com/payment/success?checkout_session_id=xxx&payment_id=yyy
```

### Failure URL Parameters
When payment fails, frontend receives:
```
https://your-frontend.com/payment/failure?checkout_session_id=xxx&payment_id=yyy
```

### Frontend Implementation Example

```javascript
// Get parameters from URL
const urlParams = new URLSearchParams(window.location.search);
const checkoutSessionId = urlParams.get('checkout_session_id');
const paymentId = urlParams.get('payment_id');

// Verify payment status
async function verifyPayment() {
  const response = await fetch(
    `https://w2-payment-worker.vg-firmly.workers.dev/api/v1/payments/${paymentId}`
  );
  const payment = await response.json();
  
  if (payment.status === 'captured') {
    // Payment successful - redirect to order confirmation
    window.location.href = `/orders/${checkoutSessionId}`;
  } else {
    // Payment failed - show error
    showError('Payment failed. Please try again.');
  }
}
```

## Workflow Verification

### Complete Payment Flow

1. **User completes checkout** → Checkout session created
2. **User initiates payment** → Payment intent created in Payment Worker
3. **User approves payment** → PayPal redirects to success/failure URL
4. **PayPal sends webhook** → Payment Worker receives webhook
5. **Payment Worker processes webhook:**
   - Updates payment status
   - Calls Checkout Worker webhook (updates session status)
   - Calls Inventory Worker webhook (deducts stock)
   - Calls Fulfillment Worker webhook (creates order)
6. **Frontend verifies payment** → Shows success/failure page

## Troubleshooting

### Webhook Not Received

1. **Check PayPal webhook configuration:**
   - Verify webhook URL is correct
   - Check event types are selected
   - Review PayPal webhook logs

2. **Check Payment Worker logs:**
   ```bash
   wrangler tail payment-worker
   ```

3. **Verify service bindings:**
   - Ensure all workers are deployed
   - Check `wrangler.toml` service bindings

### Webhook Call Failed

1. **Check target worker logs:**
   ```bash
   wrangler tail checkout-worker
   wrangler tail inventory-worker
   wrangler tail fulfillment-worker
   ```

2. **Verify webhook endpoint exists:**
   - Check router has webhook route
   - Verify handler is exported

3. **Check service binding availability:**
   - Ensure service bindings are configured
   - Verify worker names match in `wrangler.toml`

### Stock Not Deducted

1. **Check Inventory Worker webhook:**
   - Verify webhook was called
   - Check webhook payload has `order_items`
   - Verify `payment_status` is `captured`

2. **Check stock availability:**
   - Verify SKU exists in inventory
   - Check available quantity is sufficient

### Order Not Created

1. **Check Fulfillment Worker webhook:**
   - Verify webhook was called
   - Check webhook payload structure
   - Verify checkout session exists

2. **Check database:**
   - Verify Fulfillment Worker database is accessible
   - Check migration was applied

## Security Considerations

1. **Webhook Verification:**
   - PayPal webhooks are verified by signature (implemented in Payment Worker)
   - Internal webhooks use service bindings (secure by default)

2. **Service Bindings:**
   - Service bindings are internal and secure
   - No external HTTP calls between workers
   - No authentication tokens needed

3. **Frontend URLs:**
   - Store in environment variables
   - Never hardcode in source code
   - Use HTTPS in production

## Testing Checklist

- [ ] PayPal webhook configured and receiving events
- [ ] Payment Worker webhook handler processes events
- [ ] Checkout Worker receives payment status updates
- [ ] Inventory Worker deducts stock on payment capture
- [ ] Fulfillment Worker creates orders on payment capture
- [ ] Frontend URLs include checkout_session_id
- [ ] Success page displays correct order information
- [ ] Failure page handles errors gracefully
- [ ] Stock reservations released on payment failure
- [ ] All service bindings are active

## Monitoring

### Key Metrics to Monitor

1. **Webhook Success Rate:**
   - Payment Worker → Checkout Worker
   - Payment Worker → Inventory Worker
   - Payment Worker → Fulfillment Worker

2. **Payment Status Updates:**
   - Checkout session status changes
   - Stock deduction success rate
   - Order creation success rate

3. **Error Rates:**
   - Webhook call failures
   - Database update failures
   - Service binding errors

### Logging

All webhook calls are logged with:
- `webhook.checkout.notified`
- `webhook.inventory.notified`
- `webhook.fulfillment.notified`

Check logs using:
```bash
wrangler tail payment-worker --format=pretty
```

## Best Practices

1. **Idempotency:**
   - Webhooks should be idempotent
   - Check if action already performed before executing

2. **Error Handling:**
   - Always return 200 OK from webhook handlers
   - Log errors internally
   - Don't fail webhook on non-critical errors

3. **Retry Logic:**
   - PayPal automatically retries failed webhooks
   - Internal webhooks should handle retries gracefully

4. **Data Consistency:**
   - Use transactions where possible
   - Implement compensating actions for failures
   - Monitor for data inconsistencies

## Next Steps

1. Set up monitoring and alerting
2. Implement webhook retry logic
3. Add webhook signature verification for internal webhooks
4. Create admin dashboard for webhook status
5. Implement webhook replay mechanism for failed events

