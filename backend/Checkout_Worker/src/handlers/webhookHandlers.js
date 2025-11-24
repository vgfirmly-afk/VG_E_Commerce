// handlers/webhookHandlers.js
// Webhook handlers for Checkout Worker
import { logError } from "../utils/logger.js";
import * as checkoutService from "../services/checkoutService.js";

/**
 * POST /webhooks/payment-status - Handle payment status update webhook from Payment Worker
 */
export async function handlePaymentStatusWebhook(request, env) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Invalid JSON in request body",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { checkout_session_id, payment_id, payment_status, payment_data } =
      body;

    if (!checkout_session_id || !payment_id || !payment_status) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message:
            "Missing required fields: checkout_session_id, payment_id, payment_status",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Update checkout session with payment status
    const result = await checkoutService.updateCheckoutSessionPaymentStatus(
      checkout_session_id,
      payment_id,
      payment_status,
      payment_data,
      env,
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment status updated",
        checkout_session_id,
        payment_id,
        status: result.status,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    logError("handlePaymentStatusWebhook: Handler error", err);
    // Always return 200 to prevent webhook retries
    return new Response(
      JSON.stringify({
        success: false,
        error: "internal_error",
        message: err.message,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }
}
