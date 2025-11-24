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
  const mockDb = {
    prepare: sinon.stub().returns({
      bind: sinon.stub().returns({
        first: sinon.stub().resolves(null),
        all: sinon.stub().resolves({ results: [] }),
        run: sinon.stub().resolves({ success: true }),
      }),
      first: sinon.stub().resolves(null),
      all: sinon.stub().resolves({ results: [] }),
      run: sinon.stub().resolves({ success: true }),
    }),
  };

  return {
    PAYMENT_DB: mockDb,
    CHECKOUT_WORKER: {
      fetch: sinon.stub().resolves(
        new Response(
          JSON.stringify({
            checkout_session_id: "test-session-id",
            items: [{ sku_id: "test-sku-id", quantity: 1 }],
          }),
          { status: 200 },
        ),
      ),
    },
    INVENTORY_WORKER: {
      fetch: sinon.stub().resolves(
        new Response(JSON.stringify({ available_quantity: 10 }), {
          status: 200,
        }),
      ),
    },
    FULFILLMENT_WORKER: {
      fetch: sinon
        .stub()
        .resolves(
          new Response(JSON.stringify({ success: true }), { status: 200 }),
        ),
    },
    CATALOG_WORKER: {
      fetch: sinon.stub().resolves(
        new Response(
          JSON.stringify({
            product_id: "test-product-id",
            title: "Test Product",
          }),
          { status: 200 },
        ),
      ),
    },
    PAYPAL_CLIENT_ID: "test-client-id",
    PAYPAL_CLIENT_SECRET: "test-client-secret",
    FRONTEND_SUCCESS_URL: "http://localhost:5173/payment/success",
    FRONTEND_FAILURE_URL: "http://localhost:5173/payment/failure",
    SERVICE_NAME: "Payment_Worker_Service",
    HONEYCOMB_API_KEY: "test-api-key",
    HONEYCOMB_DATASET: "test-dataset",
    ...overrides,
  };
}

// Helper to create mock request
export function createMockRequest(
  method = "GET",
  url = "https://example.com/api/v1/payments",
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
    json: async () => {
      if (body === null) return {};
      return body;
    },
    text: async () => {
      if (body === null) return "";
      return JSON.stringify(body);
    },
    params: {},
    env: createMockEnv(),
    ctx: {},
    validatedBody: body,
  };

  // Add get method for headers Map (case-insensitive)
  const originalGet = headersMap.get.bind(headersMap);
  request.headers.get = (key) => {
    // Try exact match first
    let value = originalGet(key);
    if (value !== undefined) return value;

    // Try case-insensitive match
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
