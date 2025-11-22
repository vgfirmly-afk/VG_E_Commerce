// routers/fulfillment.js
import { Router } from 'itty-router';
import * as fulfillmentHandlers from '../handlers/fulfillmentHandlers.js';

const router = Router();

// Health check
router.get('/_/health', async (request, env, ctx) => {
  return new Response(JSON.stringify({ ok: true }), { 
    status: 200, 
    headers: { 'Content-Type': 'application/json' } 
  });
});

// Webhook endpoint for fulfillment creation (called by Payment/Checkout Worker)
router.post('/api/v1/webhooks/fulfillment',
  async (request, env, ctx) => {
    try {
      return await fulfillmentHandlers.handleFulfillmentWebhook(request, request.env || env);
    } catch (err) {
      console.error('[Fulfillment Router] Error in POST /api/v1/webhooks/fulfillment:', err);
      return new Response(
        JSON.stringify({ error: 'internal_error', message: err?.message ?? String(err) }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
);

// Get all orders for user
router.get('/api/v1/orders', async (request, env, ctx) => {
  return fulfillmentHandlers.getUserOrders(request, request.env || env);
});

// Get order by ID
router.get('/api/v1/orders/:order_id', async (request, env, ctx) => {
  return fulfillmentHandlers.getOrderById(request, request.env || env);
});

// Update fulfillment status
router.put('/api/v1/orders/:order_id/status',
  async (request, env, ctx) => {
    try {
      const contentType = request.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return new Response(
          JSON.stringify({ 
            error: 'validation_error', 
            message: 'Content-Type must be application/json'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return await fulfillmentHandlers.updateFulfillmentStatus(request, request.env || env);
    } catch (err) {
      console.error('[Fulfillment Router] Error in PUT /api/v1/orders/:order_id/status:', err);
      return new Response(
        JSON.stringify({ error: 'internal_error', message: err?.message ?? String(err) }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
);

// Add shipping tracking
router.post('/api/v1/orders/:order_id/tracking',
  async (request, env, ctx) => {
    try {
      const contentType = request.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return new Response(
          JSON.stringify({ 
            error: 'validation_error', 
            message: 'Content-Type must be application/json'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return await fulfillmentHandlers.addShippingTracking(request, request.env || env);
    } catch (err) {
      console.error('[Fulfillment Router] Error in POST /api/v1/orders/:order_id/tracking:', err);
      return new Response(
        JSON.stringify({ error: 'internal_error', message: err?.message ?? String(err) }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
);

// Update shipping tracking
router.put('/api/v1/tracking/:tracking_id',
  async (request, env, ctx) => {
    try {
      const contentType = request.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return new Response(
          JSON.stringify({ 
            error: 'validation_error', 
            message: 'Content-Type must be application/json'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return await fulfillmentHandlers.updateShippingTracking(request, request.env || env);
    } catch (err) {
      console.error('[Fulfillment Router] Error in PUT /api/v1/tracking/:tracking_id:', err);
      return new Response(
        JSON.stringify({ error: 'internal_error', message: err?.message ?? String(err) }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
);

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

