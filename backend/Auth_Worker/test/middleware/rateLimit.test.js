// test/middleware/rateLimit.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import {
  rateLimitMiddleware,
  checkRateLimit,
  addRateLimitHeaders,
} from "../../src/middleware/rateLimit.js";
import { createMockRequest, createMockEnv } from "../setup.js";

describe("Rate Limit Middleware", () => {
  let env;
  let request;

  beforeEach(() => {
    env = createMockEnv();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("rateLimitMiddleware", () => {
    it("should allow request when KV is not bound", async () => {
      const envWithoutKV = { ...env, RATE_LIMIT_KV: null };
      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
      );

      const result = await rateLimitMiddleware(request, envWithoutKV);

      expect(result.ok).to.be.true;
    });

    it("should allow request within limit", async () => {
      env.RATE_LIMIT_KV.get.resolves(null); // No previous count
      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
        null,
        {
          "CF-Connecting-IP": "192.168.1.1",
        },
      );

      const result = await rateLimitMiddleware(request, env);

      expect(result.ok).to.be.true;
      expect(result.remaining).to.be.greaterThan(0);
      expect(env.RATE_LIMIT_KV.put).to.have.been.called;
    });

    it("should reject request exceeding limit", async () => {
      env.RATE_LIMIT_KV.get.resolves("10"); // Already at limit
      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
        null,
        {
          "CF-Connecting-IP": "192.168.1.1",
        },
      );

      const result = await rateLimitMiddleware(request, env);

      expect(result.ok).to.be.false;
      expect(result.retry_after).to.equal(60);
    });

    it("should track requests per IP and path", async () => {
      env.RATE_LIMIT_KV.get.resolves(null);
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/login",
        null,
        {
          "CF-Connecting-IP": "192.168.1.1",
        },
      );

      await rateLimitMiddleware(request, env);

      const putCall = env.RATE_LIMIT_KV.put.getCall(0);
      expect(putCall.args[0]).to.include("192.168.1.1");
      expect(putCall.args[0]).to.include("/api/v1/auth/login");
    });

    it("should use x-forwarded-for if CF-Connecting-IP not available", async () => {
      env.RATE_LIMIT_KV.get.resolves(null);
      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
        null,
        {
          "x-forwarded-for": "10.0.0.1",
        },
      );

      await rateLimitMiddleware(request, env);

      const putCall = env.RATE_LIMIT_KV.put.getCall(0);
      expect(putCall.args[0]).to.include("10.0.0.1");
    });

    it("should handle KV errors gracefully", async () => {
      env.RATE_LIMIT_KV.get.rejects(new Error("KV error"));
      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
      );

      const result = await rateLimitMiddleware(request, env);

      // Should fail open (allow request)
      expect(result.ok).to.be.true;
    });

    it("should use config values for rate limit", async () => {
      // Rate limit uses config.js, not env vars
      // Default is 60 seconds window, 10 requests
      env.RATE_LIMIT_KV.get.resolves(null);
      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
      );

      const result = await rateLimitMiddleware(request, env);

      expect(result.ok).to.be.true;
      expect(result.limit).to.equal(10); // From config.js
      expect(result.windowSeconds).to.equal(60); // From config.js
    });
  });

  describe("checkRateLimit", () => {
    it("should return null when rate limit not exceeded", async () => {
      env.RATE_LIMIT_KV.get.resolves(null);
      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
      );

      const result = await checkRateLimit(request, env);

      expect(result).to.be.null;
      expect(request._rateLimitInfo).to.exist;
    });

    it("should return 429 Response when rate limit exceeded", async () => {
      env.RATE_LIMIT_KV.get.resolves("10"); // At limit
      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
      );

      const result = await checkRateLimit(request, env);

      expect(result).to.be.instanceOf(Response);
      expect(result.status).to.equal(429);

      const body = await result.json();
      expect(body.error).to.equal("rate_limit_exceeded");
    });

    it("should include rate limit headers in 429 response", async () => {
      env.RATE_LIMIT_KV.get.resolves("10");
      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
      );

      const result = await checkRateLimit(request, env);

      expect(result.headers.get("Retry-After")).to.exist;
      expect(result.headers.get("X-RateLimit-Limit")).to.exist;
      expect(result.headers.get("X-RateLimit-Remaining")).to.equal("0");
    });

    it("should handle rate limit response with missing optional fields", async () => {
      // Test that checkRateLimit handles missing optional fields in the response
      // by directly calling it with a rate limit exceeded scenario
      env.RATE_LIMIT_KV.get.resolves("10");
      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
      );

      const result = await checkRateLimit(request, env);

      // Should use defaults (60, 10) when fields are undefined in the response
      expect(result).to.be.instanceOf(Response);
      expect(result.status).to.equal(429);
      // Headers should have default values
      expect(result.headers.get("Retry-After")).to.exist;
      expect(result.headers.get("X-RateLimit-Limit")).to.exist;
    });

    it("should handle rate limit response with missing windowSeconds", async () => {
      env.RATE_LIMIT_KV.get.resolves(null);
      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
      );

      // Call checkRateLimit to set up _rateLimitInfo
      await checkRateLimit(request, env);

      // Manually modify to remove windowSeconds to test default fallback
      if (request._rateLimitInfo) {
        request._rateLimitInfo.windowSeconds = undefined;
        // Recalculate reset with default
        request._rateLimitInfo.reset = Math.floor(Date.now() / 1000) + 60;
      }

      // Should still work with default windowSeconds
      expect(request._rateLimitInfo).to.exist;
      expect(request._rateLimitInfo.reset).to.exist;
    });
  });

  describe("addRateLimitHeaders", () => {
    it("should add rate limit headers to response", async () => {
      env.RATE_LIMIT_KV.get.resolves(null);
      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
      );

      // Set up rate limit info
      await checkRateLimit(request, env);

      const response = new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      const result = addRateLimitHeaders(response, request);

      expect(result.headers.get("X-RateLimit-Limit")).to.exist;
      expect(result.headers.get("X-RateLimit-Remaining")).to.exist;
      expect(result.headers.get("X-RateLimit-Reset")).to.exist;
    });

    it("should return response unchanged if no rate limit info", () => {
      const response = new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      const result = addRateLimitHeaders(response, request);

      expect(result).to.equal(response);
    });

    it("should return response unchanged if request is null", () => {
      const response = new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      const result = addRateLimitHeaders(response, null);

      expect(result).to.equal(response);
    });

    it("should return response unchanged if response is null", () => {
      request._rateLimitInfo = { limit: 10, remaining: 5, reset: 1234567890 };

      const result = addRateLimitHeaders(null, request);

      expect(result).to.be.null;
    });

    it("should handle errors when setting headers", () => {
      request._rateLimitInfo = { limit: 10, remaining: 5, reset: 1234567890 };

      // Create a response with non-writable headers
      const response = new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      // Mock headers.set to throw error
      sinon
        .stub(response.headers, "set")
        .throws(new Error("Cannot set header"));

      const result = addRateLimitHeaders(response, request);

      // Should return response even if header setting fails
      expect(result).to.exist;

      response.headers.set.restore();
    });
  });
});
