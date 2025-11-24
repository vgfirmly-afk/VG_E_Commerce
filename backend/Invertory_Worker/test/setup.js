// test/setup.js
// Global test setup and utilities
import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

// Use sinon-chai for better assertions BEFORE extracting expect
chai.use(sinonChai);

const { expect } = chai;

// JWT Keys for testing
const JWT_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCeuaKvP5MXJ3zw
efdc7YjQXlnka26PIpLI3SSoPdN7CZSHM1yt2tBRgoFzOqRgIqBANr+Q/gTDuC0M
MYFuV10PoPbpDtMCM+4wKCs2ioQXbh0rVj8YgqFo8ir+METbJ26PX41zQUJ+nh0e
6yhHmhqJvfXW620MQOsBx1nO1TpbSiZ7YaF5Y36HuhFKkEUeeSGtutwNywpvrMzY
plwxDF6KxIEEPxNLQXQlJ16Hn7PzeCjXnIJ2V1cx0FhvX3VCoPXQpu4QuG1BAATi
Zd3pr6Q9Yf9QNRjmvsJt+iMi/zyyjsqJlnxR/6NUT0lBGEQmVkmnerM/c42oAkp+
VbJ6DPVrAgMBAAECggEAAiyqi7ppZ5/3swxbX69fYvS6nYmn6O0WfrWiNW3XZ7BG
E84X1HKSzQhmgUTJ5glDZxh46mHDK0fq0hJxjVNEEp09agxKcWrIYL+EIV9SF5y/
aI2/bTSzmmOgRCg2y/ElL3Cl2EY0xNWiB3+S5zGMxdtPiA4PSeOFH1qdooWYTZIt
IRZYh4ZRjSUpXEnVwSjTrVmHedQruUTD+u57k8RvRuDzenQvtHFUkx+Qzt5x6oON
tIY1D52B2ktrjkM5qNaD9QsMYzk1dQKgkguopWXwhMhrKXM8/IVDSZ912fgZv/Au
j6ggv6z0wxt5z+KRiOoiO2SMQUa87CPRTQEIlv5IiQKBgQDL/TmyvD20si8f6YiN
bFwetR/Xz8xqhNp29S1chmEPUkKaw63YMEtRNPjyOY8pw3j4ZhQ7JYCDpj0U+Evt
e2Qfoo5g8iaCsDIHPdTf/1LT3GBHyC/zk8xlV5z7OJSBaIEwwWHFuldZUHXMjX1L
nCBezx4AChwWel9B32dPIQ0qiQKBgQDHMfAn/faT3BZq9D6Xz2k8U721rnwFD5tI
JWVeo5XE/Eehg+gCCtdus4Dkme6rp5IERgb+tJ2SWrFK37v4SrpmcIehJMSSEKls
ahjBKpZvIic6NMpU9k2c2MCgWyb/hP/qI9JSkUdQmjxbADJyGwJQfJzcIJOed1KA
SLnx26ATUwKBgQCoi9SOsCa0FL4HOiiP4cbDwJhM8u9N2/O+cppGZunvhOJvidss
U8sHkCNZ0OFPeqmLZJy2uifTnxm9J+Nkl52E3gWSaMIVHYxYm2g2pHpFf0M2TFwC
gE5UNe4JTRi3TCfipwYoH+1oaKjMmOO8A4Zjj/KTycanc/kdLn/ny8FbMQKBgGel
AESOzCIbPj7gX0E2VpdhKzDBXR51BGMBskEP9PnOGqdbrviBE58yHzrTLXB7fGpk
1XbqG6LvNZiz2WZT27E5lBiwvOcTbFRQ0BiSRDwHFUof9bdHgRK/ZVsKkrwZQ99c
TC9SED1MQ2NGMvlUPFwMusF+4dBuXasKLFY/5IapAoGBAMSC/NwOcbwaQJE6x+NG
KjZcgynG6iYQwrVzXVYc1aEooRwpS6InK2gQx1aSjPFPfwpDMU4Om5F/6vJ3rsqG
xbpXaK1uGfUNNUm7kwEJ1vJO2XYlGmzLIG/mE64c+uhgDT4/Ox37fK+fcQRt7Qw0
zPKA/7OUTTigj+B9HmGyuR7I
-----END PRIVATE KEY-----`;

const JWT_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnrmirz+TFyd88Hn3XO2I
0F5Z5GtujyKSyN0kqD3TewmUhzNcrdrQUYKBczqkYCKgQDa/kP4Ew7gtDDGBbldd
D6D26Q7TAjPuMCgrNoqEF24dK1Y/GIKhaPIq/jBE2yduj1+Nc0FCfp4dHusoR5oa
ib311uttDEDrAcdZztU6W0ome2GheWN+h7oRSpBFHnkhrbrcDcsKb6zM2KZcMQxe
isSBBD8TS0F0JSdeh5+z83go15yCdldXMdBYb191QqD10KbuELhtQQAE4mXd6a+k
PWH/UDUY5r7CbfojIv88so7KiZZ8Uf+jVE9JQRhEJlZJp3qzP3ONqAJKflWyegz1
awIDAQAB
-----END PUBLIC KEY-----`;

// Make chai and sinon available globally
global.expect = expect;
global.sinon = sinon;
global.chai = chai;

// Mock Cloudflare Workers environment
export function createMockEnv(overrides = {}) {
  // Create shared stubs that can be reused
  const allStub = sinon.stub().resolves({ results: [] });
  const firstStub = sinon.stub().resolves(null);
  const runStub = sinon.stub().resolves({ success: true });
  const bindStub = sinon.stub().returns({
    all: allStub,
    first: firstStub,
    run: runStub,
  });

  const prepareStub = sinon.stub().returns({
    bind: bindStub,
    all: allStub,
    first: firstStub,
    run: runStub,
  });

  const mockDb = {
    prepare: prepareStub,
    batch: sinon.stub().resolves([]),
  };

  return {
    INVENTORY_DB: mockDb,
    INVENTORY_KV: {
      get: sinon.stub().resolves(null),
      put: sinon.stub().resolves(),
      delete: sinon.stub().resolves(),
    },
    JWT_PUBLIC_KEY: JWT_PUBLIC_KEY,
    JWT_PRIVATE_KEY: JWT_PRIVATE_KEY,
    CATALOG_WORKER_URL: "https://w2-catalog-worker.vg-firmly.workers.dev",
    ...overrides,
  };
}

// Helper to create mock request
export function createMockRequest(
  method = "GET",
  url = "https://example.com/api/v1/stock/test-sku",
  body = null,
  headers = {},
  params = {},
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
    params: params,
    json: async () => {
      // If body is explicitly null and method requires body, throw error to simulate empty/invalid JSON
      // But only if the test hasn't overridden json()
      if (
        body === null &&
        ["POST", "PUT", "PATCH"].includes(method.toUpperCase())
      ) {
        throw new Error("Unexpected end of JSON input");
      }
      // Return body if provided, otherwise return empty object
      return body !== null ? body || {} : {};
    },
    env: createMockEnv(),
    user: null,
  };

  // Add get method for headers Map
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

// Helper to create a valid JWT token with real signature
export async function createTestJWT(payload = {}, expiresIn = "1h") {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (expiresIn === "1h" ? 3600 : 0); // 1 hour or 0 for expired

  const tokenPayload = {
    sub: "test-user",
    iss: "test-issuer",
    aud: "test-audience",
    iat: now,
    exp: exp,
    ...payload,
  };

  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(JWT_PRIVATE_KEY),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const encodedHeader = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify(header)),
  );
  const encodedPayload = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify(tokenPayload)),
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
  );

  const encodedSignature = base64UrlEncode(new Uint8Array(signature));

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

function pemToArrayBuffer(pem) {
  const b64 = pem
    .replace(/-----(BEGIN|END)[\w\s]+-----/g, "")
    .replace(/\s+/g, "");
  const binStr = atob(b64);
  const len = binStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binStr.charCodeAt(i);
  return bytes.buffer;
}

function base64UrlEncode(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY };
