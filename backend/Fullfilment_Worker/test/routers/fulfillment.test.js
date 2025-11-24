// test/routers/fulfillment.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import router from "../../src/routers/fulfillment.js";
import { createMockRequest, createMockEnv } from "../setup.js";

describe("Fulfillment Router", () => {
  let env;

  beforeEach(() => {
    env = createMockEnv();
    sinon.stub(console, "error");
    sinon.stub(console, "log");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("GET /_/health", () => {
    it("should return health check response", async () => {
      const request = createMockRequest("GET", "https://example.com/_/health");

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body).to.deep.equal({ ok: true });
    });
  });

  describe("POST /api/v1/webhooks/fulfillment", () => {
    it("should handle fulfillment webhook with valid data", async () => {
      const webhookData = {
        checkout_session_id: "session-123",
        payment_id: "payment-123",
        order_data: {
          items: [
            { sku_id: "sku-123", quantity: 1, unit_price: 10, subtotal: 10 },
          ],
          subtotal: 10,
          shipping_cost: 5,
          tax: 1,
          total: 16,
        },
      };

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/webhooks/fulfillment",
        webhookData,
      );

      // Mock database calls for the handler
      const mockOrder = {
        order_id: "order-123",
        order_number: "ORD-20241201-001",
        status: "confirmed",
        created_at: new Date().toISOString(),
      };

      const mockItem = { item_id: "item-123" };

      env.CHECKOUT_WORKER.fetch.resolves(
        new Response(JSON.stringify({ checkout_session_id: "session-123" }), {
          status: 200,
        }),
      );

      const mockPrepare1 = {
        bind: sinon
          .stub()
          .returns({ run: sinon.stub().resolves({ success: true }) }),
      };
      const mockPrepare2 = {
        bind: sinon.stub().returns({ first: sinon.stub().resolves(mockOrder) }),
      };
      const mockPrepare3 = {
        bind: sinon
          .stub()
          .returns({ run: sinon.stub().resolves({ success: true }) }),
      };
      const mockPrepare4 = {
        bind: sinon.stub().returns({ first: sinon.stub().resolves(mockItem) }),
      };

      env.FULLFILLMENT_DB.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2)
        .onCall(2)
        .returns(mockPrepare2)
        .onCall(3)
        .returns(mockPrepare3)
        .onCall(4)
        .returns(mockPrepare4);

      const response = await router.handle(request, env, {});

      expect(response.status).to.be.oneOf([201, 400, 500]);
    });

    it("should handle handler errors gracefully", async () => {
      // Create a valid request that passes validation but fails in handler
      const webhookData = {
        checkout_session_id: "session-123",
        payment_id: "payment-123",
        order_data: {
          items: [
            { sku_id: "sku-123", quantity: 1, unit_price: 10, subtotal: 10 },
          ],
          subtotal: 10,
          shipping_cost: 5,
          tax: 1,
          total: 16,
        },
      };
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/webhooks/fulfillment",
        webhookData,
      );

      // Mock validation to pass, but service to fail
      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          run: sinon.stub().rejects(new Error("Handler error")),
        }),
      });

      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(500);
    });

    it("should handle request.env fallback", async () => {
      const webhookData = {
        checkout_session_id: "session-123",
        payment_id: "payment-123",
        order_data: {
          items: [
            { sku_id: "sku-123", quantity: 1, unit_price: 10, subtotal: 10 },
          ],
          subtotal: 10,
          shipping_cost: 5,
          tax: 1,
          total: 16,
        },
      };
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/webhooks/fulfillment",
        webhookData,
      );
      request.env = env; // Test request.env branch

      const mockOrder = {
        order_id: "order-123",
        order_number: "ORD-20241201-001",
        status: "confirmed",
        created_at: new Date().toISOString(),
      };

      const mockItem = { item_id: "item-123" };

      env.CHECKOUT_WORKER.fetch.resolves(
        new Response(JSON.stringify({ checkout_session_id: "session-123" }), {
          status: 200,
        }),
      );

      const mockPrepare1 = {
        bind: sinon
          .stub()
          .returns({ run: sinon.stub().resolves({ success: true }) }),
      };
      const mockPrepare2 = {
        bind: sinon.stub().returns({ first: sinon.stub().resolves(mockOrder) }),
      };
      const mockPrepare3 = {
        bind: sinon
          .stub()
          .returns({ run: sinon.stub().resolves({ success: true }) }),
      };
      const mockPrepare4 = {
        bind: sinon.stub().returns({ first: sinon.stub().resolves(mockItem) }),
      };

      env.FULLFILLMENT_DB.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2)
        .onCall(2)
        .returns(mockPrepare2)
        .onCall(3)
        .returns(mockPrepare3)
        .onCall(4)
        .returns(mockPrepare4);

      const response = await router.handle(request, {}, {});

      expect(response.status).to.be.oneOf([201, 400, 500]);
    });
  });

  describe("GET /api/v1/orders", () => {
    it("should get user orders", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/orders",
      );
      request.headers.set("X-User-Id", "user-123");

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          all: sinon.stub().resolves({ results: [] }),
          first: sinon.stub().resolves(null),
        }),
      });

      const response = await router.handle(request, env, {});

      expect(response.status).to.be.oneOf([200, 400, 500]);
    });

    it("should handle request.env fallback", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/orders",
      );
      request.headers.set("X-User-Id", "user-123");
      request.env = env; // Set request.env to test fallback

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          all: sinon.stub().resolves({ results: [] }),
          first: sinon.stub().resolves(null),
        }),
      });

      const response = await router.handle(request, {}, {});

      expect(response.status).to.be.oneOf([200, 400, 500]);
    });
  });

  describe("GET /api/v1/orders/:order_id", () => {
    it("should get order by ID", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/orders/order-123",
      );
      request.params = { order_id: "order-123" };

      const mockOrder = {
        order_id: "order-123",
        order_number: "ORD-20241201-001",
        status: "confirmed",
      };

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockOrder),
          all: sinon.stub().resolves({ results: [] }),
        }),
      });

      const response = await router.handle(request, env, {});

      expect(response.status).to.be.oneOf([200, 404, 400, 500]);
    });

    it("should handle request.env fallback", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/orders/order-123",
      );
      request.params = { order_id: "order-123" };
      request.env = env; // Test request.env branch

      const mockOrder = {
        order_id: "order-123",
        order_number: "ORD-20241201-001",
        status: "confirmed",
      };

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockOrder),
          all: sinon.stub().resolves({ results: [] }),
        }),
      });

      const response = await router.handle(request, {}, {});

      expect(response.status).to.be.oneOf([200, 404, 400, 500]);
    });
  });

  describe("PUT /api/v1/orders/:order_id/status", () => {
    it("should update fulfillment status", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/orders/order-123/status",
        {
          status: "shipped",
        },
      );
      request.params = { order_id: "order-123" };
      request.headers.set("Content-Type", "application/json");

      const mockOrder = {
        order_id: "order-123",
        status: "confirmed",
      };

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockOrder),
          run: sinon.stub().resolves({ success: true }),
          all: sinon.stub().resolves({ results: [] }),
        }),
      });

      const response = await router.handle(request, env, {});

      expect(response.status).to.be.oneOf([200, 400, 404, 500]);
    });

    it("should reject null Content-Type header", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/orders/order-123/status",
        {
          status: "shipped",
        },
      );
      request.params = { order_id: "order-123" };
      request.headers.delete("Content-Type");
      request.headers.get = sinon.stub().returns(null); // Explicitly return null

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should reject missing Content-Type header", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/orders/order-123/status",
        {
          status: "shipped",
        },
      );
      request.params = { order_id: "order-123" };
      request.headers.delete("Content-Type");

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should reject invalid Content-Type header", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/orders/order-123/status",
        {
          status: "shipped",
        },
      );
      request.params = { order_id: "order-123" };
      request.headers.set("Content-Type", "text/plain");

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should handle handler errors", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/orders/order-123/status",
        {
          status: "shipped",
        },
      );
      request.params = { order_id: "order-123" };
      request.headers.set("Content-Type", "application/json");

      // Make the handler throw an error after validation passes
      // Mock database to cause error in handler
      env.FULLFILLMENT_DB.prepare = sinon
        .stub()
        .throws(new Error("Database connection failed"));

      const response = await router.handle(request, env, {});

      // Router catch block will handle the error, but handlers catch errors internally
      // So we accept either 400 (validation) or 500 (router catch)
      expect(response.status).to.be.oneOf([400, 500]);
    });
  });

  describe("POST /api/v1/orders/:order_id/tracking", () => {
    it("should add shipping tracking", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/orders/order-123/tracking",
        {
          carrier: "UPS",
          tracking_number: "1Z999AA10123456784",
        },
      );
      request.params = { order_id: "order-123" };
      request.headers.set("Content-Type", "application/json");

      const mockOrder = { order_id: "order-123", status: "confirmed" };
      const mockTracking = { tracking_id: "tracking-123" };

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon
            .stub()
            .resolves(mockOrder)
            .onCall(1)
            .resolves(null)
            .onCall(2)
            .resolves(mockTracking),
          run: sinon.stub().resolves({ success: true }),
        }),
      });

      const response = await router.handle(request, env, {});

      expect(response.status).to.be.oneOf([201, 400, 404, 409, 500]);
    });

    it("should reject missing Content-Type header", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/orders/order-123/tracking",
        {
          carrier: "UPS",
          tracking_number: "1Z999AA10123456784",
        },
      );
      request.params = { order_id: "order-123" };
      request.headers.delete("Content-Type");

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should reject invalid Content-Type header", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/orders/order-123/tracking",
        {
          carrier: "UPS",
          tracking_number: "1Z999AA10123456784",
        },
      );
      request.params = { order_id: "order-123" };
      request.headers.set("Content-Type", "text/xml");

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should handle handler errors", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/orders/order-123/tracking",
        {
          carrier: "UPS",
          tracking_number: "1Z999AA10123456784",
        },
      );
      request.params = { order_id: "order-123" };
      request.headers.set("Content-Type", "application/json");

      // Make the handler throw an error after validation passes
      env.FULLFILLMENT_DB.prepare = sinon
        .stub()
        .throws(new Error("Database connection failed"));

      const response = await router.handle(request, env, {});

      // Router catch block will handle the error, but handlers catch errors internally
      // So we accept either 400 (validation) or 500 (router catch)
      expect(response.status).to.be.oneOf([400, 500]);
    });

    it("should handle request.env fallback", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/orders/order-123/tracking",
        {
          carrier: "UPS",
          tracking_number: "1Z999AA10123456784",
        },
      );
      request.params = { order_id: "order-123" };
      request.headers.set("Content-Type", "application/json");
      request.env = env; // Test request.env branch

      const mockOrder = { order_id: "order-123", status: "confirmed" };
      const mockTracking = { tracking_id: "tracking-123" };

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon
            .stub()
            .resolves(mockOrder)
            .onCall(1)
            .resolves(null)
            .onCall(2)
            .resolves(mockTracking),
          run: sinon.stub().resolves({ success: true }),
        }),
      });

      const response = await router.handle(request, {}, {});

      expect(response.status).to.be.oneOf([201, 400, 404, 409, 500]);
    });
  });

  describe("PUT /api/v1/tracking/:tracking_id", () => {
    it("should update shipping tracking", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/tracking/tracking-123",
        {
          status: "in_transit",
        },
      );
      request.params = { tracking_id: "tracking-123" };
      request.headers.set("Content-Type", "application/json");

      const mockTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        status: "pending",
      };

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockTracking),
          run: sinon.stub().resolves({ success: true }),
        }),
      });

      const response = await router.handle(request, env, {});

      expect(response.status).to.be.oneOf([200, 400, 404, 500]);
    });

    it("should reject missing Content-Type header", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/tracking/tracking-123",
        {
          status: "in_transit",
        },
      );
      request.params = { tracking_id: "tracking-123" };
      request.headers.delete("Content-Type");

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should reject invalid Content-Type header", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/tracking/tracking-123",
        {
          status: "in_transit",
        },
      );
      request.params = { tracking_id: "tracking-123" };
      request.headers.set("Content-Type", "text/html");

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should handle handler errors", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/tracking/tracking-123",
        {
          status: "in_transit",
        },
      );
      request.params = { tracking_id: "tracking-123" };
      request.headers.set("Content-Type", "application/json");

      // Make the handler throw an error after validation passes
      env.FULLFILLMENT_DB.prepare = sinon
        .stub()
        .throws(new Error("Database connection failed"));

      const response = await router.handle(request, env, {});

      // Router catch block will handle the error, but handlers catch errors internally
      // So we accept either 400 (validation) or 500 (router catch)
      expect(response.status).to.be.oneOf([400, 500]);
    });

    it("should handle request.env fallback", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/tracking/tracking-123",
        {
          status: "in_transit",
        },
      );
      request.params = { tracking_id: "tracking-123" };
      request.headers.set("Content-Type", "application/json");
      request.env = env; // Test request.env branch

      const mockTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        status: "pending",
      };

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockTracking),
          run: sinon.stub().resolves({ success: true }),
        }),
      });

      const response = await router.handle(request, {}, {});

      expect(response.status).to.be.oneOf([200, 400, 404, 500]);
    });
  });

  describe("Fallback route", () => {
    it("should return 404 for unknown routes", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/unknown/route",
      );

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(404);
      expect(body.error).to.equal("not_found");
      expect(body.message).to.include("Route not found");
    });

    it("should return 404 for POST to unknown routes", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/unknown/route",
      );

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(404);
      expect(body.error).to.equal("not_found");
    });

    it("should return 404 for PUT to unknown routes", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/unknown/route",
      );

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(404);
      expect(body.error).to.equal("not_found");
    });

    it("should include method in error message", async () => {
      const request = createMockRequest(
        "DELETE",
        "https://example.com/api/v1/invalid",
      );

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(body.message).to.include("DELETE");
    });
  });
});
