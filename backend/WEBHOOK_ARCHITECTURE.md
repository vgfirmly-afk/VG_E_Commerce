# PayPal Webhook Architecture - How Webhooks Work

## How PayPal Sends Webhooks

**PayPal sends webhooks as SEPARATE HTTP POST requests - one request per event.**

### Example Flow:

When a payment is processed, PayPal sends **multiple separate webhook requests**, one for each event:

```
1. PayPal sends: POST /api/v1/webhooks/paypal
   Body: { "event_type": "PAYMENT.ORDER.CREATED", ... }
   
2. PayPal sends: POST /api/v1/webhooks/paypal (separate request)
   Body: { "event_type": "CHECKOUT.ORDER.APPROVED", ... }
   
3. PayPal sends: POST /api/v1/webhooks/paypal (separate request)
   Body: { "event_type": "PAYMENT.CAPTURE.COMPLETED", ... }
```

**Each webhook request contains:**
- One `event_type` (e.g., "PAYMENT.CAPTURE.COMPLETED")
- One `resource` object with the event data
- One unique `id` for the webhook event

## Why Switch Case Works (No Break Needed)

The switch case in `webhookService.js` is correct because:

1. **Each request has ONE event_type** - PayPal sends one event per HTTP request
2. **Each case returns** - After handling the event, the function returns, so execution stops
3. **No fall-through** - Since each case returns, we don't need `break` statements

### Code Flow:

```javascript
export async function handleWebhookEvent(event, env) {
  const eventType = event.event_type; // ONE event type per request
  
  switch (eventType) {
    case 'PAYMENT.CAPTURE.COMPLETED':
      return await handlePaymentCaptureCompleted(resource, env);
      // ↑ Returns here - execution stops, no need for break
    
    case 'PAYMENT.CAPTURE.DENIED':
      return await handlePaymentCaptureDenied(resource, env);
      // ↑ Returns here - execution stops
    
    // ... other cases
  }
}
```

## Webhook Request Structure

Each PayPal webhook request looks like this:

```json
{
  "id": "WH-2W42635YX2960934L-67976317FL053254B",
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "create_time": "2024-01-15T10:00:00.000Z",
  "resource_type": "capture",
  "resource": {
    "id": "1AB23456CD789012E",
    "status": "COMPLETED",
    "amount": {
      "value": "100.00",
      "currency_code": "USD"
    },
    "supplementary_data": {
      "related_ids": {
        "order_id": "5O190127TN364715T"
      }
    }
  }
}
```

**Key Points:**
- ✅ One `event_type` per request
- ✅ One `resource` object per request
- ✅ Separate HTTP request for each event

## Timeline Example

When a user completes a payment, PayPal sends webhooks in this order:

```
Time 0:00 - User clicks "Pay with PayPal"
  → PayPal sends: PAYMENT.ORDER.CREATED

Time 0:05 - User approves payment on PayPal
  → PayPal sends: CHECKOUT.ORDER.APPROVED

Time 0:10 - Payment is captured
  → PayPal sends: PAYMENT.CAPTURE.COMPLETED
  → PayPal sends: CHECKOUT.ORDER.COMPLETED
```

Each webhook is a **separate HTTP POST request** to your webhook URL.

## Why This Design?

1. **Reliability** - If one webhook fails, others can still succeed
2. **Idempotency** - Each webhook can be retried independently
3. **Scalability** - Can process events in parallel
4. **Debugging** - Easier to track individual events

## Handling Multiple Events

Even though PayPal sends separate requests, your code should handle them **idempotently**:

```javascript
// Check if already processed
let payment = await getPaymentByOrderId(orderId, env);
if (payment.status === 'captured') {
  // Already processed - return success
  return { processed: true, message: 'Already processed' };
}
```

This prevents duplicate processing if PayPal sends the same webhook multiple times.

## Summary

✅ **PayPal sends: One webhook per event (separate HTTP requests)**
✅ **Your code receives: One event_type per request**
✅ **Switch case is correct: Each case returns, no break needed**
✅ **Each webhook is independent: Can be processed in parallel**

The current implementation is correct! 🎯

