# Webhook Workflow Analysis

## Workflow Overview

### Payment Success Flow

1. **User completes checkout** → Checkout session created with items
2. **User initiates payment** → Payment intent created, PayPal order created
3. **User approves payment on PayPal** → PayPal redirects to success URL
4. **PayPal sends webhook** → `PAYMENT.CAPTURE.COMPLETED` event
5. **Payment Worker processes webhook:**
   - Updates payment status to `captured`
   - Calls Checkout Worker webhook → Updates session status to `payment_completed`
   - Calls Inventory Worker webhook → Deducts stock for all items
   - Calls Fulfillment Worker webhook → Creates order/fulfillment
6. **Frontend receives redirect** → Shows success page with order details

### Payment Failure Flow

1. **User cancels payment** → PayPal redirects to failure URL
2. **PayPal sends webhook** → `CHECKOUT.ORDER.CANCELLED` event
3. **Payment Worker processes webhook:**
   - Updates payment status to `cancelled`
   - Calls Checkout Worker webhook → Updates session status to `payment_failed`, releases stock reservations
4. **Frontend receives redirect** → Shows failure page

## Potential Issues & Solutions

### Issue 1: Race Condition - Webhook vs User Redirect

**Problem:** User might be redirected to frontend before webhook is processed.

**Solution:**

- Frontend should poll payment status if webhook hasn't processed yet
- Frontend shows "Processing payment..." message
- Frontend retries payment status check every 2-3 seconds
- Maximum retry time: 30 seconds

**Implementation:**

```javascript
// Frontend code
async function checkPaymentStatus(paymentId, maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(`/api/v1/payments/${paymentId}`);
    const payment = await response.json();

    if (payment.status === "captured") {
      return { success: true, payment };
    }

    if (payment.status === "cancelled" || payment.status === "failed") {
      return { success: false, payment };
    }

    // Wait 2 seconds before retry
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return { success: false, error: "Payment status check timeout" };
}
```

### Issue 2: Webhook Call Failure

**Problem:** If webhook call to Checkout/Inventory/Fulfillment fails, data becomes inconsistent.

**Solution:**

- Webhook calls are non-blocking (using `.catch()`)
- Errors are logged but don't fail the main webhook
- Implement retry mechanism for failed webhook calls
- Add monitoring/alerting for webhook failures

**Current Implementation:**

- Webhook calls use `.catch()` to prevent failures
- Errors are logged with `logError()`
- Payment status is updated even if downstream webhooks fail

**Recommended Enhancement:**

- Store failed webhook calls in a queue
- Implement retry mechanism with exponential backoff
- Add dead letter queue for permanently failed webhooks

### Issue 3: Duplicate Webhook Processing

**Problem:** PayPal might send duplicate webhooks, causing duplicate orders or stock deductions.

**Solution:**

- Implement idempotency checks in webhook handlers
- Check if payment status already updated before processing
- Use payment_id as idempotency key

**Current Implementation:**

- Payment Worker checks payment status before updating
- Fulfillment Worker should check if order already exists (to be implemented)

**Recommended Enhancement:**

- Add idempotency key to all webhook handlers
- Store processed webhook IDs to prevent duplicates

### Issue 4: Stock Deduction Before Payment Confirmation

**Problem:** Stock is reserved during checkout, but if payment fails, stock should be released.

**Current Solution:**

- Stock is reserved in KV during checkout summary
- If payment fails, Checkout Worker releases stock reservations
- Inventory Worker deducts stock only when payment is captured

**Status:** ✅ Already implemented

### Issue 5: Order Creation Before Payment Confirmation

**Problem:** Order should only be created after payment is confirmed.

**Current Solution:**

- Fulfillment Worker webhook is only called when payment status is `captured`
- Order is created in Fulfillment Worker database
- Order status starts as `confirmed`

**Status:** ✅ Already implemented

### Issue 6: Frontend URL Parameters

**Problem:** Frontend needs to identify which payment succeeded/failed.

**Current Solution:**

- Success/failure URLs include `checkout_session_id` as query parameter
- PayPal adds `token` (order ID) to return URL
- Frontend can use either parameter to identify payment

**Status:** ✅ Implemented

**Frontend Usage:**

```javascript
// Get checkout_session_id from URL
const urlParams = new URLSearchParams(window.location.search);
const checkoutSessionId = urlParams.get("checkout_session_id");
const token = urlParams.get("token"); // PayPal order ID

// Use checkout_session_id to get payment details
const payment = await getPaymentByCheckoutSession(checkoutSessionId);
```

## Data Consistency Checks

### Checkout Session → Payment

- ✅ Payment has `checkout_session_id`
- ✅ Checkout session has `payment_id` and `payment_status` (after migration)

### Payment → Order

- ✅ Order has `payment_id` and `checkout_session_id`
- ✅ Order created only after payment captured

### Payment → Stock

- ✅ Stock deducted only when payment captured
- ✅ Stock reservations released on payment failure

### Order → Items

- ✅ Order items match checkout session items
- ✅ Quantities match

## Monitoring Points

1. **Webhook Success Rate:**
   - Payment Worker → Checkout Worker
   - Payment Worker → Inventory Worker
   - Payment Worker → Fulfillment Worker

2. **Payment Status Updates:**
   - Time between webhook received and status updated
   - Time between payment captured and order created

3. **Stock Consistency:**
   - Stock deducted matches order quantities
   - No negative stock after deductions

4. **Order Creation:**
   - All captured payments have corresponding orders
   - No duplicate orders for same payment

## Recommended Enhancements

1. **Idempotency Keys:**
   - Add idempotency key to all webhook handlers
   - Store processed webhook IDs

2. **Retry Mechanism:**
   - Implement retry queue for failed webhook calls
   - Exponential backoff for retries

3. **Webhook Replay:**
   - Store webhook events for replay
   - Admin endpoint to replay failed webhooks

4. **Health Checks:**
   - Endpoint to check webhook system health
   - Verify all service bindings are active

5. **Webhook Status Dashboard:**
   - Admin dashboard to view webhook status
   - Show failed webhooks and retry options

## Testing Scenarios

### Scenario 1: Successful Payment

1. Create checkout session
2. Initiate payment
3. Approve payment on PayPal
4. Verify:
   - Payment status is `captured`
   - Checkout session status is `payment_completed`
   - Stock is deducted
   - Order is created

### Scenario 2: Failed Payment

1. Create checkout session
2. Initiate payment
3. Cancel payment on PayPal
4. Verify:
   - Payment status is `cancelled`
   - Checkout session status is `payment_failed`
   - Stock reservations are released
   - No order is created

### Scenario 3: Webhook Delay

1. Create checkout session
2. Initiate payment
3. Approve payment on PayPal
4. Check frontend before webhook processes
5. Verify:
   - Frontend shows "Processing..." message
   - Frontend polls payment status
   - Eventually shows success after webhook processes

### Scenario 4: Duplicate Webhook

1. Process payment webhook
2. Receive duplicate webhook
3. Verify:
   - Payment status not updated twice
   - Stock not deducted twice
   - Order not created twice

## Conclusion

The webhook system is properly architected with:

- ✅ Proper separation of concerns
- ✅ Service bindings for secure communication
- ✅ Error handling and logging
- ✅ Data consistency measures
- ✅ Frontend URL configuration

**Remaining Work:**

- Apply Checkout Worker migration (002-add-payment-fields.sql)
- Set frontend URLs in Payment Worker wrangler.toml
- Configure PayPal webhook URL
- Test complete flow end-to-end
- Monitor webhook success rates
