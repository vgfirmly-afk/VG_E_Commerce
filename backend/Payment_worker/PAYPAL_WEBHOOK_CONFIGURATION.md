# PayPal Webhook Configuration Guide

## Required PayPal Webhook Event Types

When configuring the PayPal webhook in the PayPal Developer Dashboard, select the following event types:

### Primary Events (Required)

1. **Payment capture completed**
   - Event Type: `PAYMENT.CAPTURE.COMPLETED`
   - **Purpose:** Triggered when payment is successfully captured
   - **Action:** Updates payment status, notifies Checkout/Inventory/Fulfillment workers

2. **Payment capture denied**
   - Event Type: `PAYMENT.CAPTURE.DENIED`
   - **Purpose:** Triggered when payment capture is denied
   - **Action:** Updates payment status, notifies Checkout Worker to release stock

3. **Payment capture declined**
   - Event Type: `PAYMENT.CAPTURE.DECLINED`
   - **Purpose:** Triggered when payment capture is declined
   - **Action:** Same as DENIED - updates payment status, releases stock

4. **Payment order cancelled**
   - Event Type: `PAYMENT.ORDER.CANCELLED`
   - **Purpose:** Triggered when payment order is cancelled
   - **Action:** Updates payment status to cancelled, releases stock

5. **Payment order created**
   - Event Type: `PAYMENT.ORDER.CREATED`
   - **Purpose:** Triggered when payment order is created
   - **Action:** Updates payment status to created (optional, for tracking)

### Checkout Events (Recommended)

6. **Checkout order approved**
   - Event Type: `CHECKOUT.ORDER.APPROVED`
   - **Purpose:** Triggered when user approves the order on PayPal
   - **Action:** Updates payment status to approved

7. **Checkout order completed**
   - Event Type: `CHECKOUT.ORDER.COMPLETED`
   - **Purpose:** Triggered when checkout order is completed
   - **Action:** Updates payment status to captured, triggers all webhooks

8. **Checkout order cancelled**
   - Event Type: `CHECKOUT.ORDER.CANCELLED`
   - **Purpose:** Triggered when checkout order is cancelled
   - **Action:** Updates payment status to cancelled, releases stock

## Webhook URL

**Copy this exact URL to configure in PayPal Dashboard:**

```
https://w2-payment-worker.vg-firmly.workers.dev/api/v1/webhooks/paypal
```

**Note:** This is the ONLY URL you need to configure in PayPal Dashboard. All other worker webhooks are called internally by the Payment Worker.

## Configuration Steps

### Step 1: Access PayPal Developer Dashboard

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Log in with your PayPal account
3. Navigate to your app (or create a new app)

### Step 2: Configure Webhook

1. Click on your app name
2. Go to **Webhooks** tab
3. Click **Add Webhook** button
4. Enter webhook URL:
   ```
   https://w2-payment-worker.vg-firmly.workers.dev/api/v1/webhooks/paypal
   ```
5. Select the following event types (check the boxes):

   **Under "Payments & Payouts" section:**
   - ☑ Payment capture completed
   - ☑ Payment capture denied
   - ☑ Payment capture declined
   - ☑ Payment order cancelled
   - ☑ Payment order created

   **Under "Checkout" section (if available):**
   - ☑ Checkout order approved
   - ☑ Checkout order completed
   - ☑ Checkout order declined
   - ☑ Checkout order saved (optional - for tracking)
   - ☑ Checkout order voided (optional - for tracking)

6. Click **Save**

### Step 3: Verify Webhook

1. After saving, PayPal will send a test webhook
2. Check Payment Worker logs:
   ```bash
   wrangler tail payment-worker
   ```
3. Verify webhook is received and processed

## Event Type Mapping

| PayPal Event Type           | Handler Function                | Payment Status                   | Actions                               |
| --------------------------- | ------------------------------- | -------------------------------- | ------------------------------------- |
| `PAYMENT.CAPTURE.COMPLETED` | `handlePaymentCaptureCompleted` | `captured`                       | Updates payment, notifies all workers |
| `PAYMENT.CAPTURE.DENIED`    | `handlePaymentCaptureDenied`    | `approved` (with failure reason) | Updates payment, notifies Checkout    |
| `PAYMENT.CAPTURE.DECLINED`  | `handlePaymentCaptureDenied`    | `approved` (with failure reason) | Updates payment, notifies Checkout    |
| `PAYMENT.ORDER.CANCELLED`   | `handleOrderCancelled`          | `cancelled`                      | Updates payment, notifies Checkout    |
| `PAYMENT.ORDER.CREATED`     | `handleOrderCreated`            | `created`                        | Updates payment (optional)            |
| `CHECKOUT.ORDER.APPROVED`   | `handleOrderApproved`           | `approved`                       | Updates payment status                |
| `CHECKOUT.ORDER.COMPLETED`  | `handleOrderCompleted`          | `captured`                       | Updates payment, notifies all workers |
| `CHECKOUT.ORDER.DECLINED`   | `handleOrderCancelled`          | `cancelled`                      | Updates payment, notifies Checkout    |
| `CHECKOUT.ORDER.SAVED`      | (logs only)                     | -                                | Logs event, no action needed          |
| `CHECKOUT.ORDER.VOIDED`     | `handleOrderCancelled`          | `cancelled`                      | Updates payment, notifies Checkout    |

## Webhook Payload Structure

### PAYMENT.CAPTURE.COMPLETED

```json
{
  "id": "webhook-event-id",
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "resource": {
    "id": "capture-id",
    "status": "COMPLETED",
    "supplementary_data": {
      "related_ids": {
        "order_id": "paypal-order-id"
      }
    },
    "purchase_units": [
      {
        "payments": {
          "captures": [
            {
              "id": "capture-id",
              "amount": {
                "value": "100.00",
                "currency_code": "USD"
              }
            }
          ]
        }
      }
    ],
    "payer": {
      "email_address": "buyer@example.com",
      "name": {
        "given_name": "John",
        "surname": "Doe"
      }
    }
  }
}
```

### PAYMENT.CAPTURE.DENIED

```json
{
  "id": "webhook-event-id",
  "event_type": "PAYMENT.CAPTURE.DENIED",
  "resource": {
    "id": "capture-id",
    "status": "DENIED",
    "reason_code": "INSTRUMENT_DECLINED",
    "reason_description": "The instrument presented was either declined by the processor or bank, or it can't be used for this payment.",
    "supplementary_data": {
      "related_ids": {
        "order_id": "paypal-order-id"
      }
    }
  }
}
```

### CHECKOUT.ORDER.COMPLETED

```json
{
  "id": "webhook-event-id",
  "event_type": "CHECKOUT.ORDER.COMPLETED",
  "resource": {
    "id": "paypal-order-id",
    "status": "COMPLETED",
    "purchase_units": [
      {
        "payments": {
          "captures": [
            {
              "id": "capture-id",
              "status": "COMPLETED",
              "amount": {
                "value": "100.00",
                "currency_code": "USD"
              }
            }
          ]
        }
      }
    ],
    "payer": {
      "email_address": "buyer@example.com",
      "name": {
        "given_name": "John",
        "surname": "Doe"
      }
    }
  }
}
```

## Testing Webhooks

### Using PayPal Sandbox

1. Use PayPal Sandbox test accounts
2. Create a test payment
3. Check webhook logs in PayPal Dashboard
4. Verify webhook is received by Payment Worker

### Manual Testing

You can test webhooks manually using curl:

```bash
curl -X POST https://w2-payment-worker.vg-firmly.workers.dev/api/v1/webhooks/paypal \
  -H "Content-Type: application/json" \
  -H "PAYPAL-TRANSMISSION-ID: test-transmission-id" \
  -H "PAYPAL-TRANSMISSION-SIG: test-signature" \
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
      },
      "purchase_units": [{
        "payments": {
          "captures": [{
            "id": "test-capture-id",
            "amount": {
              "value": "100.00",
              "currency_code": "USD"
            }
          }]
        }
      }]
    }
  }'
```

## Important Notes

1. **Always return 200 OK:** Webhook handlers must return 200 OK even on errors to prevent PayPal from retrying
2. **Idempotency:** Webhook handlers check payment status before updating to prevent duplicate processing
3. **Non-blocking calls:** Webhook calls to other workers are non-blocking (using `.catch()`)
4. **Error handling:** All errors are logged but don't fail the webhook
5. **Signature verification:** Currently basic verification is implemented; full signature verification should be added for production

## Troubleshooting

### Webhook Not Received

1. **Check webhook URL:**
   - Must be publicly accessible HTTPS URL
   - No authentication required
   - Must return 200 OK

2. **Check PayPal Dashboard:**
   - Verify webhook is configured
   - Check webhook delivery logs
   - Verify event types are selected

3. **Check Payment Worker:**
   - Verify worker is deployed
   - Check worker logs: `wrangler tail payment-worker`
   - Verify endpoint exists: `POST /api/v1/webhooks/paypal`

### Webhook Received But Not Processed

1. **Check payment exists:**
   - Webhook requires payment record with matching PayPal order ID
   - Payment must be created before webhook is received

2. **Check event type:**
   - Verify event type is in the switch statement
   - Check logs for "webhook.event.ignored" messages

3. **Check error logs:**
   - Review error logs for processing failures
   - Verify database connections
   - Check service bindings are active

## Production Checklist

- [ ] Webhook URL is HTTPS
- [ ] All required event types are selected
- [ ] Webhook signature verification is implemented
- [ ] Error handling and logging is in place
- [ ] Monitoring and alerting is configured
- [ ] Webhook retry mechanism is tested
- [ ] Idempotency checks are working
- [ ] All service bindings are configured
- [ ] Frontend URLs are set in config
