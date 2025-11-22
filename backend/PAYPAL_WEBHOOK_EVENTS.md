# PayPal Webhook Event Types - Quick Reference

## Exact Event Types to Select in PayPal Dashboard

When configuring your PayPal webhook, select these **exact** event types from the PayPal Developer Dashboard:

### Under "Payments & Payouts" Section:

1. ✅ **Payment capture completed**
   - Event Type Code: `PAYMENT.CAPTURE.COMPLETED`

2. ✅ **Payment capture denied**
   - Event Type Code: `PAYMENT.CAPTURE.DENIED`

3. ✅ **Payment capture declined**
   - Event Type Code: `PAYMENT.CAPTURE.DECLINED`

4. ✅ **Payment order cancelled**
   - Event Type Code: `PAYMENT.ORDER.CANCELLED`

5. ✅ **Payment order created**
   - Event Type Code: `PAYMENT.ORDER.CREATED`

### Under "Checkout" Section (if available):

6. ✅ **Checkout order approved**
   - Event Type Code: `CHECKOUT.ORDER.APPROVED`

7. ✅ **Checkout order completed**
   - Event Type Code: `CHECKOUT.ORDER.COMPLETED`

8. ✅ **Checkout order declined**
   - Event Type Code: `CHECKOUT.ORDER.DECLINED`
   - **Note:** This handles cancelled/declined checkout orders

9. ✅ **Checkout order saved** (Optional - for tracking)
   - Event Type Code: `CHECKOUT.ORDER.SAVED`
   - **Note:** Order saved but not yet approved - no action needed

10. ✅ **Checkout order voided** (Optional - for tracking)
    - Event Type Code: `CHECKOUT.ORDER.VOIDED`
    - **Note:** Treats voided orders as cancelled

## Visual Guide for PayPal Dashboard

When you see the webhook configuration page, look for these checkboxes:

```
☑ Payment capture completed
☑ Payment capture denied
☑ Payment capture declined
☑ Payment order cancelled
☑ Payment order created
☑ Checkout order approved
☑ Checkout order completed
☑ Checkout order declined
☑ Checkout order saved (optional)
☑ Checkout order voided (optional)
```

**DO NOT** select "All Events" - this will subscribe you to many unnecessary events and may cause performance issues.

## Webhook URL

**Copy this exact URL to configure in PayPal Dashboard:**

```
https://w2-payment-worker.vg-firmly.workers.dev/api/v1/webhooks/paypal
```

**Note:** This is the ONLY URL you need to configure in PayPal Dashboard. All other worker webhooks (Checkout, Inventory, Fulfillment) are called internally by the Payment Worker and do not need to be configured in PayPal.

## What Each Event Does

| Event | When It Fires | What Happens |
|-------|---------------|--------------|
| `PAYMENT.CAPTURE.COMPLETED` | Payment successfully captured | Updates payment status, notifies Checkout/Inventory/Fulfillment workers |
| `PAYMENT.CAPTURE.DENIED` | Payment capture denied | Updates payment status, releases stock reservations |
| `PAYMENT.CAPTURE.DECLINED` | Payment capture declined | Same as DENIED - releases stock |
| `PAYMENT.ORDER.CANCELLED` | Payment order cancelled | Updates payment to cancelled, releases stock |
| `PAYMENT.ORDER.CREATED` | Payment order created | Updates payment to created (optional tracking) |
| `CHECKOUT.ORDER.APPROVED` | User approves order on PayPal | Updates payment to approved |
| `CHECKOUT.ORDER.COMPLETED` | Checkout order completed | Updates payment to captured, triggers all webhooks |
| `CHECKOUT.ORDER.DECLINED` | Checkout order declined/cancelled | Updates payment to cancelled, releases stock |
| `CHECKOUT.ORDER.SAVED` | Checkout order saved (not approved yet) | Logs event, no action needed |
| `CHECKOUT.ORDER.VOIDED` | Checkout order voided | Updates payment to cancelled, releases stock |

## Testing

After configuring, PayPal will send a test webhook. Check your Payment Worker logs:

```bash
wrangler tail payment-worker
```

You should see webhook events being received and processed.

