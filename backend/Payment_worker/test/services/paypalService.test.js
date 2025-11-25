// test/services/paypalService.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as paypalService from "../../src/services/paypalService.js";
import { createMockEnv } from "../setup.js";

describe("PayPal Service", () => {
  let env;
  let fetchStub;

  beforeEach(() => {
    env = createMockEnv();
    fetchStub = sinon.stub(global, "fetch");
  });

  afterEach(() => {
    if (fetchStub && fetchStub.restore) {
      fetchStub.restore();
    }
    sinon.restore();
  });

  describe("getPayPalAccessToken", () => {
    it("should get access token successfully", async () => {
      fetchStub.resolves(
        new Response(
          JSON.stringify({
            access_token: "test-access-token",
            expires_in: 3600,
          }),
          { status: 200 },
        ),
      );

      const token = await paypalService.getPayPalAccessToken(
        "test-client-id",
        "test-client-secret",
        env,
      );

      expect(token).to.equal("test-access-token");
      expect(fetchStub).to.have.been.called;
    });

    it("should throw error when credentials are missing", async () => {
      try {
        await paypalService.getPayPalAccessToken(null, null, env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("not configured");
      }
    });

    it("should handle OAuth errors", async () => {
      fetchStub.resolves(
        new Response(JSON.stringify({ error: "invalid_client" }), {
          status: 401,
        }),
      );

      try {
        await paypalService.getPayPalAccessToken(
          "test-client-id",
          "test-client-secret",
          env,
        );
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("OAuth failed");
      }
    });
  });

  describe("createPayPalOrder", () => {
    it("should create PayPal order successfully", async () => {
      // Mock OAuth token
      fetchStub.onCall(0).resolves(
        new Response(
          JSON.stringify({
            access_token: "test-access-token",
            expires_in: 3600,
          }),
          { status: 200 },
        ),
      );

      // Mock order creation
      const mockOrder = {
        id: "test-order-id",
        status: "CREATED",
        links: [
          {
            rel: "approve",
            href: "https://paypal.com/approve",
          },
        ],
      };

      fetchStub
        .onCall(1)
        .resolves(new Response(JSON.stringify(mockOrder), { status: 201 }));

      const orderData = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
        currency: "USD",
        return_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
      };

      const order = await paypalService.createPayPalOrder(orderData, env);

      expect(order.id).to.equal("test-order-id");
      expect(order.status).to.equal("CREATED");
    });

    it("should throw error when credentials are missing", async () => {
      const envWithoutCreds = createMockEnv({
        PAYPAL_CLIENT_ID: null,
        PAYPAL_CLIENT_SECRET: null,
      });

      try {
        await paypalService.createPayPalOrder({}, envWithoutCreds);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("not configured");
      }
    });

    it("should handle order creation errors", async () => {
      fetchStub.onCall(0).resolves(
        new Response(
          JSON.stringify({
            access_token: "test-access-token",
          }),
          { status: 200 },
        ),
      );

      fetchStub.onCall(1).resolves(
        new Response(JSON.stringify({ error: "Invalid request" }), {
          status: 400,
        }),
      );

      try {
        await paypalService.createPayPalOrder(
          {
            checkout_session_id: "test-session-id",
            amount: 100.0,
            return_url: "https://example.com/success",
            cancel_url: "https://example.com/cancel",
          },
          env,
        );
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("order creation failed");
      }
    });
  });

  describe("capturePayPalOrder", () => {
    it("should capture PayPal order successfully", async () => {
      // Mock OAuth token
      fetchStub.onCall(0).resolves(
        new Response(
          JSON.stringify({
            access_token: "test-access-token",
          }),
          { status: 200 },
        ),
      );

      // Mock capture
      const mockCapture = {
        id: "test-capture-id",
        status: "COMPLETED",
        purchase_units: [
          {
            payments: {
              captures: [
                {
                  id: "test-transaction-id",
                  amount: { value: "100.00", currency_code: "USD" },
                },
              ],
            },
          },
        ],
      };

      fetchStub
        .onCall(1)
        .resolves(new Response(JSON.stringify(mockCapture), { status: 200 }));

      const capture = await paypalService.capturePayPalOrder(
        "test-order-id",
        env,
      );

      expect(capture).to.exist;
      expect(capture.id).to.equal("test-capture-id");
    });
  });

  describe("getPayPalOrder", () => {
    it("should get PayPal order successfully", async () => {
      // Mock OAuth token
      fetchStub.onCall(0).resolves(
        new Response(
          JSON.stringify({
            access_token: "test-access-token",
          }),
          { status: 200 },
        ),
      );

      // Mock get order
      const mockOrder = {
        id: "test-order-id",
        status: "APPROVED",
      };

      fetchStub
        .onCall(1)
        .resolves(new Response(JSON.stringify(mockOrder), { status: 200 }));

      const order = await paypalService.getPayPalOrder("test-order-id", env);

      expect(order.id).to.equal("test-order-id");
      expect(order.status).to.equal("APPROVED");
    });

    it("should handle get order errors", async () => {
      fetchStub.onCall(0).resolves(
        new Response(
          JSON.stringify({
            access_token: "test-access-token",
          }),
          { status: 200 },
        ),
      );

      fetchStub.onCall(1).resolves(
        new Response(JSON.stringify({ error: "Order not found" }), {
          status: 404,
        }),
      );

      try {
        await paypalService.getPayPalOrder("test-order-id", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("get order failed");
      }
    });
  });
});
