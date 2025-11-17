// routers/cart.js
import { Router } from 'itty-router';
import * as cartHandlers from '../handlers/cartHandlers.js';
import { validateBody } from '../middleware/validate.js';
import { validateAddItem, validateUpdateQuantity } from '../utils/validators.js';

const router = Router();

// Health check - MUST be first route for itty-router matching
router.get('/_/health', async (request, env, ctx) => {
  console.log('[Cart Router] Health check matched', { 
    method: request.method, 
    url: request.url,
    timestamp: new Date().toISOString()
  });
  return new Response(JSON.stringify({ ok: true }), { 
    status: 200, 
    headers: { 'Content-Type': 'application/json' } 
  });
});

// Public endpoints
router.get('/api/v1/cart', async (request, env, ctx) => {
  return cartHandlers.getCart(request, request.env || env);
});

router.get('/api/v1/cart/:cart_id', async (request, env, ctx) => {
  return cartHandlers.getCartById(request, request.env || env);
});

router.get('/api/v1/cart/:cart_id/total', async (request, env, ctx) => {
  return cartHandlers.getTotal(request, request.env || env);
});

router.post('/api/v1/cart/:cart_id/items',
  validateBody(validateAddItem),
  async (request, env, ctx) => {
    return cartHandlers.addItem(request, request.env || env);
  }
);

router.put('/api/v1/cart/:cart_id/items/:item_id',
  validateBody(validateUpdateQuantity),
  async (request, env, ctx) => {
    return cartHandlers.updateQuantity(request, request.env || env);
  }
);

router.delete('/api/v1/cart/:cart_id/items/:item_id', async (request, env, ctx) => {
  return cartHandlers.removeItem(request, request.env || env);
});

router.delete('/api/v1/cart/:cart_id', async (request, env, ctx) => {
  return cartHandlers.clearCart(request, request.env || env);
});

// Fallback route
router.all('*', async (request) => {
  console.log('[Cart Router] 404 - Route not found', {
    method: request.method,
    url: request.url,
    pathname: new URL(request.url).pathname
  });
  
  return new Response(
    JSON.stringify({ 
      error: 'not_found', 
      message: `Route not found: ${request.method} ${new URL(request.url).pathname}` 
    }),
    { status: 404, headers: { 'Content-Type': 'application/json' } }
  );
});

export default router;

