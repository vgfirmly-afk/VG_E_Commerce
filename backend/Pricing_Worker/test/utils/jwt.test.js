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
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("verifyJWT", () => {
    it("should return null when JWT_PUBLIC_KEY is missing", async () => {
      const envWithoutKey = { ...env };
      delete envWithoutKey.JWT_PUBLIC_KEY;

      const result = await jwt.verifyJWT("token", envWithoutKey);
      expect(result).to.be.null;
    });

    it("should return null when token is not a string", async () => {
      const result = await jwt.verifyJWT(null, env);
      expect(result).to.be.null;
    });

    it("should return null when token format is invalid", async () => {
      const result = await jwt.verifyJWT("invalid-token", env);
      expect(result).to.be.null;
    });

    it("should return null when token has wrong number of parts", async () => {
      const result = await jwt.verifyJWT("header.payload", env);
      expect(result).to.be.null;
    });

    it("should return null when signature verification fails", async () => {
      // Create a token with invalid signature
      const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
      const payload = btoa(
        JSON.stringify({
          sub: "user123",
          exp: Math.floor(Date.now() / 1000) + 3600,
        }),
      );
      const signature = "invalid-signature";
      const token = `${header}.${payload}.${signature}`;

      const result = await jwt.verifyJWT(token, env);
      expect(result).to.be.null;
    });

    it("should return null when token is expired", async () => {
      // Create an expired token
      const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
      const payload = btoa(
        JSON.stringify({
          sub: "user123",
          exp: Math.floor(Date.now() / 1000) - 3600,
        }),
      );
      const signature = "signature";
      const token = `${header}.${payload}.${signature}`;

      const result = await jwt.verifyJWT(token, env);
      expect(result).to.be.null;
    });

    it("should handle invalid base64 in signature", async () => {
      const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
      const payload = btoa(
        JSON.stringify({
          sub: "user123",
          exp: Math.floor(Date.now() / 1000) + 3600,
        }),
      );
      const signature = "invalid-base64!!!";
      const token = `${header}.${payload}.${signature}`;

      const result = await jwt.verifyJWT(token, env);
      expect(result).to.be.null;
    });

    it("should handle invalid JSON in payload", async () => {
      const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
      const payload = "invalid-json";
      const signature = "signature";
      const token = `${header}.${payload}.${signature}`;

      const result = await jwt.verifyJWT(token, env);
      expect(result).to.be.null;
    });

    it("should handle invalid public key format", async () => {
      const envWithInvalidKey = {
        ...env,
        JWT_PUBLIC_KEY: "invalid-key",
      };

      const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
      const payload = btoa(
        JSON.stringify({
          sub: "user123",
          exp: Math.floor(Date.now() / 1000) + 3600,
        }),
      );
      const signature = "signature";
      const token = `${header}.${payload}.${signature}`;

      const result = await jwt.verifyJWT(token, envWithInvalidKey);
      expect(result).to.be.null;
    });
  });
});
