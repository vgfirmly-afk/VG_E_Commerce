// test/middleware/cors.test.js
import { describe, it } from "mocha";
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
        "https://example.com/api/v1/cart",
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
        "https://example.com/api/v1/cart",
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
        "Content-Type",
      );
    });

    it("should use wildcard if no origin", () => {
      const request = createMockRequest(
        "OPTIONS",
        "https://example.com/api/v1/cart",
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
        "https://example.com/api/v1/cart",
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
        "https://example.com/api/v1/cart",
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
        "https://example.com/api/v1/cart",
      );
      const response = new Response("test body", { status: 404 });

      const newResponse = addCORSHeaders(request, response);

      expect(newResponse.status).to.equal(404);
    });

    it("should return response as-is if not a Response object", () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/cart",
      );
      const nonResponse = { not: "a response" };

      const result = addCORSHeaders(request, nonResponse);
      expect(result).to.equal(nonResponse);
    });

    it("should use wildcard origin if no origin header", () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/cart",
      );
      const response = new Response("test", { status: 200 });

      const newResponse = addCORSHeaders(request, response);

      expect(newResponse.headers.get("Access-Control-Allow-Origin")).to.equal(
        "*",
      );
    });
  });

  describe("withCORS", () => {
    it("should handle OPTIONS request", async () => {
      const handler = withCORS(async () => new Response("test"));
      const request = createMockRequest(
        "OPTIONS",
        "https://example.com/api/v1/cart",
      );

      const response = await handler(request, {}, {});

      expect(response.status).to.equal(204);
    });

    it("should wrap handler response with CORS headers", async () => {
      const handler = withCORS(async () => new Response("test"));
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/cart",
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
        createMockRequest("GET", "https://example.com/api/v1/cart"),
        env,
        ctx,
      );

      expect(receivedEnv).to.equal(env);
      expect(receivedCtx).to.equal(ctx);
    });
  });
});
