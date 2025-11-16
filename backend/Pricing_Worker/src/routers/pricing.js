// routers/pricing.js
import { Router } from 'itty-router';
import * as pricingHandlers from '../handlers/pricingHandlers.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

// Health check
router.get('/_/health', () => new Response(JSON.stringify({ ok: true }), { 
  status: 200, 
  headers: { 'Content-Type': 'application/json' } 
}));

// Public endpoints
router.get('/api/v1/prices/:sku_id', async (request, env, ctx) => 
  pricingHandlers.getPrice(request, request.env || env)
);

router.get('/api/v1/prices/product/:product_id', async (request, env, ctx) => 
  pricingHandlers.getProductPrices(request, request.env || env)
);

router.post('/api/v1/calculate-total', async (request, env, ctx) => 
  pricingHandlers.calculateTotal(request, request.env || env)
);

router.get('/api/v1/prices/:sku_id/history', async (request, env, ctx) => 
  pricingHandlers.getHistory(request, request.env || env)
);

// Admin/Service endpoints (require authentication)
// Initialize price (called by Catalog Worker when SKU is created)
router.post('/api/v1/prices/:sku_id',
  async (request, env, ctx) => {
    // Allow inter-worker communication without strict auth
    // In production, use service tokens or JWT verification
    return pricingHandlers.initializePrice(request, request.env || env);
  }
);

// Update price (admin only)
router.put('/api/v1/prices/:sku_id',
  async (request, env, ctx) => {
    const authResult = await requireAdmin(request, request.env || env);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({ error: authResult.error, message: authResult.message }),
        { status: authResult.status, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return pricingHandlers.updatePrice(request, request.env || env);
  }
);

// Delete price (admin only)
router.delete('/api/v1/prices/:sku_id',
  async (request, env, ctx) => {
    const authResult = await requireAdmin(request, request.env || env);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({ error: authResult.error, message: authResult.message }),
        { status: authResult.status, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return pricingHandlers.deletePrice(request, request.env || env);
  }
);

// Fallback - catch all unmatched routes
router.all('*', async (request) => {
  return new Response(
    JSON.stringify({ 
      error: 'not_found', 
      message: 'Endpoint not found',
      path: new URL(request.url).pathname,
      method: request.method
    }), 
    { status: 404, headers: { 'Content-Type': 'application/json' } }
  );
});

// Export router with safety wrapper
const safeRouter = {
  async handle(request, env, ctx) {
    try {
      const response = await router.handle(request, env, ctx);
      // Ensure we always return a Response
      if (!response || !(response instanceof Response)) {
        console.error('Router returned invalid response:', response);
        return new Response(
          JSON.stringify({ 
            error: 'internal_error', 
            message: 'Router did not return a valid response',
            path: new URL(request.url).pathname
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return response;
    } catch (err) {
      console.error('Router handle error:', err);
      return new Response(
        JSON.stringify({ 
          error: 'internal_error', 
          message: err?.message ?? String(err),
          path: new URL(request.url).pathname
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
};

export default safeRouter;

