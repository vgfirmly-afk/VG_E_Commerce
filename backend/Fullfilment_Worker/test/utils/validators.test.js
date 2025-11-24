// test/utils/validators.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import * as validators from "../../src/utils/validators.js";

describe("Validators", () => {
  afterEach(() => {
    // Clean up if needed
  });

  describe("validateOrderId", () => {
    it("should validate a valid order ID", () => {
      const result = validators.validateOrderId("order-123");
      expect(result.error).to.be.undefined;
      expect(result.value).to.equal("order-123");
    });

    it("should reject empty order ID", () => {
      const result = validators.validateOrderId("");
      expect(result.error).to.exist;
      expect(result.error.details[0].message).to.include(
        "not allowed to be empty",
      );
    });

    it("should reject order ID that is too long", () => {
      const longId = "a".repeat(101);
      const result = validators.validateOrderId(longId);
      expect(result.error).to.exist;
      expect(result.error.details[0].message).to.include(
        "length must be less than or equal to",
      );
    });

    it("should reject null order ID", () => {
      const result = validators.validateOrderId(null);
      expect(result.error).to.exist;
    });

    it("should reject undefined order ID", () => {
      const result = validators.validateOrderId(undefined);
      expect(result.error).to.exist;
    });
  });

  describe("validateCreateFulfillmentWebhook", () => {
    it("should validate valid webhook data", () => {
      const validData = {
        checkout_session_id: "session-123",
        payment_id: "payment-123",
        user_id: "user-123",
        order_data: {
          items: [
            {
              sku_id: "sku-123",
              product_id: "prod-123",
              quantity: 2,
              unit_price: 10.5,
              subtotal: 21.0,
            },
          ],
          subtotal: 21.0,
          shipping_cost: 5.0,
          tax: 2.1,
          total: 28.1,
          currency: "USD",
        },
      };

      const result = validators.validateCreateFulfillmentWebhook(validData);
      expect(result.error).to.be.undefined;
      expect(result.value.checkout_session_id).to.equal("session-123");
    });

    it("should validate webhook data with guest session", () => {
      const validData = {
        checkout_session_id: "session-123",
        payment_id: "payment-123",
        guest_session_id: "guest-123",
        order_data: {
          items: [
            {
              sku_id: "sku-123",
              quantity: 1,
              unit_price: 10.0,
              subtotal: 10.0,
            },
          ],
          subtotal: 10.0,
          shipping_cost: 5.0,
          tax: 1.0,
          total: 16.0,
        },
      };

      const result = validators.validateCreateFulfillmentWebhook(validData);
      expect(result.error).to.be.undefined;
    });

    it("should reject webhook data missing required fields", () => {
      const invalidData = {
        checkout_session_id: "session-123",
        // Missing payment_id and order_data
      };

      const result = validators.validateCreateFulfillmentWebhook(invalidData);
      expect(result.error).to.exist;
      expect(result.error.details.length).to.be.greaterThan(0);
    });

    it("should reject webhook data with invalid item quantity", () => {
      const invalidData = {
        checkout_session_id: "session-123",
        payment_id: "payment-123",
        order_data: {
          items: [
            {
              sku_id: "sku-123",
              quantity: 0, // Invalid: must be at least 1
              unit_price: 10.0,
              subtotal: 10.0,
            },
          ],
          subtotal: 10.0,
          shipping_cost: 5.0,
          tax: 1.0,
          total: 16.0,
        },
      };

      const result = validators.validateCreateFulfillmentWebhook(invalidData);
      expect(result.error).to.exist;
    });

    it("should reject webhook data with negative prices", () => {
      const invalidData = {
        checkout_session_id: "session-123",
        payment_id: "payment-123",
        order_data: {
          items: [
            {
              sku_id: "sku-123",
              quantity: 1,
              unit_price: -10.0, // Invalid: must be >= 0
              subtotal: 10.0,
            },
          ],
          subtotal: 10.0,
          shipping_cost: 5.0,
          tax: 1.0,
          total: 16.0,
        },
      };

      const result = validators.validateCreateFulfillmentWebhook(invalidData);
      expect(result.error).to.exist;
    });
  });

  describe("validateUpdateFulfillmentStatus", () => {
    it("should validate valid status update", () => {
      const validData = {
        status: "shipped",
        notes: "Order has been shipped",
      };

      const result = validators.validateUpdateFulfillmentStatus(validData);
      expect(result.error).to.be.undefined;
      expect(result.value.status).to.equal("shipped");
    });

    it("should validate status update without notes", () => {
      const validData = {
        status: "delivered",
      };

      const result = validators.validateUpdateFulfillmentStatus(validData);
      expect(result.error).to.be.undefined;
    });

    it("should reject invalid status", () => {
      const invalidData = {
        status: "invalid_status",
        notes: "Test",
      };

      const result = validators.validateUpdateFulfillmentStatus(invalidData);
      expect(result.error).to.exist;
      expect(result.error.details[0].message).to.include("must be one of");
    });

    it("should reject status update missing status", () => {
      const invalidData = {
        notes: "Test notes",
      };

      const result = validators.validateUpdateFulfillmentStatus(invalidData);
      expect(result.error).to.exist;
    });

    it("should reject notes that are too long", () => {
      const invalidData = {
        status: "shipped",
        notes: "a".repeat(1001), // Too long
      };

      const result = validators.validateUpdateFulfillmentStatus(invalidData);
      expect(result.error).to.exist;
    });

    it("should accept all valid status values", () => {
      const validStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ];

      validStatuses.forEach((status) => {
        const result = validators.validateUpdateFulfillmentStatus({ status });
        expect(result.error).to.be.undefined;
      });
    });
  });

  describe("validateAddShippingTracking", () => {
    it("should validate valid tracking data", () => {
      const validData = {
        carrier: "UPS",
        tracking_number: "1Z999AA10123456784",
        estimated_delivery_date: "2024-12-31",
        notes: "Package shipped",
      };

      const result = validators.validateAddShippingTracking(validData);
      expect(result.error).to.be.undefined;
      expect(result.value.carrier).to.equal("UPS");
    });

    it("should validate tracking data without optional fields", () => {
      const validData = {
        carrier: "FedEx",
        tracking_number: "123456789",
      };

      const result = validators.validateAddShippingTracking(validData);
      expect(result.error).to.be.undefined;
    });

    it("should reject tracking data missing carrier", () => {
      const invalidData = {
        tracking_number: "123456789",
      };

      const result = validators.validateAddShippingTracking(invalidData);
      expect(result.error).to.exist;
    });

    it("should reject tracking data missing tracking_number", () => {
      const invalidData = {
        carrier: "UPS",
      };

      const result = validators.validateAddShippingTracking(invalidData);
      expect(result.error).to.exist;
    });

    it("should reject empty carrier", () => {
      const invalidData = {
        carrier: "",
        tracking_number: "123456789",
      };

      const result = validators.validateAddShippingTracking(invalidData);
      expect(result.error).to.exist;
    });
  });

  describe("validateUpdateShippingTracking", () => {
    it("should validate valid tracking update", () => {
      const validData = {
        status: "in_transit",
        estimated_delivery_date: "2024-12-31",
        notes: "In transit",
      };

      const result = validators.validateUpdateShippingTracking(validData);
      expect(result.error).to.be.undefined;
    });

    it("should validate empty update (all optional)", () => {
      const validData = {};

      const result = validators.validateUpdateShippingTracking(validData);
      expect(result.error).to.be.undefined;
    });

    it("should reject invalid status", () => {
      const invalidData = {
        status: "invalid_status",
      };

      const result = validators.validateUpdateShippingTracking(invalidData);
      expect(result.error).to.exist;
      expect(result.error.details[0].message).to.include("must be one of");
    });

    it("should accept all valid status values", () => {
      const validStatuses = [
        "pending",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "exception",
      ];

      validStatuses.forEach((status) => {
        const result = validators.validateUpdateShippingTracking({ status });
        expect(result.error).to.be.undefined;
      });
    });
  });
});
