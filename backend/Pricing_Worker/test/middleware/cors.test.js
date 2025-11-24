// test/middleware/cors.test.js
import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import * as cors from "../../src/middleware/cors.js";
import { createMockRequest } from "../setup.js";

describe("CORS Middleware", () => {
  describe("handleCORS", () => {
    it("should return 204 for OPTIONS request", () => {
      const request = createMockRequest("OPTIONS", "https://example.com/api/v1/prices/test-sku-id", null, {
        Origin: "https://example.com",
      });

      const response = cors.handleCORS(request);
      expect(response.status).to.equal(204);
      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("https://example.com");
    });

    it("should allow all origins when Origin header is missing", () => {
      const request = createMockRequest("OPTIONS", "https://example.com/api/v1/prices/test-sku-id");

      const response = cors.handleCORS(request);
      expect(response.status).to.equal(204);
      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("*");
    });
  });

  describe("addCORSHeaders", () => {
    it("should add CORS headers to response", () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/prices/test-sku-id", null, {
        Origin: "https://example.com",
      });

      const originalResponse = new Response(JSON.stringify({ data: "test" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      const response = cors.addCORSHeaders(request, originalResponse);
      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("https://example.com");
      expect(response.headers.get("Access-Control-Allow-Methods")).to.include("GET");
    });

    it("should handle null response", () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/prices/test-sku-id");

      const response = cors.addCORSHeaders(request, null);
      expect(response).to.be.null;
    });
  });

  describe("withCORS", () => {
    it("should handle OPTIONS request", async () => {
      const request = createMockRequest("OPTIONS", "https://example.com/api/v1/prices/test-sku-id", null, {
        Origin: "https://example.com",
      });

      const handler = cors.withCORS(async () => {
        return new Response("OK");
      });

      const response = await handler(request, request.env, {});
      expect(response.status).to.equal(204);
    });

    it("should add CORS headers to response", async () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/prices/test-sku-id", null, {
        Origin: "https://example.com",
      });

      const handler = cors.withCORS(async () => {
        return new Response(JSON.stringify({ data: "test" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      });

      const response = await handler(request, request.env, {});
      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("https://example.com");
    });
  });
});

