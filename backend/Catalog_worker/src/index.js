// src/index.js
import { instrument } from '@microlabs/otel-cf-workers';
import { resolveConfig } from './utils/tracing.js';

import router from './routers/catalog.js';
import withLogger from './middleware/logger.js'; // expects the wrapper version

// base fetch handler that delegates to your itty-router
async function baseFetch(request, env, ctx) {
  try {
    // attach env to request for downstream handlers (services that expect env)
    request.env = env;

    // delegate to itty-router
    const response = await router.handle(request, env, ctx);
    
    return response;
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err?.message ?? String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// wrap the base handler with the logger wrapper (adds trace-id logging + response header)
const handlerWithLogger = withLogger(baseFetch);

// export the instrumented handler so otel-cf-workers sets up tracing first
export default instrument({ fetch: handlerWithLogger }, resolveConfig);
