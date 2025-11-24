// db/db1.js
// PAYMENT_DB helpers for payment processing
import { v4 as uuidv4 } from "uuid";
import { logger, logError } from "../utils/logger.js";

/**
 * Create payment record
 */
export async function createPayment(paymentData, env) {
  try {
    const paymentId = uuidv4();
    const now = new Date().toISOString();

    await env.PAYMENT_DB.prepare(
      `
      INSERT INTO payments (
        payment_id, checkout_session_id, order_id, intent, status,
        amount, currency, payer_email, payer_name, metadata,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
      .bind(
        paymentId,
        paymentData.checkout_session_id,
        paymentData.order_id || null,
        paymentData.intent || "CAPTURE",
        paymentData.status || "pending",
        paymentData.amount,
        paymentData.currency || "USD",
        paymentData.payer_email || null,
        paymentData.payer_name || null,
        paymentData.metadata ? JSON.stringify(paymentData.metadata) : null,
        now,
        now,
      )
      .run();

    return await getPayment(paymentId, env);
  } catch (err) {
    logError("createPayment: Database error", err, { paymentData });
    throw err;
  }
}

/**
 * Get payment by ID
 */
export async function getPayment(paymentId, env) {
  try {
    const payment = await env.PAYMENT_DB.prepare(
      "SELECT * FROM payments WHERE payment_id = ?",
    )
      .bind(paymentId)
      .first();

    if (payment && payment.metadata) {
      try {
        payment.metadata = JSON.parse(payment.metadata);
      } catch {
        payment.metadata = null;
      }
    }

    return payment || null;
  } catch (err) {
    logError("getPayment: Database error", err, { paymentId });
    throw err;
  }
}

/**
 * Get payment by checkout session ID
 */
export async function getPaymentBySessionId(sessionId, env) {
  try {
    const payment = await env.PAYMENT_DB.prepare(
      "SELECT * FROM payments WHERE checkout_session_id = ? ORDER BY created_at DESC LIMIT 1",
    )
      .bind(sessionId)
      .first();

    if (payment && payment.metadata) {
      try {
        payment.metadata = JSON.parse(payment.metadata);
      } catch {
        payment.metadata = null;
      }
    }

    return payment || null;
  } catch (err) {
    logError("getPaymentBySessionId: Database error", err, { sessionId });
    throw err;
  }
}

/**
 * Get payment by PayPal order ID
 */
export async function getPaymentByOrderId(orderId, env) {
  try {
    const payment = await env.PAYMENT_DB.prepare(
      "SELECT * FROM payments WHERE order_id = ?",
    )
      .bind(orderId)
      .first();

    if (payment && payment.metadata) {
      try {
        payment.metadata = JSON.parse(payment.metadata);
      } catch {
        payment.metadata = null;
      }
    }

    return payment || null;
  } catch (err) {
    logError("getPaymentByOrderId: Database error", err, { orderId });
    throw err;
  }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(paymentId, status, updates, env) {
  try {
    const now = new Date().toISOString();
    const updateFields = ["status = ?", "updated_at = ?"];
    const bindValues = [status, now];

    if (updates.order_id !== undefined) {
      updateFields.push("order_id = ?");
      bindValues.push(updates.order_id);
    }
    if (updates.paypal_transaction_id !== undefined) {
      updateFields.push("paypal_transaction_id = ?");
      bindValues.push(updates.paypal_transaction_id);
    }
    if (updates.payer_email !== undefined) {
      updateFields.push("payer_email = ?");
      bindValues.push(updates.payer_email);
    }
    if (updates.payer_name !== undefined) {
      updateFields.push("payer_name = ?");
      bindValues.push(updates.payer_name);
    }
    if (updates.failure_reason !== undefined) {
      updateFields.push("failure_reason = ?");
      bindValues.push(updates.failure_reason);
    }
    if (updates.captured_at !== undefined) {
      updateFields.push("captured_at = ?");
      bindValues.push(updates.captured_at);
    }
    if (updates.metadata !== undefined) {
      updateFields.push("metadata = ?");
      bindValues.push(
        updates.metadata ? JSON.stringify(updates.metadata) : null,
      );
    }

    bindValues.push(paymentId);

    await env.PAYMENT_DB.prepare(
      `
      UPDATE payments 
      SET ${updateFields.join(", ")}
      WHERE payment_id = ?
    `,
    )
      .bind(...bindValues)
      .run();

    return await getPayment(paymentId, env);
  } catch (err) {
    logError("updatePaymentStatus: Database error", err, { paymentId, status });
    throw err;
  }
}

/**
 * Log payment event
 */
export async function logPaymentEvent(paymentId, eventType, eventData, env) {
  try {
    const eventId = uuidv4();
    const now = new Date().toISOString();

    await env.PAYMENT_DB.prepare(
      `
      INSERT INTO payment_events (event_id, payment_id, event_type, event_data, created_at)
      VALUES (?, ?, ?, ?, ?)
    `,
    )
      .bind(
        eventId,
        paymentId,
        eventType,
        eventData ? JSON.stringify(eventData) : null,
        now,
      )
      .run();

    logger("payment.event.logged", { paymentId, eventType, eventId });
  } catch (err) {
    logError("logPaymentEvent: Database error", err, { paymentId, eventType });
    // Don't throw - event logging shouldn't break payment flow
  }
}
