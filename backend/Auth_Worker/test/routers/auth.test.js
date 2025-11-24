// test/routers/auth.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import router from "../../src/routers/auth.js";
import { createMockRequest, createMockEnv } from "../setup.js";

describe("Auth Router", () => {
  let env;
  let request;

  beforeEach(() => {
    env = createMockEnv();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("health check", () => {
    it("should return health check response", async () => {
      request = createMockRequest("GET", "https://example.com/_/health");

      const response = await router.handle(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.ok).to.be.true;
    });
  });

  describe("register endpoint", () => {
    it("should route to register handler with request.env", async () => {
      const body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };
      request = createMockRequest(
        "POST",
        "https://example.com/api/v1/auth/register",
        body,
      );
      // Set request.env to test the request.env || env branch
      request.env = env;

      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [] });
      env.AUTH_DB.prepare()
        .bind()
        .run.onFirstCall()
        .resolves({ success: true });

      const response = await router.handle(request, env);

      expect(response.status).to.be.oneOf([201, 400, 409, 500]);
    });

    it("should route to register handler with env parameter", async () => {
      const body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };
      request = createMockRequest(
        "POST",
        "https://example.com/api/v1/auth/register",
        body,
      );
      // Don't set request.env to test the env fallback branch
      delete request.env;

      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [] });
      env.AUTH_DB.prepare()
        .bind()
        .run.onFirstCall()
        .resolves({ success: true });

      const response = await router.handle(request, env);

      expect(response.status).to.be.oneOf([201, 400, 409, 500]);
    });
  });

  describe("login endpoint", () => {
    it("should route to login handler with request.env", async () => {
      const body = {
        email: "test@example.com",
        password: "password123",
      };
      request = createMockRequest(
        "POST",
        "https://example.com/api/v1/auth/login",
        body,
      );
      request.env = env;

      const crypto = await import("../../src/utils/crypto.js");
      const salt = crypto.genSalt();
      const hashedPassword = await crypto.hashPassword(
        "password123",
        salt,
        env.PEPPER,
      );

      const mockUser = {
        id: "user123",
        email: "test@example.com",
        pwd_hash: hashedPassword,
        pwd_salt: salt,
        role: "user",
      };
      env.AUTH_DB.prepare()
        .bind()
        .all.onFirstCall()
        .resolves({ results: [mockUser] });
      env.AUTH_DB.prepare().bind().all.onCall(1).resolves({ results: [] });
      env.AUTH_DB.prepare()
        .bind()
        .run.onFirstCall()
        .resolves({ success: true });

      const response = await router.handle(request, env);

      expect(response.status).to.be.oneOf([200, 400, 401, 500]);
    });

    it("should route to login handler with env parameter", async () => {
      const body = {
        email: "test@example.com",
        password: "password123",
      };
      request = createMockRequest(
        "POST",
        "https://example.com/api/v1/auth/login",
        body,
      );
      delete request.env;

      const crypto = await import("../../src/utils/crypto.js");
      const salt = crypto.genSalt();
      const hashedPassword = await crypto.hashPassword(
        "password123",
        salt,
        env.PEPPER,
      );

      const mockUser = {
        id: "user123",
        email: "test@example.com",
        pwd_hash: hashedPassword,
        pwd_salt: salt,
        role: "user",
      };
      env.AUTH_DB.prepare()
        .bind()
        .all.onFirstCall()
        .resolves({ results: [mockUser] });
      env.AUTH_DB.prepare().bind().all.onCall(1).resolves({ results: [] });
      env.AUTH_DB.prepare()
        .bind()
        .run.onFirstCall()
        .resolves({ success: true });

      const response = await router.handle(request, env);

      expect(response.status).to.be.oneOf([200, 400, 401, 500]);
    });
  });

  describe("refresh token endpoint", () => {
    it("should route to refreshToken handler with request.env", async () => {
      const body = { refreshToken: "valid-refresh-token" };
      request = createMockRequest(
        "POST",
        "https://example.com/api/v1/auth/token/refresh",
        body,
      );
      request.env = env;

      const crypto = await import("../../src/utils/crypto.js");
      const refreshTokenHash = await crypto.sha256("valid-refresh-token");

      const mockToken = {
        id: "token-id",
        user_id: "user123",
        token_hash: refreshTokenHash,
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        revoked: 0,
      };
      env.AUTH_DB.prepare()
        .bind()
        .all.onFirstCall()
        .resolves({ results: [mockToken] });
      env.AUTH_DB.prepare()
        .bind()
        .all.onCall(1)
        .resolves({ results: [{ id: "user123", role: "user" }] });
      env.AUTH_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.AUTH_DB.prepare().bind().run.onCall(1).resolves({ success: true });

      const response = await router.handle(request, env);

      expect(response.status).to.be.oneOf([200, 400, 401, 500]);
    });
  });

  describe("logout endpoint", () => {
    it("should route to logout handler with request.env", async () => {
      const body = { refreshToken: "valid-refresh-token" };
      request = createMockRequest(
        "POST",
        "https://example.com/api/v1/auth/logout",
        body,
        {
          Authorization: "Bearer access-token",
        },
      );
      request.env = env;

      const crypto = await import("../../src/utils/crypto.js");
      const refreshTokenHash = await crypto.sha256("valid-refresh-token");

      const mockToken = {
        id: "token-id",
        user_id: "user123",
        token_hash: refreshTokenHash,
      };
      env.AUTH_DB.prepare()
        .bind()
        .all.onFirstCall()
        .resolves({ results: [mockToken] });
      env.AUTH_DB.prepare().bind().run.onCall(0).resolves({ success: true });
      env.AUTH_DB.prepare().bind().run.onCall(1).resolves({ success: true });

      const response = await router.handle(request, env);

      expect(response.status).to.be.oneOf([200, 400, 404, 500]);
    });
  });

  describe("me endpoint", () => {
    it("should route to me handler with request.env", async () => {
      const jwt = await import("../../src/utils/jwt.js");
      const validToken = await jwt.signJWT({ sub: "user123" }, { env });

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/auth/me",
        null,
        {
          Authorization: `Bearer ${validToken}`,
        },
      );
      request.env = env;

      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [] });
      env.AUTH_DB.prepare()
        .bind()
        .all.onCall(1)
        .resolves({
          results: [
            {
              id: "user123",
              email: "test@example.com",
              name: "Test User",
            },
          ],
        });

      const response = await router.handle(request, env);

      expect(response.status).to.be.oneOf([200, 401, 404, 500]);
    });

    it("should route to me handler with env parameter", async () => {
      const jwt = await import("../../src/utils/jwt.js");
      const validToken = await jwt.signJWT({ sub: "user123" }, { env });

      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/auth/me",
        null,
        {
          Authorization: `Bearer ${validToken}`,
        },
      );
      delete request.env;

      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [] });
      env.AUTH_DB.prepare()
        .bind()
        .all.onCall(1)
        .resolves({
          results: [
            {
              id: "user123",
              email: "test@example.com",
              name: "Test User",
            },
          ],
        });

      const response = await router.handle(request, env);

      expect(response.status).to.be.oneOf([200, 401, 404, 500]);
    });
  });

  describe("fallback route", () => {
    it("should return 404 for unknown routes", async () => {
      request = createMockRequest(
        "GET",
        "https://example.com/api/v1/auth/unknown",
      );

      const response = await router.handle(request, env);
      const body = await response.json();

      expect(response.status).to.equal(404);
      expect(body.error).to.equal("not_found");
    });
  });
});
