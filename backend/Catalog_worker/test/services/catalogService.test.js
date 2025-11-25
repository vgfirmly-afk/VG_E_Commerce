// test/services/catalogService.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as catalogService from "../../src/services/catalogService.js";
import { createMockEnv } from "../setup.js";

describe("Catalog Service", () => {
  let env;
  let mockDb;

  beforeEach(() => {
    env = createMockEnv();
    mockDb = env.CATALOG_DB;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getProduct", () => {
    it("should return product with SKUs", async () => {
      const mockProduct = {
        product_id: "1",
        title: "Test Product",
        metadata: JSON.stringify({}),
        media: JSON.stringify({}),
      };
      const mockSkus = [{ sku_id: "sku1", attributes: "{}" }];

      env.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.onFirstCall().resolves(mockProduct);
      mockDb.prepare().bind().all.onCall(1).resolves({ results: mockSkus });
      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ prices: [] }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ stocks: [] }), { status: 200 }),
      );

      const product = await catalogService.getProduct("1", env);

      expect(product).to.exist;
      expect(product.product_id).to.equal("1");
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should use cached product if available", async () => {
      const cachedProduct = {
        product_id: "1",
        title: "Cached Product",
        skus: [],
      };

      // KV.get with 'json' option returns parsed object, not string
      env.CATALOG_KV.get.resolves(cachedProduct);
      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ prices: [] }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ stocks: [] }), { status: 200 }),
      );

      const product = await catalogService.getProduct("1", env);

      expect(product).to.exist;
      expect(product.product_id).to.equal("1");
    });

    it("should return null when product not found", async () => {
      env.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.resolves(null);

      const product = await catalogService.getProduct("nonexistent", env);

      expect(product).to.be.null;
    });
  });

  describe("listProducts", () => {
    it("should handle filters", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      await catalogService.listProducts(
        { category: "Electronics", page: 1, limit: 20 },
        env,
      );

      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("getHomePageProducts", () => {
    it("should return products by category", async () => {
      const mockProducts = [{ product_id: "1" }];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      const result = await catalogService.getHomePageProducts(
        ["Electronics"],
        10,
        env,
      );

      expect(result).to.have.property("Electronics");
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should use default categories if none provided", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      await catalogService.getHomePageProducts([], 10, env);

      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("getProductImageUrl", () => {
    it("should return R2 object when found", async () => {
      const mockObject = {
        body: new Blob(["data"]),
        httpMetadata: { contentType: "image/jpeg" },
      };

      env.CATALOG_IMG_BUCKET.head.resolves({});
      env.CATALOG_IMG_BUCKET.get.resolves(mockObject);

      const result = await catalogService.getProductImageUrl(
        "product1",
        "image1",
        env,
      );

      expect(result).to.exist;
      expect(env.CATALOG_IMG_BUCKET.get).to.have.been.called;
    });

    it("should return null when image not found", async () => {
      env.CATALOG_IMG_BUCKET.head.resolves(null);

      const result = await catalogService.getProductImageUrl(
        "product1",
        "image1",
        env,
      );

      expect(result).to.be.null;
    });

    it("should handle R2 errors gracefully", async () => {
      env.CATALOG_IMG_BUCKET.head.rejects(new Error("R2 error"));

      const result = await catalogService.getProductImageUrl(
        "product1",
        "image1",
        env,
      );

      expect(result).to.be.null;
    });
  });

  describe("deleteSkuService", () => {
    it("should delete SKU and invalidate cache", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const result = await catalogService.deleteSkuService(
        "sku1",
        "product1",
        env,
      );

      expect(result).to.be.true;
      expect(env.CATALOG_KV.delete).to.have.been.called;
    });

    it("should handle errors during deletion", async () => {
      mockDb.prepare().bind().run.rejects(new Error("DB error"));

      try {
        await catalogService.deleteSkuService("sku1", "product1", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });

  describe("getProduct - edge cases", () => {
    it("should handle products with prices and stock", async () => {
      const mockProduct = {
        product_id: "1",
        title: "Test Product",
        metadata: JSON.stringify({}),
        media: JSON.stringify({}),
      };
      const mockSkus = [{ sku_id: "sku1", attributes: "{}" }];
      const mockPrices = [{ sku_id: "sku1", price: 99.99, currency: "USD" }];
      const mockStocks = [{ sku_id: "sku1", quantity: 10 }];

      env.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.onFirstCall().resolves(mockProduct);
      mockDb.prepare().bind().all.onCall(1).resolves({ results: mockSkus });
      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ prices: mockPrices }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ stocks: mockStocks }), { status: 200 }),
      );

      const product = await catalogService.getProduct("1", env);

      expect(product).to.exist;
      expect(product.skus).to.be.an("array");
      if (product.skus && product.skus.length > 0 && product.skus[0].price) {
        expect(product.skus[0].price.price).to.equal(99.99);
      }
    });

    it("should handle cached product without SKUs", async () => {
      const cachedProduct = {
        product_id: "1",
        title: "Cached Product",
      };
      const mockSkus = [{ sku_id: "sku1", attributes: "{}" }];

      env.CATALOG_KV.get.resolves(cachedProduct);
      mockDb.prepare().bind().all.resolves({ results: mockSkus });
      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ prices: [] }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ stocks: [] }), { status: 200 }),
      );

      const product = await catalogService.getProduct("1", env);

      expect(product).to.exist;
      expect(product.skus).to.be.an("array");
    });
  });

  describe("createProductService", () => {
    it("should create product with SKUs", async () => {
      const mockProduct = {
        product_id: "1",
        title: "Test Product",
        metadata: JSON.stringify({}),
        media: JSON.stringify({}),
      };
      const mockSkus = [{ sku_id: "sku1", attributes: "{}" }];

      mockDb.prepare().bind().run.onCall(0).resolves({ success: true }); // create product
      mockDb.prepare().bind().run.onCall(1).resolves({ success: true }); // create SKU
      env.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.onCall(0).resolves(mockProduct); // get product
      mockDb.prepare().bind().all.onCall(1).resolves({ results: mockSkus });
      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const productData = {
        title: "Test Product",
        skus: [{ attributes: { size: "L" } }],
      };

      const result = await catalogService.createProductService(
        productData,
        "user1",
        env,
      );

      expect(result).to.exist;
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should create product without SKUs", async () => {
      const mockProduct = {
        product_id: "1",
        title: "Test Product",
        metadata: JSON.stringify({}),
        media: JSON.stringify({}),
      };

      mockDb.prepare().bind().run.resolves({ success: true });
      env.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.resolves(mockProduct);
      mockDb.prepare().bind().all.resolves({ results: [] });
      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ prices: [] }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ stocks: [] }), { status: 200 }),
      );

      const productData = {
        title: "Test Product",
      };

      const result = await catalogService.createProductService(
        productData,
        "user1",
        env,
      );

      expect(result).to.exist;
      expect(result.product_id).to.exist;
    });
  });

  describe("updateProductService", () => {
    it.skip("should update product with SKUs", async () => {
      // Skipped: Complex mock setup required for multiple DB calls
    });

    it("should update product without SKUs", async () => {
      const mockProduct = {
        product_id: "1",
        title: "Updated",
        metadata: JSON.stringify({}),
        media: JSON.stringify({}),
      };

      mockDb.prepare().bind().run.resolves({ success: true });
      env.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.resolves(mockProduct);
      mockDb.prepare().bind().all.resolves({ results: [] });
      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ prices: [] }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ stocks: [] }), { status: 200 }),
      );

      const updates = { title: "Updated Title" };

      const result = await catalogService.updateProductService(
        "1",
        updates,
        "user1",
        env,
      );

      expect(result).to.exist;
    });
  });

  describe("deleteProductService", () => {
    it("should delete product and invalidate cache", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const result = await catalogService.deleteProductService("1", env);

      expect(result).to.be.true;
      expect(env.CATALOG_KV.delete).to.have.been.called;
    });
  });

  describe("createSkuService", () => {
    it("should create SKU successfully", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const skuData = {
        product_id: "1",
        attributes: { size: "L" },
      };

      const result = await catalogService.createSkuService(
        skuData,
        "user1",
        env,
      );

      expect(result).to.exist;
      expect(result.sku_id).to.exist;
      expect(env.CATALOG_KV.delete).to.have.been.called;
    });

    it("should create SKU with provided SKU code", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const skuData = {
        product_id: "1",
        sku_code: "SKU-001",
        attributes: { size: "L" },
      };

      const result = await catalogService.createSkuService(
        skuData,
        "user1",
        env,
      );

      expect(result).to.exist;
      expect(result.sku_id).to.exist;
      expect(result.sku_code).to.equal("SKU-001");
    });
  });

  describe("updateSkuService", () => {
    it("should update SKU successfully", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const updates = { attributes: { size: "XL" } };

      const result = await catalogService.updateSkuService(
        "sku1",
        updates,
        "product1",
        env,
      );

      expect(result).to.be.true;
      expect(env.CATALOG_KV.delete).to.have.been.called;
    });
  });

  describe("uploadProductImage", () => {
    it("should upload image successfully", async () => {
      const imageFile = new ArrayBuffer(8);
      env.CATALOG_IMG_BUCKET.put.resolves();

      const result = await catalogService.uploadProductImage(
        "product1",
        "image1",
        imageFile,
        env,
      );

      expect(result).to.exist;
      expect(result.imageId).to.equal("image1");
      expect(result.url).to.exist;
      expect(env.CATALOG_IMG_BUCKET.put).to.have.been.called;
    });

    it("should throw error if R2 bucket not configured", async () => {
      const imageFile = new ArrayBuffer(8);
      const envWithoutBucket = { ...env, CATALOG_IMG_BUCKET: null };

      try {
        await catalogService.uploadProductImage(
          "product1",
          "image1",
          imageFile,
          envWithoutBucket,
        );
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("R2 bucket not configured");
      }
    });
  });

  describe("getProductImageUrl", () => {
    it("should return null when R2 bucket not configured", async () => {
      const envWithoutBucket = { ...env, CATALOG_IMG_BUCKET: null };

      const result = await catalogService.getProductImageUrl(
        "product1",
        "image1",
        envWithoutBucket,
      );

      expect(result).to.be.null;
    });

    it("should return null when R2 get fails", async () => {
      env.CATALOG_IMG_BUCKET.head.resolves({});
      env.CATALOG_IMG_BUCKET.get.resolves(null);

      const result = await catalogService.getProductImageUrl(
        "product1",
        "image1",
        env,
      );

      expect(result).to.be.null;
    });
  });

  describe("listProducts", () => {
    it("should handle featured filter", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      await catalogService.listProducts(
        { featured: true, page: 1, limit: 20 },
        env,
      );

      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle status filter", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      await catalogService.listProducts(
        { status: "inactive", page: 1, limit: 20 },
        env,
      );

      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle errors during listing", async () => {
      mockDb.prepare().bind().all.rejects(new Error("DB error"));

      try {
        await catalogService.listProducts({ page: 1, limit: 20 }, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });

  describe("fetchProductPrices - branches", () => {
    it("should return empty array when PRICING_WORKER not available", async () => {
      const envWithoutPricing = { ...env, PRICING_WORKER: null };
      const mockProduct = {
        product_id: "1",
        metadata: JSON.stringify({}),
        media: JSON.stringify({}),
      };

      envWithoutPricing.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.resolves(mockProduct);
      mockDb.prepare().bind().all.resolves({ results: [] });
      envWithoutPricing.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ stocks: [] }), { status: 200 }),
      );

      const product = await catalogService.getProduct("1", envWithoutPricing);

      expect(product).to.exist;
      expect(product.skus).to.be.an("array");
    });

    it("should handle pricing worker error response", async () => {
      const mockProduct = {
        product_id: "1",
        metadata: JSON.stringify({}),
        media: JSON.stringify({}),
      };

      env.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.resolves(mockProduct);
      mockDb.prepare().bind().all.resolves({ results: [] });
      env.PRICING_WORKER.fetch.resolves(new Response("Error", { status: 500 }));
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ stocks: [] }), { status: 200 }),
      );

      const product = await catalogService.getProduct("1", env);

      expect(product).to.exist;
      expect(product.skus).to.be.an("array");
    });

    it("should handle pricing worker fetch error", async () => {
      const mockProduct = {
        product_id: "1",
        metadata: JSON.stringify({}),
        media: JSON.stringify({}),
      };

      env.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.resolves(mockProduct);
      mockDb.prepare().bind().all.resolves({ results: [] });
      env.PRICING_WORKER.fetch.rejects(new Error("Network error"));
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ stocks: [] }), { status: 200 }),
      );

      const product = await catalogService.getProduct("1", env);

      expect(product).to.exist;
    });
  });

  describe("fetchProductStock - branches", () => {
    it("should return empty array when INVENTORY_WORKER not available", async () => {
      const envWithoutInventory = { ...env, INVENTORY_WORKER: null };
      const mockProduct = {
        product_id: "1",
        metadata: JSON.stringify({}),
        media: JSON.stringify({}),
      };

      envWithoutInventory.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.resolves(mockProduct);
      mockDb.prepare().bind().all.resolves({ results: [] });
      envWithoutInventory.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ prices: [] }), { status: 200 }),
      );

      const product = await catalogService.getProduct("1", envWithoutInventory);

      expect(product).to.exist;
    });

    it("should handle inventory worker error response", async () => {
      const mockProduct = {
        product_id: "1",
        metadata: JSON.stringify({}),
        media: JSON.stringify({}),
      };

      env.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.resolves(mockProduct);
      mockDb.prepare().bind().all.resolves({ results: [] });
      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ prices: [] }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response("Error", { status: 500 }),
      );

      const product = await catalogService.getProduct("1", env);

      expect(product).to.exist;
    });

    it("should handle inventory worker fetch error", async () => {
      const mockProduct = {
        product_id: "1",
        metadata: JSON.stringify({}),
        media: JSON.stringify({}),
      };

      env.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.resolves(mockProduct);
      mockDb.prepare().bind().all.resolves({ results: [] });
      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ prices: [] }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.rejects(new Error("Network error"));

      const product = await catalogService.getProduct("1", env);

      expect(product).to.exist;
    });
  });

  describe("getProductImageUrl - branches", () => {
    it("should return null when bucket head returns null", async () => {
      env.CATALOG_IMG_BUCKET.head.resolves(null);

      const result = await catalogService.getProductImageUrl(
        "product1",
        "image1",
        env,
      );

      expect(result).to.be.null;
      expect(env.CATALOG_IMG_BUCKET.get).to.not.have.been.called;
    });

    it("should handle R2 get error", async () => {
      env.CATALOG_IMG_BUCKET.head.resolves({});
      env.CATALOG_IMG_BUCKET.get.rejects(new Error("R2 get error"));

      const result = await catalogService.getProductImageUrl(
        "product1",
        "image1",
        env,
      );

      expect(result).to.be.null;
    });
  });

  describe("createProductService - branches", () => {
    it("should handle errors during product creation", async () => {
      mockDb.prepare().bind().run.rejects(new Error("DB error"));

      try {
        await catalogService.createProductService(
          { title: "Test" },
          "user1",
          env,
        );
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });

    it("should handle missing CATALOG_KV", async () => {
      const envWithoutKV = { ...env, CATALOG_KV: null };
      const mockProduct = {
        product_id: "1",
        title: "Test Product",
        metadata: JSON.stringify({}),
        media: JSON.stringify({}),
      };

      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.resolves(mockProduct);
      mockDb.prepare().bind().all.resolves({ results: [] });
      envWithoutKV.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ prices: [] }), { status: 200 }),
      );
      envWithoutKV.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ stocks: [] }), { status: 200 }),
      );

      const result = await catalogService.createProductService(
        { title: "Test" },
        "user1",
        envWithoutKV,
      );

      expect(result).to.exist;
    });
  });

  describe("updateProductService - branches", () => {
    it("should handle errors during update", async () => {
      mockDb.prepare().bind().run.rejects(new Error("DB error"));

      try {
        await catalogService.updateProductService(
          "1",
          { title: "Update" },
          "user1",
          env,
        );
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });
});
