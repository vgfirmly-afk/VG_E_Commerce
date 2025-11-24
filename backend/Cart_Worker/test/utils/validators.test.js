// test/utils/validators.test.js
import { describe, it } from "mocha";
import {
  validateAddItem,
  validateUpdateQuantity,
  validateCartId,
  validateItemId,
  validateSkuId,
} from "../../src/utils/validators.js";

describe("Validators", () => {
  describe("validateAddItem", () => {
    it("should validate correct add item data", () => {
      const data = {
        sku_id: "sku-123",
        quantity: 2,
      };
      const result = validateAddItem(data);
      expect(result.error).to.be.undefined;
      expect(result.value.sku_id).to.equal("sku-123");
      expect(result.value.quantity).to.equal(2);
    });

    it("should reject missing sku_id", () => {
      const data = {
        quantity: 2,
      };
      const result = validateAddItem(data);
      expect(result.error).to.exist;
    });

    it("should reject missing quantity", () => {
      const data = {
        sku_id: "sku-123",
      };
      const result = validateAddItem(data);
      expect(result.error).to.exist;
    });

    it("should reject empty sku_id", () => {
      const data = {
        sku_id: "",
        quantity: 2,
      };
      const result = validateAddItem(data);
      expect(result.error).to.exist;
    });

    it("should reject invalid quantity (negative)", () => {
      const data = {
        sku_id: "sku-123",
        quantity: -1,
      };
      const result = validateAddItem(data);
      expect(result.error).to.exist;
    });

    it("should reject invalid quantity (zero)", () => {
      const data = {
        sku_id: "sku-123",
        quantity: 0,
      };
      const result = validateAddItem(data);
      expect(result.error).to.exist;
    });

    it("should reject quantity over max", () => {
      const data = {
        sku_id: "sku-123",
        quantity: 1000,
      };
      const result = validateAddItem(data);
      expect(result.error).to.exist;
    });

    it("should reject non-integer quantity", () => {
      const data = {
        sku_id: "sku-123",
        quantity: 1.5,
      };
      const result = validateAddItem(data);
      expect(result.error).to.exist;
    });
  });

  describe("validateUpdateQuantity", () => {
    it("should validate with absolute quantity", () => {
      const data = {
        quantity: 5,
      };
      const result = validateUpdateQuantity(data);
      expect(result.error).to.be.undefined;
      expect(result.value.quantity).to.equal(5);
    });

    it("should validate with delta", () => {
      const data = {
        delta: 2,
      };
      const result = validateUpdateQuantity(data);
      expect(result.error).to.be.undefined;
      expect(result.value.delta).to.equal(2);
    });

    it("should validate with negative delta", () => {
      const data = {
        delta: -1,
      };
      const result = validateUpdateQuantity(data);
      expect(result.error).to.be.undefined;
      expect(result.value.delta).to.equal(-1);
    });

    it("should validate with quantity zero (remove item)", () => {
      const data = {
        quantity: 0,
      };
      const result = validateUpdateQuantity(data);
      expect(result.error).to.be.undefined;
      expect(result.value.quantity).to.equal(0);
    });

    it("should reject when both quantity and delta are missing", () => {
      const data = {};
      const result = validateUpdateQuantity(data);
      expect(result.error).to.exist;
    });

    it("should reject quantity over max", () => {
      const data = {
        quantity: 1000,
      };
      const result = validateUpdateQuantity(data);
      expect(result.error).to.exist;
    });

    it("should reject negative quantity", () => {
      const data = {
        quantity: -1,
      };
      const result = validateUpdateQuantity(data);
      expect(result.error).to.exist;
    });

    it("should accept both quantity and delta (service will handle)", () => {
      const data = {
        quantity: 5,
        delta: 2,
      };
      const result = validateUpdateQuantity(data);
      expect(result.error).to.be.undefined;
    });
  });

  describe("validateCartId", () => {
    it("should validate correct cart ID", () => {
      const result = validateCartId("cart-123");
      expect(result.error).to.be.undefined;
      expect(result.value).to.equal("cart-123");
    });

    it("should reject empty cart ID", () => {
      const result = validateCartId("");
      expect(result.error).to.exist;
    });

    it("should reject null cart ID", () => {
      const result = validateCartId(null);
      expect(result.error).to.exist;
    });

    it("should reject undefined cart ID", () => {
      const result = validateCartId(undefined);
      expect(result.error).to.exist;
    });

    it("should reject too long cart ID", () => {
      const result = validateCartId("a".repeat(101));
      expect(result.error).to.exist;
    });
  });

  describe("validateItemId", () => {
    it("should validate correct item ID", () => {
      const result = validateItemId("item-123");
      expect(result.error).to.be.undefined;
      expect(result.value).to.equal("item-123");
    });

    it("should reject empty item ID", () => {
      const result = validateItemId("");
      expect(result.error).to.exist;
    });

    it("should reject null item ID", () => {
      const result = validateItemId(null);
      expect(result.error).to.exist;
    });

    it("should reject too long item ID", () => {
      const result = validateItemId("a".repeat(101));
      expect(result.error).to.exist;
    });
  });

  describe("validateSkuId", () => {
    it("should validate correct SKU ID", () => {
      const result = validateSkuId("sku-123");
      expect(result.error).to.be.undefined;
      expect(result.value).to.equal("sku-123");
    });

    it("should reject empty SKU ID", () => {
      const result = validateSkuId("");
      expect(result.error).to.exist;
    });

    it("should reject null SKU ID", () => {
      const result = validateSkuId(null);
      expect(result.error).to.exist;
    });

    it("should reject too long SKU ID", () => {
      const result = validateSkuId("a".repeat(101));
      expect(result.error).to.exist;
    });
  });
});
