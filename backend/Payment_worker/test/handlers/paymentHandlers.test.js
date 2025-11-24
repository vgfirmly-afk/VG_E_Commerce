// test/handlers/paymentHandlers.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as handlers from "../../src/handlers/paymentHandlers.js";
import { createMockEnv, createMockRequest } from "../setup.js";

describe("Payment Handlers", () => {
  let env;

  beforeEach(() => {
    env = createMockEnv();
    sinon.restore();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createPayment", () => {
    it("should create payment intent successfully", async () => {
      const request = createMockRequest("POST", "https://example.com/api/v1/payments", {
        checkout_session_id: "test-session-id",
        amount: 100.0,
        return_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
      });
      request.validatedBody = request.body;

      // Mock database - no existing payment
      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(null);
      // Mock PayPal OAuth
      const fetchStub = sinon.stub(global, "fetch");
      fetchStub.onCall(0).resolves(
        new Response(
          JSON.stringify({ access_token: "test-token", expires_in: 3600 }),
          { status: 200 },
        ),
      );
      // Mock PayPal order creation
      fetchStub.onCall(1).resolves(
        new Response(
          JSON.stringify({
            id: "test-order-id",
            status: "CREATED",
            links: [{ rel: "approve", href: "https://paypal.com/approve" }],
          }),
          { status: 201 },
        ),
      );
      // Mock payment creation
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare().bind().first.onCall(1).resolves({
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        order_id: "test-order-id",
        status: "created",
        amount: 100.0,
      });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });

      const response = await handlers.createPayment(request, env);
      const data = await response.json();

      expect(response.status).to.equal(201);
      expect(data.payment_id).to.exist;
      fetchStub.restore();
    });

    it("should handle service errors", async () => {
      const request = createMockRequest("POST", "https://example.com/api/v1/payments", {
        checkout_session_id: "test-session-id",
        amount: 100.0,
      });
      request.validatedBody = request.body;

      // Mock database error - this will cause service to throw
      env.PAYMENT_DB.prepare().bind().first.rejects(new Error("Database error"));

      const response = await handlers.createPayment(request, env);
      const data = await response.json();

      // Handler catches error and returns appropriate status
      expect([404, 500]).to.include(response.status);
      expect(data.error).to.equal("internal_error");
    });

    it("should handle not found errors", async () => {
      const request = createMockRequest("POST", "https://example.com/api/v1/payments", {
        checkout_session_id: "test-session-id",
        amount: 100.0,
      });
      request.validatedBody = request.body;

      env.PAYMENT_DB.prepare().bind().first.resolves(null);
      const fetchStub = sinon.stub(global, "fetch");
      fetchStub.onCall(0).resolves(
        new Response(
          JSON.stringify({ access_token: "test-token" }),
          { status: 200 },
        ),
      );
      fetchStub.onCall(1).rejects(new Error("Payment not found"));

      const response = await handlers.createPayment(request, env);
      // Handler catches error and returns 500
      expect([404, 500]).to.include(response.status);
      fetchStub.restore();
    });
  });

  describe("capturePayment", () => {
    it("should capture payment successfully", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/payments/test-payment-id/capture",
        { order_id: "test-order-id" },
      );
      request.params = { payment_id: "test-payment-id" };
      request.validatedBody = request.body;

      // Mock payment lookup
      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves({
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        status: "approved",
      });
      // Mock PayPal OAuth
      const fetchStub = sinon.stub(global, "fetch");
      fetchStub.onCall(0).resolves(
        new Response(
          JSON.stringify({ access_token: "test-token" }),
          { status: 200 },
        ),
      );
      // Mock PayPal capture
      fetchStub.onCall(1).resolves(
        new Response(
          JSON.stringify({
            id: "test-capture-id",
            status: "COMPLETED",
            purchase_units: [
              {
                payments: {
                  captures: [
                    {
                      id: "test-transaction-id",
                      amount: { value: "100.00" },
                    },
                  ],
                },
              },
            ],
            payer: { email_address: "test@example.com", name: { given_name: "Test", surname: "User" } },
          }),
          { status: 200 },
        ),
      );
      // Mock payment update
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare().bind().first.onCall(1).resolves({
        payment_id: "test-payment-id",
        status: "captured",
      });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });

      const response = await handlers.capturePayment(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data.status).to.equal("captured");
      fetchStub.restore();
    });

    it("should return 400 for invalid payment ID", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/payments//capture",
        {},
      );
      request.params = { payment_id: "" };
      request.validatedBody = {};

      const response = await handlers.capturePayment(request, env);
      expect(response.status).to.equal(400);
    });

    it("should return 400 for invalid capture data", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/payments/test-payment-id/capture",
        { order_id: "" },
      );
      request.params = { payment_id: "test-payment-id" };
      request.validatedBody = { order_id: "" };

      const response = await handlers.capturePayment(request, env);
      expect(response.status).to.equal(400);
    });

    it("should handle service errors", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/payments/test-payment-id/capture",
        { order_id: "test-order-id" },
      );
      request.params = { payment_id: "test-payment-id" };
      request.validatedBody = request.body;

      env.PAYMENT_DB.prepare().bind().first.rejects(new Error("Payment not found"));

      const response = await handlers.capturePayment(request, env);
      expect(response.status).to.equal(404);
    });

    it("should handle capture denied errors", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/payments/test-payment-id/capture",
        { order_id: "test-order-id" },
      );
      request.params = { payment_id: "test-payment-id" };
      request.validatedBody = request.body;

      env.PAYMENT_DB.prepare().bind().first.resolves({
        payment_id: "test-payment-id",
        status: "cancelled",
      });

      const response = await handlers.capturePayment(request, env);
      expect(response.status).to.equal(400);
    });
  });

  describe("getPayment", () => {
    it("should get payment status successfully", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/payments/test-payment-id",
      );
      request.params = { payment_id: "test-payment-id" };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves({
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        status: "created",
      });

      const response = await handlers.getPayment(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data.payment_id).to.equal("test-payment-id");
    });

    it("should return 400 for invalid payment ID", async () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/payments/");
      request.params = { payment_id: "" };

      const response = await handlers.getPayment(request, env);
      expect(response.status).to.equal(400);
    });

    it("should handle not found errors", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/payments/test-payment-id",
      );
      request.params = { payment_id: "test-payment-id" };

      // Mock payment not found - service will throw error
      env.PAYMENT_DB.prepare().bind().first.resolves(null);

      const response = await handlers.getPayment(request, env);
      // Handler catches error and returns 404
      expect([404, 500]).to.include(response.status);
    });
  });

  describe("handlePayPalSuccess", () => {
    it("should handle PayPal success callback", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/payments/callback/success?token=test-order-id&PayerID=test-payer-id",
      );

      env.PAYMENT_DB.prepare().bind().first.resolves({
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        status: "captured",
        amount: 100.0,
        currency: "USD",
        order_id: "test-order-id",
      });

      const response = await handlers.handlePayPalSuccess(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data.success).to.be.true;
    });

    it("should return 400 when token is missing", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/payments/callback/success",
      );

      const response = await handlers.handlePayPalSuccess(request, env);
      expect(response.status).to.equal(400);
    });

    it("should handle service errors", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/payments/callback/success?token=test-order-id",
      );

      env.PAYMENT_DB.prepare().bind().first.resolves(null);

      const response = await handlers.handlePayPalSuccess(request, env);
      expect(response.status).to.equal(404);
    });
  });

  describe("handlePayPalFailure", () => {
    it("should handle PayPal failure callback", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/payments/callback/failure?token=test-order-id",
      );

      env.PAYMENT_DB.prepare().bind().first.resolves({
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        status: "cancelled",
        amount: 100.0,
      });

      const response = await handlers.handlePayPalFailure(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data.success).to.be.false;
    });

    it("should return 400 when token is missing", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/payments/callback/failure",
      );

      const response = await handlers.handlePayPalFailure(request, env);
      expect(response.status).to.equal(400);
    });

    it("should handle service errors", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/payments/callback/failure?token=test-order-id",
      );

      env.PAYMENT_DB.prepare().bind().first.resolves(null);

      const response = await handlers.handlePayPalFailure(request, env);
      expect(response.status).to.equal(404);
    });
  });
});
