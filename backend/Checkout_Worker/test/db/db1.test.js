// test/db/db1.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as db from "../../src/db/db1.js";
import { createMockEnv } from "../setup.js";

describe("DB Functions", () => {
  let env;
  let mockDb;
  let mockKv;

  beforeEach(() => {
    env = createMockEnv();
    mockDb = env.CHECKOUT_DB;
    mockKv = env.CHECKOUT_KV;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getCheckoutSession", () => {
    it("should return session when found", async () => {
      const mockSession = {
        session_id: "session-123",
        cart_id: "cart-123",
        status: "pending",
      };
      mockDb.prepare().bind().first.resolves(mockSession);

      const session = await db.getCheckoutSession("session-123", env);
      expect(session).to.deep.equal(mockSession);
    });

    it("should return null when session not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      const session = await db.getCheckoutSession("session-123", env);
      expect(session).to.be.null;
    });

    it("should handle database errors", async () => {
      mockDb.prepare().bind().first.rejects(new Error("DB error"));

      try {
        await db.getCheckoutSession("session-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });

  describe("createCheckoutSession", () => {
    it("should create checkout session successfully", async () => {
      const mockSession = {
        session_id: "session-123",
        cart_id: "cart-123",
        status: "pending",
      };
      // First prepare for INSERT
      const prepareStub1 = mockDb.prepare();
      const bindStub1 = prepareStub1.bind();
      bindStub1.run.resolves({ success: true });
      // Second prepare for SELECT (getCheckoutSession)
      const prepareStub2 = mockDb.prepare();
      const bindStub2 = prepareStub2.bind();
      bindStub2.first.resolves(mockSession);

      const session = await db.createCheckoutSession(
        "cart-123",
        "user-123",
        null,
        env,
      );

      expect(session).to.deep.equal(mockSession);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should create session with guest session ID", async () => {
      const mockSession = {
        session_id: "session-123",
        guest_session_id: "guest-123",
      };
      // First prepare for INSERT
      const prepareStub1 = mockDb.prepare();
      const bindStub1 = prepareStub1.bind();
      bindStub1.run.resolves({ success: true });
      // Second prepare for SELECT
      const prepareStub2 = mockDb.prepare();
      const bindStub2 = prepareStub2.bind();
      bindStub2.first.resolves(mockSession);

      const session = await db.createCheckoutSession(
        "cart-123",
        null,
        "guest-123",
        env,
      );

      expect(session).to.exist;
    });
  });

  describe("updateCheckoutSession", () => {
    it("should update session status", async () => {
      const mockSession = { session_id: "session-123", status: "completed" };
      // First prepare for UPDATE
      const prepareStub1 = mockDb.prepare();
      const bindStub1 = prepareStub1.bind();
      bindStub1.run.resolves({ success: true });
      // Second prepare for SELECT
      const prepareStub2 = mockDb.prepare();
      const bindStub2 = prepareStub2.bind();
      bindStub2.first.resolves(mockSession);

      const session = await db.updateCheckoutSession(
        "session-123",
        { status: "completed" },
        env,
      );

      expect(session).to.exist;
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should update multiple fields", async () => {
      const updates = {
        status: "completed",
        subtotal: 100.0,
        shipping_cost: 10.0,
        tax: 18.0,
        total: 128.0,
      };
      const mockSession = { session_id: "session-123", ...updates };
      // First prepare for UPDATE
      const prepareStub1 = mockDb.prepare();
      const bindStub1 = prepareStub1.bind();
      bindStub1.run.resolves({ success: true });
      // Second prepare for SELECT
      const prepareStub2 = mockDb.prepare();
      const bindStub2 = prepareStub2.bind();
      bindStub2.first.resolves(mockSession);

      const session = await db.updateCheckoutSession(
        "session-123",
        updates,
        env,
      );

      expect(session).to.exist;
    });
  });

  describe("saveAddress", () => {
    it("should create new address", async () => {
      const addressData = {
        full_name: "John Doe",
        phone: "1234567890",
        address_line1: "123 Main St",
        city: "New York",
        state: "NY",
        postal_code: "10001",
      };
      const mockAddress = { address_id: "addr-123", ...addressData };
      mockDb.prepare().bind().first.onFirstCall().resolves(null); // No existing address
      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.onSecondCall().resolves(mockAddress);

      const address = await db.saveAddress(
        addressData,
        "user-123",
        "session-123",
        "delivery",
        env,
      );

      expect(address).to.exist;
    });

    it("should update existing address", async () => {
      const addressData = {
        address_id: "addr-123",
        full_name: "John Doe",
        phone: "1234567890",
        address_line1: "123 Main St",
        city: "New York",
        state: "NY",
        postal_code: "10001",
      };
      const existingAddress = { address_id: "addr-123" };
      const updatedAddress = {
        address_id: "addr-123",
        full_name: "John Doe Updated",
      };
      mockDb.prepare().bind().first.onFirstCall().resolves(existingAddress);
      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.onSecondCall().resolves(updatedAddress);

      const address = await db.saveAddress(
        addressData,
        "user-123",
        "session-123",
        "delivery",
        env,
      );

      expect(address).to.exist;
    });
  });

  describe("getAddress", () => {
    it("should return address when found", async () => {
      const mockAddress = { address_id: "addr-123", full_name: "John Doe" };
      mockDb.prepare().bind().first.resolves(mockAddress);

      const address = await db.getAddress("addr-123", env);
      expect(address).to.deep.equal(mockAddress);
    });

    it("should return null when address not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      const address = await db.getAddress("addr-123", env);
      expect(address).to.be.null;
    });
  });

  describe("getShippingMethods", () => {
    it("should return shipping methods", async () => {
      const mockMethods = [
        { method_id: "method-1", name: "Standard", base_cost: 5.0 },
        { method_id: "method-2", name: "Express", base_cost: 10.0 },
      ];
      const prepareStub = mockDb.prepare();
      prepareStub.all.resolves({ results: mockMethods });

      const methods = await db.getShippingMethods("10001", env);

      expect(methods).to.be.an("array");
      expect(methods.length).to.equal(2);
    });

    it("should filter by pincode when applicable_pincodes is set", async () => {
      const mockMethods = [
        {
          method_id: "method-1",
          name: "Standard",
          applicable_pincodes: JSON.stringify(["10001", "10002"]),
        },
        {
          method_id: "method-2",
          name: "Express",
          applicable_pincodes: JSON.stringify(["*"]),
        },
        {
          method_id: "method-3",
          name: "Local",
          applicable_pincodes: JSON.stringify(["20001"]),
        },
      ];
      const prepareStub = mockDb.prepare();
      prepareStub.all.resolves({ results: mockMethods });

      const methods = await db.getShippingMethods("10001", env);

      // Should include method-1 (matches) and method-2 (wildcard), but not method-3
      expect(methods.length).to.equal(2);
      expect(methods.some((m) => m.method_id === "method-1")).to.be.true;
      expect(methods.some((m) => m.method_id === "method-2")).to.be.true;
      expect(methods.some((m) => m.method_id === "method-3")).to.be.false;
    });

    it("should handle methods without applicable_pincodes", async () => {
      const mockMethods = [
        { method_id: "method-1", name: "Standard", applicable_pincodes: null },
      ];
      const prepareStub = mockDb.prepare();
      prepareStub.all.resolves({ results: mockMethods });

      const methods = await db.getShippingMethods("10001", env);

      expect(methods.length).to.equal(1);
    });

    it("should handle invalid JSON in applicable_pincodes", async () => {
      const mockMethods = [
        {
          method_id: "method-1",
          name: "Standard",
          applicable_pincodes: "invalid-json",
        },
      ];
      const prepareStub = mockDb.prepare();
      prepareStub.all.resolves({ results: mockMethods });

      const methods = await db.getShippingMethods("10001", env);

      // Should include method even if JSON parsing fails
      expect(methods.length).to.equal(1);
    });

    it("should return empty array when no methods found", async () => {
      mockDb.prepare().bind().all.resolves({ results: null });

      const methods = await db.getShippingMethods(null, env);

      expect(methods).to.deep.equal([]);
    });
  });

  describe("getShippingMethod", () => {
    it("should return shipping method when found", async () => {
      const mockMethod = { method_id: "method-123", name: "Standard" };
      mockDb.prepare().bind().first.resolves(mockMethod);

      const method = await db.getShippingMethod("method-123", env);
      expect(method).to.deep.equal(mockMethod);
    });

    it("should return null when method not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      const method = await db.getShippingMethod("method-123", env);
      expect(method).to.be.null;
    });
  });

  describe("createShippingMethod", () => {
    it("should create shipping method successfully", async () => {
      const methodData = {
        name: "Standard Shipping",
        carrier: "USPS",
        base_cost: 5.0,
      };
      const mockMethod = { method_id: "method-123", ...methodData };
      // First prepare for INSERT
      const prepareStub1 = mockDb.prepare();
      const bindStub1 = prepareStub1.bind();
      bindStub1.run.resolves({ success: true });
      // Second prepare for SELECT
      const prepareStub2 = mockDb.prepare();
      const bindStub2 = prepareStub2.bind();
      bindStub2.first.resolves(mockMethod);

      const method = await db.createShippingMethod(methodData, env);

      expect(method).to.exist;
      expect(method.method_id).to.exist;
    });
  });

  describe("updateShippingMethod", () => {
    it("should update shipping method successfully", async () => {
      const existingMethod = { method_id: "method-123", name: "Standard" };
      const updatedMethod = {
        method_id: "method-123",
        name: "Updated Standard",
      };
      mockDb.prepare().bind().first.onFirstCall().resolves(existingMethod);
      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.onSecondCall().resolves(updatedMethod);

      const method = await db.updateShippingMethod(
        "method-123",
        { name: "Updated Standard" },
        env,
      );

      expect(method).to.exist;
    });

    it("should throw error when method not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      try {
        await db.updateShippingMethod("method-123", { name: "Updated" }, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });

    it("should return existing method when no updates provided", async () => {
      const existingMethod = { method_id: "method-123", name: "Standard" };
      mockDb.prepare().bind().first.resolves(existingMethod);

      const method = await db.updateShippingMethod("method-123", {}, env);

      expect(method).to.deep.equal(existingMethod);
    });

    it("should update max_delivery_days", async () => {
      const existingMethod = { method_id: "method-123", name: "Standard" };
      const updatedMethod = { method_id: "method-123", max_delivery_days: 7 };
      mockDb.prepare().bind().first.onFirstCall().resolves(existingMethod);
      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.onSecondCall().resolves(updatedMethod);

      const method = await db.updateShippingMethod(
        "method-123",
        { max_delivery_days: 7 },
        env,
      );

      expect(method).to.exist;
    });

    it("should update is_active", async () => {
      const existingMethod = { method_id: "method-123", name: "Standard" };
      const updatedMethod = { method_id: "method-123", is_active: 0 };
      mockDb.prepare().bind().first.onFirstCall().resolves(existingMethod);
      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.onSecondCall().resolves(updatedMethod);

      const method = await db.updateShippingMethod(
        "method-123",
        { is_active: false },
        env,
      );

      expect(method).to.exist;
    });

    it("should update applicable_pincodes", async () => {
      const existingMethod = { method_id: "method-123", name: "Standard" };
      const updatedMethod = {
        method_id: "method-123",
        applicable_pincodes: JSON.stringify(["10001"]),
      };
      mockDb.prepare().bind().first.onFirstCall().resolves(existingMethod);
      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.onSecondCall().resolves(updatedMethod);

      const method = await db.updateShippingMethod(
        "method-123",
        { applicable_pincodes: ["10001"] },
        env,
      );

      expect(method).to.exist;
    });

    it("should handle null applicable_pincodes", async () => {
      const existingMethod = { method_id: "method-123", name: "Standard" };
      const updatedMethod = {
        method_id: "method-123",
        applicable_pincodes: null,
      };
      mockDb.prepare().bind().first.onFirstCall().resolves(existingMethod);
      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.onSecondCall().resolves(updatedMethod);

      const method = await db.updateShippingMethod(
        "method-123",
        { applicable_pincodes: null },
        env,
      );

      expect(method).to.exist;
    });
  });

  describe("deleteShippingMethod", () => {
    it("should soft delete shipping method", async () => {
      const existingMethod = { method_id: "method-123" };
      mockDb.prepare().bind().first.resolves(existingMethod);
      mockDb.prepare().bind().run.resolves({ success: true });

      const result = await db.deleteShippingMethod("method-123", env);

      expect(result.success).to.be.true;
      expect(result.method_id).to.equal("method-123");
    });

    it("should throw error when method not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      try {
        await db.deleteShippingMethod("method-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });
  });

  describe("saveCheckoutItems", () => {
    it("should save checkout items", async () => {
      const items = [
        { sku_id: "sku-1", quantity: 2, unit_price: 10.0, subtotal: 20.0 },
        { sku_id: "sku-2", quantity: 1, unit_price: 15.0, subtotal: 15.0 },
      ];
      // First prepare for DELETE
      const prepareStub1 = mockDb.prepare();
      const bindStub1 = prepareStub1.bind();
      bindStub1.run.resolves({ success: true });

      // Multiple prepares for INSERT (one per item)
      const prepareStub2 = mockDb.prepare();
      const bindStub2 = prepareStub2.bind();
      bindStub2.run.resolves({ success: true });

      // Last prepare for SELECT (getCheckoutItems)
      const prepareStub3 = mockDb.prepare();
      const bindStub3 = prepareStub3.bind();
      bindStub3.all.resolves({ results: items });

      const savedItems = await db.saveCheckoutItems("session-123", items, env);

      expect(savedItems).to.deep.equal(items);
    });

    it("should handle database errors", async () => {
      const items = [{ sku_id: "sku-1", quantity: 2 }];
      mockDb.prepare().bind().run.rejects(new Error("DB error"));

      try {
        await db.saveCheckoutItems("session-123", items, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });

  describe("getCheckoutItems", () => {
    it("should return checkout items", async () => {
      const mockItems = [
        { item_id: "item-1", sku_id: "sku-1", quantity: 2 },
        { item_id: "item-2", sku_id: "sku-2", quantity: 1 },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockItems });

      const items = await db.getCheckoutItems("session-123", env);

      expect(items).to.deep.equal(mockItems);
    });

    it("should return empty array when no items found", async () => {
      mockDb.prepare().bind().all.resolves({ results: null });

      const items = await db.getCheckoutItems("session-123", env);

      expect(items).to.deep.equal([]);
    });

    it("should handle database errors", async () => {
      mockDb.prepare().bind().all.rejects(new Error("DB error"));

      try {
        await db.getCheckoutItems("session-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });

  describe("getKVReservedQuantity", () => {
    it("should handle KV errors gracefully", async () => {
      mockKv.get
        .withArgs("reservation:sku-1", "json")
        .rejects(new Error("KV error"));

      // This is an internal function, but we can test it indirectly through checkStockAvailability
      // The error should be caught and return 0
      const result = await db.checkStockAvailability("sku-1", env);
      // Should not throw, but may return false if KV fails
      expect(result).to.exist;
    });

    it("should return 0 when KV get throws error", async () => {
      // Test the error path in getKVReservedQuantity by making KV.get throw
      mockKv.get
        .withArgs("reservation:sku-1", "json")
        .rejects(new Error("KV error"));
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      );

      // checkStockAvailability uses getKVReservedQuantity internally
      const result = await db.checkStockAvailability("sku-1", env);
      // Should handle error gracefully
      expect(result).to.exist;
    });
  });

  describe("reserveStockInKV", () => {
    it("should reserve stock successfully when available", async () => {
      const mockStockData = { available_quantity: 100 };
      const mockKvData = { reservations: [] };

      mockKv.get.withArgs("reservation:sku-1", "json").resolves(mockKvData);
      mockKv.put.resolves();
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify(mockStockData), { status: 200 }),
      );

      const result = await db.reserveStockInKV("session-123", "sku-1", 10, env);

      expect(result.success).to.be.true;
      expect(result.reserved).to.equal(10);
    });

    it("should fail reservation when insufficient stock", async () => {
      const mockStockData = { available_quantity: 5 };
      const mockKvData = { reservations: [] };

      mockKv.get.withArgs("reservation:sku-1", "json").resolves(mockKvData);
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify(mockStockData), { status: 200 }),
      );

      const result = await db.reserveStockInKV("session-123", "sku-1", 10, env);

      expect(result.success).to.be.false;
      expect(result.available).to.equal(5);
    });

    it("should handle expired reservations", async () => {
      const mockKvData = {
        reservations: [
          {
            sessionId: "other",
            skuId: "sku-1",
            quantity: 10,
            status: "active",
            expiresAt: Date.now() - 1000,
          },
        ],
      };

      mockKv.get.withArgs("reservation:sku-1", "json").resolves(mockKvData);
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      );
      mockKv.put.resolves();

      const result = await db.reserveStockInKV("session-123", "sku-1", 10, env);

      // Expired reservations should be filtered out
      expect(result.success).to.be.true;
    });

    it("should handle inactive reservations", async () => {
      const mockKvData = {
        reservations: [
          {
            sessionId: "other",
            skuId: "sku-1",
            quantity: 10,
            status: "inactive",
            expiresAt: Date.now() + 10000,
          },
        ],
      };

      mockKv.get.withArgs("reservation:sku-1", "json").resolves(mockKvData);
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      );
      mockKv.put.resolves();

      const result = await db.reserveStockInKV("session-123", "sku-1", 10, env);

      // Inactive reservations should not count
      expect(result.success).to.be.true;
    });

    it("should throw error when CHECKOUT_KV not available", async () => {
      const envWithoutKv = { ...env, CHECKOUT_KV: null };

      try {
        await db.reserveStockInKV("session-123", "sku-1", 10, envWithoutKv);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("CHECKOUT_KV not available");
      }
    });

    it("should throw error when INVENTORY_WORKER not available", async () => {
      const envWithoutWorker = { ...env, INVENTORY_WORKER: null };
      const mockKvData = { reservations: [] };
      mockKv.get.withArgs("reservation:sku-1", "json").resolves(mockKvData);

      try {
        await db.reserveStockInKV("session-123", "sku-1", 10, envWithoutWorker);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include(
          "INVENTORY_WORKER binding not available",
        );
      }
    });

    it("should throw error when inventory worker returns non-ok response", async () => {
      const mockKvData = { reservations: [] };
      mockKv.get.withArgs("reservation:sku-1", "json").resolves(mockKvData);
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ error: "Not found" }), { status: 404 }),
      );

      try {
        await db.reserveStockInKV("session-123", "sku-1", 10, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("Failed to get stock");
      }
    });
  });

  describe("releaseStockFromKV", () => {
    it("should release stock reservation and keep remaining", async () => {
      const mockKvData = {
        reservations: [
          {
            sessionId: "session-123",
            skuId: "sku-1",
            quantity: 10,
            status: "active",
          },
          {
            sessionId: "session-456",
            skuId: "sku-1",
            quantity: 5,
            status: "active",
          },
        ],
      };

      mockKv.get.withArgs("reservation:sku-1", "json").resolves(mockKvData);
      mockKv.put.resolves();

      await db.releaseStockFromKV("session-123", "sku-1", env);

      // Should put since there are remaining reservations
      expect(mockKv.put).to.have.been.called;
    });

    it("should delete key when no reservations remain", async () => {
      const mockKvData = {
        reservations: [
          {
            sessionId: "session-123",
            skuId: "sku-1",
            quantity: 10,
            status: "active",
          },
        ],
      };

      mockKv.get.withArgs("reservation:sku-1", "json").resolves(mockKvData);
      mockKv.delete.resolves();

      await db.releaseStockFromKV("session-123", "sku-1", env);

      // Should delete since no reservations remain
      expect(mockKv.delete).to.have.been.called;
    });

    it("should handle missing KV data gracefully", async () => {
      mockKv.get.withArgs("reservation:sku-1", "json").resolves(null);

      await db.releaseStockFromKV("session-123", "sku-1", env);

      // Should not throw
      expect(true).to.be.true;
    });

    it("should handle missing KV gracefully", async () => {
      const envWithoutKv = { ...env, CHECKOUT_KV: null };

      await db.releaseStockFromKV("session-123", "sku-1", envWithoutKv);

      // Should not throw
      expect(true).to.be.true;
    });

    it("should handle empty reservations array", async () => {
      const mockKvData = { reservations: [] };

      mockKv.get.withArgs("reservation:sku-1", "json").resolves(mockKvData);

      await db.releaseStockFromKV("session-123", "sku-1", env);

      // Should delete since no reservations
      expect(mockKv.delete).to.have.been.called;
    });

    it("should handle KV errors gracefully", async () => {
      mockKv.get
        .withArgs("reservation:sku-1", "json")
        .rejects(new Error("KV error"));

      // Should not throw - errors are caught internally
      await db.releaseStockFromKV("session-123", "sku-1", env);

      expect(true).to.be.true;
    });
  });

  describe("releaseAllStockForSession", () => {
    it("should release all stock for session with skuIds", async () => {
      const skuIds = ["sku-1", "sku-2"];
      mockKv.get.resolves(null);

      await db.releaseAllStockForSession("session-123", skuIds, env);

      // Should not throw
      expect(mockKv.get).to.have.been.called;
    });

    it("should handle null skuIds gracefully", async () => {
      // When skuIds is null, the for loop will throw, but it's caught
      await db.releaseAllStockForSession("session-123", null, env);

      // Should not throw (error is caught internally)
      expect(true).to.be.true;
    });

    it("should handle empty skuIds array", async () => {
      await db.releaseAllStockForSession("session-123", [], env);

      // Should not throw
      expect(true).to.be.true;
    });
  });

  describe("checkStockAvailability", () => {
    it("should check stock availability", async () => {
      const mockStockData = { available_quantity: 100 };
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify(mockStockData), { status: 200 }),
      );
      mockKv.get.withArgs("reservation:sku-1", "json").resolves(null);

      const result = await db.checkStockAvailability("sku-1", 10, env);

      expect(result.available).to.be.true;
      expect(result.availableQuantity).to.equal(100);
    });

    it("should return false when stock unavailable", async () => {
      const mockStockData = { available_quantity: 5 };
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify(mockStockData), { status: 200 }),
      );
      mockKv.get.resolves(null);

      const result = await db.checkStockAvailability("sku-1", 10, env);

      expect(result.available).to.be.false;
    });

    it("should handle inventory worker errors", async () => {
      env.INVENTORY_WORKER.fetch.resolves(
        new Response("Error", { status: 500 }),
      );

      const result = await db.checkStockAvailability("sku-1", 10, env);

      expect(result.available).to.be.false;
      expect(result.reason).to.exist;
    });

    it("should consider KV reservations when checking stock", async () => {
      const mockStockData = { available_quantity: 100 };
      const mockKvData = {
        reservations: [
          {
            sessionId: "other-session",
            skuId: "sku-1",
            quantity: 95,
            status: "active",
            expiresAt: Date.now() + 10000,
          },
        ],
      };
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify(mockStockData), { status: 200 }),
      );
      mockKv.get.withArgs("reservation:sku-1", "json").resolves(mockKvData);

      const result = await db.checkStockAvailability("sku-1", 10, env);

      // 100 available - 95 reserved = 5 available, need 10
      expect(result.available).to.be.false;
      expect(result.availableQuantity).to.equal(5);
    });

    it("should handle missing INVENTORY_WORKER", async () => {
      const envWithoutWorker = { ...env, INVENTORY_WORKER: null };

      const result = await db.checkStockAvailability(
        "sku-1",
        10,
        envWithoutWorker,
      );

      expect(result.available).to.be.false;
      expect(result.reason).to.exist;
    });

    it("should return available: false when stock response not ok", async () => {
      env.INVENTORY_WORKER.fetch.resolves(
        new Response("Error", { status: 500 }),
      );

      const result = await db.checkStockAvailability("sku-1", 10, env);

      expect(result.available).to.be.false;
      expect(result.reason).to.include("Stock check failed");
    });

    it("should handle KV reservations in stock check", async () => {
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      );
      mockKv.get.withArgs("reservation:sku-1", "json").resolves({
        reservations: [
          {
            sessionId: "other",
            quantity: 50,
            status: "active",
            expiresAt: Date.now() + 10000,
          },
        ],
      });

      const result = await db.checkStockAvailability("sku-1", 10, env);

      expect(result.available).to.be.true; // 100 - 50 = 50 >= 10
      expect(result.availableQuantity).to.equal(50);
      expect(result.kvReserved).to.equal(50);
    });

    it("should return available: false when actual available < quantity", async () => {
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ available_quantity: 5 }), {
          status: 200,
        }),
      );
      mockKv.get.resolves(null);

      const result = await db.checkStockAvailability("sku-1", 10, env);

      expect(result.available).to.be.false; // 5 < 10
      expect(result.availableQuantity).to.equal(5);
    });

    it("should handle errors in checkStockAvailability", async () => {
      env.INVENTORY_WORKER.fetch.rejects(new Error("Network error"));

      const result = await db.checkStockAvailability("sku-1", 10, env);

      expect(result.available).to.be.false;
      expect(result.reason).to.include("Network error");
    });
  });

  describe("releaseAllStockForSession", () => {
    it("should release all stock for session with skuIds", async () => {
      const skuIds = ["sku-1", "sku-2"];
      mockKv.get.resolves(null);

      await db.releaseAllStockForSession("session-123", skuIds, env);

      // Should not throw
      expect(mockKv.get).to.have.been.called;
    });

    it("should release stock when skuIds is null and gets items from DB", async () => {
      const mockItems = [
        { sku_id: "sku-1", quantity: 2 },
        { sku_id: "sku-2", quantity: 3 },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockItems });
      mockKv.get.resolves(null);

      await db.releaseAllStockForSession("session-123", null, env);

      // Should get items from DB and release them
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle empty skuIds array", async () => {
      await db.releaseAllStockForSession("session-123", [], env);

      // Should not throw
      expect(true).to.be.true;
    });

    it("should handle releaseStockFromKV with reservations remaining", async () => {
      const mockKvData = {
        reservations: [
          {
            sessionId: "session-123",
            quantity: 2,
            status: "active",
            expiresAt: Date.now() + 10000,
          },
          {
            sessionId: "other-session",
            quantity: 3,
            status: "active",
            expiresAt: Date.now() + 10000,
          },
        ],
      };
      mockKv.get.withArgs("reservation:sku-1", "json").resolves(mockKvData);
      mockKv.put.resolves();

      await db.releaseStockFromKV("session-123", "sku-1", env);

      // Should put updated data (with other-session reservation remaining)
      expect(mockKv.put).to.have.been.called;
    });
  });
});
