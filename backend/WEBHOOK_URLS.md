# Webhook URLs for PayPal Dashboard Configuration

## PayPal Webhook URL (Primary - Configure in PayPal Dashboard)

This is the **ONLY URL** you need to configure in the PayPal Developer Dashboard:

```
https://w2-payment-worker.vg-firmly.workers.dev/api/v1/webhooks/paypal
```

**Event Types to Select:**
- Payment capture completed
- Payment capture denied
- Payment capture declined
- Payment order cancelled
- Payment order created
- Checkout order approved
- Checkout order completed
- Checkout order cancelled

---

## Internal Worker Webhook URLs (For Reference Only)

These URLs are used internally by the Payment Worker to notify other workers. **You do NOT need to configure these in PayPal Dashboard.** They are listed here for reference and testing purposes.

### Checkout Worker Webhook
**Receives payment status updates from Payment Worker**

```
https://w2-checkout-worker.vg-firmly.workers.dev/api/v1/webhooks/payment-status
```

**Purpose:** Updates checkout session payment status when payment is captured/denied/cancelled

**Called by:** Payment Worker (automatically)

---

### Inventory Worker Webhook
**Receives payment status and order items from Payment Worker**

```
https://w2-inventory-worker.vg-firmly.workers.dev/api/v1/webhooks/payment-status
```

**Purpose:** Deducts stock quantities when payment is successfully captured

**Called by:** Payment Worker (automatically)

---

### Fulfillment Worker Webhook
**Receives order data from Payment Worker**

```
https://w2-fullfillment-worker.vg-firmly.workers.dev/api/v1/webhooks/fulfillment
```

**Purpose:** Creates order/fulfillment record when payment is successfully captured

**Called by:** Payment Worker (automatically)

---

## Complete Webhook Flow

```
PayPal
  ↓ (webhook)
Payment Worker (https://w2-payment-worker.vg-firmly.workers.dev/api/v1/webhooks/paypal)
  ↓ (internal webhooks)
  ├─→ Checkout Worker (https://w2-checkout-worker.vg-firmly.workers.dev/api/v1/webhooks/payment-status)
  ├─→ Inventory Worker (https://w2-inventory-worker.vg-firmly.workers.dev/api/v1/webhooks/payment-status)
  └─→ Fulfillment Worker (https://w2-fullfillment-worker.vg-firmly.workers.dev/api/v1/webhooks/fulfillment)
```

---

## PayPal Dashboard Configuration Steps

1. **Go to PayPal Developer Dashboard**
   - Navigate to: https://developer.paypal.com/
   - Log in with your PayPal account

2. **Select Your App**
   - Click on your app (or create a new app)
   - Go to the **Webhooks** tab

3. **Add Webhook**
   - Click **Add Webhook** button
   - Enter webhook URL:
     ```
     https://w2-payment-worker.vg-firmly.workers.dev/api/v1/webhooks/paypal
     ```

4. **Select Event Types**
   - Under **Payments & Payouts** section:
     - ☑ Payment capture completed
     - ☑ Payment capture denied
     - ☑ Payment capture declined
     - ☑ Payment order cancelled
     - ☑ Payment order created
   
   - Under **Checkout** section (if available):
     - ☑ Checkout order approved
     - ☑ Checkout order completed
     - ☑ Checkout order cancelled

5. **Save Webhook**
   - Click **Save**
   - PayPal will send a test webhook to verify the URL

6. **Verify Webhook**
   - Check Payment Worker logs:
     ```bash
     wrangler tail payment-worker
     ```
   - You should see webhook events being received

---

## Testing Webhook URLs

### Test PayPal Webhook (Payment Worker)
```bash
curl -X POST https://w2-payment-worker.vg-firmly.workers.dev/api/v1/webhooks/paypal \
  -H "Content-Type: application/json" \
  -H "PAYPAL-TRANSMISSION-ID: test-id" \
  -d '{
    "id": "test-webhook-id",
    "event_type": "PAYMENT.CAPTURE.COMPLETED",
    "resource": {
      "id": "test-capture-id",
      "status": "COMPLETED",
      "supplementary_data": {
        "related_ids": {
          "order_id": "test-order-id"
        }
      }
    }
  }'
```

### Test Checkout Worker Webhook
```bash
curl -X POST https://w2-checkout-worker.vg-firmly.workers.dev/api/v1/webhooks/payment-status \
  -H "Content-Type: application/json" \
  -d '{
    "checkout_session_id": "test-session-id",
    "payment_id": "test-payment-id",
    "payment_status": "captured",
    "payment_data": {
      "paypal_order_id": "test-order-id",
      "amount": 100.00,
      "currency": "USD"
    }
  }'
```

### Test Inventory Worker Webhook
```bash
curl -X POST https://w2-inventory-worker.vg-firmly.workers.dev/api/v1/webhooks/payment-status \
  -H "Content-Type: application/json" \
  -d '{
    "payment_id": "test-payment-id",
    "payment_status": "captured",
    "checkout_session_id": "test-session-id",
    "order_items": [
      {
        "sku_id": "test-sku-id",
        "product_id": "test-product-id",
        "quantity": 2,
        "unit_price": 50.00,
        "subtotal": 100.00
      }
    ]
  }'
```

### Test Fulfillment Worker Webhook
```bash
curl -X POST https://w2-fullfillment-worker.vg-firmly.workers.dev/api/v1/webhooks/fulfillment \
  -H "Content-Type: application/json" \
  -d '{
    "checkout_session_id": "test-session-id",
    "payment_id": "test-payment-id",
    "user_id": "test-user-id",
    "order_data": {
      "items": [
        {
          "sku_id": "test-sku-id",
          "product_id": "test-product-id",
          "quantity": 2,
          "unit_price": 50.00,
          "subtotal": 100.00
        }
      ],
      "subtotal": 100.00,
      "shipping_cost": 10.00,
      "tax": 18.00,
      "total": 128.00,
      "currency": "USD"
    }
  }'
```

---

## Important Notes

1. **Only PayPal Webhook URL is Public**
   - Only the Payment Worker webhook URL needs to be configured in PayPal Dashboard
   - All other webhook URLs are internal and called automatically by the Payment Worker

2. **HTTPS Required**
   - All webhook URLs must use HTTPS
   - PayPal requires HTTPS for webhook delivery

3. **Webhook Verification**
   - PayPal sends webhook signature headers for verification
   - Payment Worker verifies webhook authenticity (basic verification implemented)

4. **Error Handling**
   - All webhook handlers return 200 OK even on errors
   - This prevents PayPal from retrying failed webhooks
   - Errors are logged for debugging

5. **Idempotency**
   - All webhook handlers check for duplicate processing
   - Payment status is checked before updating to prevent duplicate operations

---

## Worker Base URLs (For Reference)

| Worker | Base URL |
|--------|----------|
| Payment Worker | `https://w2-payment-worker.vg-firmly.workers.dev` |
| Checkout Worker | `https://w2-checkout-worker.vg-firmly.workers.dev` |
| Inventory Worker | `https://w2-inventory-worker.vg-firmly.workers.dev` |
| Fulfillment Worker | `https://w2-fullfillment-worker.vg-firmly.workers.dev` |

---

## Quick Copy-Paste URLs

### For PayPal Dashboard:
```
https://w2-payment-worker.vg-firmly.workers.dev/api/v1/webhooks/paypal
```

### For Testing (Internal):
- Checkout: `https://w2-checkout-worker.vg-firmly.workers.dev/api/v1/webhooks/payment-status`
- Inventory: `https://w2-inventory-worker.vg-firmly.workers.dev/api/v1/webhooks/payment-status`
- Fulfillment: `https://w2-fullfillment-worker.vg-firmly.workers.dev/api/v1/webhooks/fulfillment`

