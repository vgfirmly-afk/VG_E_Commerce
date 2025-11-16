// middleware/rateLimit.js
import { logWarn, logError, logInfo } from '../utils/logger.js';
import { RATE_LIMIT_WINDOW_SECONDS, RATE_LIMIT_MAX_REQUESTS } from '../../config.js';
/**
 * Rate limit middleware for Cloudflare Workers
 * Uses KV store to track request counts per IP + path
 * 
 * @param {Request} request - The incoming request
 * @param {Object} env - Worker environment with RATE_LIMIT_KV binding
 * @returns {Promise<{ok: boolean, remaining?: number, retry_after?: number}>}
 */
export async function rateLimitMiddleware(request, env) {
  try {
    const kv = env.RATE_LIMIT_KV;
    if (!kv) {
      logInfo('rateLimit: KV not bound, allowing request', {});
      return { ok: true, limit: 0, remaining: 0, windowSeconds: 60 }; // no kv bound -> allow
    }

    // Identify by IP + path
    const ip = request.headers.get('CF-Connecting-IP') || 
               request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               'anon';
    const path = new URL(request.url).pathname;
    const key = `rl:${ip}:${path}`;
    
    // Rate limit configuration (can be overridden via env vars)
    const windowSeconds = parseInt(RATE_LIMIT_WINDOW_SECONDS, 10);
    const limit = parseInt(RATE_LIMIT_MAX_REQUESTS, 10);

    // Get current count
    const nowRaw = await kv.get(key);
    let count = nowRaw ? parseInt(nowRaw, 10) : 0;
    
    // Increment counter first
    count += 1;
    
    // Check if exceeded after incrementing
    if (count > limit) {
      // Still store the incremented count (for tracking)
      await kv.put(key, String(count), { expirationTtl: windowSeconds });
      logWarn('rateLimit: Rate limit exceeded', { ip, limit, path, count });
      return { 
        ok: false, 
        retry_after: windowSeconds,
        limit,
        count,
        windowSeconds
      };
    }
    
    // Store with expiration (KV will auto-expire after windowSeconds)
    await kv.put(key, String(count), { expirationTtl: windowSeconds });

    const remaining = Math.max(0, limit - count);
    logInfo('rateLimit: Request allowed', { ip, path, count, remaining, limit });
    
    return { 
      ok: true, 
      remaining,
      limit,
      count,
      windowSeconds
    };
  } catch (err) {
    logError('rateLimitMiddleware error', err, { function: 'rateLimitMiddleware' });
    // If KV fails, do not block traffic — allow fallback (fail open)
    return { ok: true };
  }
}

/**
 * Rate limit wrapper that returns a Response if rate limited
 * Also stores rate limit info in request for adding headers to response
 * Use this in your router/handlers
 */
export async function checkRateLimit(request, env) {
  const result = await rateLimitMiddleware(request, env);
  
  // Store rate limit info in request for adding headers to response
  if (request && result.ok) {
    request._rateLimitInfo = {
      limit: result.limit,
      remaining: result.remaining,
      reset: Math.floor(Date.now() / 1000) + (result.windowSeconds || 60) // reset after window
    };
  }
  
  if (!result.ok) {
    return new Response(
      JSON.stringify({ 
        error: 'rate_limit_exceeded',
        message: 'Too many requests. Please try again later.',
        retry_after: result.retry_after 
      }),
      { 
        status: 429,
        headers: { 
          'Content-Type': 'application/json',
          'Retry-After': String(result.retry_after || 60),
          'X-RateLimit-Limit': String(result.limit || 10),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + (result.retry_after || 60))
        }
      }
    );
  }
  
  return null; // No rate limit issue, continue
}

/**
 * Add rate limit headers to a response
 * Call this after creating a response to add rate limit headers
 */
export function addRateLimitHeaders(response, request) {
  if (!response || !request?._rateLimitInfo) return response;
  
  try {
    const { limit, remaining, reset } = request._rateLimitInfo;
    response.headers.set('X-RateLimit-Limit', String(limit));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Reset', String(reset));
  } catch (e) {
    // Don't fail if headers can't be set
  }
  
  return response;
}
