// test/middleware/cors.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import {
  handleCORS,
  addCORSHeaders,
  withCORS,
} from "../../src/middleware/cors.js";
import { createMockRequest, createMockEnv } from "../setup.js";

describe("CORS Middleware", () => {
  let env;
  let request;

  beforeEach(() => {
    env = createMockEnv();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("handleCORS", () => {
    it("should handle CORS preflight request with Origin header", () => {
      request = createMockRequest(
        "OPTIONS",
        "https://example.com/api/v1/auth/login",
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
      expect(response.headers.get("Access-Control-Allow-Credentials")).to.equal(
        "true",
      );
    });

    it("should handle CORS preflight request without Origin header", () => {
      request = createMockRequest(
        "OPTIONS",
        "https://example.com/api/v1/auth/login",
      );

      const response = handleCORS(request);

      expect(response.status).to.equal(204);
      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("*");
      expect(response.headers.get("Access-Control-Allow-Credentials")).to.equal(
        "false",
      );
    });
  });

  describe("addCORSHeaders", () => {
    it("should add CORS headers to response with Origin", () => {
      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/auth/me",
        null,
        {
          Origin: "https://example.com",
        },
      );

      const originalResponse = new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      const response = addCORSHeaders(request, originalResponse);

      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal(
        "https://example.com",
      );
      expect(response.headers.get("Access-Control-Allow-Credentials")).to.equal(
        "true",
      );
      expect(response.status).to.equal(200);
    });

    it("should add CORS headers to response without Origin", () => {
      request = createMockRequest("GET", "https://example.com/api/v1/auth/me");

      const originalResponse = new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      const response = addCORSHeaders(request, originalResponse);

      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("*");
      // When origin is '*', credentials header is not set (not 'false')
      expect(response.headers.get("Access-Control-Allow-Credentials")).to.be
        .null;
    });

    it("should return response unchanged if not a Response object", () => {
      request = createMockRequest("GET", "https://example.com/api/v1/auth/me");

      const notAResponse = { status: 200 };
      const result = addCORSHeaders(request, notAResponse);

      expect(result).to.equal(notAResponse);
    });
  });

  describe("withCORS", () => {
    it("should handle OPTIONS request", async () => {
      request = createMockRequest(
        "OPTIONS",
        "https://example.com/api/v1/auth/login",
        null,
        {
          Origin: "https://example.com",
        },
      );

      const handler = async (req, env, ctx) => {
        return new Response("Should not reach here");
      };

      const wrappedHandler = withCORS(handler);
      const response = await wrappedHandler(request, env);

      expect(response.status).to.equal(204);
      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal(
        "https://example.com",
      );
    });

    it("should add CORS headers to handler response", async () => {
      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/auth/me",
        null,
        {
          Origin: "https://example.com",
        },
      );

      const handler = async (req, env, ctx) => {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      };

      const wrappedHandler = withCORS(handler);
      const response = await wrappedHandler(request, env);

      expect(response.status).to.equal(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal(
        "https://example.com",
      );
      const body = await response.json();
      expect(body.ok).to.be.true;
    });
  });
});
