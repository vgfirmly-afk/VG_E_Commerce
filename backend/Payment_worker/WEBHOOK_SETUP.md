# PayPal Webhook Setup Guide

## Overview

This document explains the **correct PayPal payment flow** using webhooks for server-to-server communication.

## Payment Flow Architecture

### Two Types of Endpoints

1. **Frontend Callback URLs** (for user display only)
   - `/api/v1/payments/callback/success`
   - `/api/v1/payments/callback/failure`
   - **Purpose**: Show payment status to users after PayPal redirect
   - **Does NOT update payment status** - just returns current status

2. **Webhook Endpoint** (for actual payment processing)
   - `/api/v1/webhooks/paypal`
   - **Purpose**: Server-to-server communication from PayPal
   - **Updates payment status** in database
   - **Handles all payment state changes**

## Complete Payment Flow

```
┌─────────┐
│ Frontend│
└────┬────┘
     │
     │ 1. POST /api/v1/payments (Create Payment Intent)
     ▼
┌──────────────┐
│ Payment      │
│ Worker       │
└────┬─────────┘
     │
     │ 2. Create PayPal Order
     ▼
┌─────────┐
│ PayPal  │
└────┬────┘
     │
     │ 3. Return approval_url
     ▼
┌─────────┐
│ Frontend│ (User clicks approval_url)
└────┬────┘
     │
     │ 4. User approves on PayPal
     ▼
┌─────────┐
│ PayPal  │
└────┬────┘
     │
     ├─── 5a. Redirect to success/failure URL (FRONTEND - display only)
     │    └──> GET /api/v1/payments/callback/success
     │         Returns: Current payment status (for display)
     │
     └─── 5b. Send Webhook Event (BACKEND - actual processing)
          └──> POST /api/v1/webhooks/paypal
               Updates: Payment status in database
```

## Webhook Events Handled

### 1. `CHECKOUT.ORDER.APPROVED`
- **When**: User approves payment on PayPal
- **Action**: Updates payment status to `approved`
- **Stores**: Payer email, name, PayerID

### 2. `PAYMENT.CAPTURE.COMPLETED`
- **When**: Payment is successfully captured
- **Action**: Updates payment status to `captured`
- **Stores**: Transaction ID, capture details, payer info

### 3. `CHECKOUT.ORDER.COMPLETED`
- **When**: Order is fully completed
- **Action**: Updates payment status to `captured` (if not already)
- **Stores**: Complete transaction details

### 4. `PAYMENT.CAPTURE.DENIED`
- **When**: Payment capture is denied
- **Action**: Updates payment with failure reason
- **Status**: Remains `approved` but with failure_reason

### 5. `CHECKOUT.ORDER.CANCELLED`
- **When**: User cancels the order
- **Action**: Updates payment status to `cancelled`
- **Stores**: Cancellation reason

## Setting Up PayPal Webhooks

### Step 1: Configure Webhook URL in PayPal Dashboard

1. Go to: https://developer.paypal.com/dashboard/
2. Navigate to: **Apps & Credentials** → Your App
3. Click: **Webhooks** tab
4. Click: **Add Webhook**
5. Enter Webhook URL:
   ```
   https://w2-payment-worker.vg-firmly.workers.dev/api/v1/webhooks/paypal
   ```
6. Select Event Types:
   - ✅ `CHECKOUT.ORDER.APPROVED`
   - ✅ `CHECKOUT.ORDER.COMPLETED`
   - ✅ `CHECKOUT.ORDER.CANCELLED`
   - ✅ `PAYMENT.CAPTURE.COMPLETED`
   - ✅ `PAYMENT.CAPTURE.DENIED`

### Step 2: Configure Return URLs (Frontend)

When creating payment intent, set:

```json
{
  "return_url": "https://your-frontend.com/payment/success",
  "cancel_url": "https://your-frontend.com/payment/cancel"
}
```

These URLs should:
- Display payment status to user
- Call backend to get current payment status
- Show success/failure message

### Step 3: Frontend Implementation

```javascript
// After PayPal redirects to success URL
async function handlePaymentSuccess(token, payerId) {
  // Call backend to get current payment status
  const response = await fetch(
    `/api/v1/payments/callback/success?token=${token}&PayerID=${payerId}`
  );
  const data = await response.json();
  
  // Display status to user
  if (data.payment.status === 'captured') {
    showSuccessMessage('Payment successful!');
  } else if (data.payment.status === 'approved') {
    showMessage('Payment approved. Processing...');
    // Poll for status update (webhook may be delayed)
    pollPaymentStatus(data.payment.payment_id);
  }
}
```

## Webhook Security

### Signature Verification

PayPal sends webhook signature in headers:
- `PAYPAL-AUTH-ALGO`
- `PAYPAL-CERT-URL`
- `PAYPAL-TRANSMISSION-ID`
- `PAYPAL-TRANSMISSION-SIG`
- `PAYPAL-TRANSMISSION-TIME`

**Current Implementation**: Basic validation (for development)
**Production**: Should implement full signature verification using PayPal's certificate

### Webhook Retry Logic

PayPal automatically retries webhooks if:
- Response is not 200 OK
- Response takes too long
- Network error occurs

**Important**: Always return 200 OK from webhook handler, even on errors.
Log errors internally but don't fail the webhook.

## Testing Webhooks

### Using PayPal Sandbox

1. Use PayPal Sandbox test accounts
2. Configure webhook URL in Sandbox app settings
3. Make test payments
4. Check webhook logs in PayPal Dashboard

### Using ngrok (Local Development)

```bash
# Install ngrok
npm install -g ngrok

# Start your local server
npm start

# In another terminal, expose local server
ngrok http 8787

# Use ngrok URL in PayPal webhook configuration
# Example: https://abc123.ngrok.io/api/v1/webhooks/paypal
```

## Benefits of Webhook Approach

1. **Reliability**: Webhooks are retried automatically by PayPal
2. **Security**: Server-to-server communication (more secure)
3. **Real-time**: Immediate status updates
4. **Separation**: Frontend only displays, backend processes
5. **Audit Trail**: All webhook events are logged

## Troubleshooting

### Webhook Not Received

1. Check webhook URL is accessible (public HTTPS)
2. Verify webhook is configured in PayPal Dashboard
3. Check webhook event types are selected
4. Review PayPal webhook logs in Dashboard

### Payment Status Not Updated

1. Check webhook handler logs
2. Verify payment exists in database
3. Check webhook event payload
4. Ensure webhook returns 200 OK

### Signature Verification Failed

1. Verify webhook signature headers are present
2. Check certificate URL is accessible
3. Implement full signature verification (production)

## Example Webhook Payload

```json
{
  "id": "WH-2W42680J09360737-67976317FL053053R",
  "event_version": "1.0",
  "create_time": "2018-12-10T21:20:49.000Z",
  "resource_type": "checkout-order",
  "resource_version": "2.0",
  "event_type": "CHECKOUT.ORDER.APPROVED",
  "summary": "An order has been approved by buyer",
  "resource": {
    "id": "5O190127TN364715T",
    "status": "APPROVED",
    "payer": {
      "name": {
        "given_name": "John",
        "surname": "Doe"
      },
      "email_address": "buyer@example.com",
      "payer_id": "6Z5LWF59JK5L"
    }
  }
}
```

## Summary

- **Frontend Callbacks**: Display status only (no database updates)
- **Webhooks**: Handle all payment processing (database updates)
- **Always return 200 OK** from webhook handler
- **Log everything** for debugging
- **Verify webhook signatures** in production

