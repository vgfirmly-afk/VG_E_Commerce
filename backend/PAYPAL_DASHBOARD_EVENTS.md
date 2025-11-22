# PayPal Dashboard - Exact Events to Select

## Webhook URL (Copy This)

```
https://w2-payment-worker.vg-firmly.workers.dev/api/v1/webhooks/paypal
```

## Events to Select in PayPal Dashboard

### Under "Payments & Payouts" Section:

Select these 5 events:

1. ✅ **Payment capture completed**
   - Event Code: `PAYMENT.CAPTURE.COMPLETED`

2. ✅ **Payment capture denied**
   - Event Code: `PAYMENT.CAPTURE.DENIED`

3. ✅ **Payment capture declined**
   - Event Code: `PAYMENT.CAPTURE.DECLINED`

4. ✅ **Payment order cancelled**
   - Event Code: `PAYMENT.ORDER.CANCELLED`

5. ✅ **Payment order created**
   - Event Code: `PAYMENT.ORDER.CREATED`

### Under "Checkout" Section:

Select these 5 events:

6. ✅ **Checkout order approved**
   - Event Code: `CHECKOUT.ORDER.APPROVED`

7. ✅ **Checkout order completed**
   - Event Code: `CHECKOUT.ORDER.COMPLETED`

8. ✅ **Checkout order declined**
   - Event Code: `CHECKOUT.ORDER.DECLINED`
   - **Note:** This handles cancelled/declined checkout orders

9. ✅ **Checkout order saved** (Optional - Recommended for tracking)
   - Event Code: `CHECKOUT.ORDER.SAVED`
   - **Note:** Order saved but not yet approved - no action needed, just for tracking

10. ✅ **Checkout order voided** (Optional - Recommended for tracking)
    - Event Code: `CHECKOUT.ORDER.VOIDED`
    - **Note:** Treats voided orders as cancelled

## Summary

**Total Events to Select: 10**

- **Required:** 8 events (1-8 above)
- **Optional but Recommended:** 2 events (9-10 above) for better tracking

## Visual Checklist

When configuring in PayPal Dashboard, you should see and select:

**Payments & Payouts:**
```
☑ Payment capture completed
☑ Payment capture denied
☑ Payment capture declined
☑ Payment order cancelled
☑ Payment order created
```

**Checkout:**
```
☑ Checkout order approved
☑ Checkout order completed
☑ Checkout order declined
☑ Checkout order saved
☑ Checkout order voided
```

## Important Notes

1. **No "Checkout order cancelled"** - PayPal doesn't have this event. Use **"Checkout order declined"** instead.

2. **SAVED and VOIDED are optional** - These are recommended for better tracking but not strictly required. The system will work with just the first 8 events.

3. **All events are handled** - The code has been updated to handle all these event types correctly.

## What Happens with Each Event

| Event | What Happens |
|-------|-------------|
| `PAYMENT.CAPTURE.COMPLETED` | Payment captured → Updates status → Notifies all workers → Deducts stock → Creates order |
| `PAYMENT.CAPTURE.DENIED` | Payment denied → Updates status → Releases stock |
| `PAYMENT.CAPTURE.DECLINED` | Payment declined → Same as DENIED |
| `PAYMENT.ORDER.CANCELLED` | Order cancelled → Updates status → Releases stock |
| `PAYMENT.ORDER.CREATED` | Order created → Updates status (for tracking) |
| `CHECKOUT.ORDER.APPROVED` | Order approved → Updates payment status |
| `CHECKOUT.ORDER.COMPLETED` | Order completed → Payment captured → Notifies all workers |
| `CHECKOUT.ORDER.DECLINED` | Order declined → Updates status → Releases stock |
| `CHECKOUT.ORDER.SAVED` | Order saved → Logs event (no action) |
| `CHECKOUT.ORDER.VOIDED` | Order voided → Updates status → Releases stock |

