// test/utils/validators.test.js
import { describe, it } from "mocha";
import { expect } from "chai";
import * as validators from "../../src/utils/validators.js";

describe("Validators", () => {
  describe("validateSkuId", () => {
    it("should validate valid SKU ID", () => {
      const result = validators.validateSkuId("test-sku-id");
      expect(result.error).to.be.undefined;
      expect(result.value).to.equal("test-sku-id");
    });

    it("should reject empty SKU ID", () => {
      const result = validators.validateSkuId("");
      expect(result.error).to.exist;
    });

    it("should reject SKU ID that is too long", () => {
      const longId = "a".repeat(101);
      const result = validators.validateSkuId(longId);
      expect(result.error).to.exist;
    });
  });

  describe("validateSkuPriceUpdate", () => {
    it("should validate valid price update", () => {
      const data = {
        price: 29.99,
        currency: "USD",
        sale_price: 24.99,
      };
      const result = validators.validateSkuPriceUpdate(data);
      expect(result.error).to.satisfy(
        (err) => err === null || err === undefined,
      );
    });

    it("should allow all fields to be optional", () => {
      const data = {};
      const result = validators.validateSkuPriceUpdate(data);
      expect(result.error).to.satisfy(
        (err) => err === null || err === undefined,
      );
    });

    it("should reject negative price", () => {
      const data = { price: -10 };
      const result = validators.validateSkuPriceUpdate(data);
      expect(result.error).to.exist;
    });

    it("should reject invalid currency", () => {
      const data = { currency: "INVALID" };
      const result = validators.validateSkuPriceUpdate(data);
      expect(result.error).to.exist;
    });
  });

  describe("validateCalculateTotal", () => {
    it("should validate valid calculate total request", () => {
      const data = {
        items: [
          { sku_id: "sku1", quantity: 2 },
          { sku_id: "sku2", quantity: 1 },
        ],
        currency: "USD",
      };
      const result = validators.validateCalculateTotal(data);
      expect(result.error).to.be.undefined;
    });

    it("should reject empty items array", () => {
      const data = {
        items: [],
        currency: "USD",
      };
      const result = validators.validateCalculateTotal(data);
      expect(result.error).to.exist;
    });

    it("should reject invalid item structure", () => {
      const data = {
        items: [{ sku_id: "sku1" }], // missing quantity
        currency: "USD",
      };
      const result = validators.validateCalculateTotal(data);
      expect(result.error).to.exist;
    });

    it("should allow optional promotion code", () => {
      const data = {
        items: [{ sku_id: "sku1", quantity: 1 }],
        promotion_code: "SAVE10",
      };
      const result = validators.validateCalculateTotal(data);
      expect(result.error).to.be.undefined;
    });
  });

  describe("validatePriceHistoryQuery", () => {
    it("should validate valid query parameters", () => {
      const params = {
        sku_id: "test-sku-id",
        page: 1,
        limit: 20,
      };
      const result = validators.validatePriceHistoryQuery(params);
      expect(result.error).to.be.undefined;
    });

    it("should reject invalid page number", () => {
      const params = {
        sku_id: "test-sku-id",
        page: 0,
        limit: 20,
      };
      const result = validators.validatePriceHistoryQuery(params);
      expect(result.error).to.exist;
    });

    it("should reject invalid limit", () => {
      const params = {
        sku_id: "test-sku-id",
        page: 1,
        limit: 200, // too large
      };
      const result = validators.validatePriceHistoryQuery(params);
      expect(result.error).to.exist;
    });
  });

  describe("validatePromotionCodeCreate", () => {
    it("should validate valid promotion code", () => {
      const data = {
        code: "SAVE10",
        name: "Save 10%",
        discount_type: "percentage",
        discount_value: 10,
        valid_from: new Date().toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };
      const result = validators.validatePromotionCodeCreate(data);
      expect(result.error).to.be.undefined;
    });

    it("should reject missing required fields", () => {
      const data = {
        code: "SAVE10",
        // missing name, discount_type, etc.
      };
      const result = validators.validatePromotionCodeCreate(data);
      expect(result.error).to.exist;
    });

    it("should reject invalid discount type", () => {
      const data = {
        code: "SAVE10",
        name: "Save 10%",
        discount_type: "invalid",
        discount_value: 10,
        valid_from: new Date().toISOString(),
        valid_to: new Date(Date.now() + 86400000).toISOString(),
      };
      const result = validators.validatePromotionCodeCreate(data);
      expect(result.error).to.exist;
    });
  });

  describe("validatePromotionCodeUpdate", () => {
    it("should validate valid update", () => {
      const data = {
        name: "New Name",
        discount_value: 15,
      };
      const result = validators.validatePromotionCodeUpdate(data);
      expect(result.error).to.satisfy(
        (err) => err === null || err === undefined,
      );
    });

    it("should allow all fields to be optional", () => {
      const data = {};
      const result = validators.validatePromotionCodeUpdate(data);
      expect(result.error).to.satisfy(
        (err) => err === null || err === undefined,
      );
    });

    it("should reject invalid status", () => {
      const data = {
        status: "invalid",
      };
      const result = validators.validatePromotionCodeUpdate(data);
      expect(result.error).to.exist;
    });
  });

  describe("validatePromotionCodeListQuery", () => {
    it("should validate valid query parameters", () => {
      const params = {
        page: 1,
        limit: 20,
        status: "active",
      };
      const result = validators.validatePromotionCodeListQuery(params);
      expect(result.error).to.be.undefined;
    });

    it("should allow null status", () => {
      const params = {
        page: 1,
        limit: 20,
        status: null,
      };
      const result = validators.validatePromotionCodeListQuery(params);
      expect(result.error).to.be.undefined;
    });
  });
});
