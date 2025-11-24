// test/utils/validators.test.js
import { describe, it } from "mocha";
import { expect } from "chai";
import * as validators from "../../src/utils/validators.js";

describe("Validators", () => {
  describe("validateSkuStock", () => {
    it("should validate valid SKU stock data", () => {
      const data = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        reserved_quantity: 10,
        available_quantity: 90,
        low_stock_threshold: 20,
        status: "active",
      };

      const result = validators.validateSkuStock(data);
      expect(result.error).to.be.undefined;
      expect(result.value).to.exist;
    });

    it("should reject missing required fields", () => {
      const data = {
        sku_id: "sku-1",
        // Missing product_id, sku_code, quantity
      };

      const result = validators.validateSkuStock(data);
      expect(result.error).to.exist;
    });

    it("should reject invalid status", () => {
      const data = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: 100,
        status: "invalid_status",
      };

      const result = validators.validateSkuStock(data);
      expect(result.error).to.exist;
    });

    it("should reject negative quantity", () => {
      const data = {
        sku_id: "sku-1",
        product_id: "prod-1",
        sku_code: "SKU001",
        quantity: -10,
      };

      const result = validators.validateSkuStock(data);
      expect(result.error).to.exist;
    });
  });

  describe("validateSkuStockUpdate", () => {
    it("should validate valid update data", () => {
      const data = {
        quantity: 150,
        reserved_quantity: 20,
        low_stock_threshold: 15,
        status: "active",
        reason: "Restock",
      };

      const result = validators.validateSkuStockUpdate(data);
      expect(result.error).to.be.oneOf([null, undefined]);
      expect(result.value).to.exist;
    });

    it("should allow partial updates", () => {
      const data = {
        quantity: 150,
      };

      const result = validators.validateSkuStockUpdate(data);
      expect(result.error).to.be.oneOf([null, undefined]);
    });

    it("should reject invalid status", () => {
      const data = {
        status: "invalid_status",
      };

      const result = validators.validateSkuStockUpdate(data);
      expect(result.error).to.exist;
    });
  });

  describe("validateStockAdjustment", () => {
    it("should validate valid adjustment", () => {
      const data = {
        quantity: 50,
        reason: "Restock",
        reservation_id: "reservation-1",
      };

      const result = validators.validateStockAdjustment(data);
      expect(result.error).to.be.undefined;
    });

    it("should allow negative quantity (for deductions)", () => {
      const data = {
        quantity: -10,
        reason: "Purchase",
      };

      const result = validators.validateStockAdjustment(data);
      expect(result.error).to.be.undefined;
    });

    it("should require quantity", () => {
      const data = {
        reason: "Restock",
      };

      const result = validators.validateStockAdjustment(data);
      expect(result.error).to.exist;
    });
  });

  describe("validateReserveStock", () => {
    it("should validate valid reservation", () => {
      const data = {
        quantity: 10,
        reservation_id: "reservation-1",
        expires_at: "2024-12-31T23:59:59Z",
      };

      const result = validators.validateReserveStock(data);
      expect(result.error).to.be.undefined;
    });

    it("should require quantity and reservation_id", () => {
      const data = {
        quantity: 10,
      };

      const result = validators.validateReserveStock(data);
      expect(result.error).to.exist;
    });

    it("should reject quantity less than 1", () => {
      const data = {
        quantity: 0,
        reservation_id: "reservation-1",
      };

      const result = validators.validateReserveStock(data);
      expect(result.error).to.exist;
    });
  });

  describe("validateReleaseStock", () => {
    it("should validate valid release", () => {
      const data = {
        reservation_id: "reservation-1",
        quantity: 10,
      };

      const result = validators.validateReleaseStock(data);
      expect(result.error).to.be.undefined;
    });

    it("should require reservation_id", () => {
      const data = {
        quantity: 10,
      };

      const result = validators.validateReleaseStock(data);
      expect(result.error).to.exist;
    });

    it("should allow quantity to be optional", () => {
      const data = {
        reservation_id: "reservation-1",
      };

      const result = validators.validateReleaseStock(data);
      expect(result.error).to.be.undefined;
    });
  });

  describe("validateCheckStock", () => {
    it("should validate valid check request", () => {
      const data = {
        sku_ids: ["sku-1", "sku-2", "sku-3"],
      };

      const result = validators.validateCheckStock(data);
      expect(result.error).to.be.undefined;
    });

    it("should require sku_ids array", () => {
      const data = {};

      const result = validators.validateCheckStock(data);
      expect(result.error).to.exist;
    });

    it("should require non-empty array", () => {
      const data = {
        sku_ids: [],
      };

      const result = validators.validateCheckStock(data);
      expect(result.error).to.exist;
    });

    it("should reject non-array", () => {
      const data = {
        sku_ids: "not-an-array",
      };

      const result = validators.validateCheckStock(data);
      expect(result.error).to.exist;
    });
  });

  describe("validateSkuId", () => {
    it("should validate valid SKU ID", () => {
      const result = validators.validateSkuId("sku-123");
      expect(result.error).to.be.undefined;
    });

    it("should reject empty SKU ID", () => {
      const result = validators.validateSkuId("");
      expect(result.error).to.exist;
    });

    it("should reject null SKU ID", () => {
      const result = validators.validateSkuId(null);
      expect(result.error).to.exist;
    });

    it("should reject SKU ID that is too long", () => {
      const longSkuId = "a".repeat(101);
      const result = validators.validateSkuId(longSkuId);
      expect(result.error).to.exist;
    });
  });
});
