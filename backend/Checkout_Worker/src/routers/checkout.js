// routers/checkout.js
import { Router } from "itty-router";
import * as checkoutHandlers from "../handlers/checkoutHandlers.js";
import { validateBody } from "../middleware/validate.js";
import {
  validateCreateCheckoutSession,
  validateSetDeliveryAddress,
  validateSetBillingAddress,
  validateSelectShippingMethod,
  validateShippingMethod,
  validateShippingMethodUpdate,
} from "../utils/validators.js";

const router = Router();

// Health check
router.get("/_/health", async (request, env, ctx) => {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

// Create checkout session
router.post("/api/v1/checkout/sessions", async (request, env, ctx) => {
  try {
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

    const { error, value } = validateCreateCheckoutSession(body);
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

    request.validatedBody = value;
    return await checkoutHandlers.createSession(request, request.env || env);
  } catch (err) {
    console.error(
      "[Checkout Router] Error in POST /api/v1/checkout/sessions:",
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

router.post("/api/v1/checkout/checkout_cart", async (request, env, ctx) => {
  try {
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

    const { error, value } = validateCreateCheckoutSession(body);
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

    request.validatedBody = value;
    return await checkoutHandlers.createSession(request, request.env || env);
  } catch (err) {
    console.error(
      "[Checkout Router] Error in POST /api/v1/checkout/sessions:",
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

// Get checkout session
router.get(
  "/api/v1/checkout/sessions/:session_id",
  async (request, env, ctx) => {
    return checkoutHandlers.getSession(request, request.env || env);
  },
);

// Set delivery address
router.post(
  "/api/v1/checkout/sessions/:session_id/delivery-address",
  async (request, env, ctx) => {
    try {
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

      const { error, value } = validateSetDeliveryAddress(body);
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

      request.validatedBody = value;
      return await checkoutHandlers.setDeliveryAddress(
        request,
        request.env || env,
      );
    } catch (err) {
      console.error(
        "[Checkout Router] Error in POST /api/v1/checkout/sessions/:session_id/delivery-address:",
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

// Set billing address
router.post(
  "/api/v1/checkout/sessions/:session_id/billing-address",
  async (request, env, ctx) => {
    try {
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

      const { error, value } = validateSetBillingAddress(body);
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

      request.validatedBody = value;
      return await checkoutHandlers.setBillingAddress(
        request,
        request.env || env,
      );
    } catch (err) {
      console.error(
        "[Checkout Router] Error in POST /api/v1/checkout/sessions/:session_id/billing-address:",
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

// Get available shipping methods
router.get(
  "/api/v1/checkout/sessions/:session_id/shipping-methods",
  async (request, env, ctx) => {
    return checkoutHandlers.getShippingMethods(request, request.env || env);
  },
);

// Select shipping method
router.post(
  "/api/v1/checkout/sessions/:session_id/shipping-method",
  async (request, env, ctx) => {
    try {
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

      const { error, value } = validateSelectShippingMethod(body);
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

      request.validatedBody = value;
      return await checkoutHandlers.selectShippingMethod(
        request,
        request.env || env,
      );
    } catch (err) {
      console.error(
        "[Checkout Router] Error in POST /api/v1/checkout/sessions/:session_id/shipping-method:",
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

// Get checkout summary
router.get(
  "/api/v1/checkout/sessions/:session_id/summary",
  async (request, env, ctx) => {
    return checkoutHandlers.getSummary(request, request.env || env);
  },
);

// ==================== Admin Shipping Method Routes ====================

// Create shipping method (admin)
router.post("/api/v1/admin/shipping-methods", async (request, env, ctx) => {
  try {
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

    const { error, value } = validateShippingMethod(body);
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

    request.validatedBody = value;
    return await checkoutHandlers.createShippingMethod(
      request,
      request.env || env,
    );
  } catch (err) {
    console.error(
      "[Checkout Router] Error in POST /api/v1/admin/shipping-methods:",
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

// Get all shipping methods (admin)
router.get("/api/v1/admin/shipping-methods", async (request, env, ctx) => {
  return checkoutHandlers.getAllShippingMethods(request, request.env || env);
});

// Get shipping method by ID (admin)
router.get(
  "/api/v1/admin/shipping-methods/:method_id",
  async (request, env, ctx) => {
    return checkoutHandlers.getShippingMethodById(request, request.env || env);
  },
);

// Update shipping method (admin)
router.put(
  "/api/v1/admin/shipping-methods/:method_id",
  async (request, env, ctx) => {
    try {
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

      const { error, value } = validateShippingMethodUpdate(body);
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

      request.validatedBody = value;
      return await checkoutHandlers.updateShippingMethod(
        request,
        request.env || env,
      );
    } catch (err) {
      console.error(
        "[Checkout Router] Error in PUT /api/v1/admin/shipping-methods/:method_id:",
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

// Delete shipping method (admin)
router.delete(
  "/api/v1/admin/shipping-methods/:method_id",
  async (request, env, ctx) => {
    return checkoutHandlers.deleteShippingMethod(request, request.env || env);
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
      "[Checkout Router] Error in POST /api/v1/webhooks/payment-status:",
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
  return new Response(
    JSON.stringify({
      error: "not_found",
      message: `Route not found: ${request.method} ${new URL(request.url).pathname}`,
    }),
    { status: 404, headers: { "Content-Type": "application/json" } },
  );
});

export default router;
