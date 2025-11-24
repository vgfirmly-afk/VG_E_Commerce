// src/router/router.js
import { Router } from "itty-router";
import * as authHandlers from "../handlers/authHandlers.js"; // adjust path if handlers live elsewhere

const router = Router();

// health check (optional)
router.get(
  "/_/health",
  () =>
    new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
);



// auth endpoints
router.post("/api/v1/auth/register", async (request, env, ctx) =>
  authHandlers.register(request, request.env || env, ctx),
);
router.post("/api/v1/auth/login", async (request, env, ctx) =>
  authHandlers.login(request, request.env || env, ctx),
);
router.post("/api/v1/auth/token/refresh", async (request, env, ctx) =>
  authHandlers.refreshToken(request, request.env || env, ctx),
);
router.post("/api/v1/auth/logout", async (request, env, ctx) =>
  authHandlers.logout(request, request.env || env, ctx),
);
router.get("/api/v1/auth/me", async (request, env, ctx) =>
  authHandlers.me(request, request.env || env, ctx),
);

// fallback
router.all(
  "*",
  () =>
    new Response(JSON.stringify({ error: "not_found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    }),
);

export default router;
