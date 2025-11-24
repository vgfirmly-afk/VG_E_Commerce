// routers/catalog.js
import { Router } from "itty-router";
import * as catalogHandlers from "../handlers/catalogHandlers.js";
import * as adminHandlers from "../handlers/adminHandlers.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = Router();

// Health check
router.get(
  "/_/health",
  () =>
    new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
);

// Public endpoints
router.get("/api/v1/products", async (request, env, ctx) =>
  catalogHandlers.listProducts(request, request.env || env),
);
router.get("/api/v1/products/:product_id", async (request, env, ctx) =>
  catalogHandlers.getProduct(request, request.env || env),
);
router.get(
  "/api/v1/products/:product_id/images/:image_id",
  async (request, env, ctx) =>
    catalogHandlers.getProductImage(request, request.env || env),
);
router.get("/api/v1/home", async (request, env, ctx) =>
  catalogHandlers.getHomePage(request, request.env || env),
);
router.get("/api/v1/search", async (request, env, ctx) =>
  catalogHandlers.searchProductsHandler(request, request.env || env),
);

// Admin endpoints (require authentication)
// Product CRUD
router.post("/api/v1/products", async (request, env, ctx) => {
  const authResult = await requireAdmin(request, request.env || env);
  if (!authResult.ok) {
    return new Response(
      JSON.stringify({ error: authResult.error, message: authResult.message }),
      {
        status: authResult.status,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  return adminHandlers.createProduct(request, request.env || env);
});

router.put("/api/v1/products/:product_id", async (request, env, ctx) => {
  const authResult = await requireAdmin(request, request.env || env);
  if (!authResult.ok) {
    return new Response(
      JSON.stringify({ error: authResult.error, message: authResult.message }),
      {
        status: authResult.status,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  return adminHandlers.updateProduct(request, request.env || env);
});

router.delete("/api/v1/products/:product_id", async (request, env, ctx) => {
  const authResult = await requireAdmin(request, request.env || env);
  if (!authResult.ok) {
    return new Response(
      JSON.stringify({ error: authResult.error, message: authResult.message }),
      {
        status: authResult.status,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  return adminHandlers.deleteProduct(request, request.env || env);
});

// SKU CRUD
router.post("/api/v1/products/:product_id/skus", async (request, env, ctx) => {
  const authResult = await requireAdmin(request, request.env || env);
  if (!authResult.ok) {
    return new Response(
      JSON.stringify({ error: authResult.error, message: authResult.message }),
      {
        status: authResult.status,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  return adminHandlers.createSku(request, request.env || env);
});

router.put(
  "/api/v1/products/:product_id/skus/:sku_id",
  async (request, env, ctx) => {
    const authResult = await requireAdmin(request, request.env || env);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({
          error: authResult.error,
          message: authResult.message,
        }),
        {
          status: authResult.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    return adminHandlers.updateSku(request, request.env || env);
  },
);

router.delete(
  "/api/v1/products/:product_id/skus/:sku_id",
  async (request, env, ctx) => {
    const authResult = await requireAdmin(request, request.env || env);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({
          error: authResult.error,
          message: authResult.message,
        }),
        {
          status: authResult.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    return adminHandlers.deleteSku(request, request.env || env);
  },
);

// Image upload
router.post(
  "/api/v1/products/:product_id/images",
  async (request, env, ctx) => {
    const authResult = await requireAdmin(request, request.env || env);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({
          error: authResult.error,
          message: authResult.message,
        }),
        {
          status: authResult.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    return adminHandlers.uploadProductImage(request, request.env || env);
  },
);

// Fallback - catch all unmatched routes
router.all("*", async (request) => {
  return new Response(
    JSON.stringify({
      error: "not_found",
      message: "Endpoint not found",
      path: new URL(request.url).pathname,
      method: request.method,
    }),
    { status: 404, headers: { "Content-Type": "application/json" } },
  );
});

// Export router with safety wrapper
const safeRouter = {
  async handle(request, env, ctx) {
    try {
      const response = await router.handle(request, env, ctx);
      // Ensure we always return a Response
      if (!response || !(response instanceof Response)) {
        console.error("Router returned invalid response:", response);
        return new Response(
          JSON.stringify({
            error: "internal_error",
            message: "Router did not return a valid response",
            path: new URL(request.url).pathname,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }
      return response;
    } catch (err) {
      console.error("Router handle error:", err);
      return new Response(
        JSON.stringify({
          error: "internal_error",
          message: err?.message ?? String(err),
          path: new URL(request.url).pathname,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
};

export default safeRouter;
