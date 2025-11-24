// test/services/paymentService.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as paymentService from "../../src/services/paymentService.js";
import { createMockEnv } from "../setup.js";

describe("Payment Service", () => {
  let env;
  let fetchStub;

  beforeEach(() => {
    env = createMockEnv();
    // Stub fetch - don't restore in beforeEach
    fetchStub = sinon.stub(global, "fetch");
  });

  afterEach(() => {
    if (fetchStub && fetchStub.restore) {
      fetchStub.restore();
    }
    sinon.restore();
  });

  describe("createPaymentIntent", () => {
    it("should create payment intent successfully", async () => {
      const paymentData = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
        currency: "USD",
        return_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
      };

      // Mock no existing payment
      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(null);
      // Mock PayPal OAuth
      fetchStub.onCall(0).resolves(
        new Response(
          JSON.stringify({
            access_token: "test-access-token",
            expires_in: 3600,
          }),
          { status: 200 },
        ),
      );
      // Mock PayPal order creation
      fetchStub.onCall(1).resolves(
        new Response(
          JSON.stringify({
            id: "test-order-id",
            status: "CREATED",
            links: [
              {
                rel: "approve",
                href: "https://paypal.com/approve",
              },
            ],
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
      });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });

      const payment = await paymentService.createPaymentIntent(paymentData, env);

      expect(payment.payment_id).to.equal("test-payment-id");
      expect(payment.approval_url).to.equal("https://paypal.com/approve");
    });

    it("should use default URLs when return_url not provided", async () => {
      const paymentData = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
        currency: "USD",
        // No return_url or cancel_url
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(null);
      fetchStub.onCall(0).resolves(
        new Response(
          JSON.stringify({
            access_token: "test-token",
            expires_in: 3600,
          }),
          { status: 200 },
        ),
      );
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
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare().bind().first.onCall(1).resolves({
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        order_id: "test-order-id",
        status: "created",
      });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });

      const payment = await paymentService.createPaymentIntent(paymentData, env);

      expect(payment.payment_id).to.exist;
      // Should use default URLs from config
      expect(fetchStub).to.have.been.called;
    });

    it("should return existing payment if already exists with pending status", async () => {
      const paymentData = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
      };

      const existingPayment = {
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        status: "pending",
      };

      env.PAYMENT_DB.prepare().bind().first.resolves(existingPayment);

      const payment = await paymentService.createPaymentIntent(paymentData, env);

      expect(payment.payment_id).to.equal("test-payment-id");
    });

    it("should return existing payment if already exists with created status", async () => {
      const paymentData = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
      };

      const existingPayment = {
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        status: "created",
      };

      env.PAYMENT_DB.prepare().bind().first.resolves(existingPayment);

      const payment = await paymentService.createPaymentIntent(paymentData, env);

      expect(payment.payment_id).to.equal("test-payment-id");
    });

    it("should create new payment if existing payment has invalid status", async () => {
      const paymentData = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
        return_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
      };

      const existingPayment = {
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        status: "cancelled", // Invalid status - should create new
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(existingPayment);
      fetchStub.onCall(0).resolves(
        new Response(
          JSON.stringify({ access_token: "test-token", expires_in: 3600 }),
          { status: 200 },
        ),
      );
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
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare().bind().first.onCall(1).resolves({
        payment_id: "new-payment-id",
        checkout_session_id: "test-session-id",
        order_id: "test-order-id",
        status: "created",
      });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });

      const payment = await paymentService.createPaymentIntent(paymentData, env);

      expect(payment.payment_id).to.equal("new-payment-id");
    });

    it("should handle service errors", async () => {
      const paymentData = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
      };

      env.PAYMENT_DB.prepare().bind().first.resolves(null);
      fetchStub.rejects(new Error("PayPal error"));

      try {
        await paymentService.createPaymentIntent(paymentData, env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("PayPal error");
      }
    });
  });

  describe("capturePayment", () => {
    it("should capture payment successfully", async () => {
      const payment = {
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        status: "approved",
      };

      // Mock payment lookup
      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      // Mock PayPal OAuth
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
            payer: {
              email_address: "test@example.com",
              name: {
                given_name: "Test",
                surname: "User",
              },
            },
          }),
          { status: 200 },
        ),
      );
      // Mock payment update
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare().bind().first.onCall(1).resolves({
        ...payment,
        status: "captured",
      });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });

      const result = await paymentService.capturePayment(
        "test-payment-id",
        "test-order-id",
        env,
      );

      expect(result.status).to.equal("captured");
    });

    it("should return payment if already captured", async () => {
      const payment = {
        payment_id: "test-payment-id",
        status: "captured",
      };

      env.PAYMENT_DB.prepare().bind().first.resolves(payment);

      const result = await paymentService.capturePayment(
        "test-payment-id",
        null,
        env,
      );

      expect(result.status).to.equal("captured");
    });

    it("should throw error if payment cannot be captured", async () => {
      const payment = {
        payment_id: "test-payment-id",
        status: "cancelled",
      };

      env.PAYMENT_DB.prepare().bind().first.resolves(payment);

      try {
        await paymentService.capturePayment("test-payment-id", null, env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("cannot be captured");
      }
    });

    it("should find payment by order_id if payment_id not found", async () => {
      const payment = {
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        status: "approved",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(null);
      env.PAYMENT_DB.prepare().bind().first.onCall(1).resolves(payment);
      fetchStub.onCall(0).resolves(
        new Response(
          JSON.stringify({ access_token: "test-token" }),
          { status: 200 },
        ),
      );
      fetchStub.onCall(1).resolves(
        new Response(
          JSON.stringify({
            id: "test-capture-id",
            purchase_units: [
              {
                payments: {
                  captures: [{ id: "test-transaction-id" }],
                },
              },
            ],
            payer: {},
          }),
          { status: 200 },
        ),
      );
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare().bind().first.onCall(2).resolves({
        ...payment,
        status: "captured",
      });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });

      const result = await paymentService.capturePayment(
        "test-payment-id",
        "test-order-id",
        env,
      );

      expect(result).to.exist;
    });

    it("should throw error when payment not found and no orderId", async () => {
      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(null);

      try {
        await paymentService.capturePayment("test-payment-id", null, env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });

    it("should throw error when PayPal order ID not found", async () => {
      const payment = {
        payment_id: "test-payment-id",
        order_id: null,
        status: "approved",
      };

      env.PAYMENT_DB.prepare().bind().first.resolves(payment);

      try {
        await paymentService.capturePayment("test-payment-id", null, env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("PayPal order ID not found");
      }
    });
  });

  describe("getPaymentStatus", () => {
    it("should get payment status successfully", async () => {
      const payment = {
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        status: "created",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      fetchStub.onCall(0).resolves(
        new Response(
          JSON.stringify({ access_token: "test-token" }),
          { status: 200 },
        ),
      );
      fetchStub.onCall(1).resolves(
        new Response(
          JSON.stringify({
            id: "test-order-id",
            status: "APPROVED",
            payer: {
              email_address: "test@example.com",
              name: {
                given_name: "Test",
                surname: "User",
              },
            },
          }),
          { status: 200 },
        ),
      );
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare().bind().first.onCall(1).resolves({
        ...payment,
        status: "approved",
      });

      const result = await paymentService.getPaymentStatus(
        "test-payment-id",
        env,
      );

      expect(result).to.exist;
    });

    it("should sync status from PayPal when COMPLETED", async () => {
      const payment = {
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        status: "approved",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      fetchStub.onCall(0).resolves(
        new Response(
          JSON.stringify({ access_token: "test-token" }),
          { status: 200 },
        ),
      );
      fetchStub.onCall(1).resolves(
        new Response(
          JSON.stringify({
            id: "test-order-id",
            status: "COMPLETED",
            purchase_units: [
              {
                payments: {
                  captures: [{ id: "test-transaction-id" }],
                },
              },
            ],
          }),
          { status: 200 },
        ),
      );
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare().bind().first.onCall(1).resolves({
        ...payment,
        status: "captured",
      });

      const result = await paymentService.getPaymentStatus(
        "test-payment-id",
        env,
      );

      expect(result).to.exist;
    });

    it("should sync status from PayPal when APPROVED and status differs", async () => {
      const payment = {
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        status: "created", // Different from APPROVED
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      fetchStub.onCall(0).resolves(
        new Response(
          JSON.stringify({ access_token: "test-token" }),
          { status: 200 },
        ),
      );
      fetchStub.onCall(1).resolves(
        new Response(
          JSON.stringify({
            id: "test-order-id",
            status: "APPROVED",
            payer: {
              email_address: "test@example.com",
              name: { given_name: "Test", surname: "User" },
            },
          }),
          { status: 200 },
        ),
      );
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare().bind().first.onCall(1).resolves({
        ...payment,
        status: "approved",
      });

      const result = await paymentService.getPaymentStatus(
        "test-payment-id",
        env,
      );

      expect(result).to.exist;
    });

    it("should not sync if PayPal sync fails", async () => {
      const payment = {
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        status: "created",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      fetchStub.onCall(0).resolves(
        new Response(
          JSON.stringify({ access_token: "test-token" }),
          { status: 200 },
        ),
      );
      fetchStub.onCall(1).rejects(new Error("PayPal API error"));

      // Should still return payment even if sync fails
      const result = await paymentService.getPaymentStatus(
        "test-payment-id",
        env,
      );

      expect(result).to.exist;
    });

    it("should handle payment not found", async () => {
      env.PAYMENT_DB.prepare().bind().first.resolves(null);

      try {
        await paymentService.getPaymentStatus("test-payment-id", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });

    it("should handle payment without order_id", async () => {
      const payment = {
        payment_id: "test-payment-id",
        order_id: null,
        status: "created",
      };

      env.PAYMENT_DB.prepare().bind().first.resolves(payment);

      const result = await paymentService.getPaymentStatus(
        "test-payment-id",
        env,
      );

      expect(result).to.exist;
    });

    it("should handle payment with status not in sync list", async () => {
      const payment = {
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        status: "cancelled", // Not in ["created", "approved"]
      };

      env.PAYMENT_DB.prepare().bind().first.resolves(payment);

      const result = await paymentService.getPaymentStatus(
        "test-payment-id",
        env,
      );

      expect(result).to.exist;
    });
  });

  describe("handlePayPalCallback", () => {
    it("should handle success callback", async () => {
      const payment = {
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        status: "captured",
        amount: 100.0,
        currency: "USD",
        order_id: "test-order-id",
      };

      env.PAYMENT_DB.prepare().bind().first.resolves(payment);

      const result = await paymentService.handlePayPalCallback(
        "test-order-id",
        "test-payer-id",
        true,
        env,
      );

      expect(result.success).to.be.true;
      expect(result.payment).to.exist;
    });

    it("should handle failure callback", async () => {
      const payment = {
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        status: "cancelled",
        amount: 100.0,
      };

      env.PAYMENT_DB.prepare().bind().first.resolves(payment);

      const result = await paymentService.handlePayPalCallback(
        "test-order-id",
        null,
        false,
        env,
      );

      expect(result.success).to.be.false;
    });

    it("should handle success callback with payer name", async () => {
      const payment = {
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        status: "captured",
        amount: 100.0,
        currency: "USD",
        order_id: "test-order-id",
        payer_name: "Test User",
        payer_email: "test@example.com",
      };

      env.PAYMENT_DB.prepare().bind().first.resolves(payment);

      const result = await paymentService.handlePayPalCallback(
        "test-order-id",
        "test-payer-id",
        true,
        env,
      );

      expect(result.success).to.be.true;
      expect(result.payment.payer_name).to.exist;
    });

    it("should throw error when token is missing", async () => {
      try {
        await paymentService.handlePayPalCallback(null, null, true, env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("required");
      }
    });

    it("should throw error when payment not found", async () => {
      env.PAYMENT_DB.prepare().bind().first.resolves(null);

      try {
        await paymentService.handlePayPalCallback("test-order-id", null, true, env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });
  });
});
