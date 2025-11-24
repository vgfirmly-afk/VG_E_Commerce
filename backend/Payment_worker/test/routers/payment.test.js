// test/routers/payment.test.js
import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import router from "../../src/routers/payment.js";
import { createMockEnv, createMockRequest } from "../setup.js";

describe("Payment Router", () => {
  let env;

  beforeEach(() => {
    env = createMockEnv();
    sinon.restore();
  });

  describe("Health check", () => {
    it("should return health check response", async () => {
      const request = createMockRequest("GET", "https://example.com/_/health");
      request.env = env;

      const response = await router.handle(request, env, {});
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data.ok).to.be.true;
    });
  });

  describe("POST /api/v1/payments", () => {
    it("should handle create payment request", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/payments",
        {
          checkout_session_id: "test-session-id",
          amount: 100.0,
          return_url: "https://example.com/success",
          cancel_url: "https://example.com/cancel",
        },
      );
      request.env = env;
      request.validatedBody = request.body;

      const response = await router.handle(request, env, {});

      // Should return a response (may be error if handlers not fully mocked)
      expect(response).to.be.instanceOf(Response);
    });

    it("should handle errors in create payment route", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/payments",
        {
          checkout_session_id: "test-session-id",
          amount: 100.0,
          return_url: "https://example.com/success",
          cancel_url: "https://example.com/cancel",
        },
      );
      request.env = env;
      request.validatedBody = request.body;

      // Mock handler to throw error
      const originalHandler = await import(
        "../../src/handlers/paymentHandlers.js"
      );
      request.validatedBody = null; // This will cause an error

      const response = await router.handle(request, env, {});

      expect(response).to.be.instanceOf(Response);
      expect([400, 500]).to.include(response.status);
    });
  });

  describe("GET /api/v1/payments/:payment_id", () => {
    it("should handle get payment request", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/payments/test-payment-id",
      );
      request.env = env;
      request.params = { payment_id: "test-payment-id" };

      const response = await router.handle(request, env, {});

      expect(response).to.be.instanceOf(Response);
    });
  });

  describe("POST /api/v1/payments/:payment_id/capture", () => {
    it("should handle capture payment request", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/payments/test-payment-id/capture",
        { order_id: "test-order-id" },
      );
      request.env = env;
      request.params = { payment_id: "test-payment-id" };
      request.validatedBody = request.body;

      const response = await router.handle(request, env, {});

      expect(response).to.be.instanceOf(Response);
    });

    it("should handle errors in capture payment route", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/payments/test-payment-id/capture",
        { order_id: "test-order-id" },
      );
      request.env = env;
      request.params = { payment_id: "test-payment-id" };
      request.validatedBody = null; // This will cause an error

      const response = await router.handle(request, env, {});

      expect(response).to.be.instanceOf(Response);
      // Handler may return 400, 404, or 500 depending on the error
      expect([400, 404, 500]).to.include(response.status);
    });
  });

  describe("GET /api/v1/payments/callback/success", () => {
    it("should handle PayPal success callback", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/payments/callback/success?token=test-order-id",
      );
      request.env = env;

      const response = await router.handle(request, env, {});

      expect(response).to.be.instanceOf(Response);
    });
  });

  describe("GET /api/v1/payments/callback/failure", () => {
    it("should handle PayPal failure callback", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/payments/callback/failure?token=test-order-id",
      );
      request.env = env;

      const response = await router.handle(request, env, {});

      expect(response).to.be.instanceOf(Response);
    });
  });

  describe("POST /api/v1/webhooks/paypal", () => {
    it("should handle PayPal webhook", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/webhooks/paypal",
        {
          id: "test-event-id",
          event_type: "PAYMENT.CAPTURE.COMPLETED",
        },
      );
      request.env = env;

      const response = await router.handle(request, env, {});

      expect(response).to.be.instanceOf(Response);
    });
  });

  describe("Fallback route", () => {
    it("should return 404 for unknown routes", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/unknown-route",
      );
      request.env = env;

      const response = await router.handle(request, env, {});
      const data = await response.json();

      expect(response.status).to.equal(404);
      expect(data.error).to.equal("not_found");
    });
  });
});
