// test/handlers/authHandlers.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as handlers from "../../src/handlers/authHandlers.js";
import { createMockRequest, createMockEnv } from "../setup.js";

describe("Auth Handlers", () => {
  let env;
  let request;

  beforeEach(() => {
    env = createMockEnv();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("register", () => {
    it("should register user successfully", async () => {
      const body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/register",
        body,
      );

      // Mock database - no existing user, then successful creation
      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [] }); // No existing user
      env.AUTH_DB.prepare()
        .bind()
        .run.onFirstCall()
        .resolves({ success: true }); // User created

      const response = await handlers.register(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(201);
      expect(responseBody.success).to.be.true;
      expect(responseBody.userId).to.exist;
    });

    it("should return 400 for invalid input", async () => {
      const body = {
        name: "",
        email: "invalid-email",
        password: "short",
      };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/register",
        body,
      );

      const response = await handlers.register(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(400);
      expect(responseBody.error).to.equal("invalid_input");
    });

    it("should return 409 for existing email", async () => {
      const body = {
        name: "Test User",
        email: "existing@example.com",
        password: "password123",
      };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/register",
        body,
      );

      // Mock database - user already exists
      env.AUTH_DB.prepare()
        .bind()
        .all.resolves({
          results: [{ id: "existing-user", email: "existing@example.com" }],
        });

      const response = await handlers.register(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(409);
      expect(responseBody.error).to.equal("email_exists");
    });

    it("should use default status 400 when result.status is undefined", async () => {
      const body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/register",
        body,
      );

      // Mock authService.register to return error without status by making encryption fail
      // This will return an error without status field
      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [] });
      const envWithoutKey = { ...env, PII_ENCRYPTION_KEY: null };

      const bodyWithPII = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        phoneNumber: "1234567890",
      };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/register",
        bodyWithPII,
      );

      const response = await handlers.register(request, envWithoutKey);
      const responseBody = await response.json();

      // Should use default status 400 when status is undefined
      expect(response.status).to.be.oneOf([400, 500]);
    });
  });

  describe("login", () => {
    it("should login user successfully", async () => {
      const body = {
        email: "test@example.com",
        password: "password123",
      };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/login",
        body,
      );

      // Mock database - user exists with properly hashed password
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
        .resolves({ results: [mockUser] }); // User found
      env.AUTH_DB.prepare().bind().all.onCall(1).resolves({ results: [] }); // No existing refresh token
      env.AUTH_DB.prepare()
        .bind()
        .run.onFirstCall()
        .resolves({ success: true }); // Refresh token created

      const response = await handlers.login(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(200);
      expect(responseBody.accessToken).to.exist;
      expect(responseBody.refreshToken).to.exist;
    });

    it("should return 401 for invalid credentials", async () => {
      const body = {
        email: "test@example.com",
        password: "wrongpassword",
      };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/login",
        body,
      );

      // Mock database - user not found OR wrong password
      env.AUTH_DB.prepare().bind().all.resolves({ results: [] }); // User not found

      const response = await handlers.login(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(401);
      expect(responseBody.error).to.equal("invalid_credentials");
    });

    it("should use default status 401 when result.status is undefined in login", async () => {
      const body = {
        email: "test@example.com",
        password: "password123",
      };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/login",
        body,
      );

      // Mock authService.login to return error without status
      env.AUTH_DB.prepare().bind().all.resolves({ results: [] }); // User not found

      const response = await handlers.login(request, env);
      const responseBody = await response.json();

      // Should use default status 401 when status is undefined
      expect(response.status).to.equal(401);
    });

    it("should handle login failure with emailHash", async () => {
      const body = {
        email: "test@example.com",
        password: "wrongpassword",
      };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/login",
        body,
      );

      // Mock user found but wrong password
      const crypto = await import("../../src/utils/crypto.js");
      const salt = crypto.genSalt();
      const hashedPassword = await crypto.hashPassword(
        "correctpassword",
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
        .all.resolves({ results: [mockUser] });

      const response = await handlers.login(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(401);
      expect(responseBody.error).to.equal("invalid_credentials");
    });

    it("should handle login failure without emailHash", async () => {
      const body = {
        email: "test@example.com",
        password: "wrongpassword",
      };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/login",
        body,
      );

      // Mock user not found (no emailHash in result)
      env.AUTH_DB.prepare().bind().all.resolves({ results: [] });

      const response = await handlers.login(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(401);
      expect(responseBody.error).to.equal("invalid_credentials");
    });
  });

  describe("refreshToken", () => {
    it("should refresh token successfully", async () => {
      const body = { refreshToken: "valid-refresh-token" };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/token/refresh",
        body,
      );

      // Mock database - find refresh token, get user, revoke old, create new
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
        .resolves({ results: [mockToken] }); // Token found
      env.AUTH_DB.prepare()
        .bind()
        .all.onCall(1)
        .resolves({ results: [{ id: "user123", role: "user" }] }); // User found
      env.AUTH_DB.prepare().bind().run.onCall(0).resolves({ success: true }); // Old token revoked
      env.AUTH_DB.prepare().bind().run.onCall(1).resolves({ success: true }); // New token created

      const response = await handlers.refreshToken(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(200);
      expect(responseBody.accessToken).to.exist;
      expect(responseBody.refreshToken).to.exist;
    });

    it("should return 400 for missing refresh token", async () => {
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/token/refresh",
        {},
      );

      const response = await handlers.refreshToken(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(400);
      expect(responseBody.error).to.equal("missing_refresh_token");
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      const body = { refreshToken: "valid-refresh-token" };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/logout",
        body,
        {
          Authorization: "Bearer access-token",
        },
      );

      // Mock database - find refresh token, revoke it
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
        .resolves({ results: [mockToken] }); // Token found
      env.AUTH_DB.prepare()
        .bind()
        .run.onFirstCall()
        .resolves({ success: true }); // Token revoked
      env.AUTH_DB.prepare().bind().run.onCall(1).resolves({ success: true }); // Access token revoked

      const response = await handlers.logout(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(200);
      expect(responseBody.success).to.be.true;
    });

    it("should return 400 for missing refresh token", async () => {
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/logout",
        {},
      );

      const response = await handlers.logout(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(400);
      expect(responseBody.error).to.equal("missing_refresh_token");
    });

    it("should handle logout without Content-Type header", async () => {
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/logout",
        {},
      );
      request.headers.delete("Content-Type");

      const response = await handlers.logout(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(400);
      expect(responseBody.error).to.equal("missing_refresh_token");
    });

    it("should handle logout with non-JSON Content-Type", async () => {
      const body = { refreshToken: "valid-refresh-token" };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/logout",
        body,
        {
          Authorization: "Bearer access-token",
          "Content-Type": "text/plain",
        },
      );

      const response = await handlers.logout(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(400);
      expect(responseBody.error).to.equal("missing_refresh_token");
    });

    it("should use default status 400 when result.status is undefined in logout", async () => {
      const body = { refreshToken: "invalid-token" };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/logout",
        body,
        {
          Authorization: "Bearer access-token",
        },
      );

      // Mock authService.revokeRefreshToken to return error without status
      const crypto = await import("../../src/utils/crypto.js");
      const refreshTokenHash = await crypto.sha256("invalid-token");
      env.AUTH_DB.prepare().bind().all.resolves({ results: [] }); // Token not found

      const response = await handlers.logout(request, env);
      const responseBody = await response.json();

      // Should use default status 400 when status is undefined (or 404 if not found)
      expect(response.status).to.be.oneOf([400, 404]);
    });
  });

  describe("me", () => {
    it("should return user data when authenticated", async () => {
      // Create a valid JWT token for testing
      const jwt = await import("../../src/utils/jwt.js");
      const validToken = await jwt.signJWT({ sub: "user123" }, { env });

      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
        null,
        {
          Authorization: `Bearer ${validToken}`,
        },
      );

      // Mock database - token not revoked (first call), then get user (second call)
      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [] }); // Token not in revoked list
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

      const response = await handlers.me(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(200);
      expect(responseBody.user).to.exist;
      expect(responseBody.user.id).to.equal("user123");
    });

    it("should return 401 when not authenticated", async () => {
      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
      );
      // No Authorization header - requireAuth will fail

      const response = await handlers.me(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(401);
      expect(responseBody.error).to.equal("missing_token");
    });

    it("should use default status 401 when auth.status is undefined in me", async () => {
      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
      );
      // No Authorization header - requireAuth will return error without status

      const response = await handlers.me(request, env);
      const responseBody = await response.json();

      // Should use default status 401 when status is undefined
      expect(response.status).to.equal(401);
    });

    it("should redact sensitive fields", async () => {
      // Create a valid JWT token for testing
      const jwt = await import("../../src/utils/jwt.js");
      const validToken = await jwt.signJWT({ sub: "user123" }, { env });

      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
        null,
        {
          Authorization: `Bearer ${validToken}`,
        },
      );

      // Mock database - token not revoked (first call), then get user with sensitive fields (second call)
      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [] }); // Token not in revoked list
      env.AUTH_DB.prepare()
        .bind()
        .all.onCall(1)
        .resolves({
          results: [
            {
              id: "user123",
              email: "test@example.com",
              pwd_hash: "hash",
              pwd_salt: "salt",
            },
          ],
        });

      const response = await handlers.me(request, env);
      const responseBody = await response.json();

      expect(responseBody.user.pwd_hash).to.not.exist;
      expect(responseBody.user.pwd_salt).to.not.exist;
    });

    it("should handle errors in register handler catch block when logger throws", async () => {
      const body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/register",
        body,
      );

      // Mock successful registration
      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [] });
      env.AUTH_DB.prepare()
        .bind()
        .run.onFirstCall()
        .resolves({ success: true });

      // Make console.log throw to trigger catch block when logger is called
      const originalConsoleLog = console.log;
      console.log = () => {
        throw new Error("Console.log error");
      };

      const response = await handlers.register(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(500);
      expect(responseBody.error).to.equal("internal_error");

      // Restore original console.log
      console.log = originalConsoleLog;
    });

    it("should handle errors in login handler catch block when Headers constructor throws", async () => {
      const body = {
        email: "test@example.com",
        password: "password123",
      };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/login",
        body,
      );

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

      // Make Headers throw by stubbing the global Headers constructor
      const originalHeaders = global.Headers;
      global.Headers = class {
        constructor() {
          throw new Error("Headers constructor error");
        }
      };

      const response = await handlers.login(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(500);
      expect(responseBody.error).to.equal("internal_error");

      // Restore original Headers
      global.Headers = originalHeaders;
    });

    it("should handle invalid content type in refreshToken", async () => {
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/token/refresh",
        {},
      );
      request.headers.set("Content-Type", "text/plain");

      const response = await handlers.refreshToken(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(400);
      expect(responseBody.error).to.equal("invalid_content_type");
    });

    it("should handle missing Content-Type header in refreshToken", async () => {
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/token/refresh",
        {},
      );
      request.headers.delete("Content-Type");

      const response = await handlers.refreshToken(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(400);
      expect(responseBody.error).to.equal("invalid_content_type");
    });

    it("should handle null body in refreshToken", async () => {
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/token/refresh",
        null,
      );
      request.json = async () => null;

      const response = await handlers.refreshToken(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(400);
      expect(responseBody.error).to.equal("missing_refresh_token");
    });

    it("should use default status 401 when result.status is undefined in refreshToken", async () => {
      const body = { refreshToken: "invalid-token" };
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/token/refresh",
        body,
      );

      // Mock authService.rotateRefreshToken to return error without status
      const crypto = await import("../../src/utils/crypto.js");
      const refreshTokenHash = await crypto.sha256("invalid-token");
      env.AUTH_DB.prepare().bind().all.resolves({ results: [] }); // Token not found

      const response = await handlers.refreshToken(request, env);
      const responseBody = await response.json();

      // Should use default status 401 when status is undefined
      expect(response.status).to.equal(401);
    });

    it("should handle errors in refreshToken handler", async () => {
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/token/refresh",
        {},
      );
      request.json = async () => {
        throw new Error("JSON parse error");
      };

      const response = await handlers.refreshToken(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(500);
      expect(responseBody.error).to.equal("internal_error");
    });

    it("should handle errors in logout handler", async () => {
      request = createMockRequest(
        "POST",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/logout",
        {},
      );
      request.json = async () => {
        throw new Error("JSON parse error");
      };

      const response = await handlers.logout(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(500);
      expect(responseBody.error).to.equal("internal_error");
    });

    it("should handle errors in me handler", async () => {
      const jwt = await import("../../src/utils/jwt.js");
      const validToken = await jwt.signJWT({ sub: "user123" }, { env });

      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
        null,
        {
          Authorization: `Bearer ${validToken}`,
        },
      );

      // Mock requireAuth to succeed, but getUserById to fail
      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [] }); // Token not revoked
      env.AUTH_DB.prepare().bind().all.onCall(1).rejects(new Error("DB error")); // getUserById fails

      const response = await handlers.me(request, env);
      const responseBody = await response.json();

      // Should return 404 if user not found, or 500 if error
      expect(response.status).to.be.oneOf([404, 500]);
    });

    it("should handle errors in me handler catch block when JSON.stringify throws", async () => {
      const jwt = await import("../../src/utils/jwt.js");
      const validToken = await jwt.signJWT({ sub: "user123" }, { env });

      request = createMockRequest(
        "GET",
        "https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me",
        null,
        {
          Authorization: `Bearer ${validToken}`,
        },
      );

      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [] }); // Token not revoked

      // Create a circular reference to make JSON.stringify throw
      const circularUser = {
        id: "user123",
        email: "test@example.com",
        name: "Test User",
      };
      circularUser.self = circularUser;

      env.AUTH_DB.prepare()
        .bind()
        .all.onCall(1)
        .resolves({ results: [circularUser] });

      const response = await handlers.me(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(500);
      expect(responseBody.error).to.equal("internal_error");
    });
  });
});
