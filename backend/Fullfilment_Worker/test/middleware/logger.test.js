// test/middleware/logger.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import withLogger from "../../src/middleware/logger.js";
import { trace, context } from "@opentelemetry/api";
import { createMockRequest, createMockSpan } from "../setup.js";

describe("Logger Middleware", () => {
  let mockSpan;
  let traceStub;
  let contextStub;

  beforeEach(() => {
    mockSpan = createMockSpan();
    traceStub = sinon.stub(trace, "getSpan");
    contextStub = sinon.stub(context, "active");

    sinon.stub(console, "log");
    sinon.stub(console, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should wrap handler and add trace headers", async () => {
    traceStub.returns(mockSpan);

    const request = createMockRequest("GET", "https://example.com/api");
    const mockHandler = sinon
      .stub()
      .resolves(new Response("OK", { status: 200 }));

    const wrappedHandler = withLogger(mockHandler);
    const response = await wrappedHandler(request, {}, {});

    expect(response.headers.get("x-trace-id")).to.equal("test-trace-id");
    expect(response.headers.get("x-span-id")).to.equal("test-span-id");
    expect(mockHandler).to.have.been.called;
  });

  it("should log request information", async () => {
    traceStub.returns(mockSpan);

    const request = createMockRequest(
      "POST",
      "https://example.com/api/v1/orders",
    );
    const mockHandler = sinon.stub().resolves(new Response("OK"));

    const wrappedHandler = withLogger(mockHandler);
    await wrappedHandler(request, {}, {});

    expect(console.log).to.have.been.called;
    expect(mockSpan.addEvent).to.have.been.called;
  });

  it("should add Cloudflare Ray ID to span", async () => {
    traceStub.returns(mockSpan);

    const request = createMockRequest("GET", "https://example.com/api");
    request.headers.set("cf-ray", "test-ray-id");
    request.cf = { colo: "DFW" };

    const mockHandler = sinon.stub().resolves(new Response("OK"));

    const wrappedHandler = withLogger(mockHandler);
    await wrappedHandler(request, {}, {});

    expect(mockSpan.setAttribute).to.have.been.calledWith(
      "cfray",
      "test-ray-id",
    );
    expect(mockSpan.setAttribute).to.have.been.calledWith("colo", "DFW");
  });

  it("should handle handler errors gracefully", async () => {
    traceStub.returns(mockSpan);

    const request = createMockRequest("GET", "https://example.com/api");
    const mockHandler = sinon.stub().rejects(new Error("Handler error"));

    const wrappedHandler = withLogger(mockHandler);
    const response = await wrappedHandler(request, {}, {});

    expect(response.status).to.equal(500);
    expect(response.headers.get("x-trace-id")).to.equal("test-trace-id");
    expect(console.error).to.have.been.called;
  });

  it("should work without active span", async () => {
    traceStub.returns(null);

    const request = createMockRequest("GET", "https://example.com/api");
    const mockHandler = sinon.stub().resolves(new Response("OK"));

    const wrappedHandler = withLogger(mockHandler);
    const response = await wrappedHandler(request, {}, {});

    expect(response.headers.get("x-trace-id")).to.equal("none");
    expect(response.headers.get("x-span-id")).to.equal("none");
  });

  it("should handle invalid response from handler", async () => {
    traceStub.returns(mockSpan);

    const request = createMockRequest("GET", "https://example.com/api");
    const mockHandler = sinon.stub().resolves(null);

    const wrappedHandler = withLogger(mockHandler);
    const response = await wrappedHandler(request, {}, {});

    expect(response.status).to.equal(500);
    expect(console.error).to.have.been.called;
  });

  it("should add response event to span", async () => {
    traceStub.returns(mockSpan);

    const request = createMockRequest("GET", "https://example.com/api");
    const mockHandler = sinon
      .stub()
      .resolves(new Response("OK", { status: 201 }));

    const wrappedHandler = withLogger(mockHandler);
    await wrappedHandler(request, {}, {});

    const addEventCalls = mockSpan.addEvent.getCalls();
    const responseEvent = addEventCalls.find(
      (call) => call.args[0] === "response.end",
    );
    expect(responseEvent).to.exist;
  });

  it("should preserve response body", async () => {
    traceStub.returns(mockSpan);

    const request = createMockRequest("GET", "https://example.com/api");
    const responseBody = JSON.stringify({ data: "test" });
    const mockHandler = sinon.stub().resolves(
      new Response(responseBody, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const wrappedHandler = withLogger(mockHandler);
    const response = await wrappedHandler(request, {}, {});
    const body = await response.text();

    expect(body).to.equal(responseBody);
    expect(response.status).to.equal(200);
  });
});
