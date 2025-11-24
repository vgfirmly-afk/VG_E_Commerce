// test/middleware/cors.test.js
import { describe, it } from "mocha";
import { expect } from "chai";
import {
  handleCORS,
  addCORSHeaders,
  withCORS,
} from "../../src/middleware/cors.js";
import { createMockRequest } from "../setup.js";

describe("CORS Middleware", () => {
  describe("handleCORS", () => {
    it("should handle OPTIONS request with Origin header", () => {
      const request = createMockRequest(
        "OPTIONS",
        "https://example.com/api",
        null,
        {
          Origin: "https://example.com",
        },
      );

      const response = handleCORS(request);

      expect(response.status).to.equal(204);
      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal(
        "https://example.com",
      );
      expect(response.headers.get("Access-Control-Allow-Methods")).to.include(
        "GET",
      );
      expect(response.headers.get("Access-Control-Allow-Methods")).to.include(
        "POST",
      );
    });

    it("should handle OPTIONS request without Origin header", () => {
      const request = createMockRequest("OPTIONS", "https://example.com/api");

      const response = handleCORS(request);

      expect(response.status).to.equal(204);
      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("*");
    });
  });

  describe("addCORSHeaders", () => {
    it("should add CORS headers to response", () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api",
        null,
        {
          Origin: "https://example.com",
        },
      );
      const originalResponse = new Response(JSON.stringify({ data: "test" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      const response = addCORSHeaders(request, originalResponse);

      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal(
        "https://example.com",
      );
      expect(response.headers.get("Access-Control-Allow-Methods")).to.include(
        "GET",
      );
      expect(response.status).to.equal(200);
    });

    it("should handle response without Origin header", () => {
      const request = createMockRequest("GET", "https://example.com/api");
      const originalResponse = new Response(JSON.stringify({ data: "test" }), {
        status: 200,
      });

      const response = addCORSHeaders(request, originalResponse);

      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("*");
    });

    it("should return response as-is if not a Response object", () => {
      const request = createMockRequest("GET", "https://example.com/api");
      const notAResponse = { data: "test" };

      const result = addCORSHeaders(request, notAResponse);

      expect(result).to.equal(notAResponse);
    });

    it("should set credentials header for specific origin", () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api",
        null,
        {
          Origin: "https://example.com",
        },
      );
      const originalResponse = new Response(JSON.stringify({ data: "test" }), {
        status: 200,
      });

      const response = addCORSHeaders(request, originalResponse);

      expect(response.headers.get("Access-Control-Allow-Credentials")).to.equal(
        "true",
      );
    });

    it("should not set credentials header for wildcard origin", () => {
      const request = createMockRequest("GET", "https://example.com/api");
      const originalResponse = new Response(JSON.stringify({ data: "test" }), {
        status: 200,
      });

      const response = addCORSHeaders(request, originalResponse);

      expect(response.headers.get("Access-Control-Allow-Credentials")).to.be
        .null;
    });
  });

  describe("withCORS", () => {
    it("should handle OPTIONS request", async () => {
      const request = createMockRequest(
        "OPTIONS",
        "https://example.com/api",
        null,
        {
          Origin: "https://example.com",
        },
      );
      const handler = async () => new Response("test");
      const wrappedHandler = withCORS(handler);

      const response = await wrappedHandler(request, {}, {});

      expect(response.status).to.equal(204);
    });

    it("should add CORS headers to handler response", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api",
        null,
        {
          Origin: "https://example.com",
        },
      );
      const handler = async () => new Response("test", { status: 200 });
      const wrappedHandler = withCORS(handler);

      const response = await wrappedHandler(request, {}, {});

      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal(
        "https://example.com",
      );
      expect(response.status).to.equal(200);
    });
  });
});
