// test/middleware/validate.test.js
import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { validateBody } from "../../src/middleware/validate.js";
import { createPaymentSchema } from "../../src/utils/validators.js";
import { createMockRequest } from "../setup.js";

describe("Validate Middleware", () => {
  describe("validateBody", () => {
    it("should validate request body and attach to request", async () => {
      const body = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
        return_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
      };
      // Create request with Content-Type header already set
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/payments",
        body,
        { "Content-Type": "application/json" },
      );
      // Override json to ensure it returns the body
      request.json = async () => body;

      const middleware = validateBody(createPaymentSchema);
      const result = await middleware(request, {}, {});

      // Should return undefined to continue to next handler
      expect(result).to.be.undefined;
      expect(request.validatedBody).to.exist;
      expect(request.validatedBody.checkout_session_id).to.equal(
        "test-session-id",
      );
    });

    it("should return error for missing Content-Type", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/payments",
        {
          checkout_session_id: "test-session-id",
          amount: 100.0,
        },
      );
      request.headers.delete("Content-Type");

      const middleware = validateBody(createPaymentSchema);
      const response = await middleware(request, {}, {});

      expect(response).to.be.instanceOf(Response);
      expect(response.status).to.equal(400);
      const data = await response.json();
      expect(data.error).to.equal("validation_error");
    });

    it("should return error for invalid JSON", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/payments",
        null,
      );
      request.headers.set("Content-Type", "application/json");
      request.json = async () => {
        throw new Error("Invalid JSON");
      };

      const middleware = validateBody(createPaymentSchema);
      const response = await middleware(request, {}, {});

      expect(response.status).to.equal(400);
      const data = await response.json();
      expect(data.error).to.equal("validation_error");
    });

    it("should return error for invalid data", async () => {
      const body = {
        amount: -10, // Invalid negative amount - missing required fields
      };
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/payments",
        body,
        { "Content-Type": "application/json" },
      );
      request.json = async () => body;

      const middleware = validateBody(createPaymentSchema);
      const response = await middleware(request, {}, {});

      expect(response.status).to.equal(400);
      const data = await response.json();
      expect(data.error).to.equal("validation_error");
      // details should be an array if validation failed
      if (data.details) {
        expect(data.details).to.be.an("array");
        expect(data.details.length).to.be.greaterThan(0);
      }
    });

    it("should strip unknown fields", async () => {
      const body = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
        return_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
        unknown_field: "should be stripped",
      };
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/payments",
        body,
        { "Content-Type": "application/json" },
      );
      request.json = async () => body;

      const middleware = validateBody(createPaymentSchema);
      const result = await middleware(request, {}, {});

      // Should return undefined and strip unknown fields
      expect(result).to.be.undefined;
      expect(request.validatedBody).to.exist;
      expect(request.validatedBody.unknown_field).to.be.undefined;
    });

    it("should handle errors in try-catch block", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/payments",
        {
          checkout_session_id: "test-session-id",
          amount: 100.0,
        },
      );
      request.headers.set("Content-Type", "application/json");

      // Make schema.validate throw an error
      const badSchema = {
        validate: () => {
          throw new Error("Schema validation error");
        },
      };

      const middleware = validateBody(badSchema);
      const response = await middleware(request, {}, {});

      expect(response.status).to.equal(400);
      const data = await response.json();
      expect(data.error).to.equal("validation_error");
    });
  });
});
