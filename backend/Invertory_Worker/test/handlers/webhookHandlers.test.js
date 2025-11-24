// test/handlers/webhookHandlers.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as handlers from "../../src/handlers/webhookHandlers.js";
import * as service from "../../src/services/inventoryService.js";
import { createMockRequest, createMockEnv } from "../setup.js";

describe("Webhook Handlers", () => {
  let env;

  beforeEach(() => {
    env = createMockEnv();
    sinon.restore();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("handlePaymentStatusWebhook", () => {
    it("should deduct stock when payment is captured", async () => {
      const existingStock = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        reserved_quantity: 10,
        available_quantity: 90,
        status: "active",
      };
      const adjustedStock = {
        ...existingStock,
        quantity: 90,
        available_quantity: 80,
      };

      const mockDb = env.INVENTORY_DB;
      // First call: getSkuStock in deductStockForOrder
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      // Second call: getSkuStock in adjustStockQuantity (to get existing stock)
      mockDb.prepare().bind().first.onSecondCall().resolves(existingStock);
      // Third call: getSkuStock in adjustStockQuantity (to verify update)
      mockDb.prepare().bind().first.onThirdCall().resolves(adjustedStock);
      mockDb.batch.resolves([]);

      const body = {
        payment_status: "captured",
        payment_id: "pay-123",
        checkout_session_id: "checkout-123",
        order_items: [
          {
            sku_id: "sku-1",
            product_id: "prod-1",
            quantity: 10,
          },
        ],
      };

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/webhooks/payment-status",
        body,
      );
      const response = await handlers.handlePaymentStatusWebhook(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data.success).to.be.true;
      expect(data.payment_status).to.equal("captured");
      expect(data.results).to.have.length(1);
      expect(data.results[0].success).to.be.true;
      expect(data.results[0].quantity_deducted).to.equal(10);
    });

    it("should not deduct stock when payment is not captured", async () => {
      const body = {
        payment_status: "pending",
        payment_id: "pay-123",
        order_items: [
          {
            sku_id: "sku-1",
            quantity: 10,
          },
        ],
      };

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/webhooks/payment-status",
        body,
      );
      const response = await handlers.handlePaymentStatusWebhook(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data.success).to.be.true;
      expect(data.message).to.include("no stock deduction");
    });

    it("should handle multiple order items", async () => {
      const existingStock1 = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        reserved_quantity: 10,
        available_quantity: 90,
        status: "active",
      };
      const adjustedStock1 = {
        ...existingStock1,
        quantity: 90,
        available_quantity: 80,
      };

      const existingStock2 = {
        sku_id: "sku-2",
        product_id: "prod-2",
        sku_code: "SKU002",
        quantity: 100,
        reserved_quantity: 20,
        available_quantity: 80,
        status: "active",
      };
      const adjustedStock2 = {
        ...existingStock2,
        quantity: 80,
        available_quantity: 70,
      };

      const mockDb = env.INVENTORY_DB;
      // Setup mocks for multiple calls - use the shared first stub
      const firstStub = mockDb.prepare().bind().first;
      // First item: deductStockForOrder calls getSkuStock, then adjustStockQuantity calls it twice
      firstStub.onFirstCall().resolves(existingStock1); // getSkuStock in deductStockForOrder
      firstStub.onSecondCall().resolves(existingStock1); // getSkuStock in adjustStockQuantity
      firstStub.onThirdCall().resolves(adjustedStock1); // verify in adjustStockQuantity
      // Second item
      firstStub.onCall(3).resolves(existingStock2); // getSkuStock in deductStockForOrder
      firstStub.onCall(4).resolves(existingStock2); // getSkuStock in adjustStockQuantity
      firstStub.onCall(5).resolves(adjustedStock2); // verify in adjustStockQuantity
      mockDb.batch.resolves([]);

      const body = {
        payment_status: "captured",
        payment_id: "pay-123",
        order_items: [
          { sku_id: "sku-1", product_id: "prod-1", quantity: 10 },
          { sku_id: "sku-2", product_id: "prod-2", quantity: 20 },
        ],
      };

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/webhooks/payment-status",
        body,
      );
      const response = await handlers.handlePaymentStatusWebhook(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data.results).to.have.length(2);
      expect(data.results[0].success).to.be.true;
      expect(data.results[1].success).to.be.true;
    });

    it("should handle partial failures", async () => {
      const existingStock1 = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        reserved_quantity: 10,
        available_quantity: 90,
        status: "active",
      };
      const adjustedStock1 = {
        ...existingStock1,
        quantity: 90,
        available_quantity: 80,
      };

      const existingStock2 = {
        sku_id: "sku-2",
        product_id: "prod-2",
        sku_code: "SKU002",
        quantity: 10,
        reserved_quantity: 5,
        available_quantity: 5,
        status: "active",
      };

      const mockDb = env.INVENTORY_DB;
      const firstStub = mockDb.prepare().bind().first;
      // First item succeeds
      firstStub.onFirstCall().resolves(existingStock1); // getSkuStock in deductStockForOrder
      firstStub.onSecondCall().resolves(existingStock1); // getSkuStock in adjustStockQuantity
      firstStub.onThirdCall().resolves(adjustedStock1); // verify in adjustStockQuantity
      mockDb.batch.onFirstCall().resolves([]);
      // Second item fails - insufficient stock (available_quantity: 5 < quantity: 20)
      firstStub.onCall(3).resolves(existingStock2); // getSkuStock in deductStockForOrder - will throw error

      const body = {
        payment_status: "captured",
        payment_id: "pay-123",
        order_items: [
          { sku_id: "sku-1", product_id: "prod-1", quantity: 10 },
          { sku_id: "sku-2", product_id: "prod-2", quantity: 20 },
        ],
      };

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/webhooks/payment-status",
        body,
      );
      const response = await handlers.handlePaymentStatusWebhook(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data.results).to.have.length(2);
      expect(data.results[0].success).to.be.true;
      expect(data.results[1].success).to.be.false;
      expect(data.results[1].error).to.exist;
    });

    it("should skip items with missing sku_id or quantity", async () => {
      const body = {
        payment_status: "captured",
        payment_id: "pay-123",
        order_items: [
          { sku_id: "sku-1", quantity: 10 },
          { product_id: "prod-2" }, // Missing sku_id
          { sku_id: "sku-3" }, // Missing quantity
        ],
      };

      const existingStock = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        reserved_quantity: 10,
        available_quantity: 90,
        status: "active",
      };
      const adjustedStock = {
        ...existingStock,
        quantity: 90,
        available_quantity: 80,
      };

      const mockDb = env.INVENTORY_DB;
      // First call: getSkuStock in deductStockForOrder
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      // Second call: getSkuStock in adjustStockQuantity (to get existing stock)
      mockDb.prepare().bind().first.onSecondCall().resolves(existingStock);
      // Third call: getSkuStock in adjustStockQuantity (to verify update)
      mockDb.prepare().bind().first.onThirdCall().resolves(adjustedStock);
      mockDb.batch.resolves([]);

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/webhooks/payment-status",
        body,
      );
      const response = await handlers.handlePaymentStatusWebhook(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data.results).to.have.length(1);
    });

    it("should return 400 for invalid JSON", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/webhooks/payment-status",
        null,
      );
      request.json = async () => {
        throw new Error("Invalid JSON");
      };

      const response = await handlers.handlePaymentStatusWebhook(request, env);
      const data = await response.json();

      expect(response.status).to.equal(400);
      expect(data.error).to.equal("validation_error");
    });

    it("should return 400 when payment_status is missing", async () => {
      const body = {
        order_items: [{ sku_id: "sku-1", quantity: 10 }],
      };

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/webhooks/payment-status",
        body,
      );
      const response = await handlers.handlePaymentStatusWebhook(request, env);
      const data = await response.json();

      expect(response.status).to.equal(400);
      expect(data.error).to.equal("validation_error");
    });

    it("should return 400 when order_items is missing", async () => {
      const body = {
        payment_status: "captured",
      };

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/webhooks/payment-status",
        body,
      );
      const response = await handlers.handlePaymentStatusWebhook(request, env);
      const data = await response.json();

      expect(response.status).to.equal(400);
      expect(data.error).to.equal("validation_error");
    });

    it("should return 200 even on errors (to prevent webhook retries)", async () => {
      const body = {
        payment_status: "captured",
        order_items: [{ sku_id: "sku-1", quantity: 10 }],
      };

      const mockDb = env.INVENTORY_DB;
      // Mock getSkuStock to throw error - this will be caught in the inner try-catch
      const firstStub = mockDb.prepare().bind().first;
      firstStub.rejects(new Error("Unexpected error"));

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/webhooks/payment-status",
        body,
      );
      const response = await handlers.handlePaymentStatusWebhook(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      // The webhook handler catches errors in the inner try-catch and returns success: true
      // but the individual result has success: false
      expect(data.success).to.be.true;
      expect(data.results).to.have.length(1);
      expect(data.results[0].success).to.be.false;
      expect(data.results[0].error).to.exist;
    });
  });
});
