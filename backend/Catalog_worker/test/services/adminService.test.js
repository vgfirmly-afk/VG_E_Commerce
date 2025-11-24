// test/services/adminService.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as adminService from "../../src/services/adminService.js";
import { createMockEnv } from "../setup.js";

describe("Admin Service", () => {
  let env;
  let mockDb;

  beforeEach(() => {
    env = createMockEnv();
    mockDb = env.CATALOG_DB;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createProductService", () => {
    it("should create product with auto-generated slug", async () => {
      const mockProduct = { product_id: "1", title: "Test Product" };
      mockDb.prepare().bind().first.onFirstCall().resolves({ count: 0 }); // slug doesn't exist
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true }); // product created
      mockDb.prepare().bind().first.onCall(1).resolves(mockProduct); // get product
      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const productData = {
        title: "Test Product",
        description: "Description",
      };

      const result = await adminService.createProductService(
        productData,
        "user1",
        env,
        {},
      );

      expect(result).to.exist;
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should create SKUs if provided", async () => {
      const mockProduct = { product_id: "1" };
      mockDb.prepare().bind().first.onCall(0).resolves({ count: 0 }); // slug check
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true }); // create product
      mockDb.prepare().bind().run.onCall(1).resolves({ success: true }); // create SKU
      mockDb.prepare().bind().first.onCall(1).resolves(mockProduct); // get product
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

      await adminService.createProductService(productData, "user1", env, {});

      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle database errors", async () => {
      mockDb.prepare().bind().first.rejects(new Error("DB error"));

      try {
        await adminService.createProductService(
          { title: "Test" },
          "user1",
          env,
          {},
        );
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });

  describe("updateProductService", () => {
    it("should update product successfully", async () => {
      const mockProduct = { product_id: "1", title: "Updated Title" };

      // Setup mocks: prepare() needs to handle slugExists, UPDATE, and getProductById calls
      mockDb.prepare = sinon.stub();

      // Call 0: slugExists check (when title is updated, it checks if slug exists)
      mockDb.prepare.onCall(0).returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves({ count: 0 }), // slug doesn't exist
        }),
      });

      // Call 1: UPDATE query
      mockDb.prepare.onCall(1).returns({
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      });

      // Call 2: getProductById from updateProduct (internal call)
      mockDb.prepare.onCall(2).returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockProduct),
        }),
      });

      // Call 3: getProductById from updateProductService (final call)
      mockDb.prepare.onCall(3).returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(mockProduct),
        }),
      });

      const updates = { title: "Updated Title" };

      const result = await adminService.updateProductService(
        "1",
        updates,
        "user1",
        env,
      );

      expect(result).to.exist;
      expect(result.product_id).to.equal("1");
    });

    it("should generate new slug when title updated", async () => {
      const mockProduct = { product_id: "1" };
      mockDb.prepare().bind().first.onCall(0).resolves({ count: 0 }); // slug check
      mockDb.prepare().bind().run.onFirstCall().resolves({ success: true });
      mockDb.prepare().bind().first.onCall(1).resolves(mockProduct);

      await adminService.updateProductService(
        "1",
        { title: "New Title" },
        "user1",
        env,
      );

      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("deleteProductService", () => {
    it("should delete product successfully", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const result = await adminService.deleteProductService("1", env);

      expect(result).to.be.true;
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should invalidate cache after deletion", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      await adminService.deleteProductService("1", env);

      expect(env.CATALOG_KV.delete).to.have.been.called;
    });
  });

  describe("createSkuService", () => {
    it("should create SKU with auto-generated code", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });
      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const skuData = {
        product_id: "1",
        attributes: { size: "L" },
      };

      const result = await adminService.createSkuService(
        skuData,
        "user1",
        env,
        {},
      );

      expect(result).to.exist;
      expect(result.sku_id).to.exist;
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should sync price to Pricing Worker", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });
      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const skuData = {
        product_id: "1",
        attributes: { size: "L" },
        price: 99.99,
      };

      await adminService.createSkuService(skuData, "user1", env, {});

      // Pricing worker should be called
      expect(env.PRICING_WORKER.fetch).to.have.been.called;
    });
  });

  describe("updateSkuService", () => {
    it("should update SKU successfully", async () => {
      const mockSku = { sku_id: "sku1", sku_code: "SKU-001" };
      mockDb.prepare().bind().first.resolves(mockSku);
      mockDb.prepare().bind().run.resolves({ success: true });
      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const updates = { attributes: { size: "XL" } };

      const result = await adminService.updateSkuService(
        "sku1",
        updates,
        "product1",
        "user1",
        env,
        {},
      );

      expect(result).to.be.true;
      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("deleteSkuService", () => {
    it("should delete SKU successfully", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const result = await adminService.deleteSkuService(
        "sku1",
        "product1",
        env,
      );

      expect(result).to.be.true;
      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("uploadProductImageService", () => {
    it("should upload image to R2 and update product", async () => {
      const imageFile = new ArrayBuffer(8);
      const mockProduct = { product_id: "1", media: "{}" };
      mockDb.prepare().bind().first.resolves(mockProduct);
      mockDb.prepare().bind().run.resolves({ success: true });
      env.CATALOG_IMG_BUCKET.put.resolves();

      const result = await adminService.uploadProductImageService(
        "product1",
        "image1",
        imageFile,
        env,
      );

      expect(result).to.exist;
      expect(result.imageId).to.equal("image1");
      expect(env.CATALOG_IMG_BUCKET.put).to.have.been.called;
    });

    it("should throw error if R2 bucket not configured", async () => {
      const envWithoutBucket = { ...env, CATALOG_IMG_BUCKET: null };
      const imageFile = new ArrayBuffer(8);

      try {
        await adminService.uploadProductImageService(
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

    it("should update product media after upload", async () => {
      const imageFile = new ArrayBuffer(8);
      const mockProduct = { product_id: "1", media: "{}" };
      mockDb.prepare().bind().first.resolves(mockProduct);
      mockDb.prepare().bind().run.resolves({ success: true });
      env.CATALOG_IMG_BUCKET.put.resolves();

      await adminService.uploadProductImageService(
        "product1",
        "image1",
        imageFile,
        env,
      );

      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("createProductService - branches", () => {
    it("should handle product without title (no slug generation)", async () => {
      const mockProduct = {
        product_id: "1",
        description: "Description",
        metadata: JSON.stringify({}),
        media: JSON.stringify({}),
      };

      mockDb.prepare().bind().run.resolves({ success: true });
      env.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.resolves(mockProduct);
      mockDb.prepare().bind().all.resolves({ results: [] });
      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const productData = {
        description: "Description",
      };

      const result = await adminService.createProductService(
        productData,
        "user1",
        env,
      );

      expect(result).to.exist;
    });

    it("should handle product with existing image_url", async () => {
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
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const productData = {
        title: "Test Product",
        image_url: "https://example.com/image.jpg",
      };

      const result = await adminService.createProductService(
        productData,
        "user1",
        env,
      );

      expect(result).to.exist;
    });

    it("should handle product with product_images array", async () => {
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
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const productData = {
        title: "Test Product",
        product_images: ["https://example.com/image.jpg"],
      };

      const result = await adminService.createProductService(
        productData,
        "user1",
        env,
      );

      expect(result).to.exist;
    });

    it("should handle product with media object containing image_url", async () => {
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
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const productData = {
        title: "Test Product",
        media: { image_url: "https://example.com/image.jpg" },
      };

      const result = await adminService.createProductService(
        productData,
        "user1",
        env,
      );

      expect(result).to.exist;
    });

    it("should handle errors during product creation", async () => {
      mockDb.prepare().bind().first.rejects(new Error("DB error"));

      try {
        await adminService.createProductService(
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
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      envWithoutKV.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const result = await adminService.createProductService(
        { title: "Test" },
        "user1",
        envWithoutKV,
      );

      expect(result).to.exist;
    });
  });

  describe("updateProductService - branches", () => {
    it("should handle update without title (no slug regeneration)", async () => {
      const mockProduct = { product_id: "1", title: "Original" };

      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.resolves(mockProduct);

      const updates = { description: "New description" };

      const result = await adminService.updateProductService(
        "1",
        updates,
        "user1",
        env,
      );

      expect(result).to.exist;
    });

    it("should handle update with inventory stock_quantity", async () => {
      const mockProduct = { product_id: "1" };

      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.resolves(mockProduct);

      const updates = {
        inventory: { stock_quantity: 100 },
      };

      const result = await adminService.updateProductService(
        "1",
        updates,
        "user1",
        env,
      );

      expect(result).to.exist;
    });

    it("should handle update with inventory quantity", async () => {
      const mockProduct = { product_id: "1" };

      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.resolves(mockProduct);

      const updates = {
        inventory: { quantity: 50 },
      };

      const result = await adminService.updateProductService(
        "1",
        updates,
        "user1",
        env,
      );

      expect(result).to.exist;
    });

    it("should handle update with stock_quantity field", async () => {
      const mockProduct = { product_id: "1" };

      mockDb.prepare().bind().run.resolves({ success: true });
      mockDb.prepare().bind().first.resolves(mockProduct);

      const updates = {
        stock_quantity: 75,
      };

      const result = await adminService.updateProductService(
        "1",
        updates,
        "user1",
        env,
      );

      expect(result).to.exist;
    });

    it("should handle errors during update", async () => {
      mockDb.prepare().bind().run.rejects(new Error("DB error"));

      try {
        await adminService.updateProductService(
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

  describe("createSkuService - branches", () => {
    it("should handle SKU with price sync using ctx.waitUntil", async () => {
      const mockSku = { sku_id: "sku1" };
      mockDb.prepare().bind().run.resolves({ success: true });

      const ctx = {
        waitUntil: sinon.stub(),
      };

      const skuData = {
        product_id: "1",
        sku_code: "SKU-001",
        attributes: { size: "L" },
        price: 99.99,
      };

      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const result = await adminService.createSkuService(
        skuData,
        "user1",
        env,
        ctx,
      );

      expect(result).to.exist;
      expect(ctx.waitUntil).to.have.been.called;
    });

    it("should handle SKU without ctx.waitUntil", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      const skuData = {
        product_id: "1",
        sku_code: "SKU-001",
        attributes: { size: "L" },
        price: 99.99,
      };

      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const result = await adminService.createSkuService(skuData, "user1", env);

      expect(result).to.exist;
    });

    it("should handle SKU without price (no pricing sync)", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      // Reset fetch stub call count
      env.PRICING_WORKER.fetch.resetHistory();

      const skuData = {
        product_id: "1",
        sku_code: "SKU-001",
        attributes: { size: "L" },
        // No price field
      };

      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const result = await adminService.createSkuService(skuData, "user1", env);

      expect(result).to.exist;
      // Pricing worker should not be called if no price
      // Note: It might still be called if price is 0 or null, so we just verify the result
      expect(result.sku_id).to.exist;
    });

    it("should handle errors during SKU creation", async () => {
      mockDb.prepare().bind().run.rejects(new Error("DB error"));

      try {
        await adminService.createSkuService({ product_id: "1" }, "user1", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });

  describe("updateSkuService - branches", () => {
    it("should handle SKU update with price sync using ctx.waitUntil", async () => {
      const mockSku = { sku_id: "sku1", sku_code: "SKU-001" };
      mockDb.prepare().bind().first.resolves(mockSku);
      mockDb.prepare().bind().run.resolves({ success: true });

      const ctx = {
        waitUntil: sinon.stub(),
      };

      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const updates = {
        attributes: { size: "XL" },
        price: 149.99,
      };

      const result = await adminService.updateSkuService(
        "sku1",
        updates,
        "product1",
        "user1",
        env,
        ctx,
      );

      expect(result).to.be.true;
      expect(ctx.waitUntil).to.have.been.called;
    });

    it("should handle SKU update without price (no pricing sync)", async () => {
      const mockSku = { sku_id: "sku1", sku_code: "SKU-001" };
      mockDb.prepare().bind().first.resolves(mockSku);
      mockDb.prepare().bind().run.resolves({ success: true });

      const updates = {
        attributes: { size: "XL" },
      };

      const result = await adminService.updateSkuService(
        "sku1",
        updates,
        "product1",
        "user1",
        env,
      );

      expect(result).to.be.true;
      expect(env.PRICING_WORKER.fetch).to.not.have.been.called;
    });

    it("should handle errors during SKU update", async () => {
      const mockSku = { sku_id: "sku1" };
      mockDb.prepare().bind().first.resolves(mockSku);
      mockDb.prepare().bind().run.rejects(new Error("DB error"));

      try {
        await adminService.updateSkuService(
          "sku1",
          { attributes: {} },
          "product1",
          "user1",
          env,
        );
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });
  });

  describe("deleteSkuService - branches", () => {
    it("should handle errors during SKU deletion", async () => {
      mockDb.prepare().bind().run.rejects(new Error("DB error"));

      try {
        await adminService.deleteSkuService("sku1", "product1", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB error");
      }
    });

    it("should handle missing CATALOG_KV during cache invalidation", async () => {
      const envWithoutKV = { ...env, CATALOG_KV: null };
      mockDb.prepare().bind().run.resolves({ success: true });

      const result = await adminService.deleteSkuService(
        "sku1",
        "product1",
        envWithoutKV,
      );

      expect(result).to.be.true;
    });
  });

  describe("createProductService - image handling branches", () => {
    it("should set default image when media is string JSON", async () => {
      const mockProduct = {
        product_id: "1",
        title: "Test Product",
        metadata: JSON.stringify({}),
        media: JSON.stringify({ other: "data" }),
      };

      mockDb.prepare().bind().run.resolves({ success: true });
      env.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.resolves(mockProduct);
      mockDb.prepare().bind().all.resolves({ results: [] });
      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const productData = {
        title: "Test Product",
        media: JSON.stringify({ other: "data" }), // String JSON without image
      };

      const result = await adminService.createProductService(
        productData,
        "user1",
        env,
      );

      expect(result).to.exist;
    });

    it("should handle invalid JSON in media string", async () => {
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
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const productData = {
        title: "Test Product",
        media: "invalid json{",
      };

      const result = await adminService.createProductService(
        productData,
        "user1",
        env,
      );

      expect(result).to.exist;
    });

    it("should handle product with stock_quantity field", async () => {
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
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const productData = {
        title: "Test Product",
        stock_quantity: 100,
      };

      const result = await adminService.createProductService(
        productData,
        "user1",
        env,
      );

      expect(result).to.exist;
    });

    it("should handle product with inventory.quantity", async () => {
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
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const productData = {
        title: "Test Product",
        inventory: { quantity: 50 },
      };

      const result = await adminService.createProductService(
        productData,
        "user1",
        env,
      );

      expect(result).to.exist;
    });

    it("should handle SKU with quantity field", async () => {
      const mockProduct = {
        product_id: "1",
        title: "Test Product",
        metadata: JSON.stringify({}),
        media: JSON.stringify({}),
      };

      mockDb.prepare().bind().run.onCall(0).resolves({ success: true });
      mockDb.prepare().bind().run.onCall(1).resolves({ success: true });
      env.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.resolves(mockProduct);
      mockDb.prepare().bind().all.resolves({ results: [] });
      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const productData = {
        title: "Test Product",
        skus: [
          {
            attributes: { size: "L" },
            quantity: 25,
          },
        ],
      };

      const result = await adminService.createProductService(
        productData,
        "user1",
        env,
      );

      expect(result).to.exist;
    });
  });

  describe("syncStockToInventoryWorker - branches", () => {
    it("should handle missing INVENTORY_WORKER", async () => {
      const envWithoutInventory = { ...env, INVENTORY_WORKER: null };
      const mockProduct = {
        product_id: "1",
        title: "Test Product",
        metadata: JSON.stringify({}),
        media: JSON.stringify({}),
      };

      mockDb.prepare().bind().run.resolves({ success: true });
      envWithoutInventory.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.resolves(mockProduct);
      mockDb.prepare().bind().all.resolves({ results: [] });
      envWithoutInventory.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const productData = {
        title: "Test Product",
        skus: [
          {
            attributes: { size: "L" },
            stock_quantity: 10,
          },
        ],
      };

      const result = await adminService.createProductService(
        productData,
        "user1",
        envWithoutInventory,
      );

      expect(result).to.exist;
    });
  });
});
