// routers/pricing.js
import { Router } from "itty-router";
import * as pricingHandlers from "../handlers/pricingHandlers.js";
import {
  requireAdmin,
  requireServiceOrAdmin,
} from "../middleware/adminAuth.js";

const router = Router();

// Health check - MUST be first route for itty-router matching
router.get("/_/health", async (request, env, ctx) => {
  // Log all incoming health check requests for debugging
  const url = new URL(request.url);
  console.log("[Pricing Router] Health check matched", {
    method: request.method,
    path: url.pathname,
    fullUrl: request.url,
    headers: {
      Accept: request.headers.get("Accept"),
      "Content-Type": request.headers.get("Content-Type"),
      "User-Agent": request.headers.get("User-Agent"),
      "CF-Ray": request.headers.get("CF-Ray"),
      Origin: request.headers.get("Origin"),
      "X-Source": request.headers.get("X-Source"),
    },
    timestamp: new Date().toISOString(),
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

// Public endpoints
// More specific routes first
router.get("/api/v1/prices/product/:product_id", async (request, env, ctx) => {
  try {
    return await pricingHandlers.getProductPrices(request, request.env || env);
  } catch (err) {
    console.error(
      "[Pricing Router] Error in GET /api/v1/prices/product/:product_id:",
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

router.get("/api/v1/prices/:sku_id/history", async (request, env, ctx) => {
  try {
    return await pricingHandlers.getHistory(request, request.env || env);
  } catch (err) {
    console.error(
      "[Pricing Router] Error in GET /api/v1/prices/:sku_id/history:",
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

// POST route MUST be defined BEFORE GET route for same path pattern in itty-router
// Initialize price (called by Catalog Worker when SKU is created)
// MUST come after history route to avoid route conflicts
// This is the ONLY endpoint that allows service binding
router.post("/api/v1/prices/:sku_id", async (request, env, ctx) => {
  try {
    console.log("[Pricing Router] POST /api/v1/prices/:sku_id matched", {
      method: request.method,
      url: request.url,
      pathname: new URL(request.url).pathname,
      params: request.params,
      headers: {
        "X-Source": request.headers.get("X-Source"),
        Authorization: request.headers.get("Authorization")
          ? "present"
          : "missing",
        "Content-Type": request.headers.get("Content-Type"),
      },
    });

    // Allow service binding OR admin JWT for initial price creation
    const authResult = await requireServiceOrAdmin(request, request.env || env);
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

    // Set user on request for handler
    request.user = authResult.user;

    return await pricingHandlers.initializePrice(request, request.env || env);
  } catch (err) {
    console.error(
      "[Pricing Router] Error in POST /api/v1/prices/:sku_id:",
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

router.get("/api/v1/prices/:sku_id", async (request, env, ctx) => {
  try {
    return await pricingHandlers.getPrice(request, request.env || env);
  } catch (err) {
    console.error("[Pricing Router] Error in GET /api/v1/prices/:sku_id:", err);
    return new Response(
      JSON.stringify({
        error: "internal_error",
        message: err?.message ?? String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

router.post("/api/v1/calculate-total", async (request, env, ctx) => {
  try {
    return await pricingHandlers.calculateTotal(request, request.env || env);
  } catch (err) {
    console.error(
      "[Pricing Router] Error in POST /api/v1/calculate-total:",
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

// Update price (admin only - JWT required)
router.put("/api/v1/prices/:sku_id", async (request, env, ctx) => {
  try {
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
    // Set user on request for handler
    request.user = authResult.user;
    return await pricingHandlers.updatePrice(request, request.env || env);
  } catch (err) {
    console.error("[Pricing Router] Error in PUT /api/v1/prices/:sku_id:", err);
    return new Response(
      JSON.stringify({
        error: "internal_error",
        message: err?.message ?? String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

// Delete price (admin only - JWT required)
router.delete("/api/v1/prices/:sku_id", async (request, env, ctx) => {
  try {
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
    // Set user on request for handler
    request.user = authResult.user;
    return await pricingHandlers.deletePrice(request, request.env || env);
  } catch (err) {
    console.error(
      "[Pricing Router] Error in DELETE /api/v1/prices/:sku_id:",
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

// Promotion Code endpoints (admin only - JWT required)
// List promotion codes
router.get("/api/v1/promotion-codes", async (request, env, ctx) => {
  try {
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
    request.user = authResult.user;
    return await pricingHandlers.listPromotionCodes(
      request,
      request.env || env,
    );
  } catch (err) {
    console.error(
      "[Pricing Router] Error in GET /api/v1/promotion-codes:",
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

// Get promotion code by ID
router.get(
  "/api/v1/promotion-codes/:promotion_id",
  async (request, env, ctx) => {
    try {
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
      request.user = authResult.user;
      return await pricingHandlers.getPromotionCode(
        request,
        request.env || env,
      );
    } catch (err) {
      console.error(
        "[Pricing Router] Error in GET /api/v1/promotion-codes/:promotion_id:",
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

// Create promotion code
router.post("/api/v1/promotion-codes", async (request, env, ctx) => {
  try {
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
    request.user = authResult.user;
    return await pricingHandlers.createPromotionCode(
      request,
      request.env || env,
    );
  } catch (err) {
    console.error(
      "[Pricing Router] Error in POST /api/v1/promotion-codes:",
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

// Update promotion code
router.put(
  "/api/v1/promotion-codes/:promotion_id",
  async (request, env, ctx) => {
    try {
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
      request.user = authResult.user;
      return await pricingHandlers.updatePromotionCode(
        request,
        request.env || env,
      );
    } catch (err) {
      console.error(
        "[Pricing Router] Error in PUT /api/v1/promotion-codes/:promotion_id:",
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

// Delete promotion code
router.delete(
  "/api/v1/promotion-codes/:promotion_id",
  async (request, env, ctx) => {
    try {
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
      request.user = authResult.user;
      return await pricingHandlers.deletePromotionCode(
        request,
        request.env || env,
      );
    } catch (err) {
      console.error(
        "[Pricing Router] Error in DELETE /api/v1/promotion-codes/:promotion_id:",
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

// Fallback - catch all unmatched routes
router.all("*", async (request) => {
  const url = new URL(request.url);
  const logData = {
    method: request.method,
    path: url.pathname,
    searchParams: url.searchParams.toString(),
    headers: {
      "X-Source": request.headers.get("X-Source"),
      Origin: request.headers.get("Origin"),
      hasAuth: !!request.headers.get("Authorization"),
      "Content-Type": request.headers.get("Content-Type"),
      "User-Agent": request.headers.get("User-Agent"),
      "CF-Ray": request.headers.get("CF-Ray"),
    },
    timestamp: new Date().toISOString(),
  };
  console.error("[Pricing Router] Route not found:", logData);

  // Special logging for health check failures
  if (request.method === "GET" && url.pathname === "/_/health") {
    console.error(
      "[Pricing Router] CRITICAL: Health check endpoint not matched!",
      {
        path: url.pathname,
        expectedRoute: "GET /_/health",
        allRoutes: [
          "GET /_/health",
          "GET /api/v1/prices/product/:product_id",
          "GET /api/v1/prices/:sku_id/history",
          "POST /api/v1/prices/:sku_id",
          "GET /api/v1/prices/:sku_id",
          "POST /api/v1/calculate-total",
          "PUT /api/v1/prices/:sku_id",
          "DELETE /api/v1/prices/:sku_id",
        ],
        requestDetails: logData,
      },
    );
  }

  // If this is a POST to /api/v1/prices/:something, log special warning
  if (request.method === "POST" && url.pathname.startsWith("/api/v1/prices/")) {
    console.error(
      "[Pricing Router] CRITICAL: POST request to prices endpoint not matched!",
      {
        path: url.pathname,
        expectedPattern: "/api/v1/prices/:sku_id",
        allRoutes: [
          "GET /api/v1/prices/product/:product_id",
          "GET /api/v1/prices/:sku_id/history",
          "GET /api/v1/prices/:sku_id",
          "POST /api/v1/calculate-total",
          "POST /api/v1/prices/:sku_id", // This should match!
          "PUT /api/v1/prices/:sku_id",
          "DELETE /api/v1/prices/:sku_id",
        ],
      },
    );
  }

  return new Response(
    JSON.stringify({
      error: "not_found",
      message: "Endpoint not found",
      path: url.pathname,
      method: request.method,
      hint: "Check that the Pricing Worker is deployed with the latest code",
      routes: [
        "GET /_/health",
        "POST /api/v1/prices/:sku_id",
        "GET /api/v1/prices/:sku_id",
      ],
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
