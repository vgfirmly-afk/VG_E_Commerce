// test/middleware/cors.test.js
import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import {
  handleCORS,
  addCORSHeaders,
  withCORS,
} from "../../src/middleware/cors.js";
import { createMockRequest } from "../setup.js";

describe("CORS Middleware", () => {
  describe("handleCORS", () => {
    it("should return CORS preflight response", () => {
      const request = createMockRequest("OPTIONS", "https://example.com/api/v1/payments");
      request.headers.set("Origin", "https://example.com");

      const response = handleCORS(request);

      expect(response.status).to.equal(204);
      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("https://example.com");
      expect(response.headers.get("Access-Control-Allow-Methods")).to.include("GET");
      expect(response.headers.get("Access-Control-Allow-Methods")).to.include("POST");
    });

    it("should use * when Origin header is missing", () => {
      const request = createMockRequest("OPTIONS", "https://example.com/api/v1/payments");

      const response = handleCORS(request);

      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("*");
    });
  });

  describe("addCORSHeaders", () => {
    it("should add CORS headers to response", () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/payments");
      request.headers.set("Origin", "https://example.com");
      const originalResponse = new Response(JSON.stringify({ ok: true }), {
        status: 200,
      });

      const response = addCORSHeaders(request, originalResponse);

      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("https://example.com");
      expect(response.status).to.equal(200);
    });

    it("should handle response that is not a Response object", () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/payments");
      const notAResponse = null;

      const result = addCORSHeaders(request, notAResponse);
      expect(result).to.be.null;
    });

    it("should set credentials when origin is not *", () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/payments");
      request.headers.set("Origin", "https://example.com");
      const originalResponse = new Response(JSON.stringify({ ok: true }), {
        status: 200,
      });

      const response = addCORSHeaders(request, originalResponse);

      expect(response.headers.get("Access-Control-Allow-Credentials")).to.equal("true");
    });

    it("should not set credentials when origin is *", () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/payments");
      const originalResponse = new Response(JSON.stringify({ ok: true }), {
        status: 200,
      });

      const response = addCORSHeaders(request, originalResponse);

      expect(response.headers.get("Access-Control-Allow-Credentials")).to.be.null;
    });
  });

  describe("withCORS", () => {
    it("should handle OPTIONS request", async () => {
      const request = createMockRequest("OPTIONS", "https://example.com/api/v1/payments");
      const handler = sinon.stub();
      const wrapped = withCORS(handler);

      const response = await wrapped(request, {}, {});

      expect(response.status).to.equal(204);
      expect(handler).to.not.have.been.called;
    });

    it("should call handler and add CORS headers for non-OPTIONS request", async () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/payments");
      const mockResponse = new Response(JSON.stringify({ ok: true }), {
        status: 200,
      });
      const handler = sinon.stub().resolves(mockResponse);
      const wrapped = withCORS(handler);

      const response = await wrapped(request, {}, {});

      expect(handler).to.have.been.called;
      expect(response.headers.get("Access-Control-Allow-Origin")).to.exist;
    });
  });
});

