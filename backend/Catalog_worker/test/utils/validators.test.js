// test/utils/validators.test.js
import { describe, it } from "mocha";
import { expect } from "chai";
import {
  validateProduct,
  validateProductUpdate,
  validateSku,
  validateProductsQuery,
  validateSearchQuery,
  validateHomePageQuery,
  validateProductId,
  validateImageId,
  validateSkuId,
  validateSkuAttributes,
} from "../../src/utils/validators.js";

describe("Validators", () => {
  describe("validateProduct", () => {
    it("should validate correct product data", () => {
      const product = {
        title: "Test Product",
        description: "Test description",
        category: "Electronics",
        status: "active",
      };
      const result = validateProduct(product);
      expect(result.error).to.be.undefined;
      expect(result.value.title).to.equal("Test Product");
    });

    it("should reject missing title", () => {
      const product = {
        description: "Test description",
      };
      const result = validateProduct(product);
      expect(result.error).to.exist;
    });

    it("should reject empty title", () => {
      const product = {
        title: "",
        description: "Test description",
      };
      const result = validateProduct(product);
      expect(result.error).to.exist;
    });

    it("should accept optional fields", () => {
      const product = {
        title: "Test Product",
        brand: "Test Brand",
        category: "Electronics",
        price: 99.99,
      };
      const result = validateProduct(product);
      expect(result.error).to.be.undefined;
    });

    it("should validate SKU array", () => {
      const product = {
        title: "Test Product",
        skus: [
          {
            attributes: { size: "L", color: "red" },
            price: 99.99,
          },
        ],
      };
      const result = validateProduct(product);
      expect(result.error).to.be.undefined;
    });
  });

  describe("validateProductUpdate", () => {
    it("should validate update with all fields optional", () => {
      const update = {
        title: "Updated Title",
      };
      const result = validateProductUpdate(update);
      expect(result.error).to.be.undefined;
    });

    it("should accept empty update", () => {
      const result = validateProductUpdate({});
      expect(result.error).to.be.null;
    });

    it("should validate partial update", () => {
      const update = {
        description: "Updated description",
      };
      const result = validateProductUpdate(update);
      expect(result.error).to.be.null;
    });
  });

  describe("validateSku", () => {
    it("should validate correct SKU data", () => {
      const sku = {
        product_id: "product-123",
        attributes: { size: "L", color: "red" },
      };
      const result = validateSku(sku);
      expect(result.error).to.be.undefined;
    });

    it("should reject missing product_id", () => {
      const sku = {
        attributes: { size: "L" },
      };
      const result = validateSku(sku);
      expect(result.error).to.exist;
    });

    it("should accept optional price fields", () => {
      const sku = {
        product_id: "product-123",
        price: 99.99,
        currency: "USD",
      };
      const result = validateSku(sku);
      expect(result.error).to.be.undefined;
    });
  });

  describe("validateProductsQuery", () => {
    it("should validate correct query params", () => {
      const query = {
        q: "test",
        category: "Electronics",
        page: 1,
        limit: 20,
      };
      const result = validateProductsQuery(query);
      expect(result.error).to.be.undefined;
    });

    it("should set default page and limit", () => {
      const query = {};
      const result = validateProductsQuery(query);
      expect(result.error).to.be.undefined;
      expect(result.value.page).to.equal(1);
      expect(result.value.limit).to.equal(20);
    });

    it("should reject invalid page number", () => {
      const query = { page: 0 };
      const result = validateProductsQuery(query);
      expect(result.error).to.exist;
    });

    it("should reject invalid limit", () => {
      const query = { limit: 200 }; // Over max
      const result = validateProductsQuery(query);
      expect(result.error).to.exist;
    });
  });

  describe("validateSearchQuery", () => {
    it("should validate correct search query", () => {
      const query = {
        q: "test keyword",
      };
      const result = validateSearchQuery(query);
      expect(result.error).to.be.undefined;
    });

    it("should reject missing q parameter", () => {
      const query = {};
      const result = validateSearchQuery(query);
      expect(result.error).to.exist;
    });

    it("should reject empty q parameter", () => {
      const query = { q: "" };
      const result = validateSearchQuery(query);
      expect(result.error).to.exist;
    });
  });

  describe("validateHomePageQuery", () => {
    it("should validate correct home page query", () => {
      const query = {
        categories: "Electronics,Toys",
        limit: 10,
      };
      const result = validateHomePageQuery(query);
      expect(result.error).to.be.undefined;
    });

    it("should set default limit", () => {
      const query = {};
      const result = validateHomePageQuery(query);
      expect(result.error).to.be.undefined;
      expect(result.value.limit).to.equal(10);
    });
  });

  describe("validateProductId", () => {
    it("should validate correct product ID", () => {
      const result = validateProductId("product-123");
      expect(result.error).to.be.undefined;
    });

    it("should reject empty product ID", () => {
      const result = validateProductId("");
      expect(result.error).to.exist;
    });

    it("should reject missing product ID", () => {
      const result = validateProductId(null);
      expect(result.error).to.exist;
    });

    it("should reject too long product ID", () => {
      const result = validateProductId("a".repeat(101));
      expect(result.error).to.exist;
    });
  });

  describe("validateImageId", () => {
    it("should validate correct image ID", () => {
      const result = validateImageId("image-123");
      expect(result.error).to.be.undefined;
    });

    it("should reject empty image ID", () => {
      const result = validateImageId("");
      expect(result.error).to.exist;
    });
  });

  describe("validateSkuId", () => {
    it("should validate correct SKU ID", () => {
      const result = validateSkuId("sku-123");
      expect(result.error).to.be.undefined;
    });

    it("should reject empty SKU ID", () => {
      const result = validateSkuId("");
      expect(result.error).to.exist;
    });
  });

  describe("validateSkuAttributes", () => {
    it("should validate correct attributes object", () => {
      const attributes = {
        size: "L",
        color: "red",
        material: "cotton",
      };
      const result = validateSkuAttributes(attributes);
      expect(result.error).to.be.undefined;
    });

    it("should validate attributes JSON string", () => {
      const attributes = JSON.stringify({ size: "L" });
      const result = validateSkuAttributes(attributes);
      expect(result.error).to.be.undefined;
    });

    it("should reject invalid JSON string", () => {
      const attributes = "{ invalid json }";
      const result = validateSkuAttributes(attributes);
      expect(result.error).to.exist;
    });

    it("should accept empty attributes", () => {
      const result = validateSkuAttributes({});
      expect(result.error).to.be.undefined;
    });
  });
});
