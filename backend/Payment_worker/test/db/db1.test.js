// test/db/db1.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as db from "../../src/db/db1.js";
import { createMockEnv } from "../setup.js";

describe("DB Functions", () => {
  let env;
  let mockDb;

  beforeEach(() => {
    env = createMockEnv();
    mockDb = env.PAYMENT_DB;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createPayment", () => {
    it("should create payment record", async () => {
      const paymentData = {
        checkout_session_id: "test-session-id",
        order_id: "test-order-id",
        intent: "CAPTURE",
        status: "created",
        amount: 100.0,
        currency: "USD",
      };

      const mockPayment = {
        payment_id: "test-payment-id",
        ...paymentData,
        metadata: null,
      };

      // Mock INSERT
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true });
      // Mock getPayment after insert
      mockDb.prepare().bind().first.onCall(0).resolves(mockPayment);

      const payment = await db.createPayment(paymentData, env);
      expect(payment).to.exist;
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle database errors", async () => {
      const paymentData = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
        currency: "USD",
      };

      mockDb.prepare().bind().run.rejects(new Error("Database error"));

      try {
        await db.createPayment(paymentData, env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Database error");
      }
    });
  });

  describe("getPayment", () => {
    it("should return payment when found", async () => {
      const mockPayment = {
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        amount: 100.0,
        currency: "USD",
        metadata: JSON.stringify({ test: "data" }),
      };

      mockDb.prepare().bind().first.resolves(mockPayment);

      const payment = await db.getPayment("test-payment-id", env);
      expect(payment).to.exist;
      expect(payment.payment_id).to.equal("test-payment-id");
      expect(payment.metadata).to.deep.equal({ test: "data" });
    });

    it("should return null when payment not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      const payment = await db.getPayment("test-payment-id", env);
      expect(payment).to.be.null;
    });

    it("should handle invalid JSON metadata", async () => {
      const mockPayment = {
        payment_id: "test-payment-id",
        metadata: "invalid-json{",
      };

      mockDb.prepare().bind().first.resolves(mockPayment);

      const payment = await db.getPayment("test-payment-id", env);
      expect(payment.metadata).to.be.null;
    });

    it("should handle database errors", async () => {
      mockDb.prepare().bind().first.rejects(new Error("Database error"));

      try {
        await db.getPayment("test-payment-id", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Database error");
      }
    });
  });

  describe("getPaymentBySessionId", () => {
    it("should return payment when found", async () => {
      const mockPayment = {
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        amount: 100.0,
        metadata: null,
      };

      mockDb.prepare().bind().first.resolves(mockPayment);

      const payment = await db.getPaymentBySessionId("test-session-id", env);
      expect(payment).to.exist;
      expect(payment.checkout_session_id).to.equal("test-session-id");
    });

    it("should return null when payment not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      const payment = await db.getPaymentBySessionId("test-session-id", env);
      expect(payment).to.be.null;
    });

    it("should handle database errors", async () => {
      mockDb.prepare().bind().first.rejects(new Error("Database error"));

      try {
        await db.getPaymentBySessionId("test-session-id", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Database error");
      }
    });
  });

  describe("getPaymentByOrderId", () => {
    it("should return payment when found", async () => {
      const mockPayment = {
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        amount: 100.0,
        metadata: null,
      };

      mockDb.prepare().bind().first.resolves(mockPayment);

      const payment = await db.getPaymentByOrderId("test-order-id", env);
      expect(payment).to.exist;
      expect(payment.order_id).to.equal("test-order-id");
    });

    it("should return null when payment not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      const payment = await db.getPaymentByOrderId("test-order-id", env);
      expect(payment).to.be.null;
    });

    it("should handle database errors", async () => {
      mockDb.prepare().bind().first.rejects(new Error("Database error"));

      try {
        await db.getPaymentByOrderId("test-order-id", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Database error");
      }
    });
  });

  describe("updatePaymentStatus", () => {
    it("should update payment status", async () => {
      const updates = {
        status: "captured",
        paypal_transaction_id: "test-transaction-id",
        payer_email: "test@example.com",
        captured_at: new Date().toISOString(),
      };

      const mockUpdated = {
        payment_id: "test-payment-id",
        status: "captured",
        ...updates,
      };

      // Mock UPDATE
      mockDb.prepare().bind().run.resolves({ success: true });
      // Mock getPayment after update
      mockDb.prepare().bind().first.resolves(mockUpdated);

      const payment = await db.updatePaymentStatus(
        "test-payment-id",
        "captured",
        updates,
        env,
      );
      expect(payment.status).to.equal("captured");
    });

    it("should update with metadata", async () => {
      const updates = {
        metadata: { test: "data" },
      };

      const mockUpdated = {
        payment_id: "test-payment-id",
        metadata: updates.metadata,
      };

      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.resolves(mockUpdated);

      const payment = await db.updatePaymentStatus(
        "test-payment-id",
        "captured",
        updates,
        env,
      );
      expect(payment).to.exist;
    });

    it("should handle database errors", async () => {
      mockDb.prepare().bind().run.rejects(new Error("Database error"));

      try {
        await db.updatePaymentStatus(
          "test-payment-id",
          "captured",
          {},
          env,
        );
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Database error");
      }
    });
  });

  describe("logPaymentEvent", () => {
    it("should log payment event", async () => {
      const eventData = {
        paypal_order_id: "test-order-id",
        amount: 100.0,
      };

      mockDb.prepare().bind().run.resolves({ success: true });

      await db.logPaymentEvent(
        "test-payment-id",
        "created",
        eventData,
        env,
      );
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle null event data", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      await db.logPaymentEvent("test-payment-id", "created", null, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should not throw on database errors", async () => {
      mockDb.prepare().bind().run.rejects(new Error("Database error"));

      // Should not throw - event logging shouldn't break payment flow
      await db.logPaymentEvent("test-payment-id", "created", {}, env);
    });
  });
});

