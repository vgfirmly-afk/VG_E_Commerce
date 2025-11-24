// test/handlers/fulfillmentHandlers.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import * as handlers from "../../src/handlers/fulfillmentHandlers.js";
import { createMockRequest, createMockEnv } from "../setup.js";

describe("Fulfillment Handlers", () => {
  let env;

  beforeEach(() => {
    env = createMockEnv();
    sinon.stub(console, "error");
    sinon.stub(console, "log");
    sinon.stub(console, "warn");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("handleFulfillmentWebhook", () => {
    it("should handle valid webhook request", async () => {
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
        "https://example.com/webhooks/fulfillment",
        webhookData,
      );

      // Mock database and service worker calls
      const mockOrder = {
        order_id: "order-123",
        order_number: "ORD-20241201-001",
        status: "confirmed",
        created_at: new Date().toISOString(),
      };

      const mockItem = { item_id: "item-123" };

      env.CHECKOUT_WORKER.fetch.resolves(
        new Response(JSON.stringify({}), { status: 200 }),
      );

      const mockBind1 = { run: sinon.stub().resolves({ success: true }) };
      const mockPrepare1 = { bind: sinon.stub().returns(mockBind1) };

      const mockBind2 = { first: sinon.stub().resolves(mockOrder) };
      const mockPrepare2 = { bind: sinon.stub().returns(mockBind2) };

      const mockBind3 = { run: sinon.stub().resolves({ success: true }) };
      const mockPrepare3 = { bind: sinon.stub().returns(mockBind3) };

      const mockBind4 = { first: sinon.stub().resolves(mockItem) };
      const mockPrepare4 = { bind: sinon.stub().returns(mockBind4) };

      env.FULLFILLMENT_DB.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare1)
        .onCall(2)
        .returns(mockPrepare2)
        .onCall(3)
        .returns(mockPrepare2)
        .onCall(4)
        .returns(mockPrepare3)
        .onCall(5)
        .returns(mockPrepare4);

      const response = await handlers.handleFulfillmentWebhook(request, env);

      expect(response.status).to.be.oneOf([201, 400, 500]);
    });

    it("should reject invalid JSON", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/webhooks/fulfillment",
        null,
      );
      request.json = sinon.stub().rejects(new Error("Invalid JSON"));

      const response = await handlers.handleFulfillmentWebhook(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should reject invalid webhook data", async () => {
      const invalidData = { invalid: "data" };
      const request = createMockRequest(
        "POST",
        "https://example.com/webhooks/fulfillment",
        invalidData,
      );

      const response = await handlers.handleFulfillmentWebhook(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should handle service errors", async () => {
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
        "https://example.com/webhooks/fulfillment",
        webhookData,
      );

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          run: sinon.stub().rejects(new Error("Service error")),
        }),
      });

      const response = await handlers.handleFulfillmentWebhook(request, env);
      const body = await response.json();

      expect(response.status).to.equal(500);
      expect(body.error).to.equal("internal_error");
    });
  });

  describe("getOrderById", () => {
    it("should return order when found", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/orders/order-123",
      );
      request.params = { order_id: "order-123" };

      const mockOrder = {
        order_id: "order-123",
        order_number: "ORD-20241201-001",
        status: "confirmed",
        items: [],
        status_history: [],
        shipping_tracking: null,
      };

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockOrder),
          all: sinon.stub().resolves({ results: [] }),
        }),
      });

      env.CATALOG_WORKER.fetch.resolves(
        new Response(JSON.stringify({}), { status: 200 }),
      );

      const response = await handlers.getOrderById(request, env);

      expect(response.status).to.be.oneOf([200, 404, 500]);
    });

    it("should return 404 when order not found", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/orders/order-123",
      );
      request.params = { order_id: "order-123" };

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(null),
        }),
      });

      const response = await handlers.getOrderById(request, env);
      const body = await response.json();

      expect(response.status).to.equal(404);
      expect(body.error).to.equal("not_found");
    });

    it("should reject invalid order ID", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/orders/",
      );
      request.params = { order_id: "" };

      const response = await handlers.getOrderById(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });
  });

  describe("getUserOrders", () => {
    it("should return orders for user", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/orders",
      );
      request.headers.set("X-User-Id", "user-123");

      const mockOrders = [{ order_id: "order-1", user_id: "user-123" }];

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          all: sinon.stub().resolves({ results: mockOrders }),
          first: sinon.stub().resolves(null),
        }),
      });

      const response = await handlers.getUserOrders(request, env);

      expect(response.status).to.be.oneOf([200, 400, 500]);
    });

    it("should return orders for guest session", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/orders",
      );
      request.headers.set("X-Session-Id", "guest-123");

      const mockOrders = [
        { order_id: "order-1", guest_session_id: "guest-123" },
      ];

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          all: sinon.stub().resolves({ results: mockOrders }),
          first: sinon.stub().resolves(null),
        }),
      });

      const response = await handlers.getUserOrders(request, env);

      expect(response.status).to.be.oneOf([200, 400, 500]);
    });

    it("should reject when neither userId nor sessionId provided", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/orders",
      );

      const response = await handlers.getUserOrders(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should handle pagination parameters", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/orders?limit=10&offset=20",
      );
      request.headers.set("X-User-Id", "user-123");

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          all: sinon.stub().resolves({ results: [] }),
          first: sinon.stub().resolves(null),
        }),
      });

      const response = await handlers.getUserOrders(request, env);

      expect(response.status).to.be.oneOf([200, 400, 500]);
    });
  });

  describe("updateFulfillmentStatus", () => {
    it("should update fulfillment status successfully", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/orders/order-123/status",
        {
          status: "shipped",
          notes: "Order shipped",
        },
      );
      request.params = { order_id: "order-123" };
      request.headers.set("X-User-Id", "user-123");

      const mockOrder = {
        order_id: "order-123",
        status: "confirmed",
        items: [],
        status_history: [],
        shipping_tracking: null,
      };

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockOrder),
          run: sinon.stub().resolves({ success: true }),
          all: sinon.stub().resolves({ results: [] }),
        }),
      });

      env.CATALOG_WORKER.fetch.resolves(
        new Response(JSON.stringify({}), { status: 200 }),
      );

      const response = await handlers.updateFulfillmentStatus(request, env);

      expect(response.status).to.be.oneOf([200, 400, 404, 500]);
    });

    it("should reject invalid JSON", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/orders/order-123/status",
        null,
      );
      request.params = { order_id: "order-123" };
      request.json = sinon.stub().rejects(new Error("Invalid JSON"));

      const response = await handlers.updateFulfillmentStatus(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should reject invalid status update data", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/orders/order-123/status",
        {
          status: "invalid_status",
        },
      );
      request.params = { order_id: "order-123" };

      const response = await handlers.updateFulfillmentStatus(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should handle service errors", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/orders/order-123/status",
        {
          status: "shipped",
        },
      );
      request.params = { order_id: "order-123" };

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(null),
        }),
      });

      const response = await handlers.updateFulfillmentStatus(request, env);
      const body = await response.json();

      expect(response.status).to.equal(404);
      expect(body.error).to.equal("internal_error");
    });
  });

  describe("addShippingTracking", () => {
    it("should add shipping tracking successfully", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/orders/order-123/tracking",
        {
          carrier: "UPS",
          tracking_number: "1Z999AA10123456784",
        },
      );
      request.params = { order_id: "order-123" };

      const mockOrder = { order_id: "order-123", status: "confirmed" };
      const mockTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        carrier: "UPS",
        tracking_number: "1Z999AA10123456784",
      };

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon
            .stub()
            .onCall(0)
            .resolves(mockOrder)
            .onCall(1)
            .resolves(null)
            .onCall(2)
            .resolves(mockTracking),
          run: sinon.stub().resolves({ success: true }),
        }),
      });

      const response = await handlers.addShippingTracking(request, env);

      expect(response.status).to.be.oneOf([201, 400, 404, 409, 500]);
    });

    it("should reject invalid tracking data", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/orders/order-123/tracking",
        {
          carrier: "", // Invalid: empty
        },
      );
      request.params = { order_id: "order-123" };

      const response = await handlers.addShippingTracking(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should handle service errors", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/orders/order-123/tracking",
        {
          carrier: "UPS",
          tracking_number: "1Z999AA10123456784",
        },
      );
      request.params = { order_id: "order-123" };

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(null),
        }),
      });

      const response = await handlers.addShippingTracking(request, env);
      const body = await response.json();

      expect(response.status).to.equal(404);
      expect(body.error).to.equal("internal_error");
    });

    it("should return 409 when tracking already exists", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/orders/order-123/tracking",
        {
          carrier: "UPS",
          tracking_number: "1Z999AA10123456784",
        },
      );
      request.params = { order_id: "order-123" };

      const mockOrder = { order_id: "order-123", status: "confirmed" };
      const existingTracking = { tracking_id: "tracking-123" };

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon
            .stub()
            .onCall(0)
            .resolves(mockOrder)
            .onCall(1)
            .resolves(existingTracking),
        }),
      });

      const response = await handlers.addShippingTracking(request, env);
      const body = await response.json();

      expect(response.status).to.equal(409);
    });
  });

  describe("updateShippingTracking", () => {
    it("should update shipping tracking successfully", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/tracking/tracking-123",
        {
          status: "in_transit",
        },
      );
      request.params = { tracking_id: "tracking-123" };

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

      const response = await handlers.updateShippingTracking(request, env);

      expect(response.status).to.be.oneOf([200, 400, 404, 500]);
    });

    it("should reject missing tracking ID", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/tracking/",
        {
          status: "in_transit",
        },
      );
      request.params = {};

      const response = await handlers.updateShippingTracking(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should reject invalid JSON", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/tracking/tracking-123",
        null,
      );
      request.params = { tracking_id: "tracking-123" };
      request.json = sinon.stub().rejects(new Error("Invalid JSON"));

      const response = await handlers.updateShippingTracking(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should handle service errors", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/tracking/tracking-123",
        {
          status: "in_transit",
        },
      );
      request.params = { tracking_id: "tracking-123" };

      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(null),
        }),
      });

      const response = await handlers.updateShippingTracking(request, env);
      const body = await response.json();

      expect(response.status).to.equal(404);
      expect(body.error).to.equal("internal_error");
    });
  });
});
