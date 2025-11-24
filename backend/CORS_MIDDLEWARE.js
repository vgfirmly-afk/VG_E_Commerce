/**
 * CORS Middleware for Cloudflare Workers
 *
 * Copy this file to each worker's src/middleware/cors.js
 * Then import and use it in index.js
 */

/**
 * Handle CORS for requests
 * @param {Request} request - The incoming request
 * @param {Response|null} response - The response to add headers to (null for preflight)
 * @param {Object} env - Environment variables (optional, for allowed origins)
 * @returns {Response|Object} Response with CORS headers or headers object
 */
export function handleCORS(request, response = null, env = {}) {
  // Get the origin from the request
  const origin = request.headers.get("Origin");

  // List of allowed origins
  // Get from environment or use defaults
  const defaultOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  const envOrigins = env.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : [];

  const allowedOrigins = [...defaultOrigins, ...envOrigins];

  // Check if origin is allowed
  const isAllowedOrigin =
    origin &&
    allowedOrigins.some((allowed) => {
      return origin === allowed || origin.startsWith(allowed);
    });

  // Use the request origin if allowed, otherwise use first allowed origin
  const allowedOrigin = isAllowedOrigin ? origin : allowedOrigins[0] || "*";

  // Create headers
  const headers = new Headers();

  // Copy existing response headers if response exists
  if (response && response.headers) {
    response.headers.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  // Set CORS headers
  headers.set("Access-Control-Allow-Origin", allowedOrigin);
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  );
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-User-Id, X-Session-Id, X-Source",
  );
  headers.set("Access-Control-Allow-Credentials", "true"); // Required for cookies
  headers.set("Access-Control-Max-Age", "86400"); // 24 hours

  // If this is a preflight request, return early
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: headers,
    });
  }

  // For regular requests, return response with CORS headers
  if (response) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
  }

  // Return headers object if no response provided
  return { headers };
}

/**
 * CORS wrapper for fetch handlers
 * Usage: export default withCORS(baseFetch);
 */
export function withCORS(handler) {
  return async function (request, env, ctx) {
    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return handleCORS(request, null, env);
    }

    // Call the actual handler
    const response = await handler(request, env, ctx);

    // Add CORS headers to the response
    return handleCORS(request, response, env);
  };
}
