// routers/payment.js
import { Router } from 'itty-router';
import * as paymentHandlers from '../handlers/paymentHandlers.js';
import { validateBody } from '../middleware/validate.js';
import {
  createPaymentSchema,
  capturePaymentSchema
} from '../utils/validators.js';

const router = Router();

// Health check
router.get('/_/health', async (request, env, ctx) => {
  return new Response(JSON.stringify({ ok: true }), { 
    status: 200, 
    headers: { 'Content-Type': 'application/json' } 
  });
});

// Create payment intent
router.post('/api/v1/payments',
  validateBody(createPaymentSchema),
  async (request, env, ctx) => {
    try {
      return await paymentHandlers.createPayment(request, request.env || env);
    } catch (err) {
      console.error('[Payment Router] Error in POST /api/v1/payments:', err);
      return new Response(
        JSON.stringify({ error: 'internal_error', message: err?.message ?? String(err) }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
);

// Get payment status
router.get('/api/v1/payments/:payment_id', async (request, env, ctx) => {
  return paymentHandlers.getPayment(request, request.env || env);
});

// Capture payment
router.post('/api/v1/payments/:payment_id/capture',
  validateBody(capturePaymentSchema),
  async (request, env, ctx) => {
    try {
      return await paymentHandlers.capturePayment(request, request.env || env);
    } catch (err) {
      console.error('[Payment Router] Error in POST /api/v1/payments/:payment_id/capture:', err);
      return new Response(
        JSON.stringify({ error: 'internal_error', message: err?.message ?? String(err) }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
);

// PayPal callback endpoints
router.get('/api/v1/payments/callback/success', async (request, env, ctx) => {
  return paymentHandlers.handlePayPalSuccess(request, request.env || env);
});

router.get('/api/v1/payments/callback/failure', async (request, env, ctx) => {
  return paymentHandlers.handlePayPalFailure(request, request.env || env);
});

// Fallback route
router.all('*', async (request) => {
  return new Response(
    JSON.stringify({ 
      error: 'not_found', 
      message: `Route not found: ${request.method} ${new URL(request.url).pathname}` 
    }),
    { status: 404, headers: { 'Content-Type': 'application/json' } }
  );
});

export default router;

