// test/services/fulfillmentService.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import * as service from "../../src/services/fulfillmentService.js";
import { createMockEnv } from "../setup.js";

describe("Fulfillment Service", () => {
  let env;

  beforeEach(() => {
    env = createMockEnv();
    sinon.stub(console, "log");
    sinon.stub(console, "error");
    sinon.stub(console, "warn");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createFulfillmentFromWebhook", () => {
    it("should create fulfillment from webhook successfully", async () => {
      const webhookData = {
        checkout_session_id: "session-123",
        payment_id: "payment-123",
        user_id: "user-123",
        order_data: {
          items: [
            {
              sku_id: "sku-123",
              product_id: "prod-123",
              quantity: 2,
              unit_price: 10.5,
              subtotal: 21.0,
            },
          ],
          subtotal: 21.0,
          shipping_cost: 5.0,
          tax: 2.1,
          total: 28.1,
          currency: "USD",
        },
      };

      const mockOrder = {
        order_id: "order-123",
        order_number: "ORD-20241201-001",
        status: "confirmed",
        created_at: new Date().toISOString(),
      };

      const mockItem = {
        item_id: "item-123",
        order_id: "order-123",
      };

      // Mock CHECKOUT_WORKER
      env.CHECKOUT_WORKER.fetch.resolves(
        new Response(JSON.stringify({ checkout_session_id: "session-123" }), {
          status: 200,
        }),
      );

      // Mock database calls
      const mockPrepare1 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare2 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockOrder),
        }),
      };

      const mockPrepare3 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare4 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockItem),
        }),
      };

      // Setup mocks properly for all prepare calls
      // Call sequence: createOrder -> INSERT orders, createFulfillmentStatus -> INSERT status, getFulfillmentStatus -> SELECT status, getOrder -> SELECT order
      // Then for items: createOrderItem -> INSERT item, getOrderItem -> SELECT item

      const mockStatus = {
        status_id: "status-123",
        order_id: "order-123",
        status: "confirmed",
      };

      const mockBindInsert = { run: sinon.stub().resolves({ success: true }) };
      const mockPrepareInsert = { bind: sinon.stub().returns(mockBindInsert) };

      const mockBindGetStatus = { first: sinon.stub().resolves(mockStatus) };
      const mockPrepareGetStatus = {
        bind: sinon.stub().returns(mockBindGetStatus),
      };

      const mockBindGetOrder = { first: sinon.stub().resolves(mockOrder) };
      const mockPrepareGetOrder = {
        bind: sinon.stub().returns(mockBindGetOrder),
      };

      const mockBindGetItem = { first: sinon.stub().resolves(mockItem) };
      const mockPrepareGetItem = {
        bind: sinon.stub().returns(mockBindGetItem),
      };

      env.FULLFILLMENT_DB.prepare
        .onCall(0)
        .returns(mockPrepareInsert) // INSERT orders
        .onCall(1)
        .returns(mockPrepareInsert) // INSERT fulfillment_status
        .onCall(2)
        .returns(mockPrepareGetStatus) // SELECT fulfillment_status
        .onCall(3)
        .returns(mockPrepareGetOrder) // SELECT orders (getOrder)
        .onCall(4)
        .returns(mockPrepareInsert) // INSERT order_items
        .onCall(5)
        .returns(mockPrepareGetItem); // SELECT order_items

      const result = await service.createFulfillmentFromWebhook(
        webhookData,
        env,
      );

      expect(result).to.have.property("order_id");
      expect(result).to.have.property("order_number");
      expect(result).to.have.property("status");
      expect(result).to.have.property("items");
    });

    it("should handle missing CHECKOUT_WORKER binding gracefully", async () => {
      env.CHECKOUT_WORKER = null;

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

      const mockOrder = {
        order_id: "order-123",
        order_number: "ORD-20241201-001",
        status: "confirmed",
        created_at: new Date().toISOString(),
      };

      const mockItem = {
        item_id: "item-123",
        order_id: "order-123",
      };

      const mockStatus = {
        status_id: "status-123",
        order_id: "order-123",
        status: "confirmed",
      };

      const mockBindInsert = { run: sinon.stub().resolves({ success: true }) };
      const mockPrepareInsert = { bind: sinon.stub().returns(mockBindInsert) };

      const mockBindGetStatus = { first: sinon.stub().resolves(mockStatus) };
      const mockPrepareGetStatus = {
        bind: sinon.stub().returns(mockBindGetStatus),
      };

      const mockBindGetOrder = { first: sinon.stub().resolves(mockOrder) };
      const mockPrepareGetOrder = {
        bind: sinon.stub().returns(mockBindGetOrder),
      };

      const mockBindGetItem = { first: sinon.stub().resolves(mockItem) };
      const mockPrepareGetItem = {
        bind: sinon.stub().returns(mockBindGetItem),
      };

      env.FULLFILLMENT_DB.prepare
        .onCall(0)
        .returns(mockPrepareInsert) // INSERT orders
        .onCall(1)
        .returns(mockPrepareInsert) // INSERT fulfillment_status
        .onCall(2)
        .returns(mockPrepareGetStatus) // SELECT fulfillment_status
        .onCall(3)
        .returns(mockPrepareGetOrder) // SELECT orders (getOrder)
        .onCall(4)
        .returns(mockPrepareInsert) // INSERT order_items
        .onCall(5)
        .returns(mockPrepareGetItem); // SELECT order_items

      const result = await service.createFulfillmentFromWebhook(
        webhookData,
        env,
      );

      expect(result).to.have.property("order_id");
    });
  });

  describe("getOrderDetails", () => {
    it("should return order with full details", async () => {
      const mockOrder = {
        order_id: "order-123",
        order_number: "ORD-20241201-001",
        status: "confirmed",
      };

      const mockItems = [
        { item_id: "item-1", order_id: "order-123", product_id: "prod-123" },
      ];

      const mockStatuses = [
        { status_id: "status-1", order_id: "order-123", status: "confirmed" },
      ];

      const mockTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
      };

      env.FULLFILLMENT_DB.prepare
        .onCall(0)
        .returns({
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(mockOrder),
          }),
        })
        .onCall(1)
        .returns({
          bind: sinon.stub().returns({
            all: sinon.stub().resolves({ results: mockItems }),
          }),
        })
        .onCall(2)
        .returns({
          bind: sinon.stub().returns({
            all: sinon.stub().resolves({ results: mockStatuses }),
          }),
        })
        .onCall(3)
        .returns({
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(mockTracking),
          }),
        });

      // Mock CATALOG_WORKER
      env.CATALOG_WORKER.fetch.resolves(
        new Response(
          JSON.stringify({
            product_id: "prod-123",
            name: "Test Product",
            description: "Test Description",
            image_url: "http://example.com/image.jpg",
          }),
          { status: 200 },
        ),
      );

      const result = await service.getOrderDetails("order-123", env);

      expect(result).to.have.property("order_id");
      expect(result).to.have.property("items");
      expect(result).to.have.property("status_history");
      expect(result).to.have.property("shipping_tracking");
    });

    it("should return null when order not found", async () => {
      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(null),
        }),
      });

      const result = await service.getOrderDetails("order-123", env);
      expect(result).to.be.null;
    });

    it("should handle items without product_id", async () => {
      const mockOrder = {
        order_id: "order-123",
        order_number: "ORD-20241201-001",
        status: "confirmed",
      };

      const mockItems = [
        { item_id: "item-1", order_id: "order-123", sku_id: "sku-123", product_id: null },
      ];

      const mockStatuses = [];

      env.FULLFILLMENT_DB.prepare
        .onCall(0).returns({
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(mockOrder),
          }),
        })
        .onCall(1).returns({
          bind: sinon.stub().returns({
            all: sinon.stub().resolves({ results: mockItems }),
          }),
        })
        .onCall(2).returns({
          bind: sinon.stub().returns({
            all: sinon.stub().resolves({ results: mockStatuses }),
          }),
        })
        .onCall(3).returns({
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(null),
          }),
        });

      const result = await service.getOrderDetails("order-123", env);

      expect(result).to.have.property("items");
      expect(result.items[0].product).to.be.null;
    });

    it("should handle CATALOG_WORKER fetch failure gracefully", async () => {
      const mockOrder = {
        order_id: "order-123",
        order_number: "ORD-20241201-001",
        status: "confirmed",
      };

      const mockItems = [
        { item_id: "item-1", order_id: "order-123", sku_id: "sku-123", product_id: "prod-123" },
      ];

      const mockStatuses = [];

      env.FULLFILLMENT_DB.prepare
        .onCall(0).returns({
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(mockOrder),
          }),
        })
        .onCall(1).returns({
          bind: sinon.stub().returns({
            all: sinon.stub().resolves({ results: mockItems }),
          }),
        })
        .onCall(2).returns({
          bind: sinon.stub().returns({
            all: sinon.stub().resolves({ results: mockStatuses }),
          }),
        })
        .onCall(3).returns({
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(null),
          }),
        });

      // Mock CATALOG_WORKER to fail
      env.CATALOG_WORKER.fetch.resolves(
        new Response(JSON.stringify({}), { status: 404 })
      );

      const result = await service.getOrderDetails("order-123", env);

      expect(result).to.have.property("items");
      expect(result.items[0].product).to.be.null;
    });
  });

  describe("getUserOrders", () => {
    it("should return orders for user", async () => {
      const mockOrders = [{ order_id: "order-1", user_id: "user-123" }];

      const mockItems = [];

      env.FULLFILLMENT_DB.prepare
        .onCall(0)
        .returns({
          bind: sinon.stub().returns({
            all: sinon.stub().resolves({ results: mockOrders }),
          }),
        })
        .onCall(1)
        .returns({
          bind: sinon.stub().returns({
            all: sinon.stub().resolves({ results: mockItems }),
          }),
        })
        .onCall(2)
        .returns({
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(null),
          }),
        });

      const result = await service.getUserOrders("user-123", null, 50, 0, env);

      expect(result).to.be.an("array");
      expect(result[0]).to.have.property("item_count");
    });

    it("should return orders for guest session", async () => {
      const mockOrders = [
        { order_id: "order-1", guest_session_id: "guest-123" },
      ];

      const mockItems = [];

      env.FULLFILLMENT_DB.prepare
        .onCall(0)
        .returns({
          bind: sinon.stub().returns({
            all: sinon.stub().resolves({ results: mockOrders }),
          }),
        })
        .onCall(1)
        .returns({
          bind: sinon.stub().returns({
            all: sinon.stub().resolves({ results: mockItems }),
          }),
        })
        .onCall(2)
        .returns({
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(null),
          }),
        });

      const result = await service.getUserOrders(null, "guest-123", 50, 0, env);

      expect(result).to.be.an("array");
    });

    it("should throw error when neither userId nor guestSessionId provided", async () => {
      try {
        await service.getUserOrders(null, null, 50, 0, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("required");
      }
    });
  });

  describe("updateFulfillmentStatusService", () => {
    it("should update fulfillment status successfully", async () => {
      const mockOrder = {
        order_id: "order-123",
        status: "confirmed",
      };

      const mockUpdatedOrder = {
        order_id: "order-123",
        status: "shipped",
        items: [],
        status_history: [],
        shipping_tracking: null,
      };

      // Create mock objects - each prepare call needs unique bind/run/first chains
      let callIndex = 0;
      env.FULLFILLMENT_DB.prepare = sinon.stub().callsFake(() => {
        if (callIndex === 0) {
          // getOrder (initial check)
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockOrder),
            }),
          };
        } else if (callIndex === 1) {
          // updateOrder UPDATE
          callIndex++;
          return {
            bind: sinon.stub().returns({
              run: sinon.stub().resolves({ success: true }),
            }),
          };
        } else if (callIndex === 2) {
          // updateOrder getOrder (after update) - returns updated order
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockOrder), // Still returns mockOrder, updateFulfillmentStatusService then calls getOrderDetails
            }),
          };
        } else if (callIndex === 3) {
          // createFulfillmentStatus INSERT
          callIndex++;
          return {
            bind: sinon.stub().returns({
              run: sinon.stub().resolves({ success: true }),
            }),
          };
        } else if (callIndex === 4) {
          // createFulfillmentStatus getFulfillmentStatus (internal call)
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves({ status_id: "status-123" }),
            }),
          };
        } else if (callIndex === 5) {
          // getOrderDetails getOrder
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockUpdatedOrder),
            }),
          };
        } else if (callIndex === 6) {
          // getOrderDetails getOrderItems
          callIndex++;
          return {
            bind: sinon.stub().returns({
              all: sinon.stub().resolves({ results: [] }),
            }),
          };
        } else if (callIndex === 7) {
          // getOrderDetails getFulfillmentStatuses
          callIndex++;
          return {
            bind: sinon.stub().returns({
              all: sinon.stub().resolves({ results: [] }),
            }),
          };
        } else if (callIndex === 8) {
          // getOrderDetails getShippingTrackingByOrderId
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(null),
            }),
          };
        } else {
          // Fallback
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(null),
            }),
          };
        }
      });

      const result = await service.updateFulfillmentStatusService(
        "order-123",
        "shipped",
        "Order shipped",
        "user-123",
        env,
      );

      expect(result).to.have.property("order_id");
    });

    it("should throw error when order not found", async () => {
      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(null),
        }),
      });

      try {
        await service.updateFulfillmentStatusService(
          "order-123",
          "shipped",
          null,
          "user-123",
          env,
        );
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });
  });

  describe("addShippingTrackingService", () => {
    it("should add shipping tracking successfully", async () => {
      const mockOrder = {
        order_id: "order-123",
        status: "confirmed",
      };

      const trackingData = {
        carrier: "UPS",
        tracking_number: "1Z999AA10123456784",
      };

      const mockTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        ...trackingData,
      };

      // Setup mocks with proper call sequence
      let callIndex = 0;
      env.FULLFILLMENT_DB.prepare = sinon.stub().callsFake(() => {
        if (callIndex === 0) {
          // getOrder
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockOrder),
            }),
          };
        } else if (callIndex === 1) {
          // getShippingTrackingByOrderId (no existing)
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(null),
            }),
          };
        } else if (callIndex === 2) {
          // createShippingTracking INSERT
          callIndex++;
          return {
            bind: sinon.stub().returns({
              run: sinon.stub().resolves({ success: true }),
            }),
          };
        } else if (callIndex === 3) {
          // createShippingTracking getShippingTracking
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockTracking),
            }),
          };
        } else if (callIndex === 4) {
          // updateOrder UPDATE (set status to shipped)
          callIndex++;
          return {
            bind: sinon.stub().returns({
              run: sinon.stub().resolves({ success: true }),
            }),
          };
        } else if (callIndex === 5) {
          // updateOrder getOrder (after update)
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockOrder),
            }),
          };
        } else if (callIndex === 6) {
          // createFulfillmentStatus INSERT
          callIndex++;
          return {
            bind: sinon.stub().returns({
              run: sinon.stub().resolves({ success: true }),
            }),
          };
        } else {
          // createFulfillmentStatus getFulfillmentStatus (internal call)
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves({ status_id: "status-123" }),
            }),
          };
        }
      });

      const result = await service.addShippingTrackingService(
        "order-123",
        trackingData,
        env,
      );

      expect(result).to.have.property("tracking_id");
    });

    it("should throw error when order not found", async () => {
      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(null),
        }),
      });

      const trackingData = {
        carrier: "UPS",
        tracking_number: "1Z999AA10123456784",
      };

      try {
        await service.addShippingTrackingService(
          "order-123",
          trackingData,
          env,
        );
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });

    it("should throw error when tracking already exists", async () => {
      const mockOrder = {
        order_id: "order-123",
        status: "confirmed",
      };

      const existingTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
      };

      env.FULLFILLMENT_DB.prepare
        .onCall(0)
        .returns({
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(mockOrder),
          }),
        })
        .onCall(1)
        .returns({
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(existingTracking),
          }),
        });

      const trackingData = {
        carrier: "UPS",
        tracking_number: "1Z999AA10123456784",
      };

      try {
        await service.addShippingTrackingService(
          "order-123",
          trackingData,
          env,
        );
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("already exists");
      }
    });

    it("should skip order status update when already shipped", async () => {
      const mockOrder = {
        order_id: "order-123",
        status: "shipped",
      };

      const trackingData = {
        carrier: "UPS",
        tracking_number: "1Z999AA10123456784",
      };

      const mockTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        ...trackingData,
      };

      let callIndex = 0;
      env.FULLFILLMENT_DB.prepare = sinon.stub().callsFake(() => {
        if (callIndex === 0) {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockOrder),
            }),
          };
        } else if (callIndex === 1) {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(null),
            }),
          };
        } else if (callIndex === 2) {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              run: sinon.stub().resolves({ success: true }),
            }),
          };
        } else {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockTracking),
            }),
          };
        }
      });

      const result = await service.addShippingTrackingService(
        "order-123",
        trackingData,
        env,
      );
      expect(result).to.have.property("tracking_id");
      expect(env.FULLFILLMENT_DB.prepare.callCount).to.equal(4);
    });

    it("should skip order status update when already delivered", async () => {
      const mockOrder = {
        order_id: "order-123",
        status: "delivered",
      };

      const trackingData = {
        carrier: "UPS",
        tracking_number: "1Z999AA10123456784",
      };

      const mockTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        ...trackingData,
      };

      let callIndex = 0;
      env.FULLFILLMENT_DB.prepare = sinon.stub().callsFake(() => {
        if (callIndex === 0) {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockOrder),
            }),
          };
        } else if (callIndex === 1) {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(null),
            }),
          };
        } else if (callIndex === 2) {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              run: sinon.stub().resolves({ success: true }),
            }),
          };
        } else {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockTracking),
            }),
          };
        }
      });

      const result = await service.addShippingTrackingService(
        "order-123",
        trackingData,
        env,
      );
      expect(result).to.have.property("tracking_id");
      expect(env.FULLFILLMENT_DB.prepare.callCount).to.equal(4);
    });
  });

  describe("updateShippingTrackingService", () => {
    it("should update shipping tracking successfully", async () => {
      const mockTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        status: "pending",
      };

      const mockUpdatedTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        status: "in_transit",
      };

      env.FULLFILLMENT_DB.prepare
        .onCall(0)
        .returns({
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(mockTracking),
          }),
        })
        .onCall(1)
        .returns({
          bind: sinon.stub().returns({
            run: sinon.stub().resolves({ success: true }),
          }),
        })
        .onCall(2)
        .returns({
          bind: sinon.stub().returns({
            first: sinon.stub().resolves(mockUpdatedTracking),
          }),
        });

      const result = await service.updateShippingTrackingService(
        "tracking-123",
        { status: "in_transit" },
        env,
      );

      expect(result).to.have.property("tracking_id");
    });

    it("should update order status when tracking is delivered", async () => {
      const mockTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        status: "pending",
      };

      const mockUpdatedTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        status: "delivered",
      };

      // Setup mocks with proper call sequence for delivered status
      let callIndex = 0;
      env.FULLFILLMENT_DB.prepare = sinon.stub().callsFake(() => {
        if (callIndex === 0) {
          // getShippingTracking
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockTracking),
            }),
          };
        } else if (callIndex === 1) {
          // updateShippingTracking UPDATE
          callIndex++;
          return {
            bind: sinon.stub().returns({
              run: sinon.stub().resolves({ success: true }),
            }),
          };
        } else if (callIndex === 2) {
          // updateShippingTracking getShippingTracking (after update)
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockUpdatedTracking),
            }),
          };
        } else if (callIndex === 3) {
          // updateOrder UPDATE (when delivered)
          callIndex++;
          return {
            bind: sinon.stub().returns({
              run: sinon.stub().resolves({ success: true }),
            }),
          };
        } else if (callIndex === 4) {
          // updateOrder getOrder (after update)
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon
                .stub()
                .resolves({ order_id: "order-123", status: "delivered" }),
            }),
          };
        } else if (callIndex === 5) {
          // createFulfillmentStatus INSERT
          callIndex++;
          return {
            bind: sinon.stub().returns({
              run: sinon.stub().resolves({ success: true }),
            }),
          };
        } else {
          // createFulfillmentStatus getFulfillmentStatus (internal call)
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves({ status_id: "status-123" }),
            }),
          };
        }
      });

      const result = await service.updateShippingTrackingService(
        "tracking-123",
        {
          status: "delivered",
          actual_delivery_date: "2024-12-31",
        },
        env,
      );

      expect(result).to.have.property("tracking_id");
    });

    it("should throw error when tracking not found", async () => {
      env.FULLFILLMENT_DB.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(null),
        }),
      });

      try {
        await service.updateShippingTrackingService(
          "tracking-123",
          { status: "in_transit" },
          env,
        );
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });

    it("should not update order when tracking status is not delivered", async () => {
      const mockTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        status: "pending",
      };

      const mockUpdatedTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        status: "in_transit",
      };

      let callIndex = 0;
      env.FULLFILLMENT_DB.prepare = sinon.stub().callsFake(() => {
        if (callIndex === 0) {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockTracking),
            }),
          };
        } else if (callIndex === 1) {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              run: sinon.stub().resolves({ success: true }),
            }),
          };
        } else {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockUpdatedTracking),
            }),
          };
        }
      });

      const result = await service.updateShippingTrackingService(
        "tracking-123",
        { status: "in_transit" },
        env,
      );

      expect(result).to.have.property("tracking_id");
      expect(result.status).to.equal("in_transit");
      expect(env.FULLFILLMENT_DB.prepare.callCount).to.equal(3);
    });

    it("should not update order when delivered but no actual_delivery_date", async () => {
      const mockTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        status: "pending",
      };

      const mockUpdatedTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        status: "delivered",
      };

      let callIndex = 0;
      env.FULLFILLMENT_DB.prepare = sinon.stub().callsFake(() => {
        if (callIndex === 0) {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockTracking),
            }),
          };
        } else if (callIndex === 1) {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              run: sinon.stub().resolves({ success: true }),
            }),
          };
        } else {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockUpdatedTracking),
            }),
          };
        }
      });

      const result = await service.updateShippingTrackingService(
        "tracking-123",
        { status: "delivered" },
        env,
      );

      expect(result).to.have.property("tracking_id");
      expect(env.FULLFILLMENT_DB.prepare.callCount).to.equal(3);
    });

    it("should not update order when status is delivered but no actual_delivery_date in updates", async () => {
      const mockTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        status: "pending",
      };

      const mockUpdatedTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        status: "delivered",
      };

      let callIndex = 0;
      env.FULLFILLMENT_DB.prepare = sinon.stub().callsFake(() => {
        if (callIndex === 0) {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockTracking),
            }),
          };
        } else if (callIndex === 1) {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              run: sinon.stub().resolves({ success: true }),
            }),
          };
        } else {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockUpdatedTracking),
            }),
          };
        }
      });

      // Update with status delivered but no actual_delivery_date
      const result = await service.updateShippingTrackingService(
        "tracking-123",
        { status: "delivered" }, // No actual_delivery_date
        env,
      );

      expect(result).to.have.property("tracking_id");
      // Should not update order since actual_delivery_date is missing
      expect(env.FULLFILLMENT_DB.prepare.callCount).to.equal(3);
    });

    it("should not update order when status is not delivered", async () => {
      const mockTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        status: "pending",
      };

      const mockUpdatedTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        status: "in_transit",
      };

      let callIndex = 0;
      env.FULLFILLMENT_DB.prepare = sinon.stub().callsFake(() => {
        if (callIndex === 0) {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockTracking),
            }),
          };
        } else if (callIndex === 1) {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              run: sinon.stub().resolves({ success: true }),
            }),
          };
        } else {
          callIndex++;
          return {
            bind: sinon.stub().returns({
              first: sinon.stub().resolves(mockUpdatedTracking),
            }),
          };
        }
      });

      const result = await service.updateShippingTrackingService(
        "tracking-123",
        { status: "in_transit" },
        env,
      );

      expect(result).to.have.property("tracking_id");
      expect(result.status).to.equal("in_transit");
      // Should only have 3 calls (get, update, get) - no order update
      expect(env.FULLFILLMENT_DB.prepare.callCount).to.equal(3);
    });
  });
});
