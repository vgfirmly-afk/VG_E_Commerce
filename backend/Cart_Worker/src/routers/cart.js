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
  async (request, env, ctx) => {
    try {
      console.log('[Cart Router] POST /api/v1/cart/:cart_id/items matched', {
        method: request.method,
        url: request.url,
        cartId: request.params?.cart_id,
        contentType: request.headers.get('content-type'),
        hasBody: request.body !== null
      });
      
      // Validate request body directly (no middleware)
      const contentType = request.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return new Response(
          JSON.stringify({ 
            error: 'validation_error', 
            message: 'Content-Type must be application/json',
            received: contentType || 'not set'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      let body;
      let bodyText = '';
      try {
        // First, get the raw body text for debugging
        const clonedRequest = request.clone();
        bodyText = await clonedRequest.text();
        
        // Check if body text contains unresolved Postman variables
        if (bodyText.includes('{{') && bodyText.includes('}}')) {
          console.error('[Cart Router] Unresolved Postman variables detected in body:', bodyText.substring(0, 200));
          return new Response(
            JSON.stringify({ 
              error: 'validation_error', 
              message: 'Request body contains unresolved variables (e.g., {{skuId}}). Please ensure all Postman variables are set.',
              hint: 'Check that collection variables like skuId are set in Postman'
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        // Parse JSON
        body = JSON.parse(bodyText);
      } catch (parseErr) {
        console.error('[Cart Router] JSON parse error:', parseErr, {
          method: request.method,
          url: request.url,
          contentType: request.headers.get('content-type'),
          bodyPreview: bodyText.substring(0, 200)
        });
        
        let errorMessage = 'Invalid JSON in request body';
        if (parseErr.message && parseErr.message.includes('Unexpected end of JSON')) {
          errorMessage = 'Request body is empty or incomplete';
        } else if (parseErr.message && parseErr.message.includes('Unexpected token')) {
          errorMessage = 'Invalid JSON format in request body';
        } else if (parseErr.message) {
          errorMessage = `Invalid JSON: ${parseErr.message}`;
        }
        
        return new Response(
          JSON.stringify({ 
            error: 'validation_error', 
            message: errorMessage,
            details: parseErr.message,
            bodyPreview: bodyText.substring(0, 200) // Show first 200 chars for debugging
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Check if body is empty object or null
      if (!body || (typeof body === 'object' && Object.keys(body).length === 0)) {
        return new Response(
          JSON.stringify({ 
            error: 'validation_error', 
            message: 'Request body is empty or missing required fields' 
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Log the parsed body for debugging
      console.log('[Cart Router] Parsed request body:', {
        sku_id: body.sku_id,
        quantity: body.quantity
      });

      // Validate with schema
      const { error, value } = validateAddItem(body);
      if (error) {
        return new Response(
          JSON.stringify({
            error: 'validation_error',
            message: 'Invalid request data',
            details: error.details.map(d => ({
              path: d.path.join('.'),
              message: d.message,
              type: d.type
            }))
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Attach validated data to request
      request.validatedBody = value;
      
      return await cartHandlers.addItem(request, request.env || env);
    } catch (err) {
      console.error('[Cart Router] Error in POST /api/v1/cart/:cart_id/items:', err);
      return new Response(
        JSON.stringify({ error: 'internal_error', message: err?.message ?? String(err) }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
);

router.put('/api/v1/cart/:cart_id/items/:item_id',
  async (request, env, ctx) => {
    try {
      // Validate request body directly (no middleware)
      const contentType = request.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return new Response(
          JSON.stringify({ 
            error: 'validation_error', 
            message: 'Content-Type must be application/json',
            received: contentType || 'not set'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      let body;
      let bodyText = '';
      try {
        // First, get the raw body text for debugging
        const clonedRequest = request.clone();
        bodyText = await clonedRequest.text();
        
        // Check if body text contains unresolved Postman variables
        if (bodyText.includes('{{') && bodyText.includes('}}')) {
          console.error('[Cart Router] Unresolved Postman variables detected in body:', bodyText.substring(0, 200));
          return new Response(
            JSON.stringify({ 
              error: 'validation_error', 
              message: 'Request body contains unresolved variables (e.g., {{skuId}}). Please ensure all Postman variables are set.',
              hint: 'Check that collection variables like skuId are set in Postman'
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        // Parse JSON
        body = JSON.parse(bodyText);
      } catch (parseErr) {
        console.error('[Cart Router] JSON parse error:', parseErr, {
          method: request.method,
          url: request.url,
          contentType: request.headers.get('content-type'),
          bodyPreview: bodyText.substring(0, 200)
        });
        
        let errorMessage = 'Invalid JSON in request body';
        if (parseErr.message && parseErr.message.includes('Unexpected end of JSON')) {
          errorMessage = 'Request body is empty or incomplete';
        } else if (parseErr.message && parseErr.message.includes('Unexpected token')) {
          errorMessage = 'Invalid JSON format in request body';
        } else if (parseErr.message) {
          errorMessage = `Invalid JSON: ${parseErr.message}`;
        }
        
        return new Response(
          JSON.stringify({ 
            error: 'validation_error', 
            message: errorMessage,
            details: parseErr.message,
            bodyPreview: bodyText.substring(0, 200) // Show first 200 chars for debugging
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Check if body is empty object or null
      if (!body || (typeof body === 'object' && Object.keys(body).length === 0)) {
        return new Response(
          JSON.stringify({ 
            error: 'validation_error', 
            message: 'Request body is empty or missing required fields' 
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Log the parsed body for debugging
      console.log('[Cart Router] Parsed request body:', {
        quantity: body.quantity,
        delta: body.delta
      });

      // Validate with schema
      const { error, value } = validateUpdateQuantity(body);
      if (error) {
        return new Response(
          JSON.stringify({
            error: 'validation_error',
            message: 'Invalid request data',
            details: error.details.map(d => ({
              path: d.path.join('.'),
              message: d.message,
              type: d.type
            }))
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Attach validated data to request
      request.validatedBody = value;
      
      return await cartHandlers.updateQuantity(request, request.env || env);
    } catch (err) {
      console.error('[Cart Router] Error in PUT /api/v1/cart/:cart_id/items/:item_id:', err);
      return new Response(
        JSON.stringify({ error: 'internal_error', message: err?.message ?? String(err) }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
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

