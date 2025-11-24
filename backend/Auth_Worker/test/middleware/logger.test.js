// test/middleware/logger.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import withLogger from "../../src/middleware/logger.js";
import { createMockRequest, createMockEnv, createMockSpan } from "../setup.js";
import { trace, context } from "@opentelemetry/api";

describe("Logger Middleware", () => {
  let env;
  let request;

  beforeEach(() => {
    env = createMockEnv();
    // Mock OpenTelemetry
    sinon.stub(trace, "getSpan").returns(createMockSpan());
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should log request and add trace headers", async () => {
    request = createMockRequest("GET", "https://example.com/api/v1/auth/me");

    const handler = async (req, env, ctx) => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const wrappedHandler = withLogger(handler);
    const response = await wrappedHandler(request, env);

    expect(response.status).to.equal(200);
    expect(response.headers.get("x-trace-id")).to.exist;
    expect(response.headers.get("x-span-id")).to.exist;
  });

  it("should handle requests without active span", async () => {
    trace.getSpan.restore();
    sinon.stub(trace, "getSpan").returns(null);

    request = createMockRequest("GET", "https://example.com/api/v1/auth/me");

    const handler = async (req, env, ctx) => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const wrappedHandler = withLogger(handler);
    const response = await wrappedHandler(request, env);

    expect(response.status).to.equal(200);
    expect(response.headers.get("x-trace-id")).to.equal("none");
  });

  it("should add Cloudflare Ray ID to span", async () => {
    const mockSpan = createMockSpan();
    trace.getSpan.restore();
    sinon.stub(trace, "getSpan").returns(mockSpan);

    request = createMockRequest(
      "GET",
      "https://example.com/api/v1/auth/me",
      null,
      {
        "cf-ray": "test-ray-id",
      },
    );
    request.cf = { colo: "DFW" };

    const handler = async (req, env, ctx) => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const wrappedHandler = withLogger(handler);
    await wrappedHandler(request, env);

    expect(mockSpan.setAttribute).to.have.been.calledWith(
      "cfray",
      "test-ray-id",
    );
    expect(mockSpan.setAttribute).to.have.been.calledWith("colo", "DFW");
  });

  it("should handle errors when setting headers gracefully", async () => {
    request = createMockRequest("GET", "https://example.com/api/v1/auth/me");

    const handler = async (req, env, ctx) => {
      const response = new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
      // Make headers non-writable
      sinon
        .stub(response.headers, "set")
        .throws(new Error("Cannot set header"));
      return response;
    };

    const wrappedHandler = withLogger(handler);
    const response = await wrappedHandler(request, env);

    // Should still return response even if header setting fails
    expect(response.status).to.equal(200);
  });

  it("should add request and response events to span", async () => {
    const mockSpan = createMockSpan();
    trace.getSpan.restore();
    sinon.stub(trace, "getSpan").returns(mockSpan);

    request = createMockRequest("GET", "https://example.com/api/v1/auth/me");

    const handler = async (req, env, ctx) => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const wrappedHandler = withLogger(handler);
    await wrappedHandler(request, env);

    expect(mockSpan.addEvent).to.have.been.calledWith(
      "request.start",
      sinon.match.object,
    );
    expect(mockSpan.addEvent).to.have.been.calledWith(
      "response.end",
      sinon.match.object,
    );
  });
});
