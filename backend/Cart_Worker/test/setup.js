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
    CART_DB: {
      prepare: sinon.stub(),
    },
    PRICING_WORKER: {
      fetch: sinon.stub().resolves(
        new Response(JSON.stringify({ effective_price: 10.99 }), {
          status: 200,
        }),
      ),
    },
    INVENTORY_WORKER: {
      fetch: sinon.stub().resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
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
  url = "https://example.com/api/v1/cart",
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
    clone: function () {
      return {
        text: async () => JSON.stringify(body || {}),
      };
    },
    env: createMockEnv(),
    params: {},
    validatedBody: body,
    validatedQuery: {},
  };

  // Add get method for headers Map (overrides Map.get to return null if not found)
  // Make it case-insensitive for header lookups
  const originalGet = headersMap.get.bind(headersMap);
  request.headers.get = (key) => {
    // Try exact match first
    let value = originalGet(key);
    if (value !== undefined) return value;

    // Try case-insensitive lookup
    const lowerKey = key.toLowerCase();
    for (const [mapKey, mapValue] of headersMap.entries()) {
      if (mapKey.toLowerCase() === lowerKey) {
        return mapValue;
      }
    }

    return null;
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
