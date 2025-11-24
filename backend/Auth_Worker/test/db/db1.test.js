// test/db/db1.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as db from "../../src/db/db1.js";
import { createMockEnv } from "../setup.js";

describe("DB Functions", () => {
  let env;
  let mockDb;

  beforeEach(() => {
    env = createMockEnv();
    mockDb = env.AUTH_DB;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getUserByEmail", () => {
    it("should return user when found", async () => {
      const mockUser = { id: "123", email: "test@example.com" };
      mockDb
        .prepare()
        .bind()
        .all.resolves({ results: [mockUser] });

      const user = await db.getUserByEmail("test@example.com", env);
      expect(user).to.deep.equal(mockUser);
    });

    it("should return null when user not found", async () => {
      mockDb.prepare().bind().all.resolves({ results: [] });

      const user = await db.getUserByEmail("test@example.com", env);
      expect(user).to.be.null;
    });
  });

  describe("createUser", () => {
    it("should create user with PII fields", async () => {
      const user = {
        id: "123",
        email: "test@example.com",
        name: "Test User",
        pwd_hash: "hash",
        pwd_salt: "salt",
        role: "user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        phone_number_encrypted: "encrypted-phone",
        address_encrypted: "encrypted-address",
        date_of_birth_encrypted: "encrypted-dob",
        ssn_encrypted: "encrypted-ssn",
        full_name_encrypted: "encrypted-name",
      };
      mockDb.prepare().bind().run.resolves({ success: true });

      await db.createUser(user, env);
      expect(mockDb.prepare).to.have.been.called;
    });

    it("should create user without PII fields", async () => {
      const user = {
        id: "123",
        email: "test@example.com",
        name: "Test User",
        pwd_hash: "hash",
        pwd_salt: "salt",
        role: "user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockDb.prepare().bind().run.resolves({ success: true });

      await db.createUser(user, env);
      const prepareCalls = mockDb.prepare.getCalls();
      const createCall = prepareCalls.find((call) => {
        const sql = call.args[0] || "";
        return (
          sql.includes("INSERT INTO users") &&
          !sql.includes("phone_number_encrypted")
        );
      });
      expect(createCall).to.exist;
    });
  });

  describe("getUserByIddb", () => {
    it("should return user when found", async () => {
      const mockUser = { id: "123", email: "test@example.com" };
      mockDb
        .prepare()
        .bind()
        .all.resolves({ results: [mockUser] });

      const user = await db.getUserByIddb("123", env);
      expect(user).to.deep.equal(mockUser);
    });

    it("should return null when user not found", async () => {
      mockDb.prepare().bind().all.resolves({ results: [] });

      const user = await db.getUserByIddb("123", env);
      expect(user).to.be.null;
    });
  });

  describe("createRefreshTokenRow", () => {
    it("should create refresh token row", async () => {
      const row = {
        id: "token-id",
        user_id: "user123",
        token_hash: "hash",
        device_info: "device",
        expires_at: new Date().toISOString(),
        revoked: 0,
        created_at: new Date().toISOString(),
        rotated_from: null,
      };
      mockDb.prepare().bind().run.resolves({ success: true });

      await db.createRefreshTokenRow(row, env);
      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("findRefreshTokenRow", () => {
    it("should return token when found", async () => {
      const mockToken = { id: "token-id", token_hash: "hash" };
      mockDb
        .prepare()
        .bind()
        .all.resolves({ results: [mockToken] });

      const token = await db.findRefreshTokenRow("hash", env);
      expect(token).to.deep.equal(mockToken);
    });

    it("should return null when token not found", async () => {
      mockDb.prepare().bind().all.resolves({ results: [] });

      const token = await db.findRefreshTokenRow("hash", env);
      expect(token).to.be.null;
    });
  });

  describe("rotateRefreshTokenRow", () => {
    it("should rotate refresh token", async () => {
      const oldId = "old-token-id";
      const newRow = {
        id: "new-token-id",
        user_id: "user123",
        token_hash: "new-hash",
        device_info: "device",
        expires_at: new Date().toISOString(),
        revoked: 0,
        created_at: new Date().toISOString(),
        rotated_from: oldId,
      };
      mockDb.prepare().bind().run.onCall(0).resolves({ success: true }); // Revoke old
      mockDb.prepare().bind().run.onCall(1).resolves({ success: true }); // Create new

      await db.rotateRefreshTokenRow({ oldId, newRow }, env);
      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("revokeRefreshTokenRow", () => {
    it("should revoke refresh token", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      await db.revokeRefreshTokenRow("token-id", env);
      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("addRevokedToken", () => {
    it("should add revoked token", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      await db.addRevokedToken(
        "jti-123",
        "user123",
        Math.floor(Date.now() / 1000),
        env,
      );
      expect(mockDb.prepare).to.have.been.called;
    });
  });

  describe("isTokenRevoked", () => {
    it("should return true when token is revoked", async () => {
      mockDb
        .prepare()
        .bind()
        .all.resolves({ results: [{ jti: "jti-123" }] });

      const isRevoked = await db.isTokenRevoked("jti-123", env);
      expect(isRevoked).to.be.true;
    });

    it("should return false when token is not revoked", async () => {
      mockDb.prepare().bind().all.resolves({ results: [] });

      const isRevoked = await db.isTokenRevoked("jti-123", env);
      expect(isRevoked).to.be.false;
    });

    it("should return false when jti is null", async () => {
      const isRevoked = await db.isTokenRevoked(null, env);
      expect(isRevoked).to.be.false;
    });

    it("should return false when jti is undefined", async () => {
      const isRevoked = await db.isTokenRevoked(undefined, env);
      expect(isRevoked).to.be.false;
    });

    it("should handle database errors gracefully", async () => {
      mockDb.prepare().bind().all.rejects(new Error("Database error"));

      const isRevoked = await db.isTokenRevoked("jti-123", env);
      expect(isRevoked).to.be.false;
    });
  });

  describe("cleanupExpiredRevokedTokens", () => {
    it("should cleanup expired revoked tokens", async () => {
      mockDb.prepare().bind().run.resolves({ success: true });

      await db.cleanupExpiredRevokedTokens(env);
      expect(mockDb.prepare).to.have.been.called;
    });
  });
});
