// test/handlers/inventoryHandlers.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as handlers from "../../src/handlers/inventoryHandlers.js";
import * as service from "../../src/services/inventoryService.js";
import { createMockRequest, createMockEnv } from "../setup.js";

describe("Inventory Handlers", () => {
  let env;

  beforeEach(() => {
    env = createMockEnv();
    sinon.restore();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getStock", () => {
    it("should return stock when found", async () => {
      const mockStock = {
        sku_id: "sku-1",
        quantity: 100,
        available_quantity: 90,
      };

      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().first.resolves(mockStock);

      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {},
        { sku_id: "sku-1" },
      );
      const response = await handlers.getStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data).to.deep.equal(mockStock);
    });

    it("should return 404 when stock not found", async () => {
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().first.resolves(null);

      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {},
        { sku_id: "sku-1" },
      );
      const response = await handlers.getStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(404);
      expect(data.error).to.equal("not_found");
    });

    it("should return 400 for invalid SKU ID", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/",
        null,
        {},
        { sku_id: "" },
      );
      const response = await handlers.getStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(400);
      expect(data.error).to.equal("validation_error");
    });

    it("should handle errors", async () => {
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().first.rejects(new Error("Service error"));

      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {},
        { sku_id: "sku-1" },
      );
      const response = await handlers.getStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(500);
      expect(data.error).to.equal("internal_error");
    });
  });

  describe("initializeStock", () => {
    it("should initialize stock successfully", async () => {
      const mockStock = {
        sku_id: "sku-1",
        product_id: "prod-1",
        quantity: 100,
      };

      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().first.onFirstCall().resolves(null);
      mockDb.prepare().bind().first.onSecondCall().resolves(mockStock);
      mockDb.batch.resolves([]);

      const body = {
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
      };

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1",
        body,
        {},
        { sku_id: "sku-1" },
      );
      request.user = { userId: "user-1" };

      const response = await handlers.initializeStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(201);
      expect(data).to.deep.equal(mockStock);
    });

    it("should return 400 for invalid SKU ID", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/",
        {},
        {},
        { sku_id: "" },
      );
      const response = await handlers.initializeStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(400);
      expect(data.error).to.equal("validation_error");
    });
  });

  describe("updateStock", () => {
    it("should update stock successfully", async () => {
      const mockStock = {
        sku_id: "sku-1",
        quantity: 150,
      };

      const mockDb = env.INVENTORY_DB;
      const existingStock = {
        sku_id: "sku-1",
        quantity: 100,
        reserved_quantity: 10,
        product_id: "prod-1",
        sku_code: "SKU001",
      };
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      mockDb.prepare().bind().first.onSecondCall().resolves(mockStock);
      mockDb.batch.resolves([]);

      const body = { quantity: 150 };
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/stock/sku-1",
        body,
        {},
        { sku_id: "sku-1" },
      );
      request.user = { userId: "admin" };

      const response = await handlers.updateStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data).to.deep.equal(mockStock);
    });

    it("should return 400 for invalid SKU ID", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/stock/",
        {},
        {},
        { sku_id: "" },
      );
      const response = await handlers.updateStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(400);
      expect(data.error).to.equal("validation_error");
    });
  });

  describe("adjustStock", () => {
    it("should adjust stock successfully", async () => {
      const mockStock = {
        sku_id: "sku-1",
        quantity: 150,
      };

      const mockDb = env.INVENTORY_DB;
      const existingStock = {
        sku_id: "sku-1",
        quantity: 100,
        reserved_quantity: 10,
        product_id: "prod-1",
        sku_code: "SKU001",
        status: "active",
      };
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      mockDb.prepare().bind().first.onSecondCall().resolves(mockStock);
      mockDb.batch.resolves([]);

      const body = { quantity: 50, reason: "Restock" };
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1/adjust",
        body,
        {},
        { sku_id: "sku-1" },
      );
      request.user = { userId: "admin" };

      const response = await handlers.adjustStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data).to.deep.equal(mockStock);
    });

    it("should return 400 when quantity is missing", async () => {
      const body = { reason: "Restock" };
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1/adjust",
        body,
        {},
        { sku_id: "sku-1" },
      );
      request.user = { userId: "admin" };

      const response = await handlers.adjustStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(400);
      expect(data.error).to.equal("validation_error");
    });

    it("should return 400 for insufficient stock", async () => {
      const error = new Error("Insufficient stock");
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().first.rejects(error);

      const body = { quantity: -100 };
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1/adjust",
        body,
        {},
        { sku_id: "sku-1" },
      );
      request.user = { userId: "admin" };

      const response = await handlers.adjustStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(400);
      expect(data.error).to.equal("internal_error");
    });
  });

  describe("reserveStock", () => {
    it("should reserve stock successfully", async () => {
      const mockStock = {
        sku_id: "sku-1",
        reserved_quantity: 20,
        available_quantity: 80,
      };

      const mockDb = env.INVENTORY_DB;
      const existingStock = {
        sku_id: "sku-1",
        quantity: 100,
        reserved_quantity: 10,
        available_quantity: 90,
        product_id: "prod-1",
        sku_code: "SKU001",
      };
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      mockDb.prepare().bind().first.onSecondCall().resolves(mockStock);
      mockDb.batch.resolves([]);

      const body = {
        quantity: 10,
        reservation_id: "reservation-1",
        expires_at: "2024-12-31T23:59:59Z",
      };
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1/reserve",
        body,
        {},
        { sku_id: "sku-1" },
      );
      request.user = { userId: "user-1" };

      const response = await handlers.reserveStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data).to.deep.equal(mockStock);
    });

    it("should return 400 when quantity is missing", async () => {
      const body = { reservation_id: "reservation-1" };
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1/reserve",
        body,
        {},
        { sku_id: "sku-1" },
      );
      request.user = { userId: "user-1" };

      const response = await handlers.reserveStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(400);
      expect(data.error).to.equal("validation_error");
    });

    it("should return 400 for insufficient stock", async () => {
      const error = new Error("Insufficient available stock");
      const mockDb = env.INVENTORY_DB;
      const existingStock = {
        sku_id: "sku-1",
        quantity: 10,
        reserved_quantity: 5,
        available_quantity: 5,
        product_id: "prod-1",
        sku_code: "SKU001",
      };
      mockDb.prepare().bind().first.resolves(existingStock);
      mockDb.batch.resolves([]);

      const body = {
        quantity: 1000,
        reservation_id: "reservation-1",
      };
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1/reserve",
        body,
        {},
        { sku_id: "sku-1" },
      );
      request.user = { userId: "user-1" };

      const response = await handlers.reserveStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(400);
      expect(data.error).to.equal("internal_error");
    });
  });

  describe("releaseStock", () => {
    it("should release stock successfully", async () => {
      const mockStock = {
        sku_id: "sku-1",
        reserved_quantity: 10,
        available_quantity: 90,
      };

      const mockDb = env.INVENTORY_DB;
      const reservation = {
        reservation_id: "reservation-1",
        sku_id: "sku-1",
        quantity: 10,
        status: "active",
      };
      const existingStock = {
        sku_id: "sku-1",
        quantity: 100,
        reserved_quantity: 20,
        available_quantity: 80,
        product_id: "prod-1",
        sku_code: "SKU001",
      };
      const reservationStub = mockDb.prepare().bind();
      reservationStub.first.onFirstCall().resolves(reservation);
      mockDb.prepare().bind().first.onSecondCall().resolves(existingStock);
      mockDb.prepare().bind().first.onThirdCall().resolves(mockStock);
      mockDb.batch.resolves([]);

      const body = {
        reservation_id: "reservation-1",
        quantity: 10,
      };
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1/release",
        body,
        {},
        { sku_id: "sku-1" },
      );
      request.user = { userId: "user-1" };

      const response = await handlers.releaseStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data).to.deep.equal(mockStock);
    });

    it("should return 400 when reservation_id is missing", async () => {
      const body = { quantity: 10 };
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1/release",
        body,
        {},
        { sku_id: "sku-1" },
      );
      request.user = { userId: "user-1" };

      const response = await handlers.releaseStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(400);
      expect(data.error).to.equal("validation_error");
    });
  });

  describe("getHistory", () => {
    it("should return stock history", async () => {
      const mockHistory = {
        history: [
          {
            history_id: "hist-1",
            sku_id: "sku-1",
            change_type: "update",
          },
        ],
        page: 1,
        limit: 20,
        total: 1,
      };

      const mockDb = env.INVENTORY_DB;
      const historyStub = mockDb.prepare().bind();
      historyStub.all.onFirstCall().resolves({ results: mockHistory.history });
      historyStub.first.onFirstCall().resolves({ total: mockHistory.total });

      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/sku-1/history?page=1&limit=20",
        null,
        {},
        { sku_id: "sku-1" },
      );
      const response = await handlers.getHistory(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data).to.deep.equal(mockHistory);
    });

    it("should use default pagination", async () => {
      const mockHistory = {
        history: [],
        page: 1,
        limit: 20,
        total: 0,
      };

      const mockDb = env.INVENTORY_DB;
      const historyStub = mockDb.prepare().bind();
      historyStub.all.onFirstCall().resolves({ results: mockHistory.history });
      historyStub.first.onFirstCall().resolves({ total: mockHistory.total });

      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/sku-1/history",
        null,
        {},
        { sku_id: "sku-1" },
      );
      const response = await handlers.getHistory(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data.page).to.equal(1);
      expect(data.limit).to.equal(20);
    });
  });

  describe("getProductStock", () => {
    it("should return all stocks for a product", async () => {
      const mockStocks = [
        {
          sku_id: "sku-1",
          product_id: "prod-1",
          quantity: 100,
        },
      ];

      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().all.resolves({ results: mockStocks });

      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/product/prod-1",
        null,
        {},
        { product_id: "prod-1" },
      );
      const response = await handlers.getProductStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data.product_id).to.equal("prod-1");
      expect(data.stocks).to.deep.equal(mockStocks);
    });

    it("should return 400 when product_id is missing", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/product/",
        null,
        {},
        { product_id: "" },
      );
      const response = await handlers.getProductStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(400);
      expect(data.error).to.equal("validation_error");
    });
  });

  describe("checkAvailability", () => {
    it("should check availability for multiple SKUs", async () => {
      const mockAvailability = {
        "sku-1": {
          sku_id: "sku-1",
          available_quantity: 90,
          in_stock: true,
        },
        "sku-2": {
          sku_id: "sku-2",
          available_quantity: 0,
          in_stock: false,
        },
      };

      const mockDb = env.INVENTORY_DB;
      const mockStocks = [
        {
          sku_id: "sku-1",
          available_quantity: 90,
          quantity: 100,
          reserved_quantity: 10,
          status: "active",
        },
        {
          sku_id: "sku-2",
          available_quantity: 0,
          quantity: 0,
          reserved_quantity: 0,
          status: "out_of_stock",
        },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockStocks });

      const body = { sku_ids: ["sku-1", "sku-2"] };
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/check-stock",
        body,
      );
      const response = await handlers.checkAvailability(request, env);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data.availability).to.exist;
      expect(data.availability["sku-1"]).to.exist;
      expect(data.availability["sku-1"].in_stock).to.be.true;
      expect(data.availability["sku-2"]).to.exist;
      expect(data.availability["sku-2"].in_stock).to.be.false;
    });

    it("should return 400 when sku_ids is missing", async () => {
      const body = {};
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/check-stock",
        body,
      );
      const response = await handlers.checkAvailability(request, env);
      const data = await response.json();

      expect(response.status).to.equal(400);
      expect(data.error).to.equal("validation_error");
    });

    it("should return 400 when sku_ids is not an array", async () => {
      const body = { sku_ids: "not-an-array" };
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/check-stock",
        body,
      );
      const response = await handlers.checkAvailability(request, env);
      const data = await response.json();

      expect(response.status).to.equal(400);
      expect(data.error).to.equal("validation_error");
    });

    it("should handle service errors", async () => {
      const error = new Error("Service error");
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().all.rejects(error);

      const body = { sku_ids: ["sku-1"] };
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/check-stock",
        body,
      );
      const response = await handlers.checkAvailability(request, env);
      const data = await response.json();

      expect(response.status).to.equal(500);
      expect(data.error).to.equal("internal_error");
    });
  });

  describe("Error handling edge cases", () => {
    it("should handle service errors in getHistory", async () => {
      const error = new Error("Service error");
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().all.rejects(error);

      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/sku-1/history",
        null,
        {},
        { sku_id: "sku-1" },
      );
      const response = await handlers.getHistory(request, env);
      const data = await response.json();

      expect(response.status).to.equal(500);
      expect(data.error).to.equal("internal_error");
    });

    it("should handle service errors in getProductStock", async () => {
      const error = new Error("Service error");
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().all.rejects(error);

      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/product/prod-1",
        null,
        {},
        { product_id: "prod-1" },
      );
      const response = await handlers.getProductStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(500);
      expect(data.error).to.equal("internal_error");
    });

    it("should handle service errors in releaseStock", async () => {
      const error = new Error("Service error");
      const mockDb = env.INVENTORY_DB;
      const reservation = {
        reservation_id: "reservation-1",
        sku_id: "sku-1",
        quantity: 10,
        status: "active",
      };
      const reservationStub = mockDb.prepare().bind();
      reservationStub.first.resolves(reservation);
      mockDb.prepare().bind().first.onSecondCall().rejects(error);

      const body = { reservation_id: "reservation-1" };
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1/release",
        body,
        {},
        { sku_id: "sku-1" },
      );
      request.user = { userId: "user-1" };

      const response = await handlers.releaseStock(request, env);
      const data = await response.json();

      expect(response.status).to.equal(500);
      expect(data.error).to.equal("internal_error");
    });
  });

  describe("Error handling edge cases", () => {
    it("should handle JSON parse errors in initializeStock", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {},
        { sku_id: "sku-1" },
      );
      request.json = async () => {
        throw new Error("Invalid JSON");
      };

      const response = await handlers.initializeStock(request, env);
      expect(response.status).to.equal(500);
    });

    it("should handle JSON parse errors in updateStock", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {},
        { sku_id: "sku-1" },
      );
      request.json = async () => {
        throw new Error("Invalid JSON");
      };

      const response = await handlers.updateStock(request, env);
      expect(response.status).to.equal(500);
    });

    it("should handle JSON parse errors in adjustStock", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1/adjust",
        null,
        {},
        { sku_id: "sku-1" },
      );
      request.json = async () => {
        throw new Error("Invalid JSON");
      };

      const response = await handlers.adjustStock(request, env);
      expect(response.status).to.equal(500);
    });

    it("should handle JSON parse errors in reserveStock", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1/reserve",
        null,
        {},
        { sku_id: "sku-1" },
      );
      request.json = async () => {
        throw new Error("Invalid JSON");
      };

      const response = await handlers.reserveStock(request, env);
      expect(response.status).to.equal(500);
    });

    it("should handle JSON parse errors in releaseStock", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1/release",
        null,
        {},
        { sku_id: "sku-1" },
      );
      request.json = async () => {
        throw new Error("Invalid JSON");
      };

      const response = await handlers.releaseStock(request, env);
      expect(response.status).to.equal(500);
    });
  });
});
