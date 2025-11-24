// test/services/inventoryService.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as service from "../../src/services/inventoryService.js";
import { createMockEnv } from "../setup.js";

describe("Inventory Service", () => {
  let env;
  let mockDb;

  beforeEach(() => {
    env = createMockEnv();
    mockDb = env.INVENTORY_DB;
    sinon.restore();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getStock", () => {
    it("should return formatted stock data", async () => {
      const mockStock = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        reserved_quantity: 10,
        available_quantity: 90,
        low_stock_threshold: 20,
        status: "active",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      mockDb.prepare().bind().first.resolves(mockStock);

      const stock = await service.getStock("sku-1", env);
      expect(stock).to.deep.equal(mockStock);
    });

    it("should return null when stock not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      const stock = await service.getStock("sku-1", env);
      expect(stock).to.be.null;
    });

    it("should handle errors", async () => {
      const error = new Error("Service error");
      mockDb.prepare().bind().first.rejects(error);

      try {
        await service.getStock("sku-1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe("getStocks", () => {
    it("should return formatted stocks for multiple SKUs", async () => {
      const mockStocks = [
        {
          sku_id: "sku-1",
          product_id: "prod-1",
          sku_code: "SKU001",
          quantity: 100,
          reserved_quantity: 10,
          available_quantity: 90,
          status: "active",
        },
        {
          sku_id: "sku-2",
          product_id: "prod-1",
          sku_code: "SKU002",
          quantity: 200,
          reserved_quantity: 20,
          available_quantity: 180,
          status: "active",
        },
      ];

      mockDb.prepare().bind().all.resolves({ results: mockStocks });

      const stocks = await service.getStocks(["sku-1", "sku-2"], env);
      expect(stocks).to.have.length(2);
      expect(stocks[0].sku_id).to.equal("sku-1");
    });
  });

  describe("getProductStocks", () => {
    it("should return all stocks for a product", async () => {
      const mockStocks = [
        {
          sku_id: "sku-1",
          product_id: "prod-1",
          sku_code: "SKU001",
          quantity: 100,
        },
      ];

      mockDb.prepare().bind().all.resolves({ results: mockStocks });

      const stocks = await service.getProductStocks("prod-1", env);
      expect(stocks).to.have.length(1);
      expect(stocks[0].product_id).to.equal("prod-1");
    });
  });

  describe("initializeStock", () => {
    it("should initialize stock successfully", async () => {
      const stockData = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
      };

      const mockStock = { ...stockData, available_quantity: 100, status: "active" };
      // Mock: stock doesn't exist initially
      mockDb.prepare().bind().first.onFirstCall().resolves(null);
      // Mock: after initialization, stock exists
      mockDb.prepare().bind().first.onSecondCall().resolves(mockStock);
      // Mock batch operation
      mockDb.batch.resolves([]);

      const stock = await service.initializeStock(stockData, env);
      expect(stock).to.exist;
    });
  });

  describe("updateStock", () => {
    it("should update stock successfully", async () => {
      const updates = { quantity: 150, status: "active" };
      const existingStock = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        reserved_quantity: 10,
      };
      const mockStock = {
        sku_id: "sku-1",
        quantity: 150,
        status: "active",
      };

      // Mock existing stock
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      // Mock updated stock
      mockDb.prepare().bind().first.onSecondCall().resolves(mockStock);
      // Mock batch operation
      mockDb.batch.resolves([]);

      const stock = await service.updateStock("sku-1", updates, "user-1", env);
      expect(stock).to.exist;
    });
  });

  describe("adjustStock", () => {
    it("should adjust stock quantity", async () => {
      const existingStock = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        reserved_quantity: 10,
        status: "active",
      };
      const mockStock = {
        sku_id: "sku-1",
        quantity: 150,
        available_quantity: 140,
      };

      // Mock existing stock
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      // Mock updated stock after adjustment
      mockDb.prepare().bind().first.onSecondCall().resolves(mockStock);
      // Mock batch operation
      mockDb.batch.resolves([]);

      const stock = await service.adjustStock("sku-1", 50, "user-1", env, "Test reason");
      expect(stock).to.exist;
    });
  });

  describe("reserveStockForCart", () => {
    it("should reserve stock for cart", async () => {
      const existingStock = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        reserved_quantity: 10,
        available_quantity: 90,
      };
      const mockStock = {
        sku_id: "sku-1",
        reserved_quantity: 20,
        available_quantity: 80,
      };

      // Mock existing stock
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      // Mock updated stock after reservation
      mockDb.prepare().bind().first.onSecondCall().resolves(mockStock);
      // Mock batch operation
      mockDb.batch.resolves([]);

      const stock = await service.reserveStockForCart(
        "sku-1",
        10,
        "reservation-1",
        "user-1",
        env,
      );
      expect(stock).to.exist;
    });
  });

  describe("releaseReservedStock", () => {
    it("should release reserved stock", async () => {
      const reservation = {
        reservation_id: "reservation-1",
        sku_id: "sku-1",
        quantity: 10,
        status: "active",
      };
      const existingStock = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        reserved_quantity: 20,
        available_quantity: 80,
      };
      const mockStock = {
        sku_id: "sku-1",
        reserved_quantity: 10,
        available_quantity: 90,
      };

      // Mock reservation lookup
      const reservationStub = mockDb.prepare().bind();
      reservationStub.first.onFirstCall().resolves(reservation);
      // Mock stock lookup
      mockDb.prepare().bind().first.onSecondCall().resolves(existingStock);
      // Mock updated stock
      mockDb.prepare().bind().first.onThirdCall().resolves(mockStock);
      // Mock batch operation
      mockDb.batch.resolves([]);

      const stock = await service.releaseReservedStock(
        "sku-1",
        "reservation-1",
        10,
        "user-1",
        env,
      );
      expect(stock).to.exist;
    });
  });

  describe("getHistory", () => {
    it("should return stock history", async () => {
      const mockHistory = [
        {
          history_id: "hist-1",
          sku_id: "sku-1",
          change_type: "update",
        },
      ];
      const mockCount = { total: 1 };

      // Mock history query
      const historyStub = mockDb.prepare().bind();
      historyStub.all.onFirstCall().resolves({ results: mockHistory });
      // Mock count query
      historyStub.first.onFirstCall().resolves(mockCount);

      const history = await service.getHistory("sku-1", 1, 20, env);
      expect(history.history).to.deep.equal(mockHistory);
      expect(history.total).to.equal(1);
    });
  });

  describe("checkAvailability", () => {
    it("should return availability for multiple SKUs", async () => {
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

      const availability = await service.checkAvailability(["sku-1", "sku-2", "sku-3"], env);
      expect(availability["sku-1"].in_stock).to.be.true;
      expect(availability["sku-2"].in_stock).to.be.false;
      expect(availability["sku-3"].status).to.equal("not_found");
    });

    it("should handle empty SKU list", async () => {
      mockDb.prepare().bind().all.resolves({ results: [] });

      const availability = await service.checkAvailability([], env);
      expect(availability).to.deep.equal({});
    });
  });

  describe("deductStockForOrder", () => {
    it.skip("should deduct stock for order", async () => {
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

      // Mock existing stock (first call in deductStockForOrder)
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      // Mock updated stock after adjustment (second call in adjustStockQuantity to verify)
      mockDb.prepare().bind().first.onSecondCall().resolves(adjustedStock);
      // Mock batch operation
      mockDb.batch.resolves([]);

      const stock = await service.deductStockForOrder("sku-1", 10, "order-1", env);
      expect(stock.quantity).to.equal(90);
      expect(stock.available_quantity).to.equal(80);
    });

    it("should throw error if stock not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      try {
        await service.deductStockForOrder("sku-1", 10, "order-1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Stock not found");
      }
    });

    it("should throw error if insufficient stock", async () => {
      const existingStock = {
        sku_id: "sku-1",
        available_quantity: 5,
      };

      mockDb.prepare().bind().first.resolves(existingStock);

      try {
        await service.deductStockForOrder("sku-1", 10, "order-1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Insufficient stock");
      }
    });
  });
});

