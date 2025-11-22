// handlers/webhookHandlers.js
// PayPal Webhook handlers
import { logError } from '../utils/logger.js';
import {
  verifyWebhookSignature,
  handleWebhookEvent
} from '../services/webhookService.js';

/**
 * POST /webhooks/paypal - Handle PayPal webhook events
 * This is the server-to-server endpoint that PayPal calls
 */
export async function handlePayPalWebhook(request, env) {
  try {
    // Get webhook headers
    const headers = request.headers;
    
    // Get body as text first (for signature verification)
    const bodyText = await request.text();
    
    // Parse webhook body
    let event;
    try {
      event = JSON.parse(bodyText);
    } catch (parseErr) {
      logError('handlePayPalWebhook: Failed to parse JSON', parseErr);
      return new Response(
        JSON.stringify({ error: 'invalid_json', message: 'Invalid JSON in webhook body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify webhook signature
    const isValid = await verifyWebhookSignature(headers, bodyText, env);
    
    if (!isValid) {
      logError('handlePayPalWebhook: Webhook signature verification failed', null, {
        event_id: event.id,
        event_type: event.event_type
      });
      return new Response(
        JSON.stringify({ error: 'invalid_signature', message: 'Webhook signature verification failed' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Process webhook event
    const result = await handleWebhookEvent(event, env);
    
    // Return 200 OK to PayPal (they will retry if we return error)
    return new Response(
      JSON.stringify({
        success: true,
        processed: result.processed,
        message: result.message || 'Webhook processed',
        payment_id: result.payment_id,
        status: result.status
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    logError('handlePayPalWebhook: Handler error', err);
    // Still return 200 to prevent PayPal from retrying
    // Log the error for investigation
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err.message }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

