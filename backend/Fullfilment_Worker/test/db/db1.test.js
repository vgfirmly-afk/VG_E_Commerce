// test/db/db1.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import * as db from "../../src/db/db1.js";
import { createMockEnv } from "../setup.js";

describe("DB Functions", () => {
  let env;
  let mockDb;

  beforeEach(() => {
    env = createMockEnv();
    mockDb = env.FULLFILLMENT_DB;
    sinon.stub(console, "log");
    sinon.stub(console, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createOrder", () => {
    it("should create order successfully", async () => {
      const orderData = {
        checkout_session_id: "session-123",
        payment_id: "payment-123",
        user_id: "user-123",
        subtotal: 100.0,
        shipping_cost: 10.0,
        tax: 10.0,
        total: 120.0,
        currency: "USD",
      };

      const mockOrder = {
        order_id: "order-123",
        order_number: "ORD-20241201-001",
        ...orderData,
        status: "confirmed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Create separate mock prepare objects for each call
      const mockBind1 = { run: sinon.stub().resolves({ success: true }) };
      const mockPrepare1 = { bind: sinon.stub().returns(mockBind1) };

      // createFulfillmentStatus needs: INSERT status, then SELECT status
      const mockBind2 = { run: sinon.stub().resolves({ success: true }) };
      const mockPrepare2 = { bind: sinon.stub().returns(mockBind2) };

      const mockStatus = {
        status_id: "status-123",
        order_id: "order-123",
        status: "confirmed",
      };
      const mockBind3 = { first: sinon.stub().resolves(mockStatus) };
      const mockPrepare3 = { bind: sinon.stub().returns(mockBind3) };

      // getOrder after createOrder
      const mockBind4 = { first: sinon.stub().resolves(mockOrder) };
      const mockPrepare4 = { bind: sinon.stub().returns(mockBind4) };

      mockDb.prepare
        .onCall(0)
        .returns(mockPrepare1) // INSERT INTO orders
        .onCall(1)
        .returns(mockPrepare2) // INSERT INTO fulfillment_status
        .onCall(2)
        .returns(mockPrepare3) // SELECT fulfillment_status (inside createFulfillmentStatus)
        .onCall(3)
        .returns(mockPrepare4); // SELECT from orders (getOrder at end of createOrder)

      const result = await db.createOrder(orderData, env);

      expect(result).to.exist;
      expect(result.order_id).to.equal(mockOrder.order_id);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle database errors", async () => {
      const orderData = {
        checkout_session_id: "session-123",
        subtotal: 100.0,
        shipping_cost: 10.0,
        tax: 10.0,
        total: 120.0,
      };

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          run: sinon.stub().rejects(new Error("DB error")),
        }),
      });

      try {
        await db.createOrder(orderData, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });

  describe("getOrder", () => {
    it("should return order when found", async () => {
      const mockOrder = {
        order_id: "order-123",
        order_number: "ORD-20241201-001",
        status: "confirmed",
      };

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockOrder),
        }),
      });

      const result = await db.getOrder("order-123", env);
      expect(result).to.deep.equal(mockOrder);
    });

    it("should return null when order not found", async () => {
      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(null),
        }),
      });

      const result = await db.getOrder("order-123", env);
      expect(result).to.be.null;
    });

    it("should handle database errors", async () => {
      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().rejects(new Error("DB error")),
        }),
      });

      try {
        await db.getOrder("order-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });

  describe("getOrderByOrderNumber", () => {
    it("should return order when found", async () => {
      const mockOrder = {
        order_id: "order-123",
        order_number: "ORD-20241201-001",
        status: "confirmed",
      };

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockOrder),
        }),
      });

      const result = await db.getOrderByOrderNumber("ORD-20241201-001", env);
      expect(result).to.deep.equal(mockOrder);
    });

    it("should return null when order not found", async () => {
      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(null),
        }),
      });

      const result = await db.getOrderByOrderNumber("ORD-20241201-001", env);
      expect(result).to.be.null;
    });
  });

  describe("getOrdersByUserId", () => {
    it("should return orders for user", async () => {
      const mockOrders = [
        { order_id: "order-1", user_id: "user-123" },
        { order_id: "order-2", user_id: "user-123" },
      ];

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          all: sinon.stub().resolves({ results: mockOrders }),
        }),
      });

      const result = await db.getOrdersByUserId("user-123", 50, 0, env);
      expect(result).to.deep.equal(mockOrders);
    });

    it("should return empty array when no orders found", async () => {
      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          all: sinon.stub().resolves({ results: [] }),
        }),
      });

      const result = await db.getOrdersByUserId("user-123", 50, 0, env);
      expect(result).to.deep.equal([]);
    });
  });

  describe("getOrdersByGuestSessionId", () => {
    it("should return orders for guest session", async () => {
      const mockOrders = [
        { order_id: "order-1", guest_session_id: "guest-123" },
      ];

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          all: sinon.stub().resolves({ results: mockOrders }),
        }),
      });

      const result = await db.getOrdersByGuestSessionId(
        "guest-123",
        50,
        0,
        env,
      );
      expect(result).to.deep.equal(mockOrders);
    });
  });

  describe("updateOrder", () => {
    it("should update order status", async () => {
      const mockUpdatedOrder = {
        order_id: "order-123",
        status: "shipped",
        updated_at: new Date().toISOString(),
      };

      const mockPrepare1 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare2 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockUpdatedOrder),
        }),
      };

      mockDb.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2);

      const result = await db.updateOrder(
        "order-123",
        { status: "shipped" },
        env,
      );
      expect(result).to.deep.equal(mockUpdatedOrder);
    });

    it("should return order unchanged when no updates provided", async () => {
      const mockOrder = { order_id: "order-123", status: "confirmed" };

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockOrder),
        }),
      });

      const result = await db.updateOrder("order-123", {}, env);
      expect(result).to.deep.equal(mockOrder);
    });

    it("should update multiple fields", async () => {
      const mockUpdatedOrder = {
        order_id: "order-123",
        status: "delivered",
        actual_delivery_date: "2024-12-31",
        notes: "Delivered",
      };

      const mockPrepare1 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare2 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockUpdatedOrder),
        }),
      };

      mockDb.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2);

      const result = await db.updateOrder(
        "order-123",
        {
          status: "delivered",
          actual_delivery_date: "2024-12-31",
          notes: "Delivered",
        },
        env,
      );

      expect(result).to.deep.equal(mockUpdatedOrder);
    });

    it("should update only status field", async () => {
      const mockUpdatedOrder = {
        order_id: "order-123",
        status: "shipped",
      };

      const mockPrepare1 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare2 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockUpdatedOrder),
        }),
      };

      mockDb.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2);

      const result = await db.updateOrder(
        "order-123",
        { status: "shipped" },
        env,
      );

      expect(result).to.deep.equal(mockUpdatedOrder);
    });

    it("should update only estimated_delivery_date", async () => {
      const mockUpdatedOrder = {
        order_id: "order-123",
        estimated_delivery_date: "2024-12-31",
      };

      const mockPrepare1 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare2 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockUpdatedOrder),
        }),
      };

      mockDb.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2);

      const result = await db.updateOrder(
        "order-123",
        { estimated_delivery_date: "2024-12-31" },
        env,
      );

      expect(result).to.deep.equal(mockUpdatedOrder);
    });

    it("should update only actual_delivery_date", async () => {
      const mockUpdatedOrder = {
        order_id: "order-123",
        actual_delivery_date: "2024-12-30",
      };

      const mockPrepare1 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare2 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockUpdatedOrder),
        }),
      };

      mockDb.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2);

      const result = await db.updateOrder(
        "order-123",
        { actual_delivery_date: "2024-12-30" },
        env,
      );

      expect(result).to.deep.equal(mockUpdatedOrder);
    });

    it("should update only notes", async () => {
      const mockUpdatedOrder = {
        order_id: "order-123",
        notes: "Order updated",
      };

      const mockPrepare1 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare2 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockUpdatedOrder),
        }),
      };

      mockDb.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2);

      const result = await db.updateOrder(
        "order-123",
        { notes: "Order updated" },
        env,
      );

      expect(result).to.deep.equal(mockUpdatedOrder);
    });
  });

  describe("createOrderItem", () => {
    it("should create order item successfully", async () => {
      const itemData = {
        sku_id: "sku-123",
        product_id: "prod-123",
        quantity: 2,
        unit_price: 10.5,
        subtotal: 21.0,
      };

      const mockItem = {
        item_id: "item-123",
        order_id: "order-123",
        ...itemData,
      };

      const mockPrepare1 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare2 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockItem),
        }),
      };

      mockDb.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2);

      const result = await db.createOrderItem("order-123", itemData, env);
      expect(result).to.deep.equal(mockItem);
    });
  });

  describe("getOrderItem", () => {
    it("should return order item when found", async () => {
      const mockItem = {
        item_id: "item-123",
        order_id: "order-123",
        sku_id: "sku-123",
      };

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockItem),
        }),
      });

      const result = await db.getOrderItem("item-123", env);
      expect(result).to.deep.equal(mockItem);
    });
  });

  describe("getOrderItems", () => {
    it("should return order items for order", async () => {
      const mockItems = [
        { item_id: "item-1", order_id: "order-123" },
        { item_id: "item-2", order_id: "order-123" },
      ];

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          all: sinon.stub().resolves({ results: mockItems }),
        }),
      });

      const result = await db.getOrderItems("order-123", env);
      expect(result).to.deep.equal(mockItems);
    });
  });

  describe("createFulfillmentStatus", () => {
    it("should create fulfillment status successfully", async () => {
      const mockStatus = {
        status_id: "status-123",
        order_id: "order-123",
        status: "shipped",
        notes: "Order shipped",
        updated_by: "system",
      };

      const mockPrepare1 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare2 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockStatus),
        }),
      };

      mockDb.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2);

      const result = await db.createFulfillmentStatus(
        "order-123",
        "shipped",
        "Order shipped",
        "system",
        env,
      );
      expect(result).to.deep.equal(mockStatus);
    });
  });

  describe("getFulfillmentStatus", () => {
    it("should return fulfillment status when found", async () => {
      const mockStatus = {
        status_id: "status-123",
        order_id: "order-123",
        status: "shipped",
      };

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockStatus),
        }),
      });

      const result = await db.getFulfillmentStatus("status-123", env);
      expect(result).to.deep.equal(mockStatus);
    });
  });

  describe("getFulfillmentStatuses", () => {
    it("should return fulfillment statuses for order", async () => {
      const mockStatuses = [
        { status_id: "status-1", order_id: "order-123", status: "confirmed" },
        { status_id: "status-2", order_id: "order-123", status: "shipped" },
      ];

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          all: sinon.stub().resolves({ results: mockStatuses }),
        }),
      });

      const result = await db.getFulfillmentStatuses("order-123", env);
      expect(result).to.deep.equal(mockStatuses);
    });
  });

  describe("createShippingTracking", () => {
    it("should create shipping tracking successfully", async () => {
      const trackingData = {
        carrier: "UPS",
        tracking_number: "1Z999AA10123456784",
        status: "pending",
      };

      const mockTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        ...trackingData,
      };

      const mockPrepare1 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare2 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockTracking),
        }),
      };

      mockDb.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2);

      const result = await db.createShippingTracking(
        "order-123",
        trackingData,
        env,
      );
      expect(result).to.deep.equal(mockTracking);
    });
  });

  describe("getShippingTracking", () => {
    it("should return shipping tracking when found", async () => {
      const mockTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        carrier: "UPS",
        tracking_number: "1Z999AA10123456784",
      };

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockTracking),
        }),
      });

      const result = await db.getShippingTracking("tracking-123", env);
      expect(result).to.deep.equal(mockTracking);
    });
  });

  describe("getShippingTrackingByOrderId", () => {
    it("should return shipping tracking for order", async () => {
      const mockTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        carrier: "UPS",
      };

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockTracking),
        }),
      });

      const result = await db.getShippingTrackingByOrderId("order-123", env);
      expect(result).to.deep.equal(mockTracking);
    });
  });

  describe("updateShippingTracking", () => {
    it("should update shipping tracking successfully", async () => {
      const mockUpdatedTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        status: "in_transit",
      };

      const mockPrepare1 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare2 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockUpdatedTracking),
        }),
      };

      mockDb.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2);

      const result = await db.updateShippingTracking(
        "tracking-123",
        { status: "in_transit" },
        env,
      );
      expect(result).to.deep.equal(mockUpdatedTracking);
    });

    it("should return tracking unchanged when no updates provided", async () => {
      const mockTracking = {
        tracking_id: "tracking-123",
        status: "pending",
      };

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockTracking),
        }),
      });

      const result = await db.updateShippingTracking("tracking-123", {}, env);
      expect(result).to.deep.equal(mockTracking);
    });

    it("should update all tracking fields", async () => {
      const mockUpdatedTracking = {
        tracking_id: "tracking-123",
        order_id: "order-123",
        status: "delivered",
        estimated_delivery_date: "2024-12-31",
        actual_delivery_date: "2024-12-30",
        notes: "Delivered",
      };

      const mockPrepare1 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare2 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockUpdatedTracking),
        }),
      };

      mockDb.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2);

      const result = await db.updateShippingTracking(
        "tracking-123",
        {
          status: "delivered",
          estimated_delivery_date: "2024-12-31",
          actual_delivery_date: "2024-12-30",
          notes: "Delivered",
        },
        env,
      );

      expect(result).to.deep.equal(mockUpdatedTracking);
    });

    it("should update only status field", async () => {
      const mockUpdatedTracking = {
        tracking_id: "tracking-123",
        status: "in_transit",
      };

      const mockPrepare1 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare2 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockUpdatedTracking),
        }),
      };

      mockDb.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2);

      const result = await db.updateShippingTracking(
        "tracking-123",
        { status: "in_transit" },
        env,
      );

      expect(result).to.deep.equal(mockUpdatedTracking);
    });

    it("should update only estimated_delivery_date", async () => {
      const mockUpdatedTracking = {
        tracking_id: "tracking-123",
        estimated_delivery_date: "2024-12-31",
      };

      const mockPrepare1 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare2 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockUpdatedTracking),
        }),
      };

      mockDb.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2);

      const result = await db.updateShippingTracking(
        "tracking-123",
        { estimated_delivery_date: "2024-12-31" },
        env,
      );

      expect(result).to.deep.equal(mockUpdatedTracking);
    });

    it("should update only actual_delivery_date", async () => {
      const mockUpdatedTracking = {
        tracking_id: "tracking-123",
        actual_delivery_date: "2024-12-30",
      };

      const mockPrepare1 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare2 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockUpdatedTracking),
        }),
      };

      mockDb.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2);

      const result = await db.updateShippingTracking(
        "tracking-123",
        { actual_delivery_date: "2024-12-30" },
        env,
      );

      expect(result).to.deep.equal(mockUpdatedTracking);
    });

    it("should update only notes", async () => {
      const mockUpdatedTracking = {
        tracking_id: "tracking-123",
        notes: "Updated notes",
      };

      const mockPrepare1 = {
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      };

      const mockPrepare2 = {
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockUpdatedTracking),
        }),
      };

      mockDb.prepare
        .onCall(0)
        .returns(mockPrepare1)
        .onCall(1)
        .returns(mockPrepare2);

      const result = await db.updateShippingTracking(
        "tracking-123",
        { notes: "Updated notes" },
        env,
      );

      expect(result).to.deep.equal(mockUpdatedTracking);
    });
  });
});
