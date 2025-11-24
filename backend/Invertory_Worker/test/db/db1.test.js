// test/db/db1.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as db from "../../src/db/db1.js";
import { createMockEnv } from "../setup.js";

describe("DB Functions", () => {
  let env;
  let mockDb;

  beforeEach(() => {
    env = createMockEnv();
    mockDb = env.INVENTORY_DB;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getSkuStock", () => {
    it("should return stock when found", async () => {
      const mockStock = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        reserved_quantity: 10,
        available_quantity: 90,
      };
      mockDb.prepare().bind().first.resolves(mockStock);

      const stock = await db.getSkuStock("sku-1", env);
      expect(stock).to.deep.equal(mockStock);
    });

    it("should return null when stock not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      const stock = await db.getSkuStock("sku-1", env);
      expect(stock).to.be.null;
    });

    it("should handle database errors", async () => {
      const error = new Error("Database error");
      mockDb.prepare().bind().first.rejects(error);

      try {
        await db.getSkuStock("sku-1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe("getSkuStocks", () => {
    it("should return stocks for multiple SKUs", async () => {
      const mockStocks = [
        { sku_id: "sku-1", quantity: 100 },
        { sku_id: "sku-2", quantity: 200 },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockStocks });

      const stocks = await db.getSkuStocks(["sku-1", "sku-2"], env);
      expect(stocks).to.deep.equal(mockStocks);
    });

    it("should return empty array when no SKU IDs provided", async () => {
      const stocks = await db.getSkuStocks([], env);
      expect(stocks).to.deep.equal([]);
    });

    it("should return empty array when null provided", async () => {
      const stocks = await db.getSkuStocks(null, env);
      expect(stocks).to.deep.equal([]);
    });

    it("should handle database errors", async () => {
      const error = new Error("Database error");
      mockDb.prepare().bind().all.rejects(error);

      try {
        await db.getSkuStocks(["sku-1"], env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe("getProductStock", () => {
    it("should return all stocks for a product", async () => {
      const mockStocks = [
        { sku_id: "sku-1", product_id: "prod-1", sku_code: "SKU001" },
        { sku_id: "sku-2", product_id: "prod-1", sku_code: "SKU002" },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockStocks });

      const stocks = await db.getProductStock("prod-1", env);
      expect(stocks).to.deep.equal(mockStocks);
    });

    it("should handle database errors", async () => {
      const error = new Error("Database error");
      mockDb.prepare().bind().all.rejects(error);

      try {
        await db.getProductStock("prod-1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe("initializeSkuStock", () => {
    it("should initialize stock for new SKU", async () => {
      const stockData = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        low_stock_threshold: 10,
      };

      // Mock: stock doesn't exist initially
      mockDb.prepare().bind().first.onFirstCall().resolves(null);
      // Mock: after initialization, stock exists
      const mockStock = {
        ...stockData,
        available_quantity: 100,
        status: "active",
      };
      mockDb.prepare().bind().first.onSecondCall().resolves(mockStock);
      // Mock batch operation
      mockDb.batch.resolves([]);

      const stock = await db.initializeSkuStock(stockData, env);
      expect(stock).to.exist;
      expect(mockDb.batch).to.have.been.called;
    });

    it("should return existing stock if already initialized", async () => {
      const stockData = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
      };

      const existingStock = { sku_id: "sku-1", quantity: 50 };
      mockDb.prepare().bind().first.resolves(existingStock);

      const stock = await db.initializeSkuStock(stockData, env);
      expect(stock).to.deep.equal(existingStock);
      expect(mockDb.batch).to.not.have.been.called;
    });

    it("should handle database errors", async () => {
      const stockData = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
      };

      mockDb.prepare().bind().first.rejects(new Error("Database error"));

      try {
        await db.initializeSkuStock(stockData, env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Database error");
      }
    });
  });

  describe("updateSkuStock", () => {
    it("should update stock successfully", async () => {
      const existingStock = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        reserved_quantity: 10,
      };

      const updates = {
        quantity: 150,
        reserved_quantity: 20,
        low_stock_threshold: 15,
        status: "active",
      };

      // Mock existing stock
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      // Mock updated stock
      const updatedStock = {
        ...existingStock,
        ...updates,
        available_quantity: 130,
      };
      mockDb.prepare().bind().first.onSecondCall().resolves(updatedStock);
      // Mock batch operation
      mockDb.batch.resolves([]);

      const stock = await db.updateSkuStock("sku-1", updates, "user-1", env);
      expect(stock).to.exist;
      expect(mockDb.batch).to.have.been.called;
    });

    it("should throw error if stock not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      try {
        await db.updateSkuStock("sku-1", { quantity: 100 }, "user-1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Stock not found");
      }
    });

    it("should handle database errors", async () => {
      const existingStock = { sku_id: "sku-1", quantity: 100 };
      mockDb.prepare().bind().first.resolves(existingStock);
      mockDb.batch.rejects(new Error("Database error"));

      try {
        await db.updateSkuStock("sku-1", { quantity: 150 }, "user-1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Database error");
      }
    });
  });

  describe("adjustStockQuantity", () => {
    it("should increase stock quantity", async () => {
      const existingStock = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        reserved_quantity: 10,
        status: "active",
      };

      // Mock existing stock
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      // Mock updated stock after adjustment
      const updatedStock = {
        ...existingStock,
        quantity: 150,
        available_quantity: 140,
      };
      mockDb.prepare().bind().first.onSecondCall().resolves(updatedStock);
      // Mock batch operation
      mockDb.batch.resolves([]);

      const stock = await db.adjustStockQuantity("sku-1", 50, "user-1", env);
      expect(stock.quantity).to.equal(150);
      expect(mockDb.batch).to.have.been.called;
    });

    it("should decrease stock quantity", async () => {
      const existingStock = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        reserved_quantity: 10,
        status: "active",
      };

      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      const updatedStock = {
        ...existingStock,
        quantity: 50,
        available_quantity: 40,
      };
      mockDb.prepare().bind().first.onSecondCall().resolves(updatedStock);
      mockDb.batch.resolves([]);

      const stock = await db.adjustStockQuantity("sku-1", -50, "user-1", env);
      expect(stock.quantity).to.equal(50);
    });

    it("should throw error if insufficient stock", async () => {
      const existingStock = {
        sku_id: "sku-1",
        quantity: 10,
        reserved_quantity: 5,
        available_quantity: 5,
      };

      mockDb.prepare().bind().first.resolves(existingStock);

      try {
        await db.adjustStockQuantity("sku-1", -20, "user-1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Insufficient stock");
      }
    });

    it("should throw error if stock not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      try {
        await db.adjustStockQuantity("sku-1", 50, "user-1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Stock not found");
      }
    });

    it("should handle database errors", async () => {
      const existingStock = { sku_id: "sku-1", quantity: 100 };
      mockDb.prepare().bind().first.resolves(existingStock);
      mockDb.batch.rejects(new Error("Database error"));

      try {
        await db.adjustStockQuantity("sku-1", 50, "user-1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Database error");
      }
    });
  });

  describe("reserveStock", () => {
    it("should reserve stock successfully", async () => {
      const existingStock = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        reserved_quantity: 10,
        available_quantity: 90,
      };

      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      const updatedStock = {
        ...existingStock,
        reserved_quantity: 20,
        available_quantity: 80,
      };
      mockDb.prepare().bind().first.onSecondCall().resolves(updatedStock);
      mockDb.batch.resolves([]);

      const stock = await db.reserveStock(
        "sku-1",
        10,
        "reservation-1",
        "user-1",
        env,
      );
      expect(stock.reserved_quantity).to.equal(20);
      expect(mockDb.batch).to.have.been.called;
    });

    it("should throw error if insufficient available stock", async () => {
      const existingStock = {
        sku_id: "sku-1",
        quantity: 100,
        reserved_quantity: 90,
        available_quantity: 10,
      };

      mockDb.prepare().bind().first.resolves(existingStock);

      try {
        await db.reserveStock("sku-1", 20, "reservation-1", "user-1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Insufficient available stock");
      }
    });

    it("should throw error if stock not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      try {
        await db.reserveStock("sku-1", 10, "reservation-1", "user-1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Stock not found");
      }
    });

    it("should throw error if reservation verification fails", async () => {
      const existingStock = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        reserved_quantity: 10,
        available_quantity: 90,
        status: "active",
      };

      const differentStock = {
        ...existingStock,
        reserved_quantity: 5, // Different reserved quantity - verification failed
      };

      // Mock getSkuStock calls
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      mockDb.prepare().bind().first.onSecondCall().resolves(differentStock); // Updated stock has different reserved_quantity
      mockDb.batch.resolves([]);

      try {
        await db.reserveStock("sku-1", 10, "reservation-1", "user-1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Stock reservation failed");
      }
    });
  });

  describe("releaseStock", () => {
    it("should release reserved stock successfully", async () => {
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

      // Mock reservation lookup
      const reservationStub = mockDb.prepare().bind();
      reservationStub.first.onFirstCall().resolves(reservation);
      // Mock stock lookup
      mockDb.prepare().bind().first.onSecondCall().resolves(existingStock);
      // Mock updated stock
      const updatedStock = {
        ...existingStock,
        reserved_quantity: 10,
        available_quantity: 90,
      };
      mockDb.prepare().bind().first.onThirdCall().resolves(updatedStock);
      mockDb.batch.resolves([]);

      const stock = await db.releaseStock(
        "sku-1",
        "reservation-1",
        null,
        "user-1",
        env,
      );
      expect(stock).to.exist;
      expect(mockDb.batch).to.have.been.called;
    });

    it("should throw error if reservation not found", async () => {
      const reservationStub = mockDb.prepare().bind();
      reservationStub.first.resolves(null);

      try {
        await db.releaseStock("sku-1", "reservation-1", null, "user-1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Active reservation not found");
      }
    });

    it("should throw error if reservation doesn't match SKU", async () => {
      const reservation = {
        reservation_id: "reservation-1",
        sku_id: "sku-2",
        quantity: 10,
        status: "active",
      };

      const reservationStub = mockDb.prepare().bind();
      reservationStub.first.resolves(reservation);

      try {
        await db.releaseStock("sku-1", "reservation-1", null, "user-1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("does not belong to SKU");
      }
    });

    it("should handle partial release (releaseQuantity < reservation.quantity)", async () => {
      const reservation = {
        reservation_id: "reservation-1",
        sku_id: "sku-1",
        quantity: 20,
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

      const updatedStock = {
        ...existingStock,
        reserved_quantity: 10,
        available_quantity: 90,
      };

      // Mock reservation lookup
      const reservationStub = mockDb.prepare().bind();
      reservationStub.first.onFirstCall().resolves(reservation);
      // Mock stock lookup
      mockDb.prepare().bind().first.onSecondCall().resolves(existingStock);
      // Mock updated stock
      mockDb.prepare().bind().first.onThirdCall().resolves(updatedStock);
      mockDb.batch.resolves([]);

      // Release only 10 out of 20
      const stock = await db.releaseStock(
        "sku-1",
        "reservation-1",
        10,
        "user-1",
        env,
      );
      expect(stock).to.exist;
      expect(mockDb.batch).to.have.been.called;
    });

    it("should throw error if release quantity exceeds reservation quantity", async () => {
      const reservation = {
        reservation_id: "reservation-1",
        sku_id: "sku-1",
        quantity: 10,
        status: "active",
      };

      const reservationStub = mockDb.prepare().bind();
      reservationStub.first.resolves(reservation);

      try {
        await db.releaseStock("sku-1", "reservation-1", 15, "user-1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Cannot release more than reserved");
      }
    });
  });

  describe("getStockHistory", () => {
    it("should return stock history with pagination", async () => {
      const mockHistory = [
        {
          history_id: "hist-1",
          sku_id: "sku-1",
          change_type: "update",
          quantity_before: 100,
          quantity_after: 150,
        },
      ];

      const mockCount = { total: 1 };

      // Mock history query
      const historyStub = mockDb.prepare().bind();
      historyStub.all.onFirstCall().resolves({ results: mockHistory });
      // Mock count query
      historyStub.first.onFirstCall().resolves(mockCount);

      const result = await db.getStockHistory("sku-1", 1, 20, env);
      expect(result.history).to.deep.equal(mockHistory);
      expect(result.total).to.equal(1);
      expect(result.page).to.equal(1);
      expect(result.limit).to.equal(20);
    });

    it("should handle database errors", async () => {
      mockDb.prepare().bind().all.rejects(new Error("Database error"));

      try {
        await db.getStockHistory("sku-1", 1, 20, env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Database error");
      }
    });
  });
});
