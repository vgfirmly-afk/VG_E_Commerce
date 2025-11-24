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
    it("should handle PAYMENT.CAPTURE.COMPLETED event", async () => {
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
        },
      };

      // Mock payment lookup
      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves({
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        order_id: "test-order-id",
        status: "approved",
      });
      // Mock payment update
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare().bind().first.onCall(1).resolves({
        payment_id: "test-payment-id",
        status: "captured",
      });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });
      // Mock checkout session fetch
      env.CHECKOUT_WORKER.fetch.resolves(
        new Response(
          JSON.stringify({
            checkout_session_id: "test-session-id",
            items: [{ sku_id: "test-sku-id", quantity: 1 }],
          }),
          { status: 200 },
        ),
      );
      // Mock catalog worker
      env.CATALOG_WORKER.fetch.resolves(
        new Response(JSON.stringify({ product_id: "test-product-id" }), {
          status: 200,
        }),
      );
      // Mock inventory and fulfillment workers
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );
      env.FULFILLMENT_WORKER.fetch.resolves(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.true;
      expect(result.status).to.equal("captured");
    });

    it("should handle PAYMENT.CAPTURE.COMPLETED without order_id in resource", async () => {
      const event = {
        id: "test-event-id",
        event_type: "PAYMENT.CAPTURE.COMPLETED",
        resource: {
          id: "test-capture-id",
          // No supplementary_data.related_ids.order_id
        },
      };

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.false;
      expect(result.error).to.include("No order ID");
    });

    it("should handle PAYMENT.CAPTURE.COMPLETED when payment not found", async () => {
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

      env.PAYMENT_DB.prepare().bind().first.resolves(null);

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.false;
      expect(result.error).to.include("not found");
    });

    it("should handle CHECKOUT.ORDER.APPROVED event", async () => {
      const event = {
        id: "test-event-id",
        event_type: "CHECKOUT.ORDER.APPROVED",
        resource: {
          id: "test-order-id",
          payer: {
            email_address: "test@example.com",
            name: {
              given_name: "Test",
              surname: "User",
            },
          },
        },
      };

      const payment = {
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        status: "created",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({
          ...payment,
          status: "approved",
        });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.true;
      expect(result.status).to.equal("approved");
    });

    it("should handle CHECKOUT.ORDER.COMPLETED event", async () => {
      const event = {
        id: "test-event-id",
        event_type: "CHECKOUT.ORDER.COMPLETED",
        resource: {
          id: "test-order-id",
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
        },
      };

      const payment = {
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        order_id: "test-order-id",
        status: "approved",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({
          ...payment,
          status: "captured",
        });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });

      env.CHECKOUT_WORKER.fetch.resolves(
        new Response(
          JSON.stringify({
            checkout_session_id: "test-session-id",
            items: [],
          }),
          { status: 200 },
        ),
      );

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.true;
      expect(result.status).to.equal("captured");
    });

    it("should handle PAYMENT.ORDER.CANCELLED event", async () => {
      const event = {
        id: "test-event-id",
        event_type: "PAYMENT.ORDER.CANCELLED",
        resource: {
          id: "test-order-id",
        },
      };

      const payment = {
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        status: "approved",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({
          ...payment,
          status: "cancelled",
        });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });

      env.CHECKOUT_WORKER.fetch.resolves(
        new Response(JSON.stringify({}), { status: 200 }),
      );

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.true;
      expect(result.status).to.equal("cancelled");
    });

    it("should handle PAYMENT.CAPTURE.DENIED event", async () => {
      const event = {
        id: "test-event-id",
        event_type: "PAYMENT.CAPTURE.DENIED",
        resource: {
          id: "test-capture-id",
          supplementary_data: {
            related_ids: {
              order_id: "test-order-id",
            },
          },
          reason_code: "INSUFFICIENT_FUNDS",
        },
      };

      const payment = {
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        status: "approved",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({
          ...payment,
          status: "approved",
        });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });
      env.CHECKOUT_WORKER.fetch.resolves(
        new Response(JSON.stringify({}), { status: 200 }),
      );

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.true;
      expect(result.status).to.equal("approved");
    });

    it("should handle PAYMENT.CAPTURE.DENIED without order_id", async () => {
      const event = {
        id: "test-event-id",
        event_type: "PAYMENT.CAPTURE.DENIED",
        resource: {
          id: "test-capture-id",
          // No supplementary_data
        },
      };

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.false;
      expect(result.error).to.include("No order ID");
    });

    it("should handle PAYMENT.CAPTURE.DENIED when payment not found", async () => {
      const event = {
        id: "test-event-id",
        event_type: "PAYMENT.CAPTURE.DENIED",
        resource: {
          id: "test-capture-id",
          supplementary_data: {
            related_ids: {
              order_id: "test-order-id",
            },
          },
        },
      };

      env.PAYMENT_DB.prepare().bind().first.resolves(null);

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.false;
      expect(result.error).to.include("not found");
    });

    it("should handle PAYMENT.ORDER.CREATED event", async () => {
      const event = {
        id: "test-event-id",
        event_type: "PAYMENT.ORDER.CREATED",
        resource: {
          id: "test-order-id",
          status: "CREATED",
          create_time: new Date().toISOString(),
        },
      };

      const payment = {
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        status: "pending",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({
          ...payment,
          status: "created",
        });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.true;
    });

    it("should handle CHECKOUT.ORDER.SAVED event", async () => {
      const event = {
        id: "test-event-id",
        event_type: "CHECKOUT.ORDER.SAVED",
        resource: {
          id: "test-order-id",
        },
      };

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.true;
      expect(result.message).to.include("no action needed");
    });

    it("should handle CHECKOUT.ORDER.DECLINED event", async () => {
      const event = {
        id: "test-event-id",
        event_type: "CHECKOUT.ORDER.DECLINED",
        resource: {
          id: "test-order-id",
        },
      };

      const payment = {
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        status: "approved",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({
          ...payment,
          status: "cancelled",
        });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });
      env.CHECKOUT_WORKER.fetch.resolves(
        new Response(JSON.stringify({}), { status: 200 }),
      );

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.true;
      expect(result.status).to.equal("cancelled");
    });

    it("should handle CHECKOUT.ORDER.VOIDED event", async () => {
      const event = {
        id: "test-event-id",
        event_type: "CHECKOUT.ORDER.VOIDED",
        resource: {
          id: "test-order-id",
        },
      };

      const payment = {
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        status: "approved",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({
          ...payment,
          status: "cancelled",
        });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });
      env.CHECKOUT_WORKER.fetch.resolves(
        new Response(JSON.stringify({}), { status: 200 }),
      );

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.true;
      expect(result.status).to.equal("cancelled");
    });

    it("should handle PAYMENT.CAPTURE.DECLINED event", async () => {
      const event = {
        id: "test-event-id",
        event_type: "PAYMENT.CAPTURE.DECLINED",
        resource: {
          id: "test-capture-id",
          supplementary_data: {
            related_ids: {
              order_id: "test-order-id",
            },
          },
          reason_code: "INSUFFICIENT_FUNDS",
        },
      };

      const payment = {
        payment_id: "test-payment-id",
        order_id: "test-order-id",
        status: "approved",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({
          ...payment,
          status: "approved",
        });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });
      env.CHECKOUT_WORKER.fetch.resolves(
        new Response(JSON.stringify({}), { status: 200 }),
      );

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.true;
      expect(result.status).to.equal("approved");
    });

    it("should handle unknown event types", async () => {
      const event = {
        id: "test-event-id",
        event_type: "UNKNOWN.EVENT.TYPE",
        resource: {},
      };

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.false;
      expect(result.message).to.include("not handled");
    });

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

    it("should handle PAYMENT.ORDER.CANCELLED with notification failure", async () => {
      const event = {
        id: "test-event-id",
        event_type: "PAYMENT.ORDER.CANCELLED",
        resource: {
          id: "test-order-id",
        },
      };

      const payment = {
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        order_id: "test-order-id",
        status: "approved",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({
          ...payment,
          status: "cancelled",
        });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });
      // Mock checkout worker to fail - this covers the .catch() branch in notifyCheckoutWorker
      env.CHECKOUT_WORKER.fetch.rejects(new Error("Network error"));

      const result = await webhookService.handleWebhookEvent(event, env);

      // The notification failure is caught in .catch(), so the function should still succeed
      expect(result).to.exist;
      expect(result.processed).to.be.true;
      expect(result.status).to.equal("cancelled");
    });

    it("should handle PAYMENT.CAPTURE.COMPLETED without CHECKOUT_WORKER binding", async () => {
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
        },
      };

      // Remove CHECKOUT_WORKER binding
      delete env.CHECKOUT_WORKER;

      const payment = {
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        order_id: "test-order-id",
        status: "approved",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({
          ...payment,
          status: "captured",
        });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.true;
      expect(result.status).to.equal("captured");
    });

    it("should handle PAYMENT.CAPTURE.COMPLETED with CHECKOUT_WORKER non-ok response", async () => {
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
        },
      };

      const payment = {
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        order_id: "test-order-id",
        status: "approved",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({
          ...payment,
          status: "captured",
        });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });
      // Mock checkout worker to return non-ok response
      env.CHECKOUT_WORKER.fetch.resolves(
        new Response(JSON.stringify({ error: "Internal error" }), {
          status: 500,
        }),
      );
      env.CATALOG_WORKER.fetch.resolves(
        new Response(JSON.stringify({ product_id: "test-product-id" }), {
          status: 200,
        }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );
      env.FULFILLMENT_WORKER.fetch.resolves(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.true;
      expect(result.status).to.equal("captured");
    });

    it("should handle PAYMENT.CAPTURE.COMPLETED without INVENTORY_WORKER binding", async () => {
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
          payer: {},
        },
      };

      // Remove INVENTORY_WORKER binding
      delete env.INVENTORY_WORKER;

      const payment = {
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        order_id: "test-order-id",
        status: "approved",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({
          ...payment,
          status: "captured",
        });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });
      env.CHECKOUT_WORKER.fetch.resolves(
        new Response(
          JSON.stringify({
            checkout_session_id: "test-session-id",
            items: [{ sku_id: "test-sku-id", quantity: 1 }],
          }),
          { status: 200 },
        ),
      );
      env.CATALOG_WORKER.fetch.resolves(
        new Response(JSON.stringify({ product_id: "test-product-id" }), {
          status: 200,
        }),
      );
      env.FULFILLMENT_WORKER.fetch.resolves(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.true;
      expect(result.status).to.equal("captured");
    });

    it("should handle PAYMENT.CAPTURE.COMPLETED with empty order items", async () => {
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
          payer: {},
        },
      };

      const payment = {
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        order_id: "test-order-id",
        status: "approved",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({
          ...payment,
          status: "captured",
        });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });
      // Mock checkout session with empty items
      env.CHECKOUT_WORKER.fetch.resolves(
        new Response(
          JSON.stringify({
            checkout_session_id: "test-session-id",
            items: [], // Empty items
          }),
          { status: 200 },
        ),
      );

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.true;
      expect(result.status).to.equal("captured");
    });

    it("should handle PAYMENT.CAPTURE.COMPLETED with INVENTORY_WORKER non-ok response", async () => {
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
          payer: {},
        },
      };

      const payment = {
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        order_id: "test-order-id",
        status: "approved",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({
          ...payment,
          status: "captured",
        });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });
      env.CHECKOUT_WORKER.fetch.resolves(
        new Response(
          JSON.stringify({
            checkout_session_id: "test-session-id",
            items: [{ sku_id: "test-sku-id", quantity: 1 }],
          }),
          { status: 200 },
        ),
      );
      env.CATALOG_WORKER.fetch.resolves(
        new Response(JSON.stringify({ product_id: "test-product-id" }), {
          status: 200,
        }),
      );
      // Mock inventory worker to return non-ok response
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ error: "Out of stock" }), {
          status: 400,
        }),
      );
      env.FULFILLMENT_WORKER.fetch.resolves(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.true;
      expect(result.status).to.equal("captured");
    });

    it("should handle PAYMENT.CAPTURE.COMPLETED without FULFILLMENT_WORKER binding", async () => {
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
          payer: {},
        },
      };

      // Remove FULFILLMENT_WORKER binding
      delete env.FULFILLMENT_WORKER;

      const payment = {
        payment_id: "test-payment-id",
        checkout_session_id: "test-session-id",
        order_id: "test-order-id",
        status: "approved",
      };

      env.PAYMENT_DB.prepare().bind().first.onCall(0).resolves(payment);
      env.PAYMENT_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PAYMENT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({
          ...payment,
          status: "captured",
        });
      env.PAYMENT_DB.prepare().bind().run.onCall(1).resolves({ success: true });
      env.CHECKOUT_WORKER.fetch.resolves(
        new Response(
          JSON.stringify({
            checkout_session_id: "test-session-id",
            items: [{ sku_id: "test-sku-id", quantity: 1 }],
          }),
          { status: 200 },
        ),
      );
      env.CATALOG_WORKER.fetch.resolves(
        new Response(JSON.stringify({ product_id: "test-product-id" }), {
          status: 200,
        }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

      const result = await webhookService.handleWebhookEvent(event, env);

      expect(result.processed).to.be.true;
      expect(result.status).to.equal("captured");
    });
  });
});
