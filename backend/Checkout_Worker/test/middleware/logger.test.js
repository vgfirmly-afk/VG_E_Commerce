// test/middleware/logger.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as opentelemetry from "@opentelemetry/api";
import withLogger from "../../src/middleware/logger.js";
import { createMockRequest } from "../setup.js";

describe("Logger Middleware", () => {
  let mockSpan;
  let getSpanStub;
  let consoleLogStub;
  let consoleErrorStub;

  beforeEach(() => {
    mockSpan = {
      spanContext: sinon.stub().returns({
        traceId: "test-trace-id",
        spanId: "test-span-id",
      }),
      addEvent: sinon.stub(),
      setAttribute: sinon.stub(),
    };

    getSpanStub = sinon.stub(opentelemetry.trace, "getSpan").returns(mockSpan);
    sinon.stub(opentelemetry.context, "active").returns({});
    consoleLogStub = sinon.stub(console, "log");
    consoleErrorStub = sinon.stub(console, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should add trace headers to response", async () => {
    const request = createMockRequest("GET", "https://example.com/api");
    const handler = async () => new Response("test", { status: 200 });
    const wrappedHandler = withLogger(handler);

    const response = await wrappedHandler(request, {}, {});

    expect(response.headers.get("x-trace-id")).to.equal("test-trace-id");
    expect(response.headers.get("x-span-id")).to.equal("test-span-id");
    expect(consoleLogStub).to.have.been.called;
  });

  it("should log request start event", async () => {
    const request = createMockRequest("POST", "https://example.com/api");
    const handler = async () => new Response("test", { status: 200 });
    const wrappedHandler = withLogger(handler);

    await wrappedHandler(request, {}, {});

    expect(mockSpan.addEvent).to.have.been.calledWith(
      "request.start",
      sinon.match.object,
    );
  });

  it("should log response end event", async () => {
    const request = createMockRequest("GET", "https://example.com/api");
    const handler = async () => new Response("test", { status: 200 });
    const wrappedHandler = withLogger(handler);

    await wrappedHandler(request, {}, {});

    expect(mockSpan.addEvent).to.have.been.calledWith(
      "response.end",
      sinon.match.object,
    );
  });

  it("should handle handler errors", async () => {
    const request = createMockRequest("GET", "https://example.com/api");
    const handler = async () => {
      throw new Error("Test error");
    };
    const wrappedHandler = withLogger(handler);

    const response = await wrappedHandler(request, {}, {});

    expect(response.status).to.equal(500);
    expect(consoleErrorStub).to.have.been.called;
  });

  it("should handle non-Response return value", async () => {
    const request = createMockRequest("GET", "https://example.com/api");
    const handler = async () => "not a response";
    const wrappedHandler = withLogger(handler);

    const response = await wrappedHandler(request, {}, {});

    expect(response.status).to.equal(500);
    expect(response.headers.get("x-trace-id")).to.equal("test-trace-id");
  });

  it("should handle CF-Ray header if present", async () => {
    const request = createMockRequest("GET", "https://example.com/api");
    request.headers.set("cf-ray", "test-ray-id");
    const handler = async () => new Response("test", { status: 200 });
    const wrappedHandler = withLogger(handler);

    await wrappedHandler(request, {}, {});

    expect(mockSpan.setAttribute).to.have.been.calledWith(
      "cfray",
      "test-ray-id",
    );
  });

  it("should work without active span", async () => {
    getSpanStub.returns(null);
    const request = createMockRequest("GET", "https://example.com/api");
    const handler = async () => new Response("test", { status: 200 });
    const wrappedHandler = withLogger(handler);

    const response = await wrappedHandler(request, {}, {});

    expect(response.headers.get("x-trace-id")).to.equal("none");
    expect(response.headers.get("x-span-id")).to.equal("none");
  });
});
