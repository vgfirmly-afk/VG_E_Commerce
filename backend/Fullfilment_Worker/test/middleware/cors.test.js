// test/middleware/cors.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import {
  handleCORS,
  addCORSHeaders,
  withCORS,
} from "../../src/middleware/cors.js";
import { createMockRequest } from "../setup.js";

describe("CORS Middleware", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("handleCORS", () => {
    it("should return 204 response with CORS headers", () => {
      const request = createMockRequest("OPTIONS", "https://example.com/api");
      request.headers.set("Origin", "https://example.com");

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

    it("should use wildcard when no Origin header", () => {
      const request = createMockRequest("OPTIONS", "https://example.com/api");

      const response = handleCORS(request);

      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("*");
      expect(response.headers.get("Access-Control-Allow-Credentials")).to.equal(
        "false",
      );
    });

    it("should set credentials when specific origin provided", () => {
      const request = createMockRequest("OPTIONS", "https://example.com/api");
      request.headers.set("Origin", "https://example.com");

      const response = handleCORS(request);

      expect(response.headers.get("Access-Control-Allow-Credentials")).to.equal(
        "true",
      );
    });
  });

  describe("addCORSHeaders", () => {
    it("should add CORS headers to response", () => {
      const request = createMockRequest("GET", "https://example.com/api");
      request.headers.set("Origin", "https://example.com");

      const originalResponse = new Response(JSON.stringify({ data: "test" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      const response = addCORSHeaders(request, originalResponse);

      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal(
        "https://example.com",
      );
      expect(response.status).to.equal(200);
    });

    it("should return response unchanged if not a Response object", () => {
      const request = createMockRequest("GET", "https://example.com/api");
      const notAResponse = { status: 200 };

      const result = addCORSHeaders(request, notAResponse);

      expect(result).to.deep.equal(notAResponse);
    });

    it("should handle null response", () => {
      const request = createMockRequest("GET", "https://example.com/api");

      const result = addCORSHeaders(request, null);

      expect(result).to.be.null;
    });

    it("should use wildcard when no Origin header", () => {
      const request = createMockRequest("GET", "https://example.com/api");

      const originalResponse = new Response(JSON.stringify({ data: "test" }), {
        status: 200,
      });

      const response = addCORSHeaders(request, originalResponse);

      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal("*");
    });
  });

  describe("withCORS", () => {
    it("should handle OPTIONS request with preflight", async () => {
      const request = createMockRequest("OPTIONS", "https://example.com/api");
      request.headers.set("Origin", "https://example.com");

      const mockHandler = sinon.stub().resolves(new Response("OK"));
      const wrappedHandler = withCORS(mockHandler);

      const response = await wrappedHandler(request, {}, {});

      expect(response.status).to.equal(204);
      expect(mockHandler).to.not.have.been.called;
    });

    it("should add CORS headers to response from handler", async () => {
      const request = createMockRequest("GET", "https://example.com/api");
      request.headers.set("Origin", "https://example.com");

      const mockHandler = sinon.stub().resolves(
        new Response(JSON.stringify({ data: "test" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
      const wrappedHandler = withCORS(mockHandler);

      const response = await wrappedHandler(request, {}, {});

      expect(response.headers.get("Access-Control-Allow-Origin")).to.equal(
        "https://example.com",
      );
      expect(response.status).to.equal(200);
      expect(mockHandler).to.have.been.called;
    });

    it("should pass env and ctx to handler", async () => {
      const request = createMockRequest("GET", "https://example.com/api");
      const env = { TEST: "value" };
      const ctx = { waitUntil: sinon.stub() };

      const mockHandler = sinon.stub().resolves(new Response("OK"));
      const wrappedHandler = withCORS(mockHandler);

      await wrappedHandler(request, env, ctx);

      expect(mockHandler).to.have.been.calledWith(request, env, ctx);
    });
  });
});
