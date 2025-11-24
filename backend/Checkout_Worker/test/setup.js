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
  const mockDbPrepare = sinon.stub().returns({
    bind: sinon.stub().returns({
      first: sinon.stub().resolves(null),
      all: sinon.stub().resolves({ results: [] }),
      run: sinon.stub().resolves({ success: true }),
    }),
    run: sinon.stub().resolves({ success: true }),
    all: sinon.stub().resolves({ results: [] }),
    first: sinon.stub().resolves(null),
  });

  return {
    CHECKOUT_DB: {
      prepare: mockDbPrepare,
    },
    CHECKOUT_KV: {
      get: sinon.stub().resolves(null),
      put: sinon.stub().resolves(),
      delete: sinon.stub().resolves(),
    },
    CART_WORKER: {
      fetch: sinon
        .stub()
        .resolves(new Response(JSON.stringify({ items: [] }), { status: 200 })),
    },
    INVENTORY_WORKER: {
      fetch: sinon.stub().resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      ),
    },
    PRICING_WORKER: {
      fetch: sinon.stub().resolves(
        new Response(JSON.stringify({ effective_price: 10.0 }), {
          status: 200,
        }),
      ),
    },
    ...overrides,
  };
}

// Helper to create mock request
export function createMockRequest(
  method = "GET",
  url = "https://example.com/api/v1/checkout/sessions",
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
    env: createMockEnv(),
    params: {},
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
