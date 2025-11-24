// test/utils/validators.test.js
import { describe, it } from "mocha";
import { expect } from "chai";
import { validateSignup, validateLogin } from "../../src/utils/validators.js";

describe("Validators", () => {
  describe("validateSignup", () => {
    it("should validate correct signup data", () => {
      const body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const result = validateSignup(body);
      expect(result.error).to.be.undefined;
      expect(result.value).to.deep.include(body);
    });

    it("should reject missing name", () => {
      const body = {
        email: "test@example.com",
        password: "password123",
      };

      const result = validateSignup(body);
      expect(result.error).to.exist;
      // Joi still returns value even with errors, but error exists
      expect(result.error).to.not.be.undefined;
    });

    it("should reject invalid email", () => {
      const body = {
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      };

      const result = validateSignup(body);
      expect(result.error).to.exist;
    });

    it("should reject short password", () => {
      const body = {
        name: "Test User",
        email: "test@example.com",
        password: "short",
      };

      const result = validateSignup(body);
      expect(result.error).to.exist;
    });

    it("should accept optional PII fields", () => {
      const body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        phoneNumber: "1234567890",
        address: "123 Main St",
        dateOfBirth: "1990-01-01",
        ssn: "123-45-6789",
        fullName: "Test Full Name",
      };

      const result = validateSignup(body);
      expect(result.error).to.be.undefined;
    });
  });

  describe("validateLogin", () => {
    it("should validate correct login data", () => {
      const body = {
        email: "test@example.com",
        password: "password123",
      };

      const result = validateLogin(body);
      expect(result.error).to.be.undefined;
      expect(result.value).to.deep.include(body);
    });

    it("should reject missing email", () => {
      const body = {
        password: "password123",
      };

      const result = validateLogin(body);
      expect(result.error).to.exist;
    });

    it("should reject missing password", () => {
      const body = {
        email: "test@example.com",
      };

      const result = validateLogin(body);
      expect(result.error).to.exist;
    });

    it("should reject invalid email format", () => {
      const body = {
        email: "not-an-email",
        password: "password123",
      };

      const result = validateLogin(body);
      expect(result.error).to.exist;
    });
  });
});
