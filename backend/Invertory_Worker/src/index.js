// src/index.js
import { instrument } from '@microlabs/otel-cf-workers';
import { resolveConfig } from './utils/tracing.js';

import router from './routers/inventory.js';
import withLogger from './middleware/logger.js'; // expects the wrapper version

// base fetch handler that delegates to your itty-router
async function baseFetch(request, env, ctx) {
  try {
    // attach env and ctx to request for downstream handlers (services that expect env and ctx)
    request.env = env;
    request.ctx = ctx;

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

// export the instrumented handler so otel-cf-workers sets up tracing first
// Wrap in try-catch to handle instrumentation errors gracefully
let exportedHandler;
try {
  exportedHandler = instrument({ fetch: handlerWithLogger }, resolveConfig);
} catch (err) {
  console.error('Failed to instrument handler, using fallback:', err);
  // Fallback: export handler without instrumentation if it fails
  exportedHandler = handlerWithLogger;
}

export default exportedHandler;
