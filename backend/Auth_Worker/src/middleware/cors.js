// middleware/cors.js
// CORS middleware to allow all origins

/**
 * Handle CORS preflight requests (OPTIONS)
 */
export function handleCORS(request) {
  // Allow all origins - use the Origin header if present, otherwise allow all
  const origin = request.headers.get('Origin') || '*';
  
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id, X-Session-Id, X-Source, Accept',
      'Access-Control-Allow-Credentials': origin !== '*' ? 'true' : 'false',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}

/**
 * Add CORS headers to response
 */
export function addCORSHeaders(request, response) {
  if (!response || !(response instanceof Response)) {
    return response;
  }
  
  // Allow all origins - use the Origin header if present, otherwise allow all
  const origin = request.headers.get('Origin') || '*';
  const headers = new Headers(response.headers);
  
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id, X-Session-Id, X-Source, Accept');
  // Only set credentials if we have a specific origin (not '*')
  if (origin !== '*') {
    headers.set('Access-Control-Allow-Credentials', 'true');
  }
  headers.set('Access-Control-Max-Age', '86400');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers,
  });
}

/**
 * CORS wrapper for fetch handlers
 * Usage: export default withCORS(baseFetch);
 */
export function withCORS(handler) {
  return async function (request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }
    
    // Call the original handler
    const response = await handler(request, env, ctx);
    
    // Add CORS headers to the response
    return addCORSHeaders(request, response);
  };
}

