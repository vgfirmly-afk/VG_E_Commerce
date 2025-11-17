// routers/inventory.js
import { Router } from 'itty-router';
import * as inventoryHandlers from '../handlers/inventoryHandlers.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import { 
  validateSkuStockUpdate, 
  validateStockAdjustment, 
  validateReserveStock, 
  validateReleaseStock,
  validateCheckStock
} from '../utils/validators.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Health check - MUST be first route for itty-router matching
router.get('/_/health', async (request, env, ctx) => {
  console.log('[Inventory Router] Health check matched', { 
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
router.get('/api/v1/stock/:sku_id', async (request, env, ctx) => {
  return inventoryHandlers.getStock(request, request.env || env);
});

router.get('/api/v1/stock/:sku_id/history', async (request, env, ctx) => {
  return inventoryHandlers.getHistory(request, request.env || env);
});

router.post('/api/v1/stock/check', 
  validateBody(validateCheckStock),
  async (request, env, ctx) => {
    return inventoryHandlers.checkAvailability(request, request.env || env);
  }
);

// Admin/Service endpoints - POST route MUST be defined BEFORE GET route for same path pattern
router.post('/api/v1/stock/:sku_id',
  async (request, env, ctx) => {
    console.log('[Inventory Router] POST /api/v1/stock/:sku_id matched', { 
      method: request.method, 
      url: request.url,
      skuId: request.params?.sku_id,
      timestamp: new Date().toISOString()
    });
    
    // Check if request is from Service Binding
    const sourceHeader = request.headers.get('X-Source');
    if (sourceHeader !== 'catalog-worker-service-binding') {
      const authResult = await requireAdmin(request, request.env || env);
      if (!authResult.ok) {
        return new Response(
          JSON.stringify({ 
            error: authResult.error || 'unauthorized', 
            message: authResult.message || 'Unauthorized' 
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      request.user = authResult.user;
    } else {
      // Service binding request - trust it
      request.user = { userId: 'catalog_worker_service', role: 'service', source: 'service_binding' };
    }
    
    return inventoryHandlers.initializeStock(request, request.env || env);
  }
);

router.put('/api/v1/stock/:sku_id',
  validateBody(validateSkuStockUpdate),
  async (request, env, ctx) => {
    const authResult = await requireAdmin(request, request.env || env);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({ 
          error: authResult.error || 'unauthorized', 
          message: authResult.message || 'Unauthorized' 
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    request.user = authResult.user;
    return inventoryHandlers.updateStock(request, request.env || env);
  }
);

router.post('/api/v1/stock/:sku_id/adjust',
  validateBody(validateStockAdjustment),
  async (request, env, ctx) => {
    const authResult = await requireAdmin(request, request.env || env);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({ 
          error: authResult.error || 'unauthorized', 
          message: authResult.message || 'Unauthorized' 
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    request.user = authResult.user;
    return inventoryHandlers.adjustStock(request, request.env || env);
  }
);

router.post('/api/v1/stock/:sku_id/reserve',
  validateBody(validateReserveStock),
  async (request, env, ctx) => {
    // Reserve can be called by users (for cart) or services
    // For now, allow any authenticated request
    const userId = request.headers.get('X-User-Id') || 'user';
    request.user = { userId, role: 'user' };
    return inventoryHandlers.reserveStock(request, request.env || env);
  }
);

router.post('/api/v1/stock/:sku_id/release',
  validateBody(validateReleaseStock),
  async (request, env, ctx) => {
    // Release can be called by users (for cart) or services
    const userId = request.headers.get('X-User-Id') || 'user';
    request.user = { userId, role: 'user' };
    return inventoryHandlers.releaseStock(request, request.env || env);
  }
);

// Fallback route
router.all('*', async (request) => {
  console.log('[Inventory Router] 404 - Route not found', {
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

