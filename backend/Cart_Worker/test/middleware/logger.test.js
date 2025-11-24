// test/middleware/logger.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { trace, context } from "@opentelemetry/api";
import withLogger from "../../src/middleware/logger.js";
import { createMockRequest, createMockSpan } from "../setup.js";

describe("Logger Middleware", () => {
  let mockSpan;
  let originalGetSpan;

  beforeEach(() => {
    mockSpan = createMockSpan();
    originalGetSpan = trace.getSpan;
    trace.getSpan = sinon.stub().returns(mockSpan);
  });

  afterEach(() => {
    trace.getSpan = originalGetSpan;
    sinon.restore();
  });

  it("should wrap handler and add trace headers", async () => {
    const handler = withLogger(
      async () => new Response("test", { status: 200 }),
    );
    const request = createMockRequest("GET", "https://example.com/api/v1/cart");

    const response = await handler(request, {}, {});

    expect(response).to.be.instanceOf(Response);
    expect(response.headers.get("x-trace-id")).to.equal("test-trace-id");
    expect(response.headers.get("x-span-id")).to.equal("test-span-id");
  });

  it("should handle handler errors gracefully", async () => {
    const handler = withLogger(async () => {
      throw new Error("Test error");
    });
    const request = createMockRequest("GET", "https://example.com/api/v1/cart");

    const response = await handler(request, {}, {});

    expect(response).to.be.instanceOf(Response);
    expect(response.status).to.equal(500);
    const body = await response.json();
    expect(body.error).to.equal("internal_error");
  });

  it("should add request event to span", async () => {
    const handler = withLogger(async () => new Response("test"));
    const request = createMockRequest("GET", "https://example.com/api/v1/cart");

    await handler(request, {}, {});

    expect(mockSpan.addEvent).to.have.been.calledWith(
      "request.start",
      sinon.match.object,
    );
  });

  it("should add response event to span", async () => {
    const handler = withLogger(
      async () => new Response("test", { status: 200 }),
    );
    const request = createMockRequest("GET", "https://example.com/api/v1/cart");

    await handler(request, {}, {});

    expect(mockSpan.addEvent).to.have.been.calledWith(
      "response.end",
      sinon.match.object,
    );
  });

  it("should handle missing span gracefully", async () => {
    trace.getSpan = sinon.stub().returns(null);
    const handler = withLogger(async () => new Response("test"));
    const request = createMockRequest("GET", "https://example.com/api/v1/cart");

    const response = await handler(request, {}, {});

    expect(response).to.be.instanceOf(Response);
    expect(response.headers.get("x-trace-id")).to.equal("none");
  });

  it("should handle non-Response return value", async () => {
    const handler = withLogger(async () => "not a response");
    const request = createMockRequest("GET", "https://example.com/api/v1/cart");

    const response = await handler(request, {}, {});

    expect(response).to.be.instanceOf(Response);
    expect(response.status).to.equal(500);
  });

  it("should inject Cloudflare Ray ID if present", async () => {
    const request = createMockRequest("GET", "https://example.com/api/v1/cart");
    request.headers.set("cf-ray", "test-ray-id");
    request.cf = { colo: "test-colo" };

    const handler = withLogger(async () => new Response("test"));
    await handler(request, {}, {});

    expect(mockSpan.setAttribute).to.have.been.calledWith(
      "cfray",
      "test-ray-id",
    );
    expect(mockSpan.setAttribute).to.have.been.calledWith("colo", "test-colo");
  });
});
