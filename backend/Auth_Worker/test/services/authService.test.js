// test/services/authService.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as authService from "../../src/services/authService.js";
import { createMockEnv } from "../setup.js";

describe("Auth Service", () => {
  let env;
  let mockDb;

  beforeEach(() => {
    env = createMockEnv();
    mockDb = env.AUTH_DB;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("register", () => {
    it("should register user successfully", async () => {
      // Mock no existing user
      mockDb.prepare().bind().all.onFirstCall().resolves({ results: [] });
      // Mock user creation
      mockDb.prepare().bind().run.onFirstCall().resolves({ success: true });

      const result = await authService.register(
        {
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        },
        env,
      );

      expect(result.ok).to.be.true;
      expect(result.userId).to.exist;
    });

    it("should reject registration if email exists", async () => {
      const existingUser = { id: "123", email: "test@example.com" };
      mockDb
        .prepare()
        .bind()
        .all.resolves({ results: [existingUser] });

      const result = await authService.register(
        {
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        },
        env,
      );

      expect(result.ok).to.be.false;
      expect(result.error).to.equal("email_exists");
      expect(result.status).to.equal(409);
    });

    it("should encrypt PII data when provided", async () => {
      mockDb.prepare().bind().all.onFirstCall().resolves({ results: [] });
      mockDb.prepare().bind().run.onFirstCall().resolves({ success: true });

      const result = await authService.register(
        {
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          phoneNumber: "1234567890",
          address: "123 Main St",
          ssn: "123-45-6789",
        },
        env,
      );

      expect(result.ok).to.be.true;
      // Verify PII encryption was called (check SQL includes encrypted fields)
      // The prepare is called for checking existing user, then for creating user
      const prepareCalls = mockDb.prepare.getCalls();
      const createUserCall = prepareCalls.find((call) => {
        const sql = call.args[0] || "";
        return sql.includes("INSERT INTO users");
      });
      expect(createUserCall).to.exist;
      if (createUserCall) {
        expect(createUserCall.args[0]).to.include("phone_number_encrypted");
      }
    });

    it("should reject registration if PII provided but encryption key missing", async () => {
      const envWithoutKey = { ...env, PII_ENCRYPTION_KEY: null };
      mockDb.prepare().bind().all.resolves({ results: [] });

      const result = await authService.register(
        {
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          phoneNumber: "1234567890",
        },
        envWithoutKey,
      );

      expect(result.ok).to.be.false;
      expect(result.error).to.equal("encryption_key_missing");
    });

    it("should handle registration errors", async () => {
      mockDb.prepare().bind().all.rejects(new Error("DB error"));

      const result = await authService.register(
        {
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        },
        env,
      );

      expect(result.ok).to.be.false;
      expect(result.error).to.equal("internal_error");
    });
  });

  describe("login", () => {
    it("should login user successfully", async () => {
      // Create properly hashed password
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
      mockDb
        .prepare()
        .bind()
        .all.onFirstCall()
        .resolves({ results: [mockUser] }); // User found
      mockDb.prepare().bind().all.onCall(1).resolves({ results: [] }); // No existing refresh token
      mockDb.prepare().bind().run.onFirstCall().resolves({ success: true }); // Refresh token created

      const result = await authService.login(
        {
          email: "test@example.com",
          password: "password123",
        },
        env,
      );

      expect(result.ok).to.be.true;
      expect(result.accessToken).to.exist;
      expect(result.refreshToken).to.exist;
    });

    it("should reject login with invalid credentials", async () => {
      mockDb.prepare().bind().all.resolves({ results: [] });

      const result = await authService.login(
        {
          email: "test@example.com",
          password: "wrongpassword",
        },
        env,
      );

      expect(result.ok).to.be.false;
      expect(result.error).to.equal("invalid_credentials");
      expect(result.status).to.equal(401);
    });

    it("should reject login with wrong password", async () => {
      // Create properly hashed password for correct password
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
        pwd_hash: hashedPassword, // Hashed with different password
        pwd_salt: salt,
        role: "user",
      };
      mockDb
        .prepare()
        .bind()
        .all.resolves({ results: [mockUser] });

      const result = await authService.login(
        {
          email: "test@example.com",
          password: "wrongpassword", // Different password
        },
        env,
      );

      expect(result.ok).to.be.false;
      expect(result.error).to.equal("invalid_credentials");
    });
  });

  describe("rotateRefreshToken", () => {
    it("should rotate refresh token successfully", async () => {
      // Hash the refresh token properly
      const crypto = await import("../../src/utils/crypto.js");
      const refreshTokenHash = await crypto.sha256("valid-refresh-token");

      const mockToken = {
        id: "token-id",
        user_id: "user123",
        token_hash: refreshTokenHash,
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        revoked: 0,
      };
      mockDb
        .prepare()
        .bind()
        .all.onFirstCall()
        .resolves({ results: [mockToken] }); // Token found
      mockDb
        .prepare()
        .bind()
        .all.onCall(1)
        .resolves({ results: [{ id: "user123", role: "user" }] }); // User found
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true }); // Old token revoked
      mockDb.prepare().bind().run.onCall(1).resolves({ success: true }); // New token created

      const result = await authService.rotateRefreshToken(
        {
          refreshToken: "valid-refresh-token",
        },
        env,
      );

      expect(result.ok).to.be.true;
      expect(result.accessToken).to.exist;
      expect(result.refreshToken).to.exist;
    });

    it("should reject expired refresh token", async () => {
      const mockToken = {
        id: "token-id",
        user_id: "user123",
        token_hash: "hash",
        expires_at: new Date(Date.now() - 3600000).toISOString(), // Expired
        revoked: 0,
      };
      mockDb
        .prepare()
        .bind()
        .all.resolves({ results: [mockToken] });

      const result = await authService.rotateRefreshToken(
        {
          refreshToken: "expired-token",
        },
        env,
      );

      expect(result.ok).to.be.false;
      expect(result.error).to.equal("expired_refresh_token");
    });

    it("should reject revoked refresh token", async () => {
      const mockToken = {
        id: "token-id",
        user_id: "user123",
        token_hash: "hash",
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        revoked: 1, // Revoked
      };
      mockDb
        .prepare()
        .bind()
        .all.resolves({ results: [mockToken] });

      const result = await authService.rotateRefreshToken(
        {
          refreshToken: "revoked-token",
        },
        env,
      );

      expect(result.ok).to.be.false;
      expect(result.error).to.equal("invalid_refresh_token");
    });
  });

  describe("revokeRefreshToken", () => {
    it("should revoke refresh token successfully", async () => {
      const mockToken = {
        id: "token-id",
        user_id: "user123",
        token_hash: "hash",
      };
      mockDb
        .prepare()
        .bind()
        .all.onFirstCall()
        .resolves({ results: [mockToken] });
      mockDb.prepare().bind().run.onFirstCall().resolves({ success: true });

      const result = await authService.revokeRefreshToken(
        {
          refreshToken: "valid-token",
          accessToken: "valid-access-token",
        },
        env,
      );

      expect(result.ok).to.be.true;
      expect(result.userId).to.equal("user123");
    });

    it("should revoke access token if provided", async () => {
      // Hash the refresh token properly
      const crypto = await import("../../src/utils/crypto.js");
      const refreshTokenHash = await crypto.sha256("valid-token");

      const mockToken = {
        id: "token-id",
        user_id: "user123",
        token_hash: refreshTokenHash,
      };
      mockDb
        .prepare()
        .bind()
        .all.onFirstCall()
        .resolves({ results: [mockToken] }); // Token found
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true }); // Refresh token revoked
      mockDb.prepare().bind().run.onCall(1).resolves({ success: true }); // Access token revoked

      // Create a valid JWT token
      const jwt = await import("../../src/utils/jwt.js");
      const accessToken = await jwt.signJWT({ sub: "user123" }, { env });

      const result = await authService.revokeRefreshToken(
        {
          refreshToken: "valid-token",
          accessToken: accessToken,
        },
        env,
      );

      expect(result.ok).to.be.true;
    });
  });

  describe("getUserById", () => {
    it("should return user with decrypted PII", async () => {
      // Encrypt PII data using real encryption
      const crypto = await import("../../src/utils/crypto.js");
      const phoneEncrypted = await crypto.encryptAESGCM(
        "1234567890",
        env.PII_ENCRYPTION_KEY,
      );
      const addressEncrypted = await crypto.encryptAESGCM(
        "123 Main St",
        env.PII_ENCRYPTION_KEY,
      );

      const mockUser = {
        id: "user123",
        email: "test@example.com",
        phone_number_encrypted: phoneEncrypted,
        address_encrypted: addressEncrypted,
      };
      mockDb
        .prepare()
        .bind()
        .all.resolves({ results: [mockUser] });

      const user = await authService.getUserById("user123", env);

      expect(user).to.exist;
      expect(user.phone_number).to.equal("1234567890");
      expect(user.address).to.equal("123 Main St");
      expect(user.phone_number_encrypted).to.not.exist;
    });

    it("should return user without PII if encryption key missing", async () => {
      const envWithoutKey = { ...env, PII_ENCRYPTION_KEY: null };
      const mockUser = {
        id: "user123",
        email: "test@example.com",
        phone_number_encrypted: "encrypted-phone",
      };
      mockDb
        .prepare()
        .bind()
        .all.resolves({ results: [mockUser] });

      const user = await authService.getUserById("user123", envWithoutKey);

      expect(user).to.exist;
      expect(user.phone_number).to.not.exist;
    });

    it("should return null if user not found", async () => {
      mockDb.prepare().bind().all.resolves({ results: [] });

      const user = await authService.getUserById("nonexistent", env);

      expect(user).to.be.null;
    });

    it("should handle decryption errors gracefully", async () => {
      const crypto = await import("../../src/utils/crypto.js");
      const phoneEncrypted = await crypto.encryptAESGCM(
        "1234567890",
        env.PII_ENCRYPTION_KEY,
      );

      const mockUser = {
        id: "user123",
        email: "test@example.com",
        phone_number_encrypted: phoneEncrypted,
        date_of_birth_encrypted: "invalid-encrypted-data",
        ssn_encrypted: "invalid-encrypted-data",
        full_name_encrypted: "invalid-encrypted-data",
      };
      mockDb
        .prepare()
        .bind()
        .all.resolves({ results: [mockUser] });

      const user = await authService.getUserById("user123", env);

      expect(user).to.exist;
      // Should still return user even if some fields fail to decrypt
    });

    it("should handle errors in getUserById", async () => {
      mockDb.prepare().bind().all.rejects(new Error("DB error"));

      const user = await authService.getUserById("user123", env);

      expect(user).to.be.null;
    });
  });

  describe("register error paths", () => {
    it("should handle encryption failures for individual PII fields", async () => {
      mockDb.prepare().bind().all.onFirstCall().resolves({ results: [] });

      // Test with invalid encryption key to trigger encryption failure
      const envWithInvalidKey = {
        ...env,
        PII_ENCRYPTION_KEY: "invalid-key-too-short",
      };

      const result = await authService.register(
        {
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          phoneNumber: "1234567890",
          address: "123 Main St",
        },
        envWithInvalidKey,
      );

      // Should fail due to invalid key
      expect(result.ok).to.be.false;
    });

    it("should handle database errors during registration", async () => {
      mockDb.prepare().bind().all.onFirstCall().resolves({ results: [] });
      mockDb.prepare().bind().run.rejects(new Error("DB error"));

      const result = await authService.register(
        {
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        },
        env,
      );

      expect(result.ok).to.be.false;
      expect(result.error).to.equal("internal_error");
    });
  });

  describe("login error paths", () => {
    it("should handle database errors during login", async () => {
      mockDb.prepare().bind().all.rejects(new Error("DB error"));

      const result = await authService.login(
        {
          email: "test@example.com",
          password: "password123",
        },
        env,
      );

      expect(result.ok).to.be.false;
      expect(result.error).to.equal("internal_error");
    });
  });

  describe("rotateRefreshToken error paths", () => {
    it("should handle errors when token not found", async () => {
      const crypto = await import("../../src/utils/crypto.js");
      const refreshTokenHash = await crypto.sha256("invalid-token");
      mockDb.prepare().bind().all.resolves({ results: [] });

      const result = await authService.rotateRefreshToken(
        {
          refreshToken: "invalid-token",
        },
        env,
      );

      expect(result.ok).to.be.false;
      expect(result.error).to.equal("invalid_refresh_token");
    });

    it("should handle database errors during rotation", async () => {
      const crypto = await import("../../src/utils/crypto.js");
      const refreshTokenHash = await crypto.sha256("valid-token");

      const mockToken = {
        id: "token-id",
        user_id: "user123",
        token_hash: refreshTokenHash,
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        revoked: 0,
      };
      mockDb
        .prepare()
        .bind()
        .all.onFirstCall()
        .resolves({ results: [mockToken] });
      mockDb.prepare().bind().run.rejects(new Error("DB error"));

      const result = await authService.rotateRefreshToken(
        {
          refreshToken: "valid-token",
        },
        env,
      );

      expect(result.ok).to.be.false;
      expect(result.error).to.equal("internal_error");
    });
  });

  describe("revokeRefreshToken error paths", () => {
    it("should handle errors when access token verification fails", async () => {
      const crypto = await import("../../src/utils/crypto.js");
      const refreshTokenHash = await crypto.sha256("valid-token");

      const mockToken = {
        id: "token-id",
        user_id: "user123",
        token_hash: refreshTokenHash,
      };
      mockDb
        .prepare()
        .bind()
        .all.onFirstCall()
        .resolves({ results: [mockToken] });
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true });
      mockDb.prepare().bind().run.onCall(1).resolves({ success: true });

      // Use an invalid access token that will fail verification
      const result = await authService.revokeRefreshToken(
        {
          refreshToken: "valid-token",
          accessToken: "invalid-access-token-format",
        },
        env,
      );

      // Should still succeed (refresh token is revoked, access token error is logged but doesn't fail)
      expect(result.ok).to.be.true;
    });

    it("should handle database errors during revocation", async () => {
      const crypto = await import("../../src/utils/crypto.js");
      const refreshTokenHash = await crypto.sha256("valid-token");

      const mockToken = {
        id: "token-id",
        user_id: "user123",
        token_hash: refreshTokenHash,
      };
      mockDb
        .prepare()
        .bind()
        .all.resolves({ results: [mockToken] });
      mockDb.prepare().bind().run.rejects(new Error("DB error"));

      const result = await authService.revokeRefreshToken(
        {
          refreshToken: "valid-token",
        },
        env,
      );

      expect(result.ok).to.be.false;
      expect(result.error).to.equal("internal_error");
    });
  });
});
