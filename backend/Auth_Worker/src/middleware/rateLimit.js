// middleware/rateLimit.js
// Uses RATE_LIMIT_KV binding
export async function rateLimitMiddleware(request, env) {
  try {
    const kv = env.RATE_LIMIT_KV;
    if (!kv) return { ok: true }; // no kv bound -> allow

    // identify by IP + path
    const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'anon';
    const path = new URL(request.url).pathname;
    const key = `rl:${ip}:${path}`;
    const windowSeconds = 60; // 1 minute window
    const limit = 30; // max requests per window

    // increment counter atomically by using get -> put with check (KV has eventual consistency)
    const nowRaw = await kv.get(key);
    let count = nowRaw ? parseInt(nowRaw, 10) : 0;
    count += 1;
    await kv.put(key, String(count), { expirationTtl: windowSeconds });

    if (count > limit) {
      console.warn(`rateLimit: ${ip} exceeded ${limit} for ${path}`);
      return { ok: false, retry_after: windowSeconds };
    }
    return { ok: true, remaining: Math.max(0, limit - count) };
  } catch (err) {
    console.error('rateLimitMiddleware error', err);
    // If KV fails, do not block traffic — allow fallback
    return { ok: true };
  }
}
