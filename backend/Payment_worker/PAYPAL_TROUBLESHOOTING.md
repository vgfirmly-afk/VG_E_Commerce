# PayPal Integration Troubleshooting Guide

## Common Error: `INSTRUMENT_DECLINED`

### Error Description

```
"INSTRUMENT_DECLINED": "The instrument presented was either declined by the processor or bank, or it can't be used for this payment."
```

This error occurs when PayPal tries to capture the payment but the payment method (credit card or PayPal account) is declined.

### Why This Happens

1. **Test Card Configuration**: The test credit card you're using is configured to decline
2. **PayPal Sandbox Account**: The test PayPal account doesn't have proper funding or payment methods
3. **Order Status**: The order might not be fully approved when capture is attempted
4. **Test Environment**: Using incorrect test credentials or sandbox configuration

### Solutions

#### Solution 1: Use PayPal Sandbox Test Accounts (Recommended)

Instead of using credit cards, use PayPal Sandbox test accounts:

1. **Go to PayPal Developer Dashboard**: https://developer.paypal.com/
2. **Navigate to**: Sandbox → Accounts
3. **Create or use existing Personal/Business test accounts**
4. **Use these accounts for testing**:
   - Personal Account: `buyer@personal.example.com` (password: your test password)
   - Business Account: `merchant@business.example.com` (password: your test password)

**Benefits**:

- More reliable than test credit cards
- Better simulates real PayPal payments
- No card decline issues

#### Solution 2: Use Approved Test Credit Cards

If you must use credit cards, use PayPal's approved test cards:

**Successful Test Cards**:

- Card Number: `4032035495732383`
- Expiry: Any future date (e.g., `12/2025`)
- CVV: Any 3 digits (e.g., `123`)
- Name: Any name

**Other Test Cards** (from PayPal documentation):

- `4032035495732383` - Visa (Always approved)
- `5424000000000015` - Mastercard (Always approved)
- `4000000000000002` - Visa (Always declined - use to test failures)

#### Solution 3: Check Order Status Before Capture

The code now verifies the order is in `APPROVED` state before attempting capture. This prevents premature capture attempts.

#### Solution 4: Retry Capture Manually

If capture fails, the payment remains in `approved` state. You can retry capture:

```bash
POST /api/v1/payments/{payment_id}/capture
Body: {
  "order_id": "70220884193252808"  // Optional, will use payment record if not provided
}
```

### Error Response Structure

When capture fails, you'll receive:

```json
{
  "success": false,
  "message": "Payment approved but capture failed",
  "error": "The instrument presented was either declined...",
  "error_details": {
    "issue": "INSTRUMENT_DECLINED",
    "description": "The instrument presented was either declined...",
    "debug_id": "f554435d30290",
    "help_link": "https://developer.paypal.com/api/rest/reference/orders/v2/errors/#INSTRUMENT_DECLINED"
  },
  "payment": {
    "payment_id": "...",
    "status": "approved",
    "paypal_order_id": "..."
  },
  "retry_info": {
    "message": "Payment is in approved state. You can retry capture...",
    "payment_id": "..."
  }
}
```

### Payment Status Flow

```
created → approved → captured ✅
         ↓
    capture_failed (status: approved, but has failure_reason)
         ↓
    retry capture → captured ✅
```

### Best Practices for Testing

1. **Use PayPal Sandbox Test Accounts**: Most reliable method
2. **Check Order Status**: Always verify order is `APPROVED` before capture
3. **Handle Errors Gracefully**: Store error details for debugging
4. **Implement Retry Logic**: Allow manual retry of failed captures
5. **Log Everything**: All events are logged in `payment_events` table

### Testing Checklist

- [ ] PayPal Sandbox credentials configured (PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)
- [ ] Using PayPal Sandbox test account (not credit card)
- [ ] Order status is `APPROVED` before capture
- [ ] Error details are stored in payment record
- [ ] Retry mechanism available for failed captures

### Debug Information

When debugging, check:

1. **Payment Events Table**: See all events for the payment
2. **Payment Metadata**: Contains PayPal error details
3. **PayPal Debug ID**: Use `debug_id` to check PayPal's logs
4. **Order Status**: Verify order status in PayPal dashboard

### PayPal Sandbox Test Accounts Setup

1. Go to: https://developer.paypal.com/dashboard/
2. Click: "Sandbox" → "Accounts"
3. Create accounts:
   - **Personal Account** (for buyers)
   - **Business Account** (for merchants)
4. Use these accounts when testing payments

### Additional Resources

- PayPal Orders API: https://developer.paypal.com/docs/api/orders/v2/
- PayPal Sandbox Testing: https://developer.paypal.com/docs/api-basics/sandbox/
- Error Reference: https://developer.paypal.com/api/rest/reference/orders/v2/errors/
