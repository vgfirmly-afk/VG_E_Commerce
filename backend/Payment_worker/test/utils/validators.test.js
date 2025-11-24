// test/utils/validators.test.js
import { describe, it } from "mocha";
import { expect } from "chai";
import {
  createPaymentSchema,
  paymentIdSchema,
  capturePaymentSchema,
  validateCreatePayment,
  validatePaymentId,
  validateCapturePayment,
} from "../../src/utils/validators.js";

describe("Validators", () => {
  describe("createPaymentSchema", () => {
    it("should validate valid payment data", () => {
      const validData = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
        currency: "USD",
        intent: "CAPTURE",
        return_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
        description: "Test payment",
      };

      const { error, value } = createPaymentSchema.validate(validData);
      expect(error).to.be.undefined;
      expect(value.checkout_session_id).to.equal("test-session-id");
    });

    it("should default currency to USD", () => {
      const data = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
        return_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
      };

      const { error, value } = createPaymentSchema.validate(data);
      expect(error).to.be.undefined;
      expect(value.currency).to.equal("USD");
    });

    it("should default intent to CAPTURE", () => {
      const data = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
        return_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
      };

      const { error, value } = createPaymentSchema.validate(data);
      expect(error).to.be.undefined;
      expect(value.intent).to.equal("CAPTURE");
    });

    it("should reject missing required fields", () => {
      const invalidData = {
        amount: 100.0,
        // Missing checkout_session_id, return_url, cancel_url
      };

      const { error } = createPaymentSchema.validate(invalidData);
      expect(error).to.exist;
    });

    it("should reject invalid amount", () => {
      const invalidData = {
        checkout_session_id: "test-session-id",
        amount: -10, // Negative amount
        return_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
      };

      const { error } = createPaymentSchema.validate(invalidData);
      expect(error).to.exist;
    });

    it("should reject invalid currency length", () => {
      const invalidData = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
        currency: "US", // Invalid length
        return_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
      };

      const { error } = createPaymentSchema.validate(invalidData);
      expect(error).to.exist;
    });

    it("should reject invalid intent", () => {
      const invalidData = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
        intent: "INVALID",
        return_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
      };

      const { error } = createPaymentSchema.validate(invalidData);
      expect(error).to.exist;
    });

    it("should reject invalid URL", () => {
      const invalidData = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
        return_url: "not-a-url",
        cancel_url: "https://example.com/cancel",
      };

      const { error } = createPaymentSchema.validate(invalidData);
      expect(error).to.exist;
    });
  });

  describe("paymentIdSchema", () => {
    it("should validate valid payment ID", () => {
      const { error, value } = paymentIdSchema.validate("test-payment-id");
      expect(error).to.be.undefined;
      expect(value).to.equal("test-payment-id");
    });

    it("should reject empty payment ID", () => {
      const { error } = paymentIdSchema.validate("");
      expect(error).to.exist;
    });

    it("should reject payment ID that is too long", () => {
      const longId = "a".repeat(101);
      const { error } = paymentIdSchema.validate(longId);
      expect(error).to.exist;
    });
  });

  describe("capturePaymentSchema", () => {
    it("should validate valid capture data", () => {
      const validData = {
        order_id: "test-order-id",
      };

      const { error, value } = capturePaymentSchema.validate(validData);
      expect(error).to.be.undefined;
      expect(value.order_id).to.equal("test-order-id");
    });

    it("should validate empty capture data", () => {
      const { error, value } = capturePaymentSchema.validate({});
      expect(error).to.be.undefined;
      expect(value).to.exist;
    });

    it("should reject invalid order_id", () => {
      const invalidData = {
        order_id: "", // Empty string
      };

      const { error } = capturePaymentSchema.validate(invalidData);
      expect(error).to.exist;
    });
  });

  describe("validateCreatePayment", () => {
    it("should validate and return value", () => {
      const data = {
        checkout_session_id: "test-session-id",
        amount: 100.0,
        return_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
      };

      const { error, value } = validateCreatePayment(data);
      expect(error).to.be.undefined;
      expect(value).to.exist;
    });
  });

  describe("validatePaymentId", () => {
    it("should validate payment ID", () => {
      const { error, value } = validatePaymentId("test-payment-id");
      expect(error).to.be.undefined;
      expect(value).to.equal("test-payment-id");
    });
  });

  describe("validateCapturePayment", () => {
    it("should validate capture payment data", () => {
      const { error, value } = validateCapturePayment({ order_id: "test-order-id" });
      expect(error).to.be.undefined;
      expect(value).to.exist;
    });
  });
});

