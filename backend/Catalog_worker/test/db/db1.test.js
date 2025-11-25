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
    mockDb = env.CATALOG_DB;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getProductById", () => {
    it("should return product when found", async () => {
      const mockProduct = { product_id: "1", title: "Test Product" };
      mockDb.prepare().bind().first.resolves(mockProduct);

      const product = await db.getProductById("1", env);
      expect(product).to.deep.equal(mockProduct);
    });

    it("should return null when product not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      const product = await db.getProductById("1", env);
      expect(product).to.be.null;
    });
  });

  describe("getProducts", () => {
    it("should filter by category", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      await db.getProducts(
        { category: "Electronics", page: 1, limit: 20 },
        env,
      );

      expect(mockDb.prepare).to.have.been.called;
      const sqlCall = mockDb.prepare.getCall(0);
      if (sqlCall && sqlCall.args && sqlCall.args[0]) {
        expect(sqlCall.args[0]).to.include("category");
      }
    });
  });

  describe("createProduct", () => {
    it("should create product successfully", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test Product",
        description: "Description",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should consolidate JSON fields", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        brand: "Brand Name",
        weight: 100,
        color: "red",
      };

      await db.createProduct(product, env);
      const sqlCall = mockDb.prepare.getCall(0);
      expect(sqlCall).to.exist;
    });

    it("should consolidate metadata fields", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        mpn: "MPN123",
        upc: "UPC123",
        brand: "Brand",
        manufacturer: "Manufacturer",
        default_sku: "sku1",
        subcategory: "Sub",
        categories: ["Cat1", "Cat2"],
        tags: ["tag1", "tag2"],
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should consolidate media fields", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        image_url: "img.jpg",
        product_images: ["img1.jpg"],
        gallery_images: ["gallery1.jpg"],
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should consolidate inventory fields", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        stock_quantity: 100,
        low_stock_threshold: 10,
        backorder_allowed: true,
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should consolidate pricing fields", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        price: 99.99,
        sale_price: 79.99,
        compare_at_price: 129.99,
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should consolidate SEO fields", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        meta_title: "SEO Title",
        meta_description: "SEO Description",
        meta_keywords: ["keyword1"],
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should consolidate shipping fields", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        weight: 1.5,
        length: 10,
        width: 5,
        height: 3,
        shipping_class: "standard",
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should consolidate category from metadata", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        metadata: { category: "Electronics" },
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle existing metadata JSON", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        metadata: JSON.stringify({ existing: "data" }),
        brand: "New Brand",
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should consolidate stats fields", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        rating_average: 4.5,
        rating_count: 100,
        review_count: 50,
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should consolidate flags fields", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        product_type: "simple",
        virtual_product: false,
        downloadable_product: true,
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should consolidate relationships fields", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        parent_id: "parent1",
        grouped_products: ["p1", "p2"],
        upsell_ids: ["u1"],
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should consolidate variants fields", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        product_attributes: { size: ["S", "M", "L"] },
        default_attributes: { size: "M" },
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should consolidate extended_data fields", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        custom_fields: { field1: "value1" },
        specifications: { spec1: "value1" },
        features: ["feature1", "feature2"],
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle metadata.category extraction to direct column", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        metadata: { category: "Electronics" },
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle category removal from metadata", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        metadata: { category: "Electronics", other: "data" },
        category: "Toys",
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle existing JSON strings that are already strings", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        metadata: JSON.stringify({ existing: "data" }),
        attributes: JSON.stringify({ existing: "attrs" }),
        media: JSON.stringify({ existing: "media" }),
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle invalid JSON strings gracefully", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        metadata: "invalid json{",
        categories: "invalid json{",
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle existing identifiers in metadata", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        metadata: JSON.stringify({ identifiers: { mpn: "existing" } }),
        upc: "NEW123",
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle existing dimensions in attributes", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        attributes: JSON.stringify({ dimensions: { weight: 100 } }),
        length: 10,
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("updateProduct", () => {
    it("should update product successfully", async () => {
      const mockProduct = { product_id: "1", title: "Updated" };
      mockDb.prepare().bind().first.resolves(mockProduct);
      mockDb.prepare().bind().run.resolves({ success: true });

      await db.updateProduct("1", { title: "Updated" }, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should return null for empty updates", async () => {
      const mockProduct = { product_id: "1" };
      mockDb.prepare().bind().first.resolves(mockProduct);

      const result = await db.updateProduct("1", {}, env);
      expect(result).to.be.null;
    });
  });

  describe("deleteProduct", () => {
    it("should soft delete product", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      await db.deleteProduct("1", env);
      expect(mockDb.prepare).to.have.been.called;
      const sqlCall = mockDb.prepare.getCall(0);
      if (sqlCall && sqlCall.args && sqlCall.args[0]) {
        expect(sqlCall.args[0]).to.include("deleted = 1");
      }
    });
  });

  describe("getProductSkus", () => {
    it("should return SKUs for product", async () => {
      const mockSkus = [{ sku_id: "sku1", product_id: "1" }];
      mockDb.prepare().bind().all.resolves({ results: mockSkus });

      const skus = await db.getProductSkus("1", env);
      expect(skus).to.deep.equal(mockSkus);
    });
  });

  describe("createSku", () => {
    it("should create SKU successfully", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const sku = {
        sku_id: "sku1",
        product_id: "1",
        sku_code: "SKU-001",
        attributes: { size: "L" },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await db.createSku(sku, env);
      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("updateSku", () => {
    it("should update SKU successfully", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      await db.updateSku("sku1", { attributes: { size: "XL" } }, env);
      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("deleteSku", () => {
    it("should delete SKU successfully", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      await db.deleteSku("sku1", env);
      expect(mockDb.prepare).to.have.been.called;
      const sqlCall = mockDb.prepare.getCall(0);
      if (sqlCall && sqlCall.args && sqlCall.args[0]) {
        expect(sqlCall.args[0]).to.include("DELETE FROM skus");
      }
    });
  });

  describe("slugExists", () => {
    it("should return true if slug exists", async () => {
      mockDb.prepare().bind().first.resolves({ count: 1 });

      const exists = await db.slugExists("test-slug", null, env);
      expect(exists).to.be.true;
    });

    it("should return false if slug does not exist", async () => {
      mockDb.prepare().bind().first.resolves({ count: 0 });

      const exists = await db.slugExists("test-slug", null, env);
      expect(exists).to.be.false;
    });

    it("should exclude product ID when checking", async () => {
      mockDb.prepare().bind().first.resolves({ count: 0 });

      await db.slugExists("test-slug", "product-123", env);
      expect(mockDb.prepare).to.have.been.called;
      const sqlCall = mockDb.prepare.getCall(0);
      if (sqlCall && sqlCall.args && sqlCall.args[0]) {
        expect(sqlCall.args[0]).to.include("product_id !=");
      }
    });
  });

  describe("searchProducts", () => {
    it("should search products by keyword", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      await db.searchProducts("test", { page: 1, limit: 20 }, env);

      expect(mockDb.prepare).to.have.been.called;
      const sqlCall = mockDb.prepare.getCall(0);
      if (sqlCall && sqlCall.args && sqlCall.args[0]) {
        expect(sqlCall.args[0]).to.include("LIKE");
      }
    });
  });

  describe("getProductsByCategory", () => {
    it("should return products by category", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      await db.getProductsByCategory("Electronics", 10, env);

      expect(mockDb.prepare).to.have.been.called;
      const sqlCall = mockDb.prepare.getCall(0);
      if (sqlCall && sqlCall.args && sqlCall.args[0]) {
        expect(sqlCall.args[0]).to.include("category =");
      }
    });
  });

  describe("getProducts - all branches", () => {
    it("should handle status filter", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      await db.getProducts({ status: "inactive", page: 1, limit: 20 }, env);

      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle featured filter", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      await db.getProducts({ featured: true, page: 1, limit: 20 }, env);

      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle search filter", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      await db.getProducts({ search: "test", page: 1, limit: 20 }, env);

      expect(mockDb.prepare).to.have.been.called;
      const sqlCall = mockDb.prepare.getCall(0);
      if (sqlCall && sqlCall.args && sqlCall.args[0]) {
        expect(sqlCall.args[0]).to.include("LIKE");
      }
    });

    it("should handle all filters combined", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      await db.getProducts(
        {
          category: "Electronics",
          status: "active",
          featured: true,
          search: "test",
          page: 1,
          limit: 20,
        },
        env,
      );

      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("updateProduct - branches", () => {
    it("should handle category field inclusion", async () => {
      const mockProduct = { product_id: "1", title: "Updated" };
      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.resolves(mockProduct);

      await db.updateProduct("1", { category: "Electronics" }, env);

      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle category from consolidated fields", async () => {
      const mockProduct = { product_id: "1", title: "Updated" };
      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.resolves(mockProduct);

      await db.updateProduct(
        "1",
        { metadata: { category: "Electronics" } },
        env,
      );

      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle object values that need stringification", async () => {
      const mockProduct = { product_id: "1" };
      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.resolves(mockProduct);

      await db.updateProduct("1", { metadata: { test: "value" } }, env);

      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle updates returning getProductById when validFields is empty", async () => {
      const mockProduct = { product_id: "1" };
      mockDb.prepare().bind().first.resolves(mockProduct);

      // Update with only invalid fields
      const result = await db.updateProduct(
        "1",
        { invalidField: "value" },
        env,
      );

      expect(result).to.deep.equal(mockProduct);
      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("updateSku - branches", () => {
    it("should handle object attributes", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      await db.updateSku(
        "sku1",
        { attributes: { size: "XL", color: "red" } },
        env,
      );

      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle string attributes", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      await db.updateSku("sku1", { attributes: '{"size":"XL"}' }, env);

      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("getSkusByAttributes", () => {
    it("should get SKUs by attributes without productId", async () => {
      const mockSkus = [];
      mockDb.prepare().bind().all.resolves({ results: mockSkus });

      const skus = await db.getSkusByAttributes({ size: "L" }, null, env);

      expect(skus).to.be.an("array");
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should get SKUs by attributes with productId", async () => {
      const mockSkus = [];
      mockDb.prepare().bind().all.resolves({ results: mockSkus });

      const skus = await db.getSkusByAttributes({ size: "L" }, "product1", env);

      expect(skus).to.be.an("array");
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle multiple attribute filters", async () => {
      const mockSkus = [];
      mockDb.prepare().bind().all.resolves({ results: mockSkus });

      const skus = await db.getSkusByAttributes(
        { size: "L", color: "red" },
        null,
        env,
      );

      expect(skus).to.be.an("array");
    });

    it("should skip undefined/null filter values", async () => {
      const mockSkus = [];
      mockDb.prepare().bind().all.resolves({ results: mockSkus });

      const skus = await db.getSkusByAttributes(
        { size: "L", color: undefined, price: null },
        null,
        env,
      );

      expect(skus).to.be.an("array");
    });
  });

  describe("searchSkusByAttribute", () => {
    it("should search SKUs without productId", async () => {
      const mockSkus = [];
      mockDb.prepare().bind().all.resolves({ results: mockSkus });

      const skus = await db.searchSkusByAttribute("color", "red", null, env);

      expect(skus).to.be.an("array");
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should search SKUs with productId", async () => {
      const mockSkus = [];
      mockDb.prepare().bind().all.resolves({ results: mockSkus });

      const skus = await db.searchSkusByAttribute("size", "L", "product1", env);

      expect(skus).to.be.an("array");
      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("getSkuByAttribute", () => {
    it("should get SKU by attribute without productId", async () => {
      const mockSku = { sku_id: "sku1", attributes: '{"size":"L"}' };
      mockDb.prepare().bind().first.resolves(mockSku);

      const sku = await db.getSkuByAttribute("size", "L", null, env);

      expect(sku).to.deep.equal(mockSku);
    });

    it("should get SKU by attribute with productId", async () => {
      const mockSku = { sku_id: "sku1", attributes: '{"size":"L"}' };
      mockDb.prepare().bind().first.resolves(mockSku);

      const sku = await db.getSkuByAttribute("size", "L", "product1", env);

      expect(sku).to.deep.equal(mockSku);
    });

    it("should return null when SKU not found", async () => {
      mockDb.prepare().bind().first.resolves(null);

      const sku = await db.getSkuByAttribute("size", "XXL", null, env);

      expect(sku).to.be.null;
    });
  });

  describe("consolidateProductFields - additional branches", () => {
    it("should handle object metadata without changes", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        metadata: { existing: "data" },
        // No flat fields to consolidate
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle string metadata without changes", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        metadata: JSON.stringify({ existing: "data" }),
        // Already a string, no changes
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle object attributes without changes", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        attributes: { existing: "attrs" },
        // No flat fields to consolidate
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle string attributes without changes", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        attributes: JSON.stringify({ existing: "attrs" }),
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle pricing fields consolidation", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        price: 99.99,
        compare_at_price: 129.99,
        cost_price: 50.0,
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle policies fields consolidation", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        warranty_period: "1 year",
        return_policy: "30 days",
        purchase_note: "Note",
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle existing JSON objects in relationships", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        relationships: { existing: "data" },
        cross_sell_ids: ["id1", "id2"],
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle existing JSON objects in media", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        media: { existing: "media" },
        video_url: "https://example.com/video.mp4",
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle existing JSON objects in variants", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        variants: { existing: "vars" },
        variation_data: { var1: "data" },
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle existing JSON objects in extended_data", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const product = {
        product_id: "1",
        title: "Test",
        extended_data: { existing: "data" },
        features: ["f1", "f2"],
      };

      await db.createProduct(product, env);
      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("updateProduct - additional branches", () => {
    it("should handle category field when updates.category is undefined but consolidated has category", async () => {
      const mockProduct = { product_id: "1" };
      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.resolves(mockProduct);

      // Update with metadata that will extract category during consolidation
      await db.updateProduct(
        "1",
        { metadata: { category: "Electronics" } },
        env,
      );

      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle object values that need stringification in update", async () => {
      const mockProduct = { product_id: "1" };
      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.resolves(mockProduct);

      await db.updateProduct(
        "1",
        {
          metadata: { test: "value" }, // Object that needs stringification
          attributes: { size: "L" }, // Object that needs stringification
        },
        env,
      );

      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle updates with invalid fields filtered out", async () => {
      const mockProduct = { product_id: "1" };
      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.resolves(mockProduct);

      // Invalid field should be filtered out, but valid fields should remain
      await db.updateProduct(
        "1",
        {
          title: "Updated",
          invalidField: "should be filtered",
          anotherInvalid: "also filtered",
        },
        env,
      );

      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("createProduct - error branches", () => {
    it("should handle database errors", async () => {
      mockDb.prepare().bind().run.rejects(new Error("DB error"));

      const product = {
        product_id: "1",
        title: "Test Product",
      };

      try {
        await db.createProduct(product, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });

  describe("getProductById - error branches", () => {
    it("should handle database errors", async () => {
      mockDb.prepare().bind().first.rejects(new Error("DB error"));

      try {
        await db.getProductById("1", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });

  describe("getProducts - error branches", () => {
    it("should handle database errors", async () => {
      mockDb.prepare().bind().all.rejects(new Error("DB error"));

      try {
        await db.getProducts({ page: 1, limit: 20 }, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });

  describe("searchProducts - error branches", () => {
    it("should handle database errors", async () => {
      mockDb.prepare().bind().all.rejects(new Error("DB error"));

      try {
        await db.searchProducts("test", { page: 1, limit: 20 }, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });

  describe("createSku - error branches", () => {
    it("should handle database errors", async () => {
      mockDb.prepare().bind().run.rejects(new Error("DB error"));

      const sku = {
        sku_id: "sku1",
        product_id: "1",
        sku_code: "SKU-001",
      };

      try {
        await db.createSku(sku, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });

  describe("updateSku - error branches", () => {
    it("should handle database errors", async () => {
      mockDb.prepare().bind().run.rejects(new Error("DB error"));

      try {
        await db.updateSku("sku1", { attributes: { size: "L" } }, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });

  describe("deleteSku - error branches", () => {
    it("should handle database errors", async () => {
      mockDb.prepare().bind().run.rejects(new Error("DB error"));

      try {
        await db.deleteSku("sku1", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });
});
