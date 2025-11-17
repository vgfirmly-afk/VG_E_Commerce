# CORS Configuration Guide

This guide explains how to fix CORS errors when connecting the frontend to your backend workers.

## The Problem

When your frontend (running on `http://localhost:5173` or your production domain) tries to make requests to your Cloudflare Workers, the browser enforces CORS (Cross-Origin Resource Sharing) policies. Since we're using `credentials: 'include'` for httpOnly cookies, the backend **must** explicitly allow the frontend origin.

## Solution: Add CORS Middleware to Backend Workers

You need to add CORS headers to **all** your backend workers. Here's how:

### Step 1: Create CORS Middleware

Create a new file in each worker: `src/middleware/cors.js`

```javascript
// src/middleware/cors.js

/**
 * CORS middleware for Cloudflare Workers
 * Handles preflight OPTIONS requests and adds CORS headers to all responses
 */
export function handleCORS(request, response) {
  // Get the origin from the request
  const origin = request.headers.get('Origin');
  
  // List of allowed origins (add your frontend URLs here)
  // For development: http://localhost:5173, http://127.0.0.1:5173
  // For production: your frontend domain
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // Add your production frontend URL here
    // 'https://your-frontend-domain.com',
  ];
  
  // Check if origin is allowed
  const isAllowedOrigin = origin && allowedOrigins.some(allowed => {
    return origin === allowed || origin.startsWith(allowed);
  });
  
  // Use the request origin if allowed, otherwise use the first allowed origin
  const allowedOrigin = isAllowedOrigin ? origin : allowedOrigins[0];
  
  // Create headers object
  const headers = new Headers(response?.headers || {});
  
  // Set CORS headers
  headers.set('Access-Control-Allow-Origin', allowedOrigin || '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id, X-Session-Id, X-Source');
  headers.set('Access-Control-Allow-Credentials', 'true'); // Required for cookies
  headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  
  // If this is a preflight request, return early
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: headers,
    });
  }
  
  // For regular requests, add CORS headers to the response
  if (response) {
    // Clone response to modify headers
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
    return newResponse;
  }
  
  return { headers };
}

/**
 * CORS wrapper for fetch handlers
 */
export function withCORS(handler) {
  return async function(request, env, ctx) {
    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return handleCORS(request, null);
    }
    
    // Call the actual handler
    const response = await handler(request, env, ctx);
    
    // Add CORS headers to the response
    return handleCORS(request, response);
  };
}
```

### Step 2: Update Each Worker's index.js

Update `src/index.js` in each worker (Auth, Cart, Catalog, Inventory, Pricing):

**Before:**
```javascript
async function baseFetch(request, env, ctx) {
  // ... existing code
  const response = await router.handle(request, env, ctx);
  return response;
}
```

**After:**
```javascript
import { withCORS } from './middleware/cors.js';

async function baseFetch(request, env, ctx) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return withCORS(() => new Response(null, { status: 204 }))(request, env, ctx);
  }
  
  // ... existing code
  const response = await router.handle(request, env, ctx);
  
  // Add CORS headers to response
  return withCORS(() => response)(request, env, ctx);
}
```

**Or simpler approach - wrap the entire handler:**

```javascript
import { withCORS } from './middleware/cors.js';

async function baseFetch(request, env, ctx) {
  try {
    // ... existing code
    const response = await router.handle(request, env, ctx);
    return response;
  } catch (err) {
    // ... error handling
  }
}

// Wrap with CORS
const handlerWithCORS = withCORS(baseFetch);
const handlerWithLogger = withLogger(handlerWithCORS);
export default instrument({ fetch: handlerWithLogger }, resolveConfig);
```

### Step 3: Update Allowed Origins

In `src/middleware/cors.js`, update the `allowedOrigins` array to include:

1. **Development URLs:**
   - `http://localhost:5173` (Vite default)
   - `http://127.0.0.1:5173`
   - Any other local ports you use

2. **Production URL:**
   - Your frontend production domain (e.g., `https://your-frontend.vercel.app`)

### Step 4: Environment-Based CORS (Optional but Recommended)

For better security, use environment variables:

```javascript
// src/middleware/cors.js
export function handleCORS(request, response, env) {
  const origin = request.headers.get('Origin');
  
  // Get allowed origins from environment or use defaults
  const allowedOrigins = env.ALLOWED_ORIGINS 
    ? env.ALLOWED_ORIGINS.split(',')
    : [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
      ];
  
  // ... rest of the code
}
```

Then set in `wrangler.toml`:
```toml
[vars]
ALLOWED_ORIGINS = "http://localhost:5173,https://your-frontend-domain.com"
```

## Quick Fix: Add CORS Headers Directly in index.js

If you want a quick fix without creating a separate middleware file, add this to each worker's `index.js`:

```javascript
async function baseFetch(request, env, ctx) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id, X-Session-Id',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  try {
    // ... existing code
    const response = await router.handle(request, env, ctx);
    
    // Add CORS headers to response
    if (response && response instanceof Response) {
      const origin = request.headers.get('Origin');
      const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
      const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
      
      response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id, X-Session-Id');
    }
    
    return response;
  } catch (err) {
    // ... error handling
  }
}
```

## Important Notes

1. **`Access-Control-Allow-Credentials: true`** is **required** when using `credentials: 'include'` in fetch
2. **`Access-Control-Allow-Origin`** cannot be `*` when credentials are included - it must be a specific origin
3. **Preflight requests** (OPTIONS) must be handled before the actual request
4. **All workers** need CORS headers, not just the Auth worker

## Testing

After adding CORS:

1. Open browser DevTools → Network tab
2. Make a request from your frontend
3. Check the response headers - you should see:
   - `Access-Control-Allow-Origin: http://localhost:5173`
   - `Access-Control-Allow-Credentials: true`
4. Check for preflight OPTIONS request - it should return 204

## Common CORS Errors

- **"No 'Access-Control-Allow-Origin' header"**: CORS headers not set on backend
- **"Credentials flag is true, but 'Access-Control-Allow-Credentials' is not 'true'"**: Missing or incorrect credentials header
- **"Access-Control-Allow-Origin cannot be '*' when credentials are true"**: Must use specific origin, not wildcard

## Deployment

After updating your workers with CORS:

1. Deploy each worker: `wrangler deploy`
2. Test from your frontend
3. If using production frontend, add its URL to `allowedOrigins`

