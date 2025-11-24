// test/setup.js
// Global test setup and utilities
import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

// Use sinon-chai for better assertions BEFORE extracting expect
chai.use(sinonChai);

const { expect } = chai;

// Make chai and sinon available globally
global.expect = expect;
global.sinon = sinon;
global.chai = chai;

// Mock Cloudflare Workers environment
export function createMockEnv(overrides = {}) {
  return {
    FULLFILLMENT_DB: {
      prepare: sinon.stub().returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(null),
          all: sinon.stub().resolves({ results: [] }),
          run: sinon.stub().resolves({ success: true }),
        }),
        run: sinon.stub().resolves({ success: true }),
        first: sinon.stub().resolves(null),
        all: sinon.stub().resolves({ results: [] }),
      }),
    },
    CHECKOUT_WORKER: {
      fetch: sinon
        .stub()
        .resolves(new Response(JSON.stringify({}), { status: 200 })),
    },
    CATALOG_WORKER: {
      fetch: sinon
        .stub()
        .resolves(new Response(JSON.stringify({}), { status: 200 })),
    },
    SERVICE_NAME: "Fulfillment_Worker_Service",
    HONEYCOMB_API_KEY: "test-api-key",
    HONEYCOMB_DATASET: "test-dataset",
    ...overrides,
  };
}

// Helper to create mock request
export function createMockRequest(
  method = "GET",
  url = "https://example.com/api/v1/orders",
  body = null,
  headers = {},
) {
  const headersMap = new Map(
    Object.entries({
      "Content-Type": "application/json",
      ...headers,
    }),
  );

  const request = {
    method,
    url,
    headers: headersMap,
    json: async () => body || {},
    text: async () => JSON.stringify(body || {}),
    params: {},
    env: createMockEnv(),
    ctx: {},
  };

  // Add get method for headers Map (overrides Map.get to return null if not found)
  const originalGet = headersMap.get.bind(headersMap);
  request.headers.get = (key) => {
    const value = originalGet(key);
    return value !== undefined ? value : null;
  };

  return request;
}

// Helper to create mock span for OpenTelemetry
export function createMockSpan() {
  return {
    spanContext: sinon.stub().returns({
      traceId: "test-trace-id",
      spanId: "test-span-id",
    }),
    addEvent: sinon.stub(),
    setAttribute: sinon.stub(),
    recordException: sinon.stub(),
    setStatus: sinon.stub(),
  };
}

// Helper to create mock context for OpenTelemetry
export function createMockContext(span = null) {
  return {
    active: sinon.stub().returns(
      span
        ? {
            getValue: sinon.stub().returns(span),
          }
        : {},
    ),
  };
}
