// test/services/pricingService.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as pricingService from "../../src/services/pricingService.js";
// Removed db import - can't stub ES modules, will use env mocks
import { createMockEnv } from "../setup.js";

describe("Pricing Service", () => {
  let env;

  beforeEach(() => {
    env = createMockEnv();
    // Don't stub ES modules - services will use real db functions
    // Tests will mock via env.PRICING_DB instead
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getPrice", () => {
    it("should return price with effective price calculation", async () => {
      const mockPrice = {
        sku_id: "test-sku-id",
        price: 100,
        sale_price: 80,
        currency: "USD",
      };

      env.PRICING_DB.prepare().bind().first.resolves(mockPrice);

      const result = await pricingService.getPrice("test-sku-id", env);
      expect(result).to.exist;
      expect(result.effective_price).to.equal(80);
      expect(result.original_price).to.equal(100);
    });

    it("should return null when price not found", async () => {
      env.PRICING_DB.prepare().bind().first.resolves(null);

      const result = await pricingService.getPrice("test-sku-id", env);
      expect(result).to.be.null;
    });

    it("should handle database error", async () => {
      env.PRICING_DB.prepare()
        .bind()
        .first.rejects(new Error("Database error"));

      try {
        await pricingService.getPrice("test-sku-id", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Database error");
      }
    });
  });

  describe("getPrices", () => {
    it("should return prices for multiple SKUs", async () => {
      const mockPrices = [
        { sku_id: "sku1", price: 10, sale_price: null, currency: "USD" },
        { sku_id: "sku2", price: 20, sale_price: 15, currency: "USD" },
      ];

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });

      const result = await pricingService.getPrices(["sku1", "sku2"], env);
      expect(result).to.have.length(2);
      expect(result[0].effective_price).to.equal(10);
      expect(result[1].effective_price).to.equal(15);
    });

    it("should handle empty SKU list", async () => {
      const result = await pricingService.getPrices([], env);
      expect(result).to.be.an("array");
      expect(result.length).to.equal(0);
    });

    it("should handle database error", async () => {
      env.PRICING_DB.prepare().bind().all.rejects(new Error("Database error"));

      try {
        await pricingService.getPrices(["sku1"], env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Database error");
      }
    });
  });

  describe("getProductPricing", () => {
    it("should return all prices for a product", async () => {
      const mockPrices = [
        { sku_id: "sku1", product_id: "prod1", price: 10, currency: "USD" },
      ];

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });

      const result = await pricingService.getProductPricing("prod1", env);
      expect(result).to.have.length(1);
      expect(result[0].sku_id).to.equal("sku1");
    });

    it("should handle empty product prices", async () => {
      env.PRICING_DB.prepare().bind().all.resolves({ results: [] });

      const result = await pricingService.getProductPricing("prod1", env);
      expect(result).to.be.an("array");
      expect(result.length).to.equal(0);
    });

    it("should handle database error", async () => {
      env.PRICING_DB.prepare().bind().all.rejects(new Error("Database error"));

      try {
        await pricingService.getProductPricing("prod1", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("Database error");
      }
    });
  });

  describe("calculateGrandTotal", () => {
    it("should calculate total without promotion code", async () => {
      const items = [
        { sku_id: "sku1", quantity: 2 },
        { sku_id: "sku2", quantity: 1 },
      ];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 10,
          sale_price: null,
          currency: "USD",
        },
        {
          sku_id: "sku2",
          sku_code: "SKU2",
          price: 20,
          sale_price: null,
          currency: "USD",
        },
      ];

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });

      const result = await pricingService.calculateGrandTotal(
        items,
        null,
        "USD",
        env,
      );

      expect(result.subtotal).to.equal(40); // 2*10 + 1*20
      expect(result.discount).to.equal(0);
      expect(result.total).to.equal(40);
      expect(result.items).to.have.length(2);
    });

    it("should calculate total with percentage promotion code", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.subtotal).to.equal(100);
      expect(result.discount).to.equal(10); // 10% of 100
      expect(result.total).to.equal(90);
      expect(result.promotion).to.exist;
    });

    it("should calculate total with fixed amount promotion code", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE20",
        status: "active",
        discount_type: "fixed_amount",
        discount_value: 20,
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE20",
        "USD",
        env,
      );

      expect(result.subtotal).to.equal(100);
      expect(result.discount).to.equal(20);
      expect(result.total).to.equal(80);
    });

    it("should handle promotion code with max discount limit", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 1000,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE50",
        status: "active",
        discount_type: "percentage",
        discount_value: 50,
        min_purchase_amount: null,
        max_discount_amount: 200,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE50",
        "USD",
        env,
      );

      expect(result.subtotal).to.equal(1000);
      expect(result.discount).to.equal(200); // Capped at max_discount_amount
      expect(result.total).to.equal(800);
    });

    it("should handle promotion code with minimum purchase requirement", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 50,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: 100,
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.subtotal).to.equal(50);
      expect(result.discount).to.equal(0);
      expect(result.promotion_error).to.include("Minimum purchase");
    });

    it("should handle promotion code with usage limit", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: 10,
        usage_count: 10,
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(0);
      expect(result.promotion_error).to.include("usage limit");
    });

    it("should handle promotion code with applicable SKUs (string JSON)", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: JSON.stringify(["sku2", "sku3"]),
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(0);
      expect(result.promotion_error).to.include("does not apply");
    });

    it("should handle promotion code with applicable SKUs (array)", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: ["sku1"], // Already an array
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(10);
      expect(result.total).to.equal(90);
    });

    it("should handle promotion code with applicable_skus as JSON string", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: JSON.stringify(["sku1"]), // JSON string
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(10);
      expect(result.total).to.equal(90);
    });

    it("should handle promotion code with applicable_skus as invalid JSON string", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: "invalid-json{", // Invalid JSON string
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      // Should handle parse error gracefully and apply to all SKUs
      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(10);
    });

    it("should handle promotion code with empty applicable_skus array", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: JSON.stringify([]), // Empty array
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      // Empty array means applies to all
      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(10);
    });

    it("should skip items without price", async () => {
      const items = [
        { sku_id: "sku1", quantity: 1 },
        { sku_id: "sku2", quantity: 1 },
      ];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 10,
          sale_price: null,
          currency: "USD",
        },
        // sku2 price not found
      ];

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });

      const result = await pricingService.calculateGrandTotal(
        items,
        null,
        "USD",
        env,
      );

      expect(result.items).to.have.length(1);
      expect(result.subtotal).to.equal(10);
    });

    it("should handle sale prices in calculation", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: 80,
          currency: "USD",
        },
      ];

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });

      const result = await pricingService.calculateGrandTotal(
        items,
        null,
        "USD",
        env,
      );

      expect(result.items[0].unit_price).to.equal(80);
      expect(result.items[0].sale_price).to.equal(80);
      expect(result.subtotal).to.equal(80);
    });

    it("should handle promotion code that is expired", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      // getPromotionCode returns null for expired codes
      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(null);

      const result = await pricingService.calculateGrandTotal(
        items,
        "EXPIRED",
        "USD",
        env,
      );

      expect(result.discount).to.equal(0);
      expect(result.promotion_error).to.include("not found");
    });

    it("should handle promotion code that is inactive", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "inactive",
        discount_type: "percentage",
        discount_value: 10,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(0);
      expect(result.promotion_error).to.include("inactive");
    });

    it("should handle promotion code with invalid applicable_skus JSON", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: "invalid-json{", // Invalid JSON
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      // Should handle parse error gracefully and apply to all SKUs
      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(10);
    });

    it("should handle fixed amount discount exceeding subtotal", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 50,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE100",
        status: "active",
        discount_type: "fixed_amount",
        discount_value: 100, // More than subtotal
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE100",
        "USD",
        env,
      );

      expect(result.subtotal).to.equal(50);
      expect(result.discount).to.equal(50); // Capped at subtotal
      expect(result.total).to.equal(0);
    });

    it("should handle fixed amount discount not exceeding subtotal", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE20",
        status: "active",
        discount_type: "fixed_amount",
        discount_value: 20, // Less than subtotal
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE20",
        "USD",
        env,
      );

      expect(result.subtotal).to.equal(100);
      expect(result.discount).to.equal(20); // Not capped
      expect(result.total).to.equal(80);
    });

    it("should handle percentage discount with max_discount_amount", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 1000,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE50",
        status: "active",
        discount_type: "percentage",
        discount_value: 50, // 50% of 1000 = 500
        min_purchase_amount: null,
        max_discount_amount: 200, // But capped at 200
        usage_limit: null,
        usage_count: 0,
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE50",
        "USD",
        env,
      );

      expect(result.subtotal).to.equal(1000);
      expect(result.discount).to.equal(200); // Capped at max_discount_amount
      expect(result.total).to.equal(800);
    });

    it("should handle percentage discount without max_discount_amount", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE20",
        status: "active",
        discount_type: "percentage",
        discount_value: 20,
        min_purchase_amount: null,
        max_discount_amount: null, // No cap
        usage_limit: null,
        usage_count: 0,
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE20",
        "USD",
        env,
      );

      expect(result.subtotal).to.equal(100);
      expect(result.discount).to.equal(20); // 20% of 100
      expect(result.total).to.equal(80);
    });

    it("should handle percentage discount with max_discount_amount not exceeded", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10, // 10% of 100 = 10
        min_purchase_amount: null,
        max_discount_amount: 50, // Max is 50, discount is 10, so not exceeded
        usage_limit: null,
        usage_count: 0,
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(10); // Not capped
      expect(result.total).to.equal(90);
    });

    it("should handle promotion code lookup error", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare()
        .bind()
        .first.rejects(new Error("Database error"));

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(0);
      expect(result.promotion_error).to.include("Error processing");
    });

    it("should handle incrementPromotionUsage error gracefully", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.rejects(new Error("Update failed"));

      // Should still calculate discount even if usage increment fails
      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(10);
      expect(result.total).to.equal(90);
    });

    it("should handle promotion code with applicable SKUs matching", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: JSON.stringify(["sku1", "sku2"]), // sku1 is in the list
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(10);
      expect(result.total).to.equal(90);
    });

    it("should handle promotion code with no applicable_skus (applies to all)", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: null, // No restriction
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(10);
      expect(result.total).to.equal(90);
    });

    it("should handle promotion code with min_purchase_amount not met", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 50,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: 100, // Subtotal is 50, doesn't meet minimum
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(0);
      expect(result.promotion_error).to.include("Minimum purchase");
    });

    it("should handle promotion code with min_purchase_amount met", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 150,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: 100, // Subtotal is 150, meets minimum
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(15);
      expect(result.total).to.equal(135);
    });

    it("should handle promotion code with usage_limit reached", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: 10,
        usage_count: 10, // Reached limit
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(0);
      expect(result.promotion_error).to.include("usage limit");
    });

    it("should handle promotion code with usage_limit not reached", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: 10,
        usage_count: 5, // Not reached limit
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(10);
      expect(result.total).to.equal(90);
    });

    it("should handle promotion code with usage_limit not set (null)", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: null,
        max_discount_amount: null,
        usage_limit: null, // No limit
        usage_count: 100, // High count but no limit
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(10);
      expect(result.total).to.equal(90);
    });

    it("should handle promotion code with min_purchase_amount not set (null)", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 50,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10,
        min_purchase_amount: null, // No minimum
        max_discount_amount: null,
        usage_limit: null,
        usage_count: 0,
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(5);
      expect(result.total).to.equal(45);
    });

    it("should handle percentage discount with max_discount_amount not exceeded", async () => {
      const items = [{ sku_id: "sku1", quantity: 1 }];

      const mockPrices = [
        {
          sku_id: "sku1",
          sku_code: "SKU1",
          price: 100,
          sale_price: null,
          currency: "USD",
        },
      ];

      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        status: "active",
        discount_type: "percentage",
        discount_value: 10, // 10% of 100 = 10
        min_purchase_amount: null,
        max_discount_amount: 50, // Max is 50, discount is 10, so not exceeded
        usage_limit: null,
        usage_count: 0,
        applicable_skus: null,
        valid_from: new Date(Date.now() - 86400000).toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockPrices });
      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.calculateGrandTotal(
        items,
        "SAVE10",
        "USD",
        env,
      );

      expect(result.discount).to.equal(10); // Not capped
      expect(result.total).to.equal(90);
    });
  });

  describe("updatePrice", () => {
    it("should update SKU price", async () => {
      const existingPrice = {
        sku_id: "test-sku-id",
        product_id: "test-product-id",
        sku_code: "TEST-SKU",
        price: 29.99,
        currency: "USD",
      };

      const mockUpdated = {
        sku_id: "test-sku-id",
        price: 39.99,
        currency: "USD",
      };

      env.PRICING_DB.prepare().bind().first.onCall(0).resolves(existingPrice);
      env.PRICING_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PRICING_DB.prepare().bind().run.onCall(1).resolves({ success: true });
      env.PRICING_DB.prepare().bind().first.onCall(1).resolves(mockUpdated);

      const result = await pricingService.updatePrice(
        "test-sku-id",
        { price: 39.99 },
        "user123",
        env,
      );
      expect(result).to.deep.equal(mockUpdated);
    });

    it("should handle error when updating non-existent price", async () => {
      env.PRICING_DB.prepare().bind().first.resolves(null);

      try {
        await pricingService.updatePrice(
          "test-sku-id",
          { price: 39.99 },
          "user123",
          env,
        );
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });
  });

  describe("deletePrice", () => {
    it("should delete SKU price", async () => {
      const existingPrice = {
        sku_id: "test-sku-id",
        product_id: "test-product-id",
        sku_code: "TEST-SKU",
        price: 29.99,
        currency: "USD",
      };

      // Mock: getSkuPrice, update (soft delete), history insert
      env.PRICING_DB.prepare().bind().first.resolves(existingPrice);
      env.PRICING_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.PRICING_DB.prepare().bind().run.onCall(1).resolves({ success: true });

      const result = await pricingService.deletePrice(
        "test-sku-id",
        "user123",
        env,
      );
      expect(result).to.be.true;
    });

    it("should handle error when deleting non-existent price", async () => {
      env.PRICING_DB.prepare().bind().first.resolves(null);

      try {
        await pricingService.deletePrice("test-sku-id", "user123", env);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });
  });

  describe("getHistory", () => {
    it("should return price history", async () => {
      const mockHistory = [
        {
          history_id: "hist1",
          sku_id: "test-sku-id",
          price: 29.99,
          change_type: "update",
        },
      ];

      env.PRICING_DB.prepare().bind().all.resolves({ results: mockHistory });

      const result = await pricingService.getHistory(
        "test-sku-id",
        { page: 1, limit: 20 },
        env,
      );
      expect(result).to.deep.equal(mockHistory);
    });
  });

  describe("getPromotionCodeService", () => {
    it("should return promotion code by ID", async () => {
      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        applicable_skus: JSON.stringify(["sku1", "sku2"]),
      };

      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);

      const result = await pricingService.getPromotionCodeService(
        "promo1",
        env,
      );
      expect(result).to.exist;
      expect(Array.isArray(result.applicable_skus)).to.be.true;
    });

    it("should return null when promotion not found", async () => {
      env.PRICING_DB.prepare().bind().first.resolves(null);

      const result = await pricingService.getPromotionCodeService(
        "promo1",
        env,
      );
      expect(result).to.be.null;
    });

    it("should handle promotion code with invalid JSON in applicable_skus", async () => {
      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        applicable_skus: "invalid-json{",
      };

      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);

      const result = await pricingService.getPromotionCodeService(
        "promo1",
        env,
      );
      expect(result).to.exist;
      // Should keep as string if parsing fails
      expect(typeof result.applicable_skus).to.equal("string");
    });

    it("should handle promotion code without applicable_skus", async () => {
      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        applicable_skus: null,
      };

      env.PRICING_DB.prepare().bind().first.resolves(mockPromo);

      const result = await pricingService.getPromotionCodeService(
        "promo1",
        env,
      );
      expect(result).to.exist;
      expect(result.applicable_skus).to.be.null;
    });
  });

  describe("createPromotionCodeService", () => {
    it("should create promotion code", async () => {
      const promoData = {
        code: "SAVE10",
        name: "Save 10%",
        discount_type: "percentage",
        discount_value: 10,
        valid_from: new Date().toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      env.PRICING_DB.prepare().bind().first.onCall(0).resolves(null);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });
      env.PRICING_DB.prepare()
        .bind()
        .first.onCall(1)
        .resolves({
          promotion_id: "promo1",
          ...promoData,
        });

      const result = await pricingService.createPromotionCodeService(
        promoData,
        "user123",
        env,
      );
      expect(result).to.exist;
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

      // Mock: code already exists
      env.PRICING_DB.prepare().bind().first.resolves({ code: "SAVE10" });

      try {
        await pricingService.createPromotionCodeService(
          promoData,
          "user123",
          env,
        );
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("already exists");
      }
    });
  });

  describe("deletePromotionCodeService", () => {
    it("should delete promotion code", async () => {
      const existing = {
        promotion_id: "promo1",
        code: "SAVE10",
      };

      env.PRICING_DB.prepare().bind().first.resolves(existing);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.deletePromotionCodeService(
        "promo1",
        "user123",
        env,
      );
      expect(result).to.be.true;
    });

    it("should handle error when promotion code not found", async () => {
      env.PRICING_DB.prepare().bind().first.resolves(null);

      try {
        await pricingService.deletePromotionCodeService(
          "promo1",
          "user123",
          env,
        );
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });
  });

  describe("listPromotionCodesService", () => {
    it("should list promotion codes", async () => {
      const mockResult = {
        promotions: [
          {
            promotion_id: "promo1",
            code: "SAVE10",
            applicable_skus: JSON.stringify(["sku1"]),
          },
        ],
        page: 1,
        limit: 20,
        total: 1,
      };

      env.PRICING_DB.prepare()
        .bind()
        .all.onCall(0)
        .resolves({ results: mockResult.promotions });

      const result = await pricingService.listPromotionCodesService(
        { page: 1, limit: 20 },
        env,
      );
      expect(result.promotions).to.have.length(1);
      expect(Array.isArray(result.promotions[0].applicable_skus)).to.be.true;
    });
  });

  describe("createPromotionCodeService", () => {
    it("should create promotion code", async () => {
      const promoData = {
        code: "SAVE10",
        name: "Save 10%",
        discount_type: "percentage",
        discount_value: 10,
        valid_from: new Date().toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      const mockPromo = {
        promotion_id: "promo1",
        ...promoData,
        applicable_skus: null,
      };

      env.PRICING_DB.prepare().bind().first.onCall(0).resolves(null);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });
      env.PRICING_DB.prepare().bind().first.onCall(1).resolves(mockPromo);

      const result = await pricingService.createPromotionCodeService(
        promoData,
        "user123",
        env,
      );
      expect(result).to.exist;
      expect(result.code).to.equal("SAVE10");
    });

    it("should handle applicable_skus as string in createPromotionCodeService", async () => {
      const promoData = {
        code: "SAVE10",
        name: "Save 10%",
        discount_type: "percentage",
        discount_value: 10,
        valid_from: new Date().toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      const mockPromo = {
        promotion_id: "promo1",
        ...promoData,
        applicable_skus: JSON.stringify(["sku1"]), // String JSON
      };

      env.PRICING_DB.prepare().bind().first.onCall(0).resolves(null);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });
      env.PRICING_DB.prepare().bind().first.onCall(1).resolves(mockPromo);

      const result = await pricingService.createPromotionCodeService(
        promoData,
        "user123",
        env,
      );
      expect(result).to.exist;
      // Should parse applicable_skus from string to array
      expect(Array.isArray(result.applicable_skus)).to.be.true;
    });

    it("should handle invalid JSON in applicable_skus in createPromotionCodeService", async () => {
      const promoData = {
        code: "SAVE10",
        name: "Save 10%",
        discount_type: "percentage",
        discount_value: 10,
        valid_from: new Date().toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };

      const mockPromo = {
        promotion_id: "promo1",
        ...promoData,
        applicable_skus: "invalid-json{", // Invalid JSON
      };

      env.PRICING_DB.prepare().bind().first.onCall(0).resolves(null);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });
      env.PRICING_DB.prepare().bind().first.onCall(1).resolves(mockPromo);

      const result = await pricingService.createPromotionCodeService(
        promoData,
        "user123",
        env,
      );
      expect(result).to.exist;
      // Should keep as string if parsing fails
      expect(typeof result.applicable_skus).to.equal("string");
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

      // Mock: code already exists
      env.PRICING_DB.prepare().bind().first.resolves({ code: "SAVE10" });

      try {
        await pricingService.createPromotionCodeService(
          promoData,
          "user123",
          env,
        );
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("already exists");
      }
    });
  });

  describe("updatePromotionCodeService", () => {
    it("should update promotion code", async () => {
      const existing = {
        promotion_id: "promo1",
        code: "SAVE10",
        name: "Old Name",
      };

      const updates = { name: "New Name" };
      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        name: "New Name",
      };

      // Mock: get by id (existing), update, get by id again (updated)
      env.PRICING_DB.prepare().bind().first.onCall(0).resolves(existing);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });
      env.PRICING_DB.prepare().bind().first.onCall(1).resolves(mockPromo);

      const result = await pricingService.updatePromotionCodeService(
        "promo1",
        updates,
        "user123",
        env,
      );
      expect(result.name).to.equal("New Name");
    });

    it("should handle error when promotion code not found", async () => {
      env.PRICING_DB.prepare().bind().first.resolves(null);

      try {
        await pricingService.updatePromotionCodeService(
          "promo1",
          { name: "New Name" },
          "user123",
          env,
        );
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });

    it("should handle applicable_skus as string in updatePromotionCodeService", async () => {
      const existing = {
        promotion_id: "promo1",
        code: "SAVE10",
      };

      const updates = { name: "New Name" };
      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        name: "New Name",
        applicable_skus: JSON.stringify(["sku1"]), // String JSON
      };

      env.PRICING_DB.prepare().bind().first.onCall(0).resolves(existing);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });
      env.PRICING_DB.prepare().bind().first.onCall(1).resolves(mockPromo);

      const result = await pricingService.updatePromotionCodeService(
        "promo1",
        updates,
        "user123",
        env,
      );
      expect(result).to.exist;
      // Should parse applicable_skus from string to array
      expect(Array.isArray(result.applicable_skus)).to.be.true;
    });

    it("should handle invalid JSON in applicable_skus in updatePromotionCodeService", async () => {
      const existing = {
        promotion_id: "promo1",
        code: "SAVE10",
      };

      const updates = { name: "New Name" };
      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        name: "New Name",
        applicable_skus: "invalid-json{", // Invalid JSON
      };

      env.PRICING_DB.prepare().bind().first.onCall(0).resolves(existing);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });
      env.PRICING_DB.prepare().bind().first.onCall(1).resolves(mockPromo);

      const result = await pricingService.updatePromotionCodeService(
        "promo1",
        updates,
        "user123",
        env,
      );
      expect(result).to.exist;
      // Should keep as string if parsing fails
      expect(typeof result.applicable_skus).to.equal("string");
    });

    it("should handle applicable_skus as null in updatePromotionCodeService", async () => {
      const existing = {
        promotion_id: "promo1",
        code: "SAVE10",
      };

      const updates = { name: "New Name" };
      const mockPromo = {
        promotion_id: "promo1",
        code: "SAVE10",
        name: "New Name",
        applicable_skus: null,
      };

      env.PRICING_DB.prepare().bind().first.onCall(0).resolves(existing);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });
      env.PRICING_DB.prepare().bind().first.onCall(1).resolves(mockPromo);

      const result = await pricingService.updatePromotionCodeService(
        "promo1",
        updates,
        "user123",
        env,
      );
      expect(result).to.exist;
      expect(result.applicable_skus).to.be.null;
    });
  });

  describe("deletePromotionCodeService", () => {
    it("should delete promotion code", async () => {
      const existing = {
        promotion_id: "promo1",
        code: "SAVE10",
      };

      // Mock: get by id, update (soft delete)
      env.PRICING_DB.prepare().bind().first.resolves(existing);
      env.PRICING_DB.prepare().bind().run.resolves({ success: true });

      const result = await pricingService.deletePromotionCodeService(
        "promo1",
        "user123",
        env,
      );
      expect(result).to.be.true;
    });

    it("should handle error when promotion code not found", async () => {
      env.PRICING_DB.prepare().bind().first.resolves(null);

      try {
        await pricingService.deletePromotionCodeService(
          "promo1",
          "user123",
          env,
        );
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.message).to.include("not found");
      }
    });
  });
});
