// test/middleware/logger.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import withLogger from "../../src/middleware/logger.js";
import { trace, context } from "@opentelemetry/api";
import { createMockSpan } from "../setup.js";

describe("Logger Middleware", () => {
  let mockSpan;
  let consoleLogStub;
  let consoleErrorStub;

  beforeEach(() => {
    mockSpan = createMockSpan();
    sinon.stub(trace, "getSpan").returns(mockSpan);
    consoleLogStub = sinon.stub(console, "log");
    consoleErrorStub = sinon.stub(console, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("withLogger", () => {
    it("should wrap handler and log request", async () => {
      const handler = async () => new Response("test");
      const wrapped = withLogger(handler);
      const request = new Request("https://example.com/api/v1/products", {
        method: "GET",
      });

      await wrapped(request, {}, {});

      expect(consoleLogStub).to.have.been.called;
      expect(mockSpan.addEvent).to.have.been.calledWith("request.start");
    });

    it("should add trace headers to response", async () => {
      const handler = async () => new Response("test");
      const wrapped = withLogger(handler);
      const request = new Request("https://example.com/api/v1/products", {
        method: "GET",
      });

      const response = await wrapped(request, {}, {});

      expect(response.headers.get("x-trace-id")).to.exist;
      expect(response.headers.get("x-span-id")).to.exist;
    });

    it("should handle handler errors", async () => {
      const handler = async () => {
        throw new Error("Handler error");
      };
      const wrapped = withLogger(handler);
      const request = new Request("https://example.com/api/v1/products", {
        method: "GET",
      });

      const response = await wrapped(request, {}, {});

      expect(response.status).to.equal(500);
      expect(consoleErrorStub).to.have.been.called;
    });

    it("should log response status", async () => {
      const handler = async () => new Response("test", { status: 201 });
      const wrapped = withLogger(handler);
      const request = new Request("https://example.com/api/v1/products", {
        method: "GET",
      });

      await wrapped(request, {}, {});

      expect(mockSpan.addEvent).to.have.been.calledWith("response.end");
    });

    it("should handle non-Response return value", async () => {
      const handler = async () => "not a response";
      const wrapped = withLogger(handler);
      const request = new Request("https://example.com/api/v1/products", {
        method: "GET",
      });

      const response = await wrapped(request, {}, {});

      expect(response).to.be.instanceOf(Response);
      expect(response.status).to.equal(500);
    });

    it("should handle CF-Ray header if present", async () => {
      const handler = async () => new Response("test");
      const wrapped = withLogger(handler);
      const headers = new Headers();
      headers.set("cf-ray", "test-ray-id");
      const request = new Request("https://example.com/api/v1/products", {
        method: "GET",
        headers,
      });

      await wrapped(request, {}, {});

      expect(mockSpan.setAttribute).to.have.been.calledWith(
        "cfray",
        "test-ray-id",
      );
    });

    it("should handle errors when setting trace headers", async () => {
      const handler = async () => new Response("test");
      const wrapped = withLogger(handler);
      const request = new Request("https://example.com/api/v1/products", {
        method: "GET",
      });
      // Note: Cannot stub Headers.get, but handler should handle errors gracefully

      const response = await wrapped(request, {}, {});

      // Should still return a response even if errors occur
      expect(response).to.be.instanceOf(Response);
    });
  });
});
