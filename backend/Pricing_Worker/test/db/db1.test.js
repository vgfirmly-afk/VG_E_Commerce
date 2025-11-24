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
    mockDb = env.PRICING_DB;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getSkuPrice", () => {
    it("should return price when found", async () => {
      const mockPrice = {
        sku_id: "test-sku-id",
        price: 29.99,
        currency: "USD",
        status: "active",
      };
      mockDb
        .prepare()
        .bind()
        .first.resolves(mockPrice);

      const price = await db.getSkuPrice("test-sku-id", env);
      expect(price).to.deep.equal(mockPrice);
    });

    it("should return null when price not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      const price = await db.getSkuPrice("test-sku-id", env);
      expect(price).to.be.null;
    });

    it("should handle database errors", async () => {
      mockDb.prepare().bind().first.rejects(new Error("Database error"));

      try {
        await db.getSkuPrice("test-sku-id", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.equal("Database error");
      }
    });
  });

  describe("initializeSkuPrice", () => {
    it("should initialize new SKU price", async () => {
      const skuData = {
        sku_id: "test-sku-id",
        product_id: "test-product-id",
        sku_code: "TEST-SKU",
        price: 29.99,
        currency: "USD",
      };

      // Mock getSkuPrice to return null (price doesn't exist)
      mockDb.prepare().bind().first.onCall(0).resolves(null);
      // Mock INSERT
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true });
      // Mock price history INSERT
      mockDb.prepare().bind().run.onCall(1).resolves({ success: true });
      // Mock getSkuPrice to return inserted price
      mockDb.prepare().bind().first.onCall(1).resolves({
        sku_id: "test-sku-id",
        price: 29.99,
        currency: "USD",
      });

      const price = await db.initializeSkuPrice(skuData, env);
      expect(price).to.exist;
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should return existing price if already exists", async () => {
      const skuData = {
        sku_id: "test-sku-id",
        product_id: "test-product-id",
        sku_code: "TEST-SKU",
        price: 29.99,
      };

      const existingPrice = {
        sku_id: "test-sku-id",
        price: 25.99,
        currency: "USD",
      };

      mockDb.prepare().bind().first.resolves(existingPrice);

      const price = await db.initializeSkuPrice(skuData, env);
      expect(price).to.deep.equal(existingPrice);
    });
  });

  describe("getSkuPrices", () => {
    it("should return prices for multiple SKUs", async () => {
      const mockPrices = [
        { sku_id: "sku1", price: 10.0 },
        { sku_id: "sku2", price: 20.0 },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockPrices });

      const prices = await db.getSkuPrices(["sku1", "sku2"], env);
      expect(prices).to.deep.equal(mockPrices);
    });

    it("should return empty array when no SKU IDs provided", async () => {
      const prices = await db.getSkuPrices([], env);
      expect(prices).to.deep.equal([]);
    });

    it("should return empty array when SKU IDs is null", async () => {
      const prices = await db.getSkuPrices(null, env);
      expect(prices).to.deep.equal([]);
    });
  });

  describe("getProductPrices", () => {
    it("should return all prices for a product", async () => {
      const mockPrices = [
        { sku_id: "sku1", product_id: "prod1", price: 10.0 },
        { sku_id: "sku2", product_id: "prod1", price: 20.0 },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockPrices });

      const prices = await db.getProductPrices("prod1", env);
      expect(prices).to.deep.equal(mockPrices);
    });
  });

  describe("updateSkuPrice", () => {
    it("should update SKU price", async () => {
      const currentPrice = {
        sku_id: "test-sku-id",
        product_id: "test-product-id",
        sku_code: "TEST-SKU",
        price: 29.99,
        currency: "USD",
      };

      const priceData = { price: 39.99, reason: "Price increase" };

      // Mock getSkuPrice (current price)
      mockDb.prepare().bind().first.onCall(0).resolves(currentPrice);
      // Mock UPDATE
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true });
      // Mock price history INSERT
      mockDb.prepare().bind().run.onCall(1).resolves({ success: true });
      // Mock getSkuPrice (updated price)
      mockDb.prepare().bind().first.onCall(1).resolves({
        ...currentPrice,
        price: 39.99,
      });

      const updated = await db.updateSkuPrice(
        "test-sku-id",
        priceData,
        "user123",
        env,
      );
      expect(updated.price).to.equal(39.99);
    });

    it("should update only currency", async () => {
      const currentPrice = {
        sku_id: "test-sku-id",
        product_id: "test-product-id",
        sku_code: "TEST-SKU",
        price: 29.99,
        currency: "USD",
      };

      const priceData = { currency: "EUR" };

      mockDb.prepare().bind().first.onCall(0).resolves(currentPrice);
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true });
      mockDb.prepare().bind().run.onCall(1).resolves({ success: true });
      mockDb.prepare().bind().first.onCall(1).resolves({
        ...currentPrice,
        currency: "EUR",
      });

      const updated = await db.updateSkuPrice(
        "test-sku-id",
        priceData,
        "user123",
        env,
      );
      expect(updated.currency).to.equal("EUR");
    });

    it("should update sale_price to null", async () => {
      const currentPrice = {
        sku_id: "test-sku-id",
        product_id: "test-product-id",
        sku_code: "TEST-SKU",
        price: 29.99,
        sale_price: 24.99,
        currency: "USD",
      };

      const priceData = { sale_price: null };

      mockDb.prepare().bind().first.onCall(0).resolves(currentPrice);
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true });
      mockDb.prepare().bind().run.onCall(1).resolves({ success: true });
      mockDb.prepare().bind().first.onCall(1).resolves({
        ...currentPrice,
        sale_price: null,
      });

      const updated = await db.updateSkuPrice(
        "test-sku-id",
        priceData,
        "user123",
        env,
      );
      expect(updated.sale_price).to.be.null;
    });

    it("should throw error when SKU price not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      try {
        await db.updateSkuPrice(
          "test-sku-id",
          { price: 39.99 },
          "user123",
          env,
        );
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.equal("SKU price not found");
      }
    });

    it("should return current price when no fields to update", async () => {
      const currentPrice = {
        sku_id: "test-sku-id",
        price: 29.99,
        currency: "USD",
      };

      mockDb.prepare().bind().first.resolves(currentPrice);

      const updated = await db.updateSkuPrice(
        "test-sku-id",
        { reason: "No changes" },
        "user123",
        env,
      );
      expect(updated).to.deep.equal(currentPrice);
    });
  });

  describe("deleteSkuPrice", () => {
    it("should soft delete SKU price", async () => {
      const currentPrice = {
        sku_id: "test-sku-id",
        product_id: "test-product-id",
        sku_code: "TEST-SKU",
        price: 29.99,
        currency: "USD",
      };

      // Mock getSkuPrice
      mockDb.prepare().bind().first.resolves(currentPrice);
      // Mock UPDATE (soft delete)
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true });
      // Mock price history INSERT
      mockDb.prepare().bind().run.onCall(1).resolves({ success: true });

      const result = await db.deleteSkuPrice("test-sku-id", "user123", env);
      expect(result).to.be.true;
    });

    it("should throw error when SKU price not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      try {
        await db.deleteSkuPrice("test-sku-id", "user123", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.equal("SKU price not found");
      }
    });
  });

  describe("createPriceHistory", () => {
    it("should create price history entry", async () => {
      const historyData = {
        sku_id: "test-sku-id",
        product_id: "test-product-id",
        sku_code: "TEST-SKU",
        price: 29.99,
        currency: "USD",
        change_type: "update",
        reason: "Price update",
        changed_by: "user123",
      };

      mockDb.prepare().bind().run.resolves({ success: true });

      const result = await db.createPriceHistory(historyData, env);
      expect(result).to.exist;
      expect(result.sku_id).to.equal("test-sku-id");
    });
  });

  describe("getPriceHistory", () => {
    it("should return price history for a SKU", async () => {
      const mockHistory = [
        {
          history_id: "hist1",
          sku_id: "test-sku-id",
          price: 29.99,
          change_type: "update",
        },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockHistory });

      const history = await db.getPriceHistory(
        "test-sku-id",
        { page: 1, limit: 20 },
        env,
      );
      expect(history).to.deep.equal(mockHistory);
    });

    it("should handle default page and limit", async () => {
      mockDb.prepare().bind().all.resolves({ results: [] });

      const history = await db.getPriceHistory("test-sku-id", {}, env);
      expect(history).to.be.an("array");
    });

    it("should handle res?.results being undefined", async () => {
      mockDb.prepare().bind().all.resolves(null); // No results property

      const history = await db.getPriceHistory("test-sku-id", { page: 1, limit: 20 }, env);
      expect(history).to.be.an("array");
      expect(history.length).to.equal(0);
    });
  });

  describe("getPromotionCode", () => {
    it("should return active promotion code", async () => {
      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        discount_type: "percentage",
        discount_value: 10,
        status: "active",
      };
      mockDb.prepare().bind().first.resolves(mockPromo);

      const promo = await db.getPromotionCode("SAVE10", env);
      expect(promo).to.deep.equal(mockPromo);
    });

    it("should return null when promotion code not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      const promo = await db.getPromotionCode("INVALID", env);
      expect(promo).to.be.null;
    });
  });

  describe("getPromotionCodeById", () => {
    it("should return promotion code by ID", async () => {
      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
      };
      mockDb.prepare().bind().first.resolves(mockPromo);

      const promo = await db.getPromotionCodeById("promo1", env);
      expect(promo).to.deep.equal(mockPromo);
    });
  });

  describe("getPromotionCodeByCode", () => {
    it("should return promotion code by code", async () => {
      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
      };
      mockDb.prepare().bind().first.resolves(mockPromo);

      const promo = await db.getPromotionCodeByCode("SAVE10", env);
      expect(promo).to.deep.equal(mockPromo);
    });
  });

  describe("listPromotionCodes", () => {
    it("should list promotion codes with pagination", async () => {
      const mockPromos = [
        { promotion_id: "promo1", code: "SAVE10" },
        { promotion_id: "promo2", code: "SAVE20" },
      ];
      mockDb.prepare().bind().all.onCall(0).resolves({ results: mockPromos });
      mockDb.prepare().bind().first.onCall(0).resolves({ total: 2 });

      const result = await db.listPromotionCodes(
        { page: 1, limit: 20 },
        env,
      );
      expect(result.promotions).to.deep.equal(mockPromos);
      expect(result.total).to.equal(2);
    });

    it("should filter by status", async () => {
      const mockPromos = [{ promotion_id: "promo1", code: "SAVE10" }];
      mockDb.prepare().bind().all.onCall(0).resolves({ results: mockPromos });
      mockDb.prepare().bind().first.onCall(0).resolves({ total: 1 });

      const result = await db.listPromotionCodes(
        { page: 1, limit: 20, status: "active" },
        env,
      );
      expect(result.promotions).to.deep.equal(mockPromos);
    });

    it("should handle no status filter", async () => {
      const mockPromos = [{ promotion_id: "promo1", code: "SAVE10" }];
      mockDb.prepare().bind().all.onCall(0).resolves({ results: mockPromos });
      mockDb.prepare().bind().first.onCall(0).resolves({ total: 1 });

      const result = await db.listPromotionCodes(
        { page: 1, limit: 20, status: null },
        env,
      );
      expect(result.promotions).to.deep.equal(mockPromos);
    });

    it("should handle res?.results being undefined", async () => {
      mockDb.prepare().bind().all.onCall(0).resolves(null);
      mockDb.prepare().bind().first.onCall(0).resolves({ total: 0 });

      const result = await db.listPromotionCodes({ page: 1, limit: 20 }, env);
      expect(result.promotions).to.be.an("array");
      expect(result.promotions.length).to.equal(0);
    });

    it("should handle countRes?.total being undefined", async () => {
      mockDb.prepare().bind().all.onCall(0).resolves({ results: [] });
      mockDb.prepare().bind().first.onCall(0).resolves(null);

      const result = await db.listPromotionCodes({ page: 1, limit: 20 }, env);
      expect(result.total).to.equal(0);
    });
  });

  describe("createPromotionCode", () => {
    it("should create new promotion code", async () => {
      const promoData = {
        code: "SAVE10",
        name: "Save 10%",
        discount_type: "percentage",
        discount_value: 10,
        valid_from: new Date().toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      // Mock getPromotionCodeByCode (check if exists)
      mockDb.prepare().bind().first.onCall(0).resolves(null);
      // Mock INSERT
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true });
      // Mock getPromotionCodeById (return created)
      mockDb.prepare().bind().first.onCall(1).resolves({
        promotion_id: "promo1",
        ...promoData,
      });

      const promo = await db.createPromotionCode(promoData, "user123", env);
      expect(promo).to.exist;
    });

    it("should handle applicable_skus as array", async () => {
      const promoData = {
        code: "SAVE10",
        name: "Save 10%",
        discount_type: "percentage",
        discount_value: 10,
        valid_from: new Date().toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
        applicable_skus: ["sku1", "sku2"], // Array
      };

      mockDb.prepare().bind().first.onCall(0).resolves(null);
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true });
      mockDb.prepare().bind().first.onCall(1).resolves({
        promotion_id: "promo1",
        ...promoData,
      });

      const promo = await db.createPromotionCode(promoData, "user123", env);
      expect(promo).to.exist;
    });

    it("should handle applicable_skus as string", async () => {
      const promoData = {
        code: "SAVE10",
        name: "Save 10%",
        discount_type: "percentage",
        discount_value: 10,
        valid_from: new Date().toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
        applicable_skus: '["sku1"]', // String
      };

      mockDb.prepare().bind().first.onCall(0).resolves(null);
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true });
      mockDb.prepare().bind().first.onCall(1).resolves({
        promotion_id: "promo1",
        ...promoData,
      });

      const promo = await db.createPromotionCode(promoData, "user123", env);
      expect(promo).to.exist;
    });

    it("should throw error when code already exists", async () => {
      const promoData = {
        code: "SAVE10",
        name: "Save 10%",
        discount_type: "percentage",
        discount_value: 10,
        valid_from: new Date().toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      mockDb.prepare().bind().first.resolves({ code: "SAVE10" });

      try {
        await db.createPromotionCode(promoData, "user123", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("already exists");
      }
    });
  });

  describe("updatePromotionCode", () => {
    it("should update promotion code", async () => {
      const existing = {
        promotion_id: "promo1",
        code: "SAVE10",
        name: "Save 10%",
      };

      const updates = { name: "Save 15%" };

      // Mock getPromotionCodeById
      mockDb.prepare().bind().first.onCall(0).resolves(existing);
      // Mock UPDATE
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true });
      // Mock getPromotionCodeById (return updated)
      mockDb.prepare().bind().first.onCall(1).resolves({
        ...existing,
        ...updates,
      });

      const updated = await db.updatePromotionCode(
        "promo1",
        updates,
        "user123",
        env,
      );
      expect(updated.name).to.equal("Save 15%");
    });

    it("should handle applicable_skus update as array", async () => {
      const existing = {
        promotion_id: "promo1",
        code: "SAVE10",
      };

      const updates = { applicable_skus: ["sku1", "sku2"] };

      mockDb.prepare().bind().first.onCall(0).resolves(existing);
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true });
      mockDb.prepare().bind().first.onCall(1).resolves({
        ...existing,
        ...updates,
      });

      const updated = await db.updatePromotionCode(
        "promo1",
        updates,
        "user123",
        env,
      );
      expect(updated).to.exist;
    });

    it("should handle applicable_skus update as null", async () => {
      const existing = {
        promotion_id: "promo1",
        code: "SAVE10",
      };

      const updates = { applicable_skus: null };

      mockDb.prepare().bind().first.onCall(0).resolves(existing);
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true });
      mockDb.prepare().bind().first.onCall(1).resolves({
        ...existing,
        ...updates,
      });

      const updated = await db.updatePromotionCode(
        "promo1",
        updates,
        "user123",
        env,
      );
      expect(updated).to.exist;
    });

    it("should return existing when no fields to update", async () => {
      const existing = {
        promotion_id: "promo1",
        code: "SAVE10",
      };

      mockDb.prepare().bind().first.resolves(existing);

      const updated = await db.updatePromotionCode(
        "promo1",
        {}, // Empty updates
        "user123",
        env,
      );
      expect(updated).to.deep.equal(existing);
    });

    it("should throw error when promotion code not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      try {
        await db.updatePromotionCode(
          "promo1",
          { name: "New Name" },
          "user123",
          env,
        );
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.equal("Promotion code not found");
      }
    });
  });

  describe("deletePromotionCode", () => {
    it("should soft delete promotion code", async () => {
      const existing = {
        promotion_id: "promo1",
        code: "SAVE10",
      };

      mockDb.prepare().bind().first.resolves(existing);
      mockDb.prepare().bind().run.resolves({ success: true });

      const result = await db.deletePromotionCode("promo1", "user123", env);
      expect(result).to.be.true;
    });

    it("should throw error when promotion code not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      try {
        await db.deletePromotionCode("promo1", "user123", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.equal("Promotion code not found");
      }
    });
  });

  describe("incrementPromotionUsage", () => {
    it("should increment promotion usage count", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const result = await db.incrementPromotionUsage("SAVE10", env);
      expect(result).to.be.true;
    });
  });

  describe("calculateEffectivePrice", () => {
    it("should return sale price when available", () => {
      const priceData = {
        price: 100,
        sale_price: 80,
        currency: "USD",
      };

      const result = db.calculateEffectivePrice(priceData);
      expect(result.effective_price).to.equal(80);
      expect(result.original_price).to.equal(100);
      expect(result.sale_price).to.equal(80);
    });

    it("should return regular price when no sale price", () => {
      const priceData = {
        price: 100,
        sale_price: null,
        currency: "USD",
      };

      const result = db.calculateEffectivePrice(priceData);
      expect(result.effective_price).to.equal(100);
      expect(result.original_price).to.equal(100);
      expect(result.sale_price).to.be.null;
    });

    it("should return null when priceData is null", () => {
      const result = db.calculateEffectivePrice(null);
      expect(result).to.be.null;
    });

    it("should default currency to USD", () => {
      const priceData = {
        price: 100,
        sale_price: null,
      };

      const result = db.calculateEffectivePrice(priceData);
      expect(result.currency).to.equal("USD");
    });
  });
});

