// test/utils/jwt.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as jwt from "../../src/utils/jwt.js";
import { createMockEnv } from "../setup.js";

describe("JWT Utils", () => {
  let env;

  beforeEach(() => {
    env = createMockEnv();
    // Note: You need to set TEST_JWT_PRIVATE_KEY and TEST_JWT_PUBLIC_KEY environment variables
    // or replace these placeholders with actual RSA key pair
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("signJWT", () => {
    it("should sign a JWT token successfully", async () => {
      if (
        !env.JWT_PRIVATE_KEY ||
        env.JWT_PRIVATE_KEY === "YOUR_JWT_PRIVATE_KEY_HERE"
      ) {
        console.log("Skipping JWT tests - keys not configured");
        return;
      }

      const payload = { sub: "user123", role: "user" };
      const token = await jwt.signJWT(payload, { env, expiresIn: "15m" });

      expect(token).to.be.a("string");
      expect(token.split(".")).to.have.lengthOf(3); // JWT has 3 parts
    });

    it("should include jti in token", async () => {
      if (
        !env.JWT_PRIVATE_KEY ||
        env.JWT_PRIVATE_KEY === "YOUR_JWT_PRIVATE_KEY_HERE"
      ) {
        return;
      }

      const payload = { sub: "user123" };
      const token = await jwt.signJWT(payload, { env });

      // Decode payload to check jti
      const parts = token.split(".");
      const payloadPart = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
      expect(payloadPart.jti).to.exist;
    });

    it("should throw error if JWT_PRIVATE_KEY not set", async () => {
      const envWithoutKey = { ...env, JWT_PRIVATE_KEY: null };
      try {
        await jwt.signJWT({ sub: "user123" }, { env: envWithoutKey });
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("JWT_PRIVATE_KEY");
      }
    });

    it("should handle custom expiration", async () => {
      if (
        !env.JWT_PRIVATE_KEY ||
        env.JWT_PRIVATE_KEY === "YOUR_JWT_PRIVATE_KEY_HERE"
      ) {
        return;
      }

      const token = await jwt.signJWT(
        { sub: "user123" },
        { env, expiresIn: "30m" },
      );
      expect(token).to.be.a("string");
    });
  });

  describe("verifyJWT", () => {
    it("should verify a valid JWT token", async () => {
      if (
        !env.JWT_PRIVATE_KEY ||
        env.JWT_PRIVATE_KEY === "YOUR_JWT_PRIVATE_KEY_HERE"
      ) {
        return;
      }

      const payload = { sub: "user123", role: "user" };
      const token = await jwt.signJWT(payload, { env });
      const verified = await jwt.verifyJWT(token, env);

      expect(verified).to.exist;
      expect(verified.sub).to.equal("user123");
    });

    it("should return null if JWT_PUBLIC_KEY not set", async () => {
      const envWithoutKey = { ...env, JWT_PUBLIC_KEY: null };
      const result = await jwt.verifyJWT("invalid.token.here", envWithoutKey);
      expect(result).to.be.null;
    });

    it("should return null for invalid token format", async () => {
      if (
        !env.JWT_PUBLIC_KEY ||
        env.JWT_PUBLIC_KEY === "YOUR_JWT_PUBLIC_KEY_HERE"
      ) {
        return;
      }

      const result = await jwt.verifyJWT("invalid-token", env);
      expect(result).to.be.null;
    });

    it("should return null for expired token", async () => {
      if (
        !env.JWT_PRIVATE_KEY ||
        env.JWT_PRIVATE_KEY === "YOUR_JWT_PRIVATE_KEY_HERE"
      ) {
        return;
      }

      // Test expired token by creating one with very short expiration
      // signJWT accepts number of seconds for expiresIn
      const token = await jwt.signJWT(
        { sub: "user123" },
        { env, expiresIn: 1 },
      ); // 1 second expiration

      // Wait for token to expire (wait 2 seconds to be sure it's expired)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const verified = await jwt.verifyJWT(token, env);
      expect(verified).to.be.null;
    });

    it("should return null for tampered token", async () => {
      if (
        !env.JWT_PRIVATE_KEY ||
        env.JWT_PRIVATE_KEY === "YOUR_JWT_PRIVATE_KEY_HERE"
      ) {
        return;
      }

      const token = await jwt.signJWT({ sub: "user123" }, { env });
      const tampered = token.slice(0, -5) + "xxxxx";
      const verified = await jwt.verifyJWT(tampered, env);
      expect(verified).to.be.null;
    });

    it("should return null for token with invalid signature", async () => {
      if (
        !env.JWT_PRIVATE_KEY ||
        env.JWT_PRIVATE_KEY === "YOUR_JWT_PRIVATE_KEY_HERE"
      ) {
        return;
      }

      // Create a token and modify the signature
      const token = await jwt.signJWT({ sub: "user123" }, { env });
      const parts = token.split(".");
      parts[2] = "invalid-signature";
      const invalidToken = parts.join(".");

      const verified = await jwt.verifyJWT(invalidToken, env);
      expect(verified).to.be.null;
    });

    it("should return null for token missing parts", async () => {
      if (
        !env.JWT_PUBLIC_KEY ||
        env.JWT_PUBLIC_KEY === "YOUR_JWT_PUBLIC_KEY_HERE"
      ) {
        return;
      }

      const verified = await jwt.verifyJWT("invalid.token", env);
      expect(verified).to.be.null;
    });

    it("should handle errors during verification", async () => {
      if (
        !env.JWT_PUBLIC_KEY ||
        env.JWT_PUBLIC_KEY === "YOUR_JWT_PUBLIC_KEY_HERE"
      ) {
        return;
      }

      // Invalid base64 in payload
      const invalidToken = "header.invalid-payload.signature";
      const verified = await jwt.verifyJWT(invalidToken, env);
      expect(verified).to.be.null;
    });
  });

  describe("importPublicKeyFromPrivate", () => {
    it.skip("should import public key from private key", async () => {
      // Note: importPublicKeyFromPrivate is not exported, it's an internal function
      // This test is skipped as the function is not part of the public API
    });
  });
});
