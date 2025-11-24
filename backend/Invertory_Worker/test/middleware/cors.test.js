// test/middleware/cors.test.js
import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import * as cors from "../../src/middleware/cors.js";
import { createMockRequest } from "../setup.js";

describe("CORS Middleware", () => {
  describe("handleCORS", () => {
    it("should handle OPTIONS preflight request", () => {
      const request = createMockRequest("OPTIONS", "https://example.com/api/v1/stock/sku-1", null, {
        Origin: "https://example.com",
      });

      const response = cors.handleCORS(request);

      expect(response.status).to.equal(204);
      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("https://example.com");
      expect(response.headers.get("Access-Control-Allow-Methods")).to.include("GET");
      expect(response.headers.get("Access-Control-Allow-Methods")).to.include("POST");
      expect(response.headers.get("Access-Control-Allow-Headers")).to.include("Content-Type");
      expect(response.headers.get("Access-Control-Allow-Headers")).to.include("Authorization");
    });

    it("should use wildcard when Origin is not present", () => {
      const request = createMockRequest("OPTIONS", "https://example.com/api/v1/stock/sku-1");

      const response = cors.handleCORS(request);

      expect(response.status).to.equal(204);
      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("*");
    });
  });

  describe("addCORSHeaders", () => {
    it("should add CORS headers to response", () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/stock/sku-1", null, {
        Origin: "https://example.com",
      });

      const originalResponse = new Response(JSON.stringify({ data: "test" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      const response = cors.addCORSHeaders(request, originalResponse);

      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("https://example.com");
      expect(response.headers.get("Access-Control-Allow-Methods")).to.include("GET");
      expect(response.headers.get("Access-Control-Allow-Headers")).to.include("Authorization");
    });

    it("should preserve original response status", () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/stock/sku-1");
      const originalResponse = new Response("Error", { status: 404 });

      const response = cors.addCORSHeaders(request, originalResponse);

      expect(response.status).to.equal(404);
    });

    it("should return original response if not a Response object", () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/stock/sku-1");
      const notAResponse = { data: "test" };

      const result = cors.addCORSHeaders(request, notAResponse);

      expect(result).to.equal(notAResponse);
    });

    it("should set credentials header when origin is specific", () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/stock/sku-1", null, {
        Origin: "https://example.com",
      });

      const originalResponse = new Response("OK", { status: 200 });
      const response = cors.addCORSHeaders(request, originalResponse);

      expect(response.headers.get("Access-Control-Allow-Credentials")).to.equal("true");
    });

    it("should not set credentials header when origin is wildcard", () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/stock/sku-1");

      const originalResponse = new Response("OK", { status: 200 });
      const response = cors.addCORSHeaders(request, originalResponse);

      expect(response.headers.get("Access-Control-Allow-Credentials")).to.be.null;
    });
  });

  describe("withCORS", () => {
    it("should handle OPTIONS request", async () => {
      const request = createMockRequest("OPTIONS", "https://example.com/api/v1/stock/sku-1", null, {
        Origin: "https://example.com",
      });

      const handler = async () => new Response("Handler response");
      const wrappedHandler = cors.withCORS(handler);

      const response = await wrappedHandler(request, {}, {});

      expect(response.status).to.equal(204);
    });

    it("should add CORS headers to handler response", async () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/stock/sku-1", null, {
        Origin: "https://example.com",
      });

      const handler = async () => new Response("Handler response", { status: 200 });
      const wrappedHandler = cors.withCORS(handler);

      const response = await wrappedHandler(request, {}, {});

      expect(response.status).to.equal(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("https://example.com");
    });

    it("should call handler for non-OPTIONS requests", async () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/stock/sku-1");
      let handlerCalled = false;

      const handler = async () => {
        handlerCalled = true;
        return new Response("Handler response");
      };

      const wrappedHandler = cors.withCORS(handler);
      await wrappedHandler(request, {}, {});

      expect(handlerCalled).to.be.true;
    });
  });
});

