// test/services/checkoutService.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as checkoutService from "../../src/services/checkoutService.js";
import * as db from "../../src/db/db1.js";
import { createMockEnv } from "../setup.js";

describe("Checkout Service", () => {
  let env;

  beforeEach(() => {
    env = createMockEnv();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createSession", () => {
    it("should create checkout session successfully", async () => {
      const mockCart = {
        items: [{ sku_id: "sku-1", quantity: 2, unit_price: 10.0 }],
      };
      const mockSession = { session_id: "session-123", cart_id: "cart-123" };

      env.CART_WORKER.fetch.resolves(
        new Response(JSON.stringify(mockCart), { status: 200 }),
      );
      // First prepare for INSERT (createCheckoutSession)
      const prepareStub1 = env.CHECKOUT_DB.prepare();
      const bindStub1 = prepareStub1.bind();
      bindStub1.run.resolves({ success: true });
      // Second prepare for SELECT (getCheckoutSession)
      const prepareStub2 = env.CHECKOUT_DB.prepare();
      const bindStub2 = prepareStub2.bind();
      bindStub2.first.resolves(mockSession);
      // Third prepare for DELETE (saveCheckoutItems)
      const prepareStub3 = env.CHECKOUT_DB.prepare();
      const bindStub3 = prepareStub3.bind();
      bindStub3.run.resolves({ success: true });
      // Fourth prepare for INSERT (saveCheckoutItems)
      const prepareStub4 = env.CHECKOUT_DB.prepare();
      const bindStub4 = prepareStub4.bind();
      bindStub4.run.resolves({ success: true });
      // Fifth prepare for SELECT (getCheckoutItems)
      const prepareStub5 = env.CHECKOUT_DB.prepare();
      const bindStub5 = prepareStub5.bind();
      bindStub5.all.resolves({ results: [] });

      const session = await checkoutService.createSession(
        "cart-123",
        "user-123",
        null,
        env,
      );

      expect(session).to.exist;
    });

    it("should throw error when cart not found", async () => {
      env.CART_WORKER.fetch.resolves(
        new Response("Not Found", { status: 404 }),
      );

      try {
        await checkoutService.createSession("cart-123", "user-123", null, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        // The error message will be from getCartFromCartWorker which throws "Failed to get cart: 404"
        expect(err.message).to.exist;
      }
    });

    it("should throw error when cart is empty", async () => {
      const mockCart = { items: [] };
      env.CART_WORKER.fetch.resolves(
        new Response(JSON.stringify(mockCart), { status: 200 }),
      );

      try {
        await checkoutService.createSession("cart-123", "user-123", null, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("empty");
      }
    });

    it("should handle pricing worker returning null", async () => {
      const mockCart = {
        items: [{ sku_id: "sku-1", quantity: 2, unit_price: 10.0 }],
      };
      const mockSession = { session_id: "session-123", cart_id: "cart-123" };

      env.CART_WORKER.fetch.resolves(
        new Response(JSON.stringify(mockCart), { status: 200 }),
      );
      // First prepare for INSERT (createCheckoutSession)
      const prepareStub1 = env.CHECKOUT_DB.prepare();
      const bindStub1 = prepareStub1.bind();
      bindStub1.run.resolves({ success: true });
      // Second prepare for SELECT (getCheckoutSession)
      const prepareStub2 = env.CHECKOUT_DB.prepare();
      const bindStub2 = prepareStub2.bind();
      bindStub2.first.resolves(mockSession);
      // Third prepare for DELETE (saveCheckoutItems)
      const prepareStub3 = env.CHECKOUT_DB.prepare();
      const bindStub3 = prepareStub3.bind();
      bindStub3.run.resolves({ success: true });
      // Fourth prepare for INSERT (saveCheckoutItems)
      const prepareStub4 = env.CHECKOUT_DB.prepare();
      const bindStub4 = prepareStub4.bind();
      bindStub4.run.resolves({ success: true });
      // Fifth prepare for SELECT (getCheckoutItems)
      const prepareStub5 = env.CHECKOUT_DB.prepare();
      const bindStub5 = prepareStub5.bind();
      bindStub5.all.resolves({ results: [] });

      const session = await checkoutService.createSession(
        "cart-123",
        "user-123",
        null,
        env,
      );

      expect(session).to.exist;
      expect(session.session_id).to.equal("session-123");
    });
  });

  describe("getSession", () => {
    it("should return session with related data", async () => {
      const mockSession = {
        session_id: "session-123",
        delivery_address_id: "addr-1",
        billing_address_id: "addr-2",
        shipping_method_id: "method-1",
      };
      const mockItems = [{ item_id: "item-1" }];
      const mockDeliveryAddress = { address_id: "addr-1" };
      const mockBillingAddress = { address_id: "addr-2" };
      const mockShippingMethod = { method_id: "method-1" };

      let prepareCallCount = 0;
      env.CHECKOUT_DB.prepare.callsFake(() => {
        prepareCallCount++;
        if (prepareCallCount === 1) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockSession),
            }),
          };
        }
        if (prepareCallCount === 2) {
          return {
            bind: sinon.stub().returns({
              all: sinon.stub().resolves({ results: mockItems }),
            }),
          };
        }
        if (prepareCallCount === 3) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockDeliveryAddress),
            }),
          };
        }
        if (prepareCallCount === 4) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockBillingAddress),
            }),
          };
        }
        if (prepareCallCount === 5) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockShippingMethod),
            }),
          };
        }
        return {
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(null),
            all: sinon.stub().resolves({ results: [] }),
          }),
        };
      });

      const session = await checkoutService.getSession("session-123", env);

      expect(session).to.exist;
      expect(session.items).to.deep.equal(mockItems);
      expect(session.delivery_address).to.deep.equal(mockDeliveryAddress);
      expect(session.billing_address).to.deep.equal(mockBillingAddress);
      expect(session.shipping_method).to.deep.equal(mockShippingMethod);
    });

    it("should return null when session not found", async () => {
      const prepareStub = env.CHECKOUT_DB.prepare();
      const bindStub = prepareStub.bind();
      bindStub.first.resolves(null);

      const session = await checkoutService.getSession("session-123", env);

      expect(session).to.be.null;
    });
  });

  describe("setDeliveryAddress", () => {
    it("should throw error when session not found", async () => {
      const prepareStub = env.CHECKOUT_DB.prepare();
      const bindStub = prepareStub.bind();
      bindStub.first.resolves(null);

      try {
        await checkoutService.setDeliveryAddress(
          "session-123",
          {},
          false,
          "user-123",
          null,
          env,
        );
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });
  });

  describe("setBillingAddress", () => {
    it("should throw error when session not found for billing address", async () => {
      env.CHECKOUT_DB.prepare().bind().first.resolves(null);

      try {
        await checkoutService.setBillingAddress(
          "session-123",
          {},
          "user-123",
          null,
          env,
        );
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });
  });

  describe("getAvailableShippingMethods", () => {
    it("should return available shipping methods", async () => {
      const mockSession = {
        session_id: "session-123",
        delivery_address_id: "addr-1",
      };
      const mockAddress = { address_id: "addr-1", postal_code: "10001" };
      const mockMethods = [
        { method_id: "method-1", name: "Standard", base_cost: 5.0 },
      ];

      let prepareCallCount = 0;
      env.CHECKOUT_DB.prepare.callsFake(() => {
        prepareCallCount++;
        if (prepareCallCount === 1) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockSession),
            }),
          };
        }
        if (prepareCallCount === 2) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockAddress),
            }),
          };
        }
        if (prepareCallCount === 3) {
          return {
            all: sinon.stub().resolves({ results: mockMethods }),
          };
        }
        return {
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(null),
            all: sinon.stub().resolves({ results: [] }),
          }),
        };
      });

      const methods = await checkoutService.getAvailableShippingMethods(
        "session-123",
        env,
      );

      expect(methods).to.exist;
      expect(methods.length).to.equal(1);
    });

    it("should throw error when delivery address not set", async () => {
      const mockSession = { session_id: "session-123" };
      const prepareStub = env.CHECKOUT_DB.prepare();
      const bindStub = prepareStub.bind();
      bindStub.first.resolves(mockSession);

      try {
        await checkoutService.getAvailableShippingMethods("session-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("not set");
      }
    });

    it("should throw error when delivery address not found", async () => {
      const mockSession = {
        session_id: "session-123",
        delivery_address_id: "addr-1",
      };
      const prepareStub1 = env.CHECKOUT_DB.prepare();
      const bindStub1 = prepareStub1.bind();
      bindStub1.first.onFirstCall().resolves(mockSession);
      const prepareStub2 = env.CHECKOUT_DB.prepare();
      const bindStub2 = prepareStub2.bind();
      bindStub2.first.resolves(null);

      try {
        await checkoutService.getAvailableShippingMethods("session-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });
  });

  describe("selectShippingMethod", () => {
    it("should select shipping method successfully", async () => {
      const mockSession = {
        session_id: "session-123",
        delivery_address_id: "addr-1",
      };
      const mockAddress = { address_id: "addr-1", postal_code: "10001" };
      const mockShippingMethod = {
        method_id: "method-1",
        base_cost: 5.0,
        min_delivery_days: 3,
        max_delivery_days: 7,
      };
      const mockItems = [{ sku_id: "sku-1", quantity: 1 }];

      // First prepare for getCheckoutSession
      const prepareStub1 = env.CHECKOUT_DB.prepare();
      const bindStub1 = prepareStub1.bind();
      bindStub1.first.onFirstCall().resolves(mockSession);
      // Second prepare for getShippingMethod
      const prepareStub2 = env.CHECKOUT_DB.prepare();
      const bindStub2 = prepareStub2.bind();
      bindStub2.first.resolves(mockShippingMethod);
      // Third prepare for getAddress
      const prepareStub3 = env.CHECKOUT_DB.prepare();
      const bindStub3 = prepareStub3.bind();
      bindStub3.first.resolves(mockAddress);
      // Fourth prepare for UPDATE (updateCheckoutSession)
      const prepareStub4 = env.CHECKOUT_DB.prepare();
      const bindStub4 = prepareStub4.bind();
      bindStub4.run.resolves({ success: true });
      // Fifth prepare for SELECT (getCheckoutSession after update)
      const prepareStub5 = env.CHECKOUT_DB.prepare();
      const bindStub5 = prepareStub5.bind();
      bindStub5.first
        .onSecondCall()
        .resolves({ ...mockSession, shipping_method_id: "method-1" });
      // Sixth prepare for getCheckoutItems
      const prepareStub6 = env.CHECKOUT_DB.prepare();
      const bindStub6 = prepareStub6.bind();
      bindStub6.all.resolves({ results: mockItems });
      // Seventh prepare for getShippingMethod (in getSession)
      const prepareStub7 = env.CHECKOUT_DB.prepare();
      const bindStub7 = prepareStub7.bind();
      bindStub7.first.onCall(3).resolves(mockShippingMethod);

      const session = await checkoutService.selectShippingMethod(
        "session-123",
        "method-1",
        env,
      );

      expect(session).to.exist;
    });

    it("should throw error when shipping method not found", async () => {
      const mockSession = {
        session_id: "session-123",
        delivery_address_id: "addr-1",
      };
      const prepareStub1 = env.CHECKOUT_DB.prepare();
      const bindStub1 = prepareStub1.bind();
      bindStub1.first.onFirstCall().resolves(mockSession);
      const prepareStub2 = env.CHECKOUT_DB.prepare();
      const bindStub2 = prepareStub2.bind();
      bindStub2.first.resolves(null);

      try {
        await checkoutService.selectShippingMethod(
          "session-123",
          "method-1",
          env,
        );
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });

    it("should throw error when delivery address not set for shipping method", async () => {
      const mockSession = { session_id: "session-123" };
      const prepareStub = env.CHECKOUT_DB.prepare();
      const bindStub = prepareStub.bind();
      bindStub.first.resolves(mockSession);

      try {
        await checkoutService.selectShippingMethod(
          "session-123",
          "method-1",
          env,
        );
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("not set");
      }
    });
  });

  describe("getSummary", () => {
    it("should return checkout summary with billing address", async () => {
      const mockSession = {
        session_id: "session-123",
        delivery_address_id: "addr-1",
        billing_address_id: "addr-2",
        shipping_method_id: "method-1",
        shipping_cost: 5.0,
        currency: "USD",
      };
      const mockAddress = { address_id: "addr-1" };
      const mockBillingAddress = { address_id: "addr-2" };
      const mockShippingMethod = { method_id: "method-1" };
      const mockItems = [{ sku_id: "sku-1", quantity: 2, unit_price: 10.0 }];

      let prepareCallCount = 0;
      env.CHECKOUT_DB.prepare.callsFake(() => {
        prepareCallCount++;
        if (prepareCallCount === 1) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockSession),
            }),
          };
        }
        if (prepareCallCount === 2) {
          return {
            bind: sinon.stub().returns({
              all: sinon.stub().resolves({ results: mockItems }),
            }),
          };
        }
        if (prepareCallCount === 3) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockAddress),
            }),
          };
        }
        if (prepareCallCount === 4) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockBillingAddress),
            }),
          };
        }
        if (prepareCallCount === 5) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockShippingMethod),
            }),
          };
        }
        if (prepareCallCount === 6) {
          return {
            bind: sinon.stub().returns({
              run: sinon.stub().resolves({ success: true }),
            }),
          };
        }
        return {
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(null),
            all: sinon.stub().resolves({ results: [] }),
            run: sinon.stub().resolves({ success: true }),
          }),
        };
      });
      env.INVENTORY_WORKER.fetch.onFirstCall().resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      );
      env.INVENTORY_WORKER.fetch.onSecondCall().resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      );
      env.CHECKOUT_KV.get.callsFake((key, options) => {
        if (options === "json") {
          return Promise.resolve(null);
        }
        return Promise.resolve(null);
      });
      env.CHECKOUT_KV.put.resolves();
      env.PRICING_WORKER.fetch.onFirstCall().resolves(
        new Response(JSON.stringify({ effective_price: 10.0 }), {
          status: 200,
        }),
      );
      env.PRICING_WORKER.fetch.onSecondCall().resolves(
        new Response(JSON.stringify({ effective_price: 10.0 }), {
          status: 200,
        }),
      );

      const summary = await checkoutService.getSummary("session-123", env);

      expect(summary).to.exist;
      expect(summary.billing_address).to.deep.equal(mockBillingAddress);
      expect(summary.pricing.subtotal).to.equal(20.0);
    });

    it("should return checkout summary with stock reservation", async () => {
      const mockSession = {
        session_id: "session-123",
        delivery_address_id: "addr-1",
        shipping_method_id: "method-1",
        shipping_cost: 5.0,
        currency: "USD",
      };
      const mockAddress = { address_id: "addr-1" };
      const mockShippingMethod = { method_id: "method-1" };
      const mockItems = [{ sku_id: "sku-1", quantity: 2, unit_price: 10.0 }];

      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onFirstCall()
        .resolves(mockSession);
      env.CHECKOUT_DB.prepare()
        .bind()
        .all.onFirstCall()
        .resolves({ results: mockItems });
      env.CHECKOUT_DB.prepare().bind().first.onCall(1).resolves(mockAddress);
      env.CHECKOUT_DB.prepare().bind().first.onCall(2).resolves(null);
      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onCall(3)
        .resolves(mockShippingMethod);
      // Create fresh Response objects for each fetch call (Response body can only be read once)
      env.INVENTORY_WORKER.fetch.onFirstCall().resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      );
      env.INVENTORY_WORKER.fetch.onSecondCall().resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      );
      env.CHECKOUT_KV.get.resolves(null);
      env.CHECKOUT_KV.put.resolves();
      env.PRICING_WORKER.fetch.onFirstCall().resolves(
        new Response(JSON.stringify({ effective_price: 10.0 }), {
          status: 200,
        }),
      );
      env.PRICING_WORKER.fetch.onSecondCall().resolves(
        new Response(JSON.stringify({ effective_price: 10.0 }), {
          status: 200,
        }),
      );
      env.CHECKOUT_DB.prepare().bind().run.resolves({ success: true });
      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onSecondCall()
        .resolves(mockSession);

      const summary = await checkoutService.getSummary("session-123", env);

      expect(summary).to.exist;
      expect(summary.items).to.exist;
      expect(summary.pricing).to.exist;
      expect(summary.pricing.subtotal).to.equal(20.0);
    });

    it("should handle reservation success false", async () => {
      const mockSession = {
        session_id: "session-123",
        delivery_address_id: "addr-1",
        shipping_method_id: "method-1",
        shipping_cost: 5.0,
      };
      const mockItems = [{ sku_id: "sku-1", quantity: 10, unit_price: 10.0 }];

      let prepareCallCount = 0;
      env.CHECKOUT_DB.prepare.callsFake(() => {
        prepareCallCount++;
        if (prepareCallCount === 1) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockSession),
            }),
          };
        }
        if (prepareCallCount === 2) {
          return {
            bind: sinon.stub().returns({
              all: sinon.stub().resolves({ results: mockItems }),
            }),
          };
        }
        if (prepareCallCount === 3) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves({ address_id: "addr-1" }),
            }),
          };
        }
        if (prepareCallCount === 4) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves({ method_id: "method-1" }),
            }),
          };
        }
        if (prepareCallCount === 5) {
          return {
            bind: sinon.stub().returns({
              run: sinon.stub().resolves({ success: true }),
            }),
          };
        }
        return {
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(null),
            all: sinon.stub().resolves({ results: [] }),
            run: sinon.stub().resolves({ success: true }),
          }),
        };
      });
      // First stock check passes
      env.INVENTORY_WORKER.fetch.onFirstCall().resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      );
      env.CHECKOUT_KV.get.onFirstCall().callsFake((key, options) => {
        if (options === "json") {
          return Promise.resolve(null);
        }
        return Promise.resolve(null);
      });
      env.CHECKOUT_KV.put.onFirstCall().resolves();
      // But reservation returns success: false
      env.INVENTORY_WORKER.fetch.onSecondCall().resolves(
        new Response(JSON.stringify({ available_quantity: 5 }), {
          status: 200,
        }),
      );
      env.CHECKOUT_KV.get.onSecondCall().callsFake((key, options) => {
        if (options === "json") {
          return Promise.resolve({
            reservations: [
              {
                sessionId: "other",
                quantity: 95,
                status: "active",
                expiresAt: Date.now() + 10000,
              },
            ],
          });
        }
        return Promise.resolve(null);
      });

      try {
        await checkoutService.getSummary("session-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("out of stock");
      }
    });

    it("should throw error when session not found", async () => {
      env.CHECKOUT_DB.prepare().bind().first.resolves(null);

      try {
        await checkoutService.getSummary("session-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });

    it("should throw error when delivery address not set", async () => {
      const mockSession = { session_id: "session-123" };
      env.CHECKOUT_DB.prepare().bind().first.resolves(mockSession);

      try {
        await checkoutService.getSummary("session-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("must be set");
      }
    });

    it("should throw error when shipping method not set", async () => {
      const mockSession = {
        session_id: "session-123",
        delivery_address_id: "addr-1",
      };
      env.CHECKOUT_DB.prepare().bind().first.resolves(mockSession);

      try {
        await checkoutService.getSummary("session-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("not set");
      }
    });

    it("should throw error when items out of stock", async () => {
      const mockSession = {
        session_id: "session-123",
        delivery_address_id: "addr-1",
        shipping_method_id: "method-1",
      };
      const mockItems = [{ sku_id: "sku-1", quantity: 10 }];

      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onFirstCall()
        .resolves(mockSession);
      env.CHECKOUT_DB.prepare()
        .bind()
        .all.onFirstCall()
        .resolves({ results: mockItems });
      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({ address_id: "addr-1" });
      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onCall(2)
        .resolves({ method_id: "method-1" });
      env.INVENTORY_WORKER.fetch.onFirstCall().resolves(
        new Response(JSON.stringify({ available_quantity: 5 }), {
          status: 200,
        }),
      );
      env.INVENTORY_WORKER.fetch.onSecondCall().resolves(
        new Response(JSON.stringify({ available_quantity: 5 }), {
          status: 200,
        }),
      );
      env.CHECKOUT_KV.get.resolves(null);
      env.CHECKOUT_KV.put.resolves();

      try {
        await checkoutService.getSummary("session-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("out of stock");
      }
    });

    it("should handle stock check unavailable", async () => {
      const mockSession = {
        session_id: "session-123",
        delivery_address_id: "addr-1",
        shipping_method_id: "method-1",
        shipping_cost: 5.0,
      };
      const mockItems = [{ sku_id: "sku-1", quantity: 10, unit_price: 10.0 }];

      let prepareCallCount = 0;
      env.CHECKOUT_DB.prepare.callsFake(() => {
        prepareCallCount++;
        if (prepareCallCount === 1) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockSession),
            }),
          };
        }
        if (prepareCallCount === 2) {
          return {
            bind: sinon.stub().returns({
              all: sinon.stub().resolves({ results: mockItems }),
            }),
          };
        }
        if (prepareCallCount === 3) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves({ address_id: "addr-1" }),
            }),
          };
        }
        if (prepareCallCount === 4) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves({ method_id: "method-1" }),
            }),
          };
        }
        return {
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(null),
            all: sinon.stub().resolves({ results: [] }),
            run: sinon.stub().resolves({ success: true }),
          }),
        };
      });
      // Stock check fails - item unavailable (needs 10, only 5 available)
      // checkStockAvailability calls INVENTORY_WORKER.fetch and CHECKOUT_KV.get (via getKVReservedQuantity)
      // It calculates: available = d1AvailableQuantity - kvReservedQuantity
      // If available < quantity, returns { available: false, ... }
      env.INVENTORY_WORKER.fetch.onFirstCall().resolves(
        new Response(JSON.stringify({ available_quantity: 5 }), {
          status: 200,
        }),
      );
      // getKVReservedQuantity calls CHECKOUT_KV.get with 'json' option
      env.CHECKOUT_KV.get.callsFake((key, options) => {
        if (options === "json") {
          return Promise.resolve(null); // No KV reservations, so kvReservedQuantity = 0
        }
        return Promise.resolve(null);
      });
      // checkStockAvailability will return available: false because 5 - 0 = 5 < 10 (quantity needed)

      try {
        await checkoutService.getSummary("session-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("out of stock");
      }
    });

    it("should handle reservation failure", async () => {
      const mockSession = {
        session_id: "session-123",
        delivery_address_id: "addr-1",
        shipping_method_id: "method-1",
        shipping_cost: 5.0,
      };
      const mockItems = [{ sku_id: "sku-1", quantity: 2, unit_price: 10.0 }];

      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onFirstCall()
        .resolves(mockSession);
      env.CHECKOUT_DB.prepare()
        .bind()
        .all.onFirstCall()
        .resolves({ results: mockItems });
      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({ address_id: "addr-1" });
      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onCall(2)
        .resolves({ method_id: "method-1" });
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      );
      env.CHECKOUT_KV.get.resolves(null);
      env.CHECKOUT_KV.put.resolves();
      // Reservation fails
      env.CHECKOUT_KV.get.onSecondCall().callsFake((key, options) => {
        if (options === "json") {
          return Promise.resolve({ reservations: [] });
        }
        return Promise.resolve(null);
      });
      env.INVENTORY_WORKER.fetch.onSecondCall().resolves(
        new Response(JSON.stringify({ available_quantity: 1 }), {
          status: 200,
        }),
      );
      env.CHECKOUT_KV.put.onSecondCall().resolves();
      env.CHECKOUT_KV.delete.resolves();

      try {
        await checkoutService.getSummary("session-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("out of stock");
      }
    });

    it("should use item unit_price when pricing worker fails", async () => {
      const mockSession = {
        session_id: "session-123",
        delivery_address_id: "addr-1",
        shipping_method_id: "method-1",
        shipping_cost: 5.0,
        currency: "USD",
      };
      const mockItems = [{ sku_id: "sku-1", quantity: 2, unit_price: 10.0 }];

      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onFirstCall()
        .resolves(mockSession);
      env.CHECKOUT_DB.prepare()
        .bind()
        .all.onFirstCall()
        .resolves({ results: mockItems });
      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({ address_id: "addr-1" });
      env.CHECKOUT_DB.prepare().bind().first.onCall(2).resolves(null);
      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onCall(3)
        .resolves({ method_id: "method-1" });
      // Create fresh Response objects for each fetch call
      env.INVENTORY_WORKER.fetch.onFirstCall().resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      );
      env.INVENTORY_WORKER.fetch.onSecondCall().resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      );
      env.CHECKOUT_KV.get.resolves(null);
      env.CHECKOUT_KV.put.resolves();
      // Pricing worker fails
      env.PRICING_WORKER.fetch
        .onFirstCall()
        .resolves(new Response("Error", { status: 500 }));
      env.PRICING_WORKER.fetch
        .onSecondCall()
        .resolves(new Response("Error", { status: 500 }));
      env.CHECKOUT_DB.prepare().bind().run.resolves({ success: true });
      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onSecondCall()
        .resolves(mockSession);

      const summary = await checkoutService.getSummary("session-123", env);

      expect(summary.pricing.subtotal).to.equal(20.0); // Uses unit_price from item
    });

    it("should handle reservation failure in getSummary", async () => {
      const mockSession = {
        session_id: "session-123",
        delivery_address_id: "addr-1",
        shipping_method_id: "method-1",
        shipping_cost: 5.0,
      };
      const mockItems = [{ sku_id: "sku-1", quantity: 10, unit_price: 10.0 }]; // Need 10, but only 5 available

      let prepareCallCount = 0;
      env.CHECKOUT_DB.prepare.callsFake(() => {
        prepareCallCount++;
        // Call 1: getCheckoutSession
        if (prepareCallCount === 1) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockSession),
            }),
          };
        }
        // Call 2: getCheckoutItems
        if (prepareCallCount === 2) {
          return {
            bind: sinon.stub().returns({
              all: sinon.stub().resolves({ results: mockItems }),
            }),
          };
        }
        // Call 3: getAddress (delivery)
        if (prepareCallCount === 3) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves({ address_id: "addr-1" }),
            }),
          };
        }
        // Call 4: getAddress (billing) - not set
        if (prepareCallCount === 4) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(null),
            }),
          };
        }
        // Call 5: getShippingMethod
        if (prepareCallCount === 5) {
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves({ method_id: "method-1" }),
            }),
          };
        }
        // Default
        return {
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(null),
            all: sinon.stub().resolves({ results: [] }),
            run: sinon.stub().resolves({ success: true }),
          }),
        };
      });
      // Stock check: available_quantity = 100, but KV has 95 reserved, so only 5 available
      // Item needs 10, so it should fail
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      );
      env.CHECKOUT_KV.get.callsFake((key, options) => {
        if (options === "json" && key.includes("reservation:")) {
          return Promise.resolve({
            reservations: [
              {
                sessionId: "other",
                quantity: 95,
                status: "active",
                expiresAt: Date.now() + 10000,
              },
            ],
          });
        }
        return Promise.resolve(null);
      });
      env.CHECKOUT_KV.put.resolves();
      env.CHECKOUT_KV.delete.resolves();

      try {
        await checkoutService.getSummary("session-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("out of stock");
      }
    });

    it("should handle reservation failure with success:false", async () => {
      const mockSession = {
        session_id: "session-123",
        delivery_address_id: "addr-1",
        shipping_method_id: "method-1",
        shipping_cost: 5.0,
      };
      const mockItems = [{ sku_id: "sku-1", quantity: 10, unit_price: 10.0 }];

      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onFirstCall()
        .resolves(mockSession);
      env.CHECKOUT_DB.prepare()
        .bind()
        .all.onFirstCall()
        .resolves({ results: mockItems });
      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({ address_id: "addr-1" });
      env.CHECKOUT_DB.prepare().bind().first.onCall(2).resolves(null);
      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onCall(3)
        .resolves({ method_id: "method-1" });
      // Stock check passes - create fresh Response objects
      env.INVENTORY_WORKER.fetch.onFirstCall().resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      );
      env.INVENTORY_WORKER.fetch.onSecondCall().resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      );
      env.CHECKOUT_KV.get.onFirstCall().resolves(null);
      // But reservation fails (insufficient after KV reservations)
      env.CHECKOUT_KV.get.onSecondCall().callsFake((key, options) => {
        if (options === "json") {
          return Promise.resolve({
            reservations: [
              {
                sessionId: "other",
                quantity: 95,
                status: "active",
                expiresAt: Date.now() + 10000,
              },
            ],
          });
        }
        return Promise.resolve(null);
      });
      env.CHECKOUT_KV.put.onFirstCall().resolves();
      env.CHECKOUT_KV.delete.resolves();

      try {
        await checkoutService.getSummary("session-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("out of stock");
      }
    });
  });

  describe("updateCheckoutSessionPaymentStatus", () => {
    it("should release stock when payment fails", async () => {
      const mockSession = { session_id: "session-123", status: "pending" };
      const updatedSession = { ...mockSession, status: "payment_failed" };
      let firstCallCount = 0;
      let prepareCallCount = 0;
      env.CHECKOUT_DB.prepare.callsFake(() => {
        prepareCallCount++;
        return {
          bind: sinon.stub().callsFake(() => {
            const isFirstCall =
              prepareCallCount === 1 ||
              (prepareCallCount > 2 && firstCallCount === 0);
            firstCallCount++;
            if (prepareCallCount === 1) {
              // First getCheckoutSession
              return {
                first: sinon.stub().resolves(mockSession),
                run: sinon.stub().resolves({ success: true }),
              };
            } else if (prepareCallCount === 2) {
              // updateCheckoutSession
              return {
                first: sinon.stub().resolves(null),
                run: sinon.stub().resolves({ success: true }),
              };
            } else {
              // Subsequent getCheckoutSession calls
              return {
                first: sinon.stub().resolves(updatedSession),
                run: sinon.stub().resolves({ success: true }),
              };
            }
          }),
        };
      });
      env.CHECKOUT_KV.get.resolves(null);

      const session = await checkoutService.updateCheckoutSessionPaymentStatus(
        "session-123",
        "payment-123",
        "failed",
        {},
        env,
      );

      expect(session).to.exist;
      expect(session.status).to.equal("payment_failed");
    });

    it("should release stock when payment is cancelled", async () => {
      const mockSession = { session_id: "session-123", status: "pending" };
      const updatedSession = { ...mockSession, status: "payment_failed" };
      let prepareCallCount = 0;
      env.CHECKOUT_DB.prepare.callsFake(() => {
        prepareCallCount++;
        return {
          bind: sinon.stub().callsFake(() => {
            if (prepareCallCount === 1) {
              // First getCheckoutSession
              return {
                first: sinon.stub().resolves(mockSession),
                run: sinon.stub().resolves({ success: true }),
              };
            } else if (prepareCallCount === 2) {
              // updateCheckoutSession
              return {
                first: sinon.stub().resolves(null),
                run: sinon.stub().resolves({ success: true }),
              };
            } else {
              // Subsequent getCheckoutSession calls
              return {
                first: sinon.stub().resolves(updatedSession),
                run: sinon.stub().resolves({ success: true }),
              };
            }
          }),
        };
      });
      env.CHECKOUT_KV.get.resolves(null);

      const session = await checkoutService.updateCheckoutSessionPaymentStatus(
        "session-123",
        "payment-123",
        "cancelled",
        {},
        env,
      );

      expect(session).to.exist;
      expect(session.status).to.equal("payment_failed");
    });

    it("should handle stock release errors gracefully", async () => {
      const mockSession = { session_id: "session-123", status: "pending" };
      const updatedSession = { ...mockSession, status: "payment_failed" };
      let prepareCallCount = 0;
      env.CHECKOUT_DB.prepare.callsFake(() => {
        prepareCallCount++;
        return {
          bind: sinon.stub().callsFake(() => {
            if (prepareCallCount === 1) {
              // First getCheckoutSession
              return {
                first: sinon.stub().resolves(mockSession),
                run: sinon.stub().resolves({ success: true }),
              };
            } else if (prepareCallCount === 2) {
              // updateCheckoutSession
              return {
                first: sinon.stub().resolves(null),
                run: sinon.stub().resolves({ success: true }),
              };
            } else {
              // Subsequent getCheckoutSession calls
              return {
                first: sinon.stub().resolves(updatedSession),
                run: sinon.stub().resolves({ success: true }),
              };
            }
          }),
        };
      });
      env.CHECKOUT_KV.get.rejects(new Error("KV error"));

      const session = await checkoutService.updateCheckoutSessionPaymentStatus(
        "session-123",
        "payment-123",
        "failed",
        {},
        env,
      );

      // Should still update session even if stock release fails
      expect(session).to.exist;
      expect(session.status).to.equal("payment_failed");
    });
  });

  describe("Shipping Method Admin Services", () => {
    it("should create shipping method", async () => {
      const methodData = {
        name: "Standard Shipping",
        carrier: "USPS",
        base_cost: 5.0,
      };
      const mockMethod = { method_id: "method-123", ...methodData };
      // First prepare for INSERT (createShippingMethodDb)
      const prepareStub1 = env.CHECKOUT_DB.prepare();
      const bindStub1 = prepareStub1.bind();
      bindStub1.run.resolves({ success: true });
      // Second prepare for SELECT (getShippingMethod)
      const prepareStub2 = env.CHECKOUT_DB.prepare();
      const bindStub2 = prepareStub2.bind();
      bindStub2.first.resolves(mockMethod);

      const method = await checkoutService.createShippingMethodService(
        methodData,
        env,
      );

      expect(method).to.exist;
    });

    it("should update shipping method", async () => {
      const updates = { name: "Updated Name" };
      const mockMethod = { method_id: "method-123", name: "Updated Name" };
      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onFirstCall()
        .resolves({ method_id: "method-123" });
      env.CHECKOUT_DB.prepare().bind().run.resolves({ success: true });
      env.CHECKOUT_DB.prepare()
        .bind()
        .first.onSecondCall()
        .resolves(mockMethod);

      const method = await checkoutService.updateShippingMethodService(
        "method-123",
        updates,
        env,
      );

      expect(method).to.exist;
    });

    it("should delete shipping method", async () => {
      env.CHECKOUT_DB.prepare()
        .bind()
        .first.resolves({ method_id: "method-123" });
      env.CHECKOUT_DB.prepare().bind().run.resolves({ success: true });

      const result = await checkoutService.deleteShippingMethodService(
        "method-123",
        env,
      );

      expect(result.success).to.be.true;
    });

    it("should get all shipping methods", async () => {
      const mockMethods = [
        { method_id: "method-1" },
        { method_id: "method-2" },
      ];
      // getShippingMethods doesn't use bind
      const prepareStub = env.CHECKOUT_DB.prepare();
      prepareStub.all.resolves({ results: mockMethods });

      const methods = await checkoutService.getAllShippingMethodsService(env);

      expect(methods).to.deep.equal(mockMethods);
    });

    it("should get shipping method by ID", async () => {
      const mockMethod = { method_id: "method-123", name: "Standard" };
      env.CHECKOUT_DB.prepare().bind().first.resolves(mockMethod);

      const method = await checkoutService.getShippingMethodByIdService(
        "method-123",
        env,
      );

      expect(method).to.deep.equal(mockMethod);
    });

    it("should throw error when shipping method not found", async () => {
      env.CHECKOUT_DB.prepare().bind().first.resolves(null);

      try {
        await checkoutService.getShippingMethodByIdService("method-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });
  });
});
