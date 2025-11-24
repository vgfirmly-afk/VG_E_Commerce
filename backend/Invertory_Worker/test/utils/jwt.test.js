// test/utils/jwt.test.js
import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as jwt from "../../src/utils/jwt.js";
import { createMockEnv, JWT_PUBLIC_KEY } from "../setup.js";

describe("JWT Utils", () => {
  let env;

  beforeEach(() => {
    env = createMockEnv();
  });

  describe("verifyJWT", () => {
    it("should return null when JWT_PUBLIC_KEY is not set", async () => {
      const envWithoutKey = createMockEnv({ JWT_PUBLIC_KEY: null });
      const result = await jwt.verifyJWT("token", envWithoutKey);
      expect(result).to.be.null;
    });

    it("should return null for invalid token format", async () => {
      const result = await jwt.verifyJWT("invalid-token", env);
      expect(result).to.be.null;
    });

    it("should return null for token with wrong number of parts", async () => {
      const result = await jwt.verifyJWT("part1.part2", env);
      expect(result).to.be.null;
    });

    it("should return null for non-string token", async () => {
      const result = await jwt.verifyJWT(null, env);
      expect(result).to.be.null;
    });

    it("should handle signature verification failure", async () => {
      // Create a token with invalid signature
      const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
      const payload = btoa(
        JSON.stringify({
          sub: "user-1",
          exp: Math.floor(Date.now() / 1000) + 3600,
        }),
      )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
      const invalidToken = `${header}.${payload}.invalid-signature`;

      const result = await jwt.verifyJWT(invalidToken, env);
      expect(result).to.be.null;
    });

    it("should return null for expired token", async () => {
      // Note: This test may not work perfectly without a real JWT library
      // but it tests the expiration check logic
      const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
      const payload = btoa(
        JSON.stringify({
          sub: "user-1",
          exp: Math.floor(Date.now() / 1000) - 3600,
        }),
      )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
      const expiredToken = `${header}.${payload}.signature`;

      // Mock crypto.subtle.verify to return true (signature valid)
      const originalVerify = global.crypto.subtle.verify;
      global.crypto.subtle.verify = sinon.stub().resolves(true);

      try {
        const result = await jwt.verifyJWT(expiredToken, env);
        // Should return null due to expiration
        expect(result).to.be.null;
      } finally {
        global.crypto.subtle.verify = originalVerify;
      }
    });

    it("should handle key import errors", async () => {
      const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
      const payload = btoa(JSON.stringify({ sub: "user-1" }))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
      const token = `${header}.${payload}.signature`;

      // Mock crypto.subtle.importKey to throw error
      const originalImportKey = global.crypto.subtle.importKey;
      global.crypto.subtle.importKey = sinon
        .stub()
        .rejects(new Error("Key import error"));

      try {
        const result = await jwt.verifyJWT(token, env);
        expect(result).to.be.null;
      } finally {
        global.crypto.subtle.importKey = originalImportKey;
      }
    });

    it("should handle payload decode errors", async () => {
      const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
      const invalidPayload = "invalid-base64";
      const token = `${header}.${invalidPayload}.signature`;

      // Mock crypto.subtle.verify to return true
      const originalVerify = global.crypto.subtle.verify;
      global.crypto.subtle.verify = sinon.stub().resolves(true);

      try {
        const result = await jwt.verifyJWT(token, env);
        expect(result).to.be.null;
      } finally {
        global.crypto.subtle.verify = originalVerify;
      }
    });
  });
});
