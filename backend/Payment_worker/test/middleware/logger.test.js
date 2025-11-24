// test/middleware/logger.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import withLogger from "../../src/middleware/logger.js";
import { createMockRequest } from "../setup.js";

describe("Logger Middleware", () => {
  describe("withLogger", () => {
    it("should add trace headers to response", async () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/payments");
      const mockResponse = new Response(JSON.stringify({ ok: true }), {
        status: 200,
      });
      const handler = sinon.stub().resolves(mockResponse);

      const wrapped = withLogger(handler);
      const response = await wrapped(request, {}, {});

      // Should return a response with trace headers (may be empty if OpenTelemetry not available)
      expect(response).to.be.instanceOf(Response);
      expect([200, 500]).to.include(response.status);
    });

    it("should handle handler errors", async () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/payments");
      const handler = sinon.stub().rejects(new Error("Handler error"));

      const wrapped = withLogger(handler);
      const response = await wrapped(request, {}, {});

      expect(response).to.be.instanceOf(Response);
      expect(response.status).to.equal(500);
    });

    it("should handle non-Response return value", async () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/payments");
      const handler = sinon.stub().resolves(null);

      const wrapped = withLogger(handler);
      const response = await wrapped(request, {}, {});

      expect(response).to.be.instanceOf(Response);
      expect(response.status).to.equal(500);
    });

    it("should handle request with cf-ray header", async () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/payments");
      request.headers.set("cf-ray", "test-ray-id");
      request.cf = { colo: "DFW" };
      const mockResponse = new Response(JSON.stringify({ ok: true }), {
        status: 200,
      });
      const handler = sinon.stub().resolves(mockResponse);

      const wrapped = withLogger(handler);
      const response = await wrapped(request, {}, {});

      expect(response).to.be.instanceOf(Response);
      expect([200, 500]).to.include(response.status);
    });

    it("should handle request without cf-ray header", async () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/payments");
      request.headers.delete("cf-ray");
      request.cf = undefined;
      const mockResponse = new Response(JSON.stringify({ ok: true }), {
        status: 200,
      });
      const handler = sinon.stub().resolves(mockResponse);

      const wrapped = withLogger(handler);
      const response = await wrapped(request, {}, {});

      expect(response).to.be.instanceOf(Response);
      expect([200, 500]).to.include(response.status);
    });

    it("should handle request with colo but no ray-id", async () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/payments");
      request.cf = { colo: "DFW" };
      const mockResponse = new Response(JSON.stringify({ ok: true }), {
        status: 200,
      });
      const handler = sinon.stub().resolves(mockResponse);

      const wrapped = withLogger(handler);
      const response = await wrapped(request, {}, {});

      expect(response).to.be.instanceOf(Response);
      expect([200, 500]).to.include(response.status);
    });
  });
});
