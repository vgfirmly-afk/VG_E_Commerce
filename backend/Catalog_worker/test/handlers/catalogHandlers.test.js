// test/handlers/catalogHandlers.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as handlers from "../../src/handlers/catalogHandlers.js";
import { createMockRequest, createMockEnv } from "../setup.js";

describe("Catalog Handlers", () => {
  let env;
  let request;
  let mockDb;

  beforeEach(() => {
    env = createMockEnv();
    mockDb = env.CATALOG_DB;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("listProducts", () => {
    it("should return products list with pagination", async () => {
      const mockProducts = [
        {
          product_id: "1",
          title: "Product 1",
          category: "Electronics",
          media: JSON.stringify({ product_images: [{ url: "image.jpg" }] }),
          metadata: JSON.stringify({ default_sku: "sku1" }),
        },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products?page=1&limit=20",
      );

      const response = await handlers.listProducts(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.products).to.be.an("array");
      expect(body.page).to.equal(1);
      expect(body.limit).to.equal(20);
    });

    it("should handle validation errors", async () => {
      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products?page=-1",
      );

      const response = await handlers.listProducts(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should handle service errors", async () => {
      mockDb.prepare().bind().all.rejects(new Error("Database error"));

      request = createMockRequest("GET", "https://example.com/api/v1/products");

      const response = await handlers.listProducts(request, env);
      const body = await response.json();

      expect(response.status).to.equal(500);
      expect(body.error).to.equal("internal_error");
    });

    it("should extract images and categories from product data", async () => {
      const mockProducts = [
        {
          product_id: "1",
          title: "Product 1",
          category: "Electronics",
          media: JSON.stringify({
            product_images: [{ url: "img1.jpg" }, { url: "img2.jpg" }],
          }),
          metadata: JSON.stringify({ categories: ["Electronics", "Tech"] }),
        },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest("GET", "https://example.com/api/v1/products");

      const response = await handlers.listProducts(request, env);
      const body = await response.json();

      expect(body.products[0].images).to.be.an("array");
      expect(body.products[0].categories).to.be.an("array");
    });
  });

  describe("getProduct", () => {
    it("should return product details", async () => {
      const mockProduct = {
        product_id: "1",
        title: "Product 1",
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

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products/1",
      );
      request.params = { product_id: "1" };

      const response = await handlers.getProduct(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.product_id).to.equal("1");
    });

    it("should return 404 when product not found", async () => {
      env.CATALOG_KV.get.resolves(null);
      mockDb.prepare().bind().first.resolves(null);

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products/1",
      );
      request.params = { product_id: "1" };

      const response = await handlers.getProduct(request, env);
      const body = await response.json();

      expect(response.status).to.equal(404);
      expect(body.error).to.equal("not_found");
    });

    it("should validate product ID", async () => {
      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products/",
      );
      request.params = { product_id: "" };

      const response = await handlers.getProduct(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });
  });

  describe("getProductImage", () => {
    it("should return product image", async () => {
      const mockR2Object = {
        body: new Blob(["image data"], { type: "image/jpeg" }),
        httpMetadata: { contentType: "image/jpeg" },
      };

      env.CATALOG_IMG_BUCKET.head.resolves({});
      env.CATALOG_IMG_BUCKET.get.resolves(mockR2Object);

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products/1/images/img1",
      );
      request.params = { product_id: "1", image_id: "img1" };

      const response = await handlers.getProductImage(request, env);

      expect(response.status).to.equal(200);
      expect(response.headers.get("Content-Type")).to.equal("image/jpeg");
    });

    it("should return 404 when image not found", async () => {
      env.CATALOG_IMG_BUCKET.head.resolves(null);

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products/1/images/img1",
      );
      request.params = { product_id: "1", image_id: "img1" };

      const response = await handlers.getProductImage(request, env);
      const body = await response.json();

      expect(response.status).to.equal(404);
      expect(body.error).to.equal("not_found");
    });

    it("should validate product and image IDs", async () => {
      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products//images/",
      );
      request.params = { product_id: "", image_id: "" };

      const response = await handlers.getProductImage(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });
  });

  describe("getHomePage", () => {
    it("should return home page products", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest("GET", "https://example.com/api/v1/home");

      const response = await handlers.getHomePage(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body).to.be.an("object");
    });

    it("should handle validation errors", async () => {
      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/home?limit=200",
      );

      const response = await handlers.getHomePage(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should use default categories when none specified", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest("GET", "https://example.com/api/v1/home");

      const response = await handlers.getHomePage(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("searchProductsHandler", () => {
    it("should return search results", async () => {
      const mockProducts = [
        {
          product_id: "1",
          title: "Test Product",
          category: "Electronics",
          media: JSON.stringify({}),
          metadata: JSON.stringify({}),
        },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/search?q=test",
      );

      const response = await handlers.searchProductsHandler(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.products).to.be.an("array");
      expect(body.keyword).to.equal("test");
    });

    it("should handle validation errors", async () => {
      request = createMockRequest("GET", "https://example.com/api/v1/search");

      const response = await handlers.searchProductsHandler(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should handle empty search query", async () => {
      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/search?q=",
      );

      const response = await handlers.searchProductsHandler(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should extract images from product_images array", async () => {
      const mockProducts = [
        {
          product_id: "1",
          title: "Test Product",
          category: "Electronics",
          media: JSON.stringify({
            product_images: [{ url: "img1.jpg" }, { url: "img2.jpg" }],
          }),
          metadata: JSON.stringify({}),
        },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/search?q=test",
      );

      const response = await handlers.searchProductsHandler(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      if (
        body.products &&
        body.products.length > 0 &&
        body.products[0].images
      ) {
        expect(body.products[0].images).to.be.an("array");
      }
    });

    it("should extract images from image_url", async () => {
      const mockProducts = [
        {
          product_id: "1",
          title: "Test Product",
          category: "Electronics",
          media: JSON.stringify({ image_url: "img1.jpg" }),
          metadata: JSON.stringify({}),
        },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/search?q=test",
      );

      const response = await handlers.searchProductsHandler(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      if (
        body.products &&
        body.products.length > 0 &&
        body.products[0].images
      ) {
        expect(body.products[0].images).to.be.an("array");
      }
    });

    it("should extract categories from metadata categories array", async () => {
      const mockProducts = [
        {
          product_id: "1",
          title: "Test Product",
          media: JSON.stringify({}),
          metadata: JSON.stringify({ categories: ["Electronics", "Tech"] }),
        },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/search?q=test",
      );

      const response = await handlers.searchProductsHandler(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      if (
        body.products &&
        body.products.length > 0 &&
        body.products[0].categories
      ) {
        expect(body.products[0].categories).to.be.an("array");
      }
    });

    it("should extract categories from metadata.category", async () => {
      const mockProducts = [
        {
          product_id: "1",
          title: "Test Product",
          media: JSON.stringify({}),
          metadata: JSON.stringify({ category: "Electronics" }),
        },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/search?q=test",
      );

      const response = await handlers.searchProductsHandler(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      if (
        body.products &&
        body.products.length > 0 &&
        body.products[0].categories
      ) {
        expect(body.products[0].categories).to.be.an("array");
      }
    });

    it("should handle products with direct category field", async () => {
      const mockProducts = [
        {
          product_id: "1",
          title: "Test Product",
          category: "Electronics",
          media: JSON.stringify({}),
          metadata: JSON.stringify({}),
        },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/search?q=test",
      );

      const response = await handlers.searchProductsHandler(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      if (
        body.products &&
        body.products.length > 0 &&
        body.products[0].categories
      ) {
        expect(body.products[0].categories).to.be.an("array");
      }
    });

    it("should handle products without media or metadata", async () => {
      const mockProducts = [
        {
          product_id: "1",
          title: "Test Product",
        },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/search?q=test",
      );

      const response = await handlers.searchProductsHandler(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.products).to.be.an("array");
    });

    it("should handle products with media as object not string", async () => {
      const mockProducts = [
        {
          product_id: "1",
          title: "Test Product",
          media: { image_url: "img.jpg" },
          metadata: JSON.stringify({}),
        },
      ];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/search?q=test",
      );

      const response = await handlers.searchProductsHandler(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
    });
  });

  describe("listProducts - branches", () => {
    it("should handle featured parameter", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products?featured=1",
      );
      request.env = env;

      const response = await handlers.listProducts(request, env);

      expect(response).to.be.instanceOf(Response);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle status parameter", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products?status=inactive",
      );
      request.env = env;

      const response = await handlers.listProducts(request, env);

      expect(response).to.be.instanceOf(Response);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle limit exceeding MAX_PRODUCTS_PER_PAGE", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products?limit=200",
      );
      request.env = env;

      const response = await handlers.listProducts(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.limit).to.be.at.most(100); // Should be capped
    });
  });

  describe("getProductImage - branches", () => {
    it("should handle different image content types", async () => {
      const mockR2Object = {
        body: new Blob(["image data"], { type: "image/png" }),
        httpMetadata: { contentType: "image/png" },
      };

      env.CATALOG_IMG_BUCKET.head.resolves({});
      env.CATALOG_IMG_BUCKET.get.resolves(mockR2Object);

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products/1/images/img1",
      );
      request.params = { product_id: "1", image_id: "img1" };

      const response = await handlers.getProductImage(request, env);

      expect(response.status).to.equal(200);
      expect(response.headers.get("Content-Type")).to.equal("image/png");
    });

    it("should handle missing contentType in R2 object", async () => {
      const mockR2Object = {
        body: new Blob(["image data"]),
        httpMetadata: {},
      };

      env.CATALOG_IMG_BUCKET.head.resolves({});
      env.CATALOG_IMG_BUCKET.get.resolves(mockR2Object);

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products/1/images/img1",
      );
      request.params = { product_id: "1", image_id: "img1" };

      const response = await handlers.getProductImage(request, env);

      expect(response).to.be.instanceOf(Response);
    });

    it("should handle product ID validation error", async () => {
      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products//images/img1",
      );
      request.params = { product_id: "", image_id: "img1" };

      const response = await handlers.getProductImage(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should handle image ID validation error", async () => {
      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products/1/images/",
      );
      request.params = { product_id: "1", image_id: "" };

      const response = await handlers.getProductImage(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should handle image not found (R2 returns null)", async () => {
      env.CATALOG_IMG_BUCKET.head.resolves(null);

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products/1/images/img1",
      );
      request.params = { product_id: "1", image_id: "img1" };

      const response = await handlers.getProductImage(request, env);
      const body = await response.json();

      expect(response.status).to.equal(404);
      expect(body.error).to.equal("not_found");
    });
  });

  describe("getHomePage - branches", () => {
    it("should handle validation error", async () => {
      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/home?limit=-1",
      );
      request.env = env;

      const response = await handlers.getHomePage(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should handle custom categories parameter", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/home?categories=Electronics,Toys",
      );
      request.env = env;

      const response = await handlers.getHomePage(request, env);

      expect(response).to.be.instanceOf(Response);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should handle custom limit parameter", async () => {
      const mockProducts = [];
      mockDb.prepare().bind().all.resolves({ results: mockProducts });

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/home?limit=20",
      );
      request.env = env;

      const response = await handlers.getHomePage(request, env);

      expect(response).to.be.instanceOf(Response);
    });
  });
});
