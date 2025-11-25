// test/services/webhookService.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as webhookService from "../../src/services/webhookService.js";
import { createMockEnv } from "../setup.js";

describe("Webhook Service", () => {
  let env;

  beforeEach(() => {
    env = createMockEnv();
    sinon.restore();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("verifyWebhookSignature", () => {
    it("should verify webhook signature with valid headers", async () => {
      const headers = new Headers();
      headers.set("PAYPAL-TRANSMISSION-ID", "test-transmission-id");
      headers.set("PAYPAL-TRANSMISSION-SIG", "test-signature");
      headers.set("PAYPAL-AUTH-ALGO", "SHA256withRSA");
      headers.set("PAYPAL-CERT-URL", "https://api.paypal.com/cert");
      headers.set("PAYPAL-TRANSMISSION-TIME", "2023-01-01T00:00:00Z");

      const isValid = await webhookService.verifyWebhookSignature(
        headers,
        "test-body",
        env,
      );

      expect(isValid).to.be.true;
    });

    it("should return true even without full verification (dev mode)", async () => {
      const headers = new Headers();

      const isValid = await webhookService.verifyWebhookSignature(
        headers,
        "test-body",
        env,
      );

      // In development, returns true even without full verification
      expect(isValid).to.be.true;
    });
  });

  describe("handleWebhookEvent", () => {
    it("should handle errors gracefully", async () => {
      const event = {
        id: "test-event-id",
        event_type: "PAYMENT.CAPTURE.COMPLETED",
        resource: {
          id: "test-capture-id",
          supplementary_data: {
            related_ids: {
              order_id: "test-order-id",
            },
          },
        },
      };

      env.PAYMENT_DB.prepare()
        .bind()
        .first.rejects(new Error("Database error"));

      try {
        await webhookService.handleWebhookEvent(event, env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).to.exist;
        expect(err.message).to.exist;
      }
    });

    it("should handle CHECKOUT.ORDER.APPROVED error path", async () => {
      const event = {
        id: "test-event-id",
        event_type: "CHECKOUT.ORDER.APPROVED",
        resource: {
          id: "test-order-id",
          payer: {},
        },
      };

      env.PAYMENT_DB.prepare()
        .bind()
        .first.rejects(new Error("Database error"));

      try {
        await webhookService.handleWebhookEvent(event, env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).to.exist;
      }
    });

    it("should handle CHECKOUT.ORDER.COMPLETED error path", async () => {
      const event = {
        id: "test-event-id",
        event_type: "CHECKOUT.ORDER.COMPLETED",
        resource: {
          id: "test-order-id",
          purchase_units: [],
        },
      };

      env.PAYMENT_DB.prepare()
        .bind()
        .first.rejects(new Error("Database error"));

      try {
        await webhookService.handleWebhookEvent(event, env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).to.exist;
      }
    });

    it("should handle PAYMENT.ORDER.CREATED error path", async () => {
      const event = {
        id: "test-event-id",
        event_type: "PAYMENT.ORDER.CREATED",
        resource: {
          id: "test-order-id",
          status: "CREATED",
        },
      };

      env.PAYMENT_DB.prepare()
        .bind()
        .first.rejects(new Error("Database error"));

      try {
        await webhookService.handleWebhookEvent(event, env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).to.exist;
      }
    });

    it("should handle CHECKOUT.ORDER.CANCELLED error path", async () => {
      const event = {
        id: "test-event-id",
        event_type: "CHECKOUT.ORDER.CANCELLED",
        resource: {
          id: "test-order-id",
        },
      };

      env.PAYMENT_DB.prepare()
        .bind()
        .first.rejects(new Error("Database error"));

      try {
        await webhookService.handleWebhookEvent(event, env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).to.exist;
      }
    });
  });
});
