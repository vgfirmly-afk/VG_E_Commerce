// test/utils/validators.test.js
import { describe, it } from "mocha";
import { expect } from "chai";
import {
  validateAddress,
  validateSetDeliveryAddress,
  validateSetBillingAddress,
  validateSelectShippingMethod,
  validateCreateCheckoutSession,
  validateSessionId,
  validateCartId,
  validateShippingMethod,
  validateShippingMethodUpdate,
  validateShippingMethodId,
} from "../../src/utils/validators.js";

describe("Validators", () => {
  describe("validateAddress", () => {
    it("should validate correct address data", () => {
      const address = {
        full_name: "John Doe",
        phone: "1234567890",
        email: "john@example.com",
        address_line1: "123 Main St",
        address_line2: "Apt 4",
        city: "New York",
        state: "NY",
        postal_code: "10001",
        country: "US",
      };

      const result = validateAddress(address);
      expect(result.error).to.be.undefined;
      expect(result.value).to.deep.include(address);
    });

    it("should reject missing required fields", () => {
      const address = {
        full_name: "John Doe",
        // Missing phone
      };

      const result = validateAddress(address);
      expect(result.error).to.exist;
    });

    it("should reject invalid email", () => {
      const address = {
        full_name: "John Doe",
        phone: "1234567890",
        email: "invalid-email",
        address_line1: "123 Main St",
        city: "New York",
        state: "NY",
        postal_code: "10001",
      };

      const result = validateAddress(address);
      expect(result.error).to.exist;
    });
  });

  describe("validateSetDeliveryAddress", () => {
    it("should validate delivery address with use_for_billing", () => {
      const address = {
        full_name: "John Doe",
        phone: "1234567890",
        address_line1: "123 Main St",
        city: "New York",
        state: "NY",
        postal_code: "10001",
        use_for_billing: true,
      };

      const result = validateSetDeliveryAddress(address);
      expect(result.error).to.be.undefined;
      expect(result.value.use_for_billing).to.be.true;
    });
  });

  describe("validateSetBillingAddress", () => {
    it("should validate billing address", () => {
      const address = {
        full_name: "John Doe",
        phone: "1234567890",
        address_line1: "123 Main St",
        city: "New York",
        state: "NY",
        postal_code: "10001",
      };

      const result = validateSetBillingAddress(address);
      expect(result.error).to.be.undefined;
    });
  });

  describe("validateSelectShippingMethod", () => {
    it("should validate shipping method selection", () => {
      const data = {
        shipping_method_id: "method-123",
      };

      const result = validateSelectShippingMethod(data);
      expect(result.error).to.be.undefined;
      expect(result.value.shipping_method_id).to.equal("method-123");
    });

    it("should reject missing shipping_method_id", () => {
      const data = {};

      const result = validateSelectShippingMethod(data);
      expect(result.error).to.exist;
    });
  });

  describe("validateCreateCheckoutSession", () => {
    it("should validate checkout session creation", () => {
      const data = {
        cart_id: "cart-123",
      };

      const result = validateCreateCheckoutSession(data);
      expect(result.error).to.be.undefined;
      expect(result.value.cart_id).to.equal("cart-123");
    });

    it("should reject missing cart_id", () => {
      const data = {};

      const result = validateCreateCheckoutSession(data);
      expect(result.error).to.exist;
    });
  });

  describe("validateSessionId", () => {
    it("should validate session ID", () => {
      const result = validateSessionId("session-123");
      expect(result.error).to.be.undefined;
      expect(result.value).to.equal("session-123");
    });

    it("should reject empty session ID", () => {
      const result = validateSessionId("");
      expect(result.error).to.exist;
    });

    it("should reject undefined session ID", () => {
      const result = validateSessionId(undefined);
      expect(result.error).to.exist;
    });
  });

  describe("validateCartId", () => {
    it("should validate cart ID", () => {
      const result = validateCartId("cart-123");
      expect(result.error).to.be.undefined;
      expect(result.value).to.equal("cart-123");
    });

    it("should reject empty cart ID", () => {
      const result = validateCartId("");
      expect(result.error).to.exist;
    });
  });

  describe("validateShippingMethod", () => {
    it("should validate shipping method creation", () => {
      const method = {
        name: "Standard Shipping",
        description: "Standard delivery",
        carrier: "USPS",
        base_cost: 5.0,
        cost_per_kg: 1.0,
        min_delivery_days: 3,
        max_delivery_days: 7,
        is_active: true,
        applicable_pincodes: ["10001", "10002"],
      };

      const result = validateShippingMethod(method);
      expect(result.error).to.be.undefined;
      expect(result.value.name).to.equal("Standard Shipping");
    });

    it("should reject missing required fields", () => {
      const method = {
        name: "Standard Shipping",
        // Missing carrier
      };

      const result = validateShippingMethod(method);
      expect(result.error).to.exist;
    });
  });

  describe("validateShippingMethodUpdate", () => {
    it("should validate shipping method update", () => {
      const updates = {
        name: "Updated Name",
        base_cost: 10.0,
      };

      const result = validateShippingMethodUpdate(updates);
      expect(result.error).to.be.undefined;
      expect(result.value.name).to.equal("Updated Name");
    });

    it("should allow partial updates", () => {
      const updates = {
        is_active: false,
      };

      const result = validateShippingMethodUpdate(updates);
      expect(result.error).to.be.undefined;
    });
  });

  describe("validateShippingMethodId", () => {
    it("should validate shipping method ID", () => {
      const result = validateShippingMethodId("method-123");
      expect(result.error).to.be.undefined;
      expect(result.value).to.equal("method-123");
    });

    it("should reject empty method ID", () => {
      const result = validateShippingMethodId("");
      expect(result.error).to.exist;
    });
  });
});
