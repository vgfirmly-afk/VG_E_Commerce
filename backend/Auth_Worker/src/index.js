// src/index.js
import { instrument } from '@microlabs/otel-cf-workers';
import { resolveConfig } from './utils/tracing.js';

import router from './routers/auth.js';
import withLogger from './middleware/logger.js'; // expects the wrapper version
import { checkRateLimit, addRateLimitHeaders } from './middleware/rateLimit.js';

// base fetch handler that delegates to your itty-router
async function baseFetch(request, env, ctx) {
  try {
    // Check rate limit first (before processing request)
    const rateLimitResponse = await checkRateLimit(request, env);
    if (rateLimitResponse) {
      return rateLimitResponse; // Return 429 if rate limited
    }

    // attach env to request for downstream handlers (services that expect env)
    request.env = env;

    // delegate to itty-router
    const response = await router.handle(request, env, ctx);
    
    // Add rate limit headers to successful responses
    if (response && response instanceof Response) {
      addRateLimitHeaders(response, request);
    }
    
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
