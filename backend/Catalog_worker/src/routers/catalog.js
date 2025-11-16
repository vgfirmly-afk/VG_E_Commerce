// routers/catalog.js
import { Router } from 'itty-router';
import * as catalogHandlers from '../handlers/catalogHandlers.js';
import * as adminHandlers from '../handlers/adminHandlers.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

// Health check
router.get('/_/health', () => new Response(JSON.stringify({ ok: true }), { 
  status: 200, 
  headers: { 'Content-Type': 'application/json' } 
}));

// Public endpoints
router.get('/api/v1/products', async (request, env, ctx) => catalogHandlers.listProducts(request, request.env || env));
router.get('/api/v1/products/:product_id', async (request, env, ctx) => catalogHandlers.getProduct(request, request.env || env));
router.get('/api/v1/products/:product_id/images/:image_id', async (request, env, ctx) => catalogHandlers.getProductImage(request, request.env || env));
router.get('/api/v1/home', async (request, env, ctx) => catalogHandlers.getHomePage(request, request.env || env));
router.get('/api/v1/search', async (request, env, ctx) => catalogHandlers.searchProductsHandler(request, request.env || env));

// Admin endpoints (require authentication)
// Product CRUD
router.post('/api/v1/products', 
  async (request, env, ctx) => {
    const authResult = await requireAdmin(request, request.env || env);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({ error: authResult.error, message: authResult.message }),
        { status: authResult.status, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return adminHandlers.createProduct(request, request.env || env);
  }
);

router.put('/api/v1/products/:product_id',
  async (request, env, ctx) => {
    const authResult = await requireAdmin(request, request.env || env);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({ error: authResult.error, message: authResult.message }),
        { status: authResult.status, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return adminHandlers.updateProduct(request, request.env || env);
  }
);

router.delete('/api/v1/products/:product_id',
  async (request, env, ctx) => {
    const authResult = await requireAdmin(request, request.env || env);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({ error: authResult.error, message: authResult.message }),
        { status: authResult.status, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return adminHandlers.deleteProduct(request, request.env || env);
  }
);

// SKU CRUD
router.post('/api/v1/products/:product_id/skus',
  async (request, env, ctx) => {
    const authResult = await requireAdmin(request, request.env || env);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({ error: authResult.error, message: authResult.message }),
        { status: authResult.status, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return adminHandlers.createSku(request, request.env || env);
  }
);

router.put('/api/v1/products/:product_id/skus/:sku_id',
  async (request, env, ctx) => {
    const authResult = await requireAdmin(request, request.env || env);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({ error: authResult.error, message: authResult.message }),
        { status: authResult.status, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return adminHandlers.updateSku(request, request.env || env);
  }
);

router.delete('/api/v1/products/:product_id/skus/:sku_id',
  async (request, env, ctx) => {
    const authResult = await requireAdmin(request, request.env || env);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({ error: authResult.error, message: authResult.message }),
        { status: authResult.status, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return adminHandlers.deleteSku(request, request.env || env);
  }
);

// Image upload
router.post('/api/v1/products/:product_id/images',
  async (request, env, ctx) => {
    const authResult = await requireAdmin(request, request.env || env);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({ error: authResult.error, message: authResult.message }),
        { status: authResult.status, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return adminHandlers.uploadProductImage(request, request.env || env);
  }
);

// Fallback
router.all('*', () => new Response(
  JSON.stringify({ error: 'not_found', message: 'Endpoint not found' }), 
  { status: 404, headers: { 'Content-Type': 'application/json' } }
));

export default router;
