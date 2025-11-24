// test/middleware/adminAuth.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as adminAuth from "../../src/middleware/adminAuth.js";
import * as jwt from "../../src/utils/jwt.js";
import { createMockRequest, createMockEnv, createTestJWT } from "../setup.js";

describe("Admin Auth Middleware", () => {
  let env;

  beforeEach(() => {
    env = createMockEnv();
    sinon.restore();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("requireAdmin", () => {
    it("should allow admin with valid JWT", async () => {
      const payload = {
        sub: "user-1",
        role: "admin",
        email: "admin@example.com",
      };

      const token = await createTestJWT(payload);
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {
          Authorization: `Bearer ${token}`,
        },
      );

      const result = await adminAuth.requireAdmin(request, env);

      expect(result.ok).to.be.true;
      expect(result.user.userId).to.equal("user-1");
      expect(result.user.role).to.equal("admin");
    });

    it("should reject request without Authorization header", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/sku-1",
      );

      const result = await adminAuth.requireAdmin(request, env);

      expect(result.ok).to.be.false;
      expect(result.status).to.equal(401);
      expect(result.error).to.equal("authentication_error");
    });

    it("should reject request with invalid Authorization format", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {
          Authorization: "InvalidFormat token",
        },
      );

      const result = await adminAuth.requireAdmin(request, env);

      expect(result.ok).to.be.false;
      expect(result.status).to.equal(401);
    });

    it("should reject request with missing token", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {
          Authorization: "Bearer ",
        },
      );

      const result = await adminAuth.requireAdmin(request, env);

      expect(result.ok).to.be.false;
      expect(result.status).to.equal(401);
    });

    it("should reject request with invalid JWT", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {
          Authorization: "Bearer invalid-token",
        },
      );

      const result = await adminAuth.requireAdmin(request, env);

      expect(result.ok).to.be.false;
      expect(result.status).to.equal(401);
      expect(result.message).to.include("Invalid or expired");
    });

    it("should reject request when JWT_PUBLIC_KEY is not configured", async () => {
      const envWithoutKey = createMockEnv({ JWT_PUBLIC_KEY: null });

      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {
          Authorization: "Bearer token",
        },
      );

      const result = await adminAuth.requireAdmin(request, envWithoutKey);

      expect(result.ok).to.be.false;
      expect(result.status).to.equal(401);
      expect(result.message).to.include("JWT verification not configured");
    });

    it("should reject user without admin role", async () => {
      const payload = {
        sub: "user-1",
        role: "user",
        email: "user@example.com",
      };

      const token = await createTestJWT(payload);
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {
          Authorization: `Bearer ${token}`,
        },
      );

      const result = await adminAuth.requireAdmin(request, env);

      expect(result.ok).to.be.false;
      expect(result.status).to.equal(403);
      expect(result.error).to.equal("authorization_error");
    });

    it("should accept ADMIN role (uppercase)", async () => {
      const payload = {
        sub: "user-1",
        role: "ADMIN",
        email: "admin@example.com",
      };

      const token = await createTestJWT(payload);
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {
          Authorization: `Bearer ${token}`,
        },
      );

      const result = await adminAuth.requireAdmin(request, env);

      expect(result.ok).to.be.true;
      expect(result.user.role).to.equal("ADMIN");
    });

    it("should handle JWT verification errors", async () => {
      // Use an invalid token that will cause verification to fail
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {
          Authorization: "Bearer invalid.token.here",
        },
      );

      const result = await adminAuth.requireAdmin(request, env);

      expect(result.ok).to.be.false;
      expect(result.status).to.equal(401);
    });

    it("should handle errors in requireAdmin catch block", async () => {
      // Create a request that will cause an error in the try block
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {
          Authorization: "Bearer token",
        },
      );

      // Mock headers.get to throw an error
      const originalGet = request.headers.get;
      request.headers.get = () => {
        throw new Error("Headers error");
      };

      const result = await adminAuth.requireAdmin(request, env);

      expect(result.ok).to.be.false;
      expect(result.status).to.equal(401);
      expect(result.error).to.equal("authentication_error");
    });
  });

  describe("requireServiceOrAdmin", () => {
    it("should allow service binding request", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {
          "X-Source": "catalog-worker-service-binding",
        },
      );

      const result = await adminAuth.requireServiceOrAdmin(request, env);

      expect(result.ok).to.be.true;
      expect(result.user.userId).to.equal("catalog_worker_service");
      expect(result.user.role).to.equal("service");
      expect(result.user.source).to.equal("service_binding");
    });

    it("should allow admin JWT when not service binding", async () => {
      const payload = {
        sub: "user-1",
        role: "admin",
        email: "admin@example.com",
      };

      const token = await createTestJWT(payload);
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {
          Authorization: `Bearer ${token}`,
        },
      );

      const result = await adminAuth.requireServiceOrAdmin(request, env);

      expect(result.ok).to.be.true;
      expect(result.user.role).to.equal("admin");
    });

    it("should reject non-service non-admin request", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1",
      );

      const result = await adminAuth.requireServiceOrAdmin(request, env);

      expect(result.ok).to.be.false;
      expect(result.status).to.equal(401);
    });

    it("should handle errors", async () => {
      // Use an invalid token that will cause verification to fail
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {
          Authorization: "Bearer invalid.token.here",
        },
      );

      const result = await adminAuth.requireServiceOrAdmin(request, env);

      expect(result.ok).to.be.false;
      expect(result.status).to.equal(401);
    });

    it("should handle errors in requireServiceOrAdmin catch block", async () => {
      // Create a request that will cause an error
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/stock/sku-1",
        null,
        {
          "X-Source": "catalog-worker-service-binding",
        },
      );

      // Mock headers.get to throw an error
      const originalGet = request.headers.get;
      request.headers.get = () => {
        throw new Error("Headers error");
      };

      const result = await adminAuth.requireServiceOrAdmin(request, env);

      expect(result.ok).to.be.false;
      expect(result.status).to.equal(401);
      expect(result.error).to.equal("authentication_error");
    });
  });
});
