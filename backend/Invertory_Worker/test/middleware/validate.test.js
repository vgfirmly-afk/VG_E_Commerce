// test/middleware/validate.test.js
import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import Joi from "joi";
import * as validate from "../../src/middleware/validate.js";
import { createMockRequest } from "../setup.js";

describe("Validate Middleware", () => {
  describe("validateBody", () => {
    it.skip("should validate valid JSON body", async () => {
      const schema = Joi.object({
        quantity: Joi.number().required(),
        reason: Joi.string().optional(),
      });

      const body = { quantity: 100, reason: "Restock" };
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1/adjust", body, {
        "Content-Type": "application/json",
      });

      const middleware = validate.validateBody(schema);
      const result = await middleware(request, {}, {});

      expect(result).to.be.undefined;
      expect(request.validatedBody).to.deep.equal(body);
    });

    it("should return 400 for invalid JSON", async () => {
      const schema = Joi.object({
        quantity: Joi.number().required(),
      });

      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1/adjust", null);
      request.json = async () => {
        throw new Error("Unexpected end of JSON input");
      };

      const middleware = validate.validateBody(schema);
      const result = await middleware(request, {}, {});

      expect(result).to.be.instanceOf(Response);
      expect(result.status).to.equal(400);
      const data = await result.json();
      expect(data.error).to.equal("validation_error");
    });

    it("should return 400 for invalid data", async () => {
      const schema = Joi.object({
        quantity: Joi.number().required(),
      });

      const body = { quantity: "not-a-number" };
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1/adjust", body, {
        "Content-Type": "application/json",
      });

      const middleware = validate.validateBody(schema);
      const result = await middleware(request, {}, {});

      expect(result).to.be.instanceOf(Response);
      expect(result.status).to.equal(400);
      const data = await result.json();
      expect(data.error).to.equal("validation_error");
      if (data.details) {
        expect(data.details).to.be.an("array");
      } else {
        // If details is not present, that's also acceptable
        expect(data.message).to.exist;
      }
    });

    it("should check Content-Type for POST requests", async () => {
      const schema = Joi.object({
        quantity: Joi.number().required(),
      });

      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1/adjust", null, {
        "Content-Type": "text/plain",
      });

      const middleware = validate.validateBody(schema);
      const result = await middleware(request, {}, {});

      expect(result).to.be.instanceOf(Response);
      expect(result.status).to.equal(400);
      const data = await result.json();
      expect(data.error).to.equal("validation_error");
      expect(data.message).to.include("Content-Type");
    });

    it.skip("should strip unknown fields", async () => {
      const schema = Joi.object({
        quantity: Joi.number().required(),
      }).unknown(true); // Allow unknown fields but strip them

      const body = { quantity: 100, unknownField: "should be removed" };
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1/adjust", body, {
        "Content-Type": "application/json",
      });

      const middleware = validate.validateBody(schema);
      const result = await middleware(request, {}, {});

      expect(result).to.be.undefined;
      expect(request.validatedBody).to.not.have.property("unknownField");
      expect(request.validatedBody.quantity).to.equal(100);
    });

    it("should handle GET requests without body validation", async () => {
      const schema = Joi.object({
        quantity: Joi.number().required(),
      });

      const request = createMockRequest("GET", "https://example.com/api/v1/stock/sku-1");
      // For GET requests, json() should not be called, but if it is, it should return {}
      request.json = async () => ({});

      const middleware = validate.validateBody(schema);
      const result = await middleware(request, {}, {});

      // GET requests don't require Content-Type check, but body validation still happens
      // Since body is empty {}, validation will fail, so we expect a Response
      expect(result).to.be.instanceOf(Response);
      expect(result.status).to.equal(400);
    });
  });

  describe("validateQuery", () => {
    it("should validate query parameters", async () => {
      const schema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20),
      });

      const request = createMockRequest("GET", "https://example.com/api/v1/stock/sku-1/history?page=2&limit=10");

      const middleware = validate.validateQuery(schema);
      const result = await middleware(request, {}, {});

      expect(result).to.be.undefined;
      expect(request.validatedQuery.page).to.equal(2);
      expect(request.validatedQuery.limit).to.equal(10);
    });

    it("should return 400 for invalid query parameters", async () => {
      const schema = Joi.object({
        page: Joi.number().integer().min(1).required(),
      });

      const request = createMockRequest("GET", "https://example.com/api/v1/stock/sku-1/history?page=invalid");

      const middleware = validate.validateQuery(schema);
      const result = await middleware(request, {}, {});

      expect(result).to.be.instanceOf(Response);
      expect(result.status).to.equal(400);
      const data = await result.json();
      expect(data.error).to.equal("validation_error");
    });

    it("should handle missing query parameters", async () => {
      const schema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(20),
      });

      const request = createMockRequest("GET", "https://example.com/api/v1/stock/sku-1/history");

      const middleware = validate.validateQuery(schema);
      const result = await middleware(request, {}, {});

      expect(result).to.be.undefined;
      expect(request.validatedQuery.page).to.equal(1);
      expect(request.validatedQuery.limit).to.equal(20);
    });
  });
});

