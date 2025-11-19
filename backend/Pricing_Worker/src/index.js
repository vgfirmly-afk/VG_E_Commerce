// src/index.js
import { instrument } from '@microlabs/otel-cf-workers';
import { resolveConfig } from './utils/tracing.js';

import router from './routers/pricing.js';
import withLogger from './middleware/logger.js'; // expects the wrapper version
import { withCORS } from './middleware/cors.js';

// base fetch handler that delegates to your itty-router
async function baseFetch(request, env, ctx) {
  try {
    // attach env to request for downstream handlers (services that expect env)
    request.env = env;

    // delegate to itty-router
    const response = await router.handle(request, env, ctx);
    
    // Ensure we always return a Response object
    if (!response || !(response instanceof Response)) {
      console.error('Router did not return a Response:', response);
      return new Response(
        JSON.stringify({ error: 'internal_error', message: 'Router did not return a valid response' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return response;
  } catch (err) {
    console.error('baseFetch error:', err);
    return new Response(
      JSON.stringify({ 
        error: 'internal_error', 
        message: err?.message ?? String(err),
        stack: err?.stack 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// wrap the base handler with the logger wrapper (adds trace-id logging + response header)
const handlerWithLogger = withLogger(baseFetch);

// wrap with CORS middleware (allows all origins)
const handlerWithCORS = withCORS(handlerWithLogger);

// export the instrumented handler so otel-cf-workers sets up tracing first
// Wrap in try-catch to handle instrumentation errors gracefully
let exportedHandler;
try {
  exportedHandler = instrument({ fetch: handlerWithCORS }, resolveConfig);
} catch (err) {
  console.error('Failed to instrument handler, using fallback:', err);
  // Fallback: export handler without instrumentation if it fails
  exportedHandler = handlerWithCORS;
}

export default exportedHandler;
