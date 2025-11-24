import { verifyJWT } from "../utils/jwt.js";
import { getLog } from "../utils/logger.js";

export async function requireAuth(request) {
  const log = getLog();
  try {
    const auth = request.headers.get("authorization") || "";
    if (!auth.startsWith("Bearer "))
      return new Response(JSON.stringify({ error: "Missing token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });

    const token = auth.slice(7);
    const payload = await verifyJWT(token);
    // attach payload to request by adding header (itty-router doesn't allow mutation of Request) — handlers can re-verify via event
    request.user = payload;
    return null;
  } catch (err) {
    log.warn("auth.verify_failed", { msg: err?.message });
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Example admin check: you can change to roles/claims checking
export async function requireAuthAdmin(request) {
  const res = await requireAuth(request);
  if (res) return res;
  const payload = request.user;
  if (!payload || !payload.isAdmin)
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  return null;
}
