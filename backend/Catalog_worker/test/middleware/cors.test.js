// test/middleware/cors.test.js
import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import {
  handleCORS,
  addCORSHeaders,
  withCORS,
} from "../../src/middleware/cors.js";
import { createMockRequest } from "../setup.js";

describe("CORS Middleware", () => {
  describe("handleCORS", () => {
    it("should return 204 for OPTIONS request", () => {
      const request = createMockRequest(
        "OPTIONS",
        "https://example.com/api/v1/products",
        null,
        {
          Origin: "https://example.com",
        },
      );
      const response = handleCORS(request);

      expect(response.status).to.equal(204);
    });

    it("should set CORS headers with origin", () => {
      const request = createMockRequest(
        "OPTIONS",
        "https://example.com/api/v1/products",
        null,
        {
          Origin: "https://example.com",
        },
      );
      const response = handleCORS(request);

      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal(
        "https://example.com",
      );
      expect(response.headers.get("Access-Control-Allow-Methods")).to.include(
        "GET",
      );
      expect(response.headers.get("Access-Control-Allow-Headers")).to.include(
        "Authorization",
      );
    });

    it("should use wildcard if no origin", () => {
      const request = createMockRequest(
        "OPTIONS",
        "https://example.com/api/v1/products",
      );
      const response = handleCORS(request);

      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("*");
      expect(response.headers.get("Access-Control-Allow-Credentials")).to.equal(
        "false",
      );
    });

    it("should set credentials for specific origin", () => {
      const request = createMockRequest(
        "OPTIONS",
        "https://example.com/api/v1/products",
        null,
        {
          Origin: "https://example.com",
        },
      );
      const response = handleCORS(request);

      expect(response.headers.get("Access-Control-Allow-Credentials")).to.equal(
        "true",
      );
    });
  });

  describe("addCORSHeaders", () => {
    it("should add CORS headers to response", () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products",
        null,
        {
          Origin: "https://example.com",
        },
      );
      const response = new Response(JSON.stringify({ data: "test" }), {
        status: 200,
      });

      const newResponse = addCORSHeaders(request, response);

      expect(newResponse.headers.get("Access-Control-Allow-Origin")).to.equal(
        "https://example.com",
      );
      expect(newResponse.status).to.equal(200);
    });

    it("should preserve response body and status", () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products",
      );
      const response = new Response("test body", { status: 404 });

      const newResponse = addCORSHeaders(request, response);

      expect(newResponse.status).to.equal(404);
    });

    it("should return response as-is if not a Response object", () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products",
      );
      const nonResponse = { not: "a response" };

      const result = addCORSHeaders(request, nonResponse);
      expect(result).to.equal(nonResponse);
    });
  });

  describe("withCORS", () => {
    it("should handle OPTIONS request", async () => {
      const handler = withCORS(async () => new Response("test"));
      const request = createMockRequest(
        "OPTIONS",
        "https://example.com/api/v1/products",
      );

      const response = await handler(request, {}, {});

      expect(response.status).to.equal(204);
    });

    it("should wrap handler response with CORS headers", async () => {
      const handler = withCORS(async () => new Response("test"));
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/products",
        null,
        {
          Origin: "https://example.com",
        },
      );

      const response = await handler(request, {}, {});

      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal(
        "https://example.com",
      );
    });

    it("should pass request, env, and ctx to handler", async () => {
      let receivedEnv, receivedCtx;
      const handler = withCORS(async (req, env, ctx) => {
        receivedEnv = env;
        receivedCtx = ctx;
        return new Response("test");
      });
      const env = { test: "env" };
      const ctx = { test: "ctx" };

      await handler(
        createMockRequest("GET", "https://example.com/api/v1/products"),
        env,
        ctx,
      );

      expect(receivedEnv).to.equal(env);
      expect(receivedCtx).to.equal(ctx);
    });
  });
});
