# Quick CORS Fix for All Workers

## Step 1: Add CORS to Auth Worker

Edit `backend/Auth_Worker/src/index.js`:

```javascript
// src/index.js
import { instrument } from '@microlabs/otel-cf-workers';
import { resolveConfig } from './utils/tracing.js';

import router from './routers/auth.js';
import withLogger from './middleware/logger.js';
import { checkRateLimit, addRateLimitHeaders } from './middleware/rateLimit.js';

// CORS helper function
function addCORSHeaders(request, response) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
  ];
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', allowedOrigin);
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id, X-Session-Id');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers,
  });
}

// base fetch handler
async function baseFetch(request, env, ctx) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': request.headers.get('Origin') || 'http://localhost:5173',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id, X-Session-Id',
      },
    });
  }

  try {
    const rateLimitResponse = await checkRateLimit(request, env);
    if (rateLimitResponse) {
      return addCORSHeaders(request, rateLimitResponse);
    }

    request.env = env;
    const response = await router.handle(request, env, ctx);
    
    if (response && response instanceof Response) {
      addRateLimitHeaders(response, request);
      return addCORSHeaders(request, response);
    }
    
    return response;
  } catch (err) {
    const errorResponse = new Response(
      JSON.stringify({ error: 'internal_error', message: err?.message ?? String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
    return addCORSHeaders(request, errorResponse);
  }
}

const handlerWithLogger = withLogger(baseFetch);
export default instrument({ fetch: handlerWithLogger }, resolveConfig);
```

## Step 2: Repeat for Other Workers

Apply the same pattern to:
- `Cart_Worker/src/index.js`
- `Catalog_worker/src/index.js`
- `Invertory_Worker/src/index.js`
- `Pricing_Worker/src/index.js`

## Step 3: Deploy

```bash
cd backend/Auth_Worker && wrangler deploy
cd ../Cart_Worker && wrangler deploy
cd ../Catalog_worker && wrangler deploy
cd ../Invertory_Worker && wrangler deploy
cd ../Pricing_Worker && wrangler deploy
```

## Step 4: Test

1. Start your frontend: `npm run dev`
2. Open browser DevTools → Network tab
3. Try to login or make any API call
4. Check that requests succeed and response headers include CORS headers

