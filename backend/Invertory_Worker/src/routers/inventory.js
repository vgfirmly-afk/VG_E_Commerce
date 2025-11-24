// routers/inventory.js
import { Router } from "itty-router";
import * as inventoryHandlers from "../handlers/inventoryHandlers.js";
import {
  requireAdmin,
  requireServiceOrAdmin,
} from "../middleware/adminAuth.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import {
  validateSkuStockUpdate,
  validateStockAdjustment,
  validateReserveStock,
  validateReleaseStock,
  validateCheckStock,
} from "../utils/validators.js";
import { logger } from "../utils/logger.js";

const router = Router();

// Health check - MUST be first route for itty-router matching
router.get("/_/health", async (request, env, ctx) => {
  console.log("[Inventory Router] Health check matched", {
    method: request.method,
    url: request.url,
    timestamp: new Date().toISOString(),
  });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

// Public endpoints
// More specific route first (product stock) before single SKU route
router.get("/api/v1/stock/product/:product_id", async (request, env, ctx) => {
  try {
    return await inventoryHandlers.getProductStock(request, request.env || env);
  } catch (err) {
    console.error(
      "[Inventory Router] Error in GET /api/v1/stock/product/:product_id:",
      err,
    );
    return new Response(
      JSON.stringify({
        error: "internal_error",
        message: err?.message ?? String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

router.get("/api/v1/stock/:sku_id", async (request, env, ctx) => {
  try {
    return await inventoryHandlers.getStock(request, request.env || env);
  } catch (err) {
    console.error(
      "[Inventory Router] Error in GET /api/v1/stock/:sku_id:",
      err,
    );
    return new Response(
      JSON.stringify({
        error: "internal_error",
        message: err?.message ?? String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

router.get("/api/v1/stock/:sku_id/history", async (request, env, ctx) => {
  try {
    return await inventoryHandlers.getHistory(request, request.env || env);
  } catch (err) {
    console.error(
      "[Inventory Router] Error in GET /api/v1/stock/:sku_id/history:",
      err,
    );
    return new Response(
      JSON.stringify({
        error: "internal_error",
        message: err?.message ?? String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

// Check stock availability - Using different path to avoid route conflicts with /api/v1/stock/:sku_id
// This endpoint is PUBLIC and does NOT require authentication
router.post("/api/v1/check-stock", async (request, env, ctx) => {
  try {
    console.log(
      "[Inventory Router] POST /api/v1/check-stock matched (PUBLIC ENDPOINT)",
      {
        method: request.method,
        url: request.url,
        pathname: new URL(request.url).pathname,
        hasAuthHeader: !!request.headers.get("Authorization"),
        timestamp: new Date().toISOString(),
      },
    );

    // Validate request body directly (no middleware)
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Content-Type must be application/json",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Invalid JSON in request body",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Validate with schema
    const { error, value } = validateCheckStock(body);
    if (error) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Invalid request data",
          details: error.details.map((d) => ({
            path: d.path.join("."),
            message: d.message,
            type: d.type,
          })),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Attach validated data to request
    request.validatedBody = value;

    return await inventoryHandlers.checkAvailability(
      request,
      request.env || env,
    );
  } catch (err) {
    console.error("[Inventory Router] Error in POST /api/v1/check-stock:", err);
    return new Response(
      JSON.stringify({
        error: "internal_error",
        message: err?.message ?? String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

// Legacy endpoint - kept for backward compatibility but redirects to new path
router.post("/api/v1/stock/check", async (request, env, ctx) => {
  console.log(
    "[Inventory Router] POST /api/v1/stock/check - redirecting to /api/v1/check-stock",
  );
  // Return a helpful error message directing users to the new endpoint
  return new Response(
    JSON.stringify({
      error: "endpoint_moved",
      message:
        "This endpoint has been moved. Please use POST /api/v1/check-stock instead.",
      new_endpoint: "/api/v1/check-stock",
    }),
    {
      status: 301,
      headers: {
        "Content-Type": "application/json",
        Location: "/api/v1/check-stock",
      },
    },
  );
});

// Admin/Service endpoints - POST route MUST be defined BEFORE GET route for same path pattern
// Initialize stock (called by Catalog Worker when SKU is created)
// This is the ONLY endpoint that allows service binding
router.post("/api/v1/stock/:sku_id", async (request, env, ctx) => {
  try {
    const skuId = request.params?.sku_id;

    // IMPORTANT: Prevent /api/v1/stock/check from matching this route
    // The check endpoint should be matched by the more specific route above
    if (skuId === "check") {
      console.log(
        '[Inventory Router] POST /api/v1/stock/:sku_id matched with sku_id="check" - this should not happen, returning 404',
      );
      return new Response(
        JSON.stringify({
          error: "not_found",
          message:
            "Route not found. Use POST /api/v1/stock/check for checking stock availability.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log("[Inventory Router] POST /api/v1/stock/:sku_id matched", {
      method: request.method,
      url: request.url,
      skuId: skuId,
      timestamp: new Date().toISOString(),
    });

    // Allow service binding OR admin JWT for initial stock creation
    const authResult = await requireServiceOrAdmin(request, request.env || env);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({
          error: authResult.error || "unauthorized",
          message: authResult.message || "Unauthorized",
        }),
        {
          status: authResult.status || 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Set user on request for handler
    request.user = authResult.user;

    return await inventoryHandlers.initializeStock(request, request.env || env);
  } catch (err) {
    console.error(
      "[Inventory Router] Error in POST /api/v1/stock/:sku_id:",
      err,
    );
    return new Response(
      JSON.stringify({
        error: "internal_error",
        message: err?.message ?? String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

// Update stock (admin only - JWT required)
router.put(
  "/api/v1/stock/:sku_id",
  // validateBody(validateSkuStockUpdate),
  async (request, env, ctx) => {
    try {
      const authResult = await requireAdmin(request, request.env || env);
      if (!authResult.ok) {
        return new Response(
          JSON.stringify({
            error: authResult.error || "unauthorized",
            message: authResult.message || "Unauthorized",
          }),
          {
            status: authResult.status || 401,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
      request.user = authResult.user;
      return await inventoryHandlers.updateStock(request, request.env || env);
    } catch (err) {
      console.error(
        "[Inventory Router] Error in PUT /api/v1/stock/:sku_id:",
        err,
      );
      return new Response(
        JSON.stringify({
          error: "internal_error",
          message: err?.message ?? String(err),
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
);

// Adjust stock (admin only - JWT required)
router.post(
  "/api/v1/stock/:sku_id/adjust",
  // validateBody(validateStockAdjustment),
  async (request, env, ctx) => {
    try {
      const authResult = await requireAdmin(request, request.env || env);
      if (!authResult.ok) {
        return new Response(
          JSON.stringify({
            error: authResult.error || "unauthorized",
            message: authResult.message || "Unauthorized",
          }),
          {
            status: authResult.status || 401,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
      request.user = authResult.user;
      return await inventoryHandlers.adjustStock(request, request.env || env);
    } catch (err) {
      console.error(
        "[Inventory Router] Error in POST /api/v1/stock/:sku_id/adjust:",
        err,
      );
      return new Response(
        JSON.stringify({
          error: "internal_error",
          message: err?.message ?? String(err),
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
);

// Reserve stock (for cart/checkout - can be called by users or services)
router.post(
  "/api/v1/stock/:sku_id/reserve",
  // validateBody(validateReserveStock),
  async (request, env, ctx) => {
    try {
      // Reserve can be called by users (for cart) or services
      // For now, allow any authenticated request or use X-User-Id header
      const userId = request.headers.get("X-User-Id") || "user";
      request.user = { userId, role: "user" };
      return await inventoryHandlers.reserveStock(request, request.env || env);
    } catch (err) {
      console.error(
        "[Inventory Router] Error in POST /api/v1/stock/:sku_id/reserve:",
        err,
      );
      const status = err.message.includes("Insufficient") ? 400 : 500;
      return new Response(
        JSON.stringify({
          error: "internal_error",
          message: err?.message ?? String(err),
        }),
        { status, headers: { "Content-Type": "application/json" } },
      );
    }
  },
);

// Release reserved stock (for cart abandonment - can be called by users or services)
router.post(
  "/api/v1/stock/:sku_id/release",
  // validateBody(validateReleaseStock),
  async (request, env, ctx) => {
    try {
      // Release can be called by users (for cart) or services
      const userId = request.headers.get("X-User-Id") || "user";
      request.user = { userId, role: "user" };
      return await inventoryHandlers.releaseStock(request, request.env || env);
    } catch (err) {
      console.error(
        "[Inventory Router] Error in POST /api/v1/stock/:sku_id/release:",
        err,
      );
      return new Response(
        JSON.stringify({
          error: "internal_error",
          message: err?.message ?? String(err),
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
);

// Webhook endpoint for payment status updates (called by Payment Worker)
router.post("/api/v1/webhooks/payment-status", async (request, env, ctx) => {
  try {
    const webhookHandlers = await import("../handlers/webhookHandlers.js");
    return webhookHandlers.handlePaymentStatusWebhook(
      request,
      request.env || env,
    );
  } catch (err) {
    console.error(
      "[Inventory Router] Error in POST /api/v1/webhooks/payment-status:",
      err,
    );
    return new Response(
      JSON.stringify({
        error: "internal_error",
        message: err?.message ?? String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

// Fallback route
router.all("*", async (request) => {
  console.log("[Inventory Router] 404 - Route not found", {
    method: request.method,
    url: request.url,
    pathname: new URL(request.url).pathname,
  });

  return new Response(
    JSON.stringify({
      error: "not_found",
      message: `Route not found: ${request.method} ${new URL(request.url).pathname}`,
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
