// test/middleware/validate.test.js
import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import Joi from "joi";
import * as validate from "../../src/middleware/validate.js";
import { createMockRequest } from "../setup.js";

describe("Validate Middleware", () => {
  describe("validateBody", () => {
    it("should validate valid request body", async () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
      });

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/promotion-codes",
        {
          name: "Test",
          age: 25,
        },
      );

      const middleware = validate.validateBody(schema);
      const result = await middleware(request, request.env, {});

      expect(result).to.be.undefined;
      expect(request.validatedBody).to.exist;
      expect(request.validatedBody.name).to.equal("Test");
    });

    it("should return 400 for invalid request body", async () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
      });

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/promotion-codes",
        {
          name: "Test",
          // age is missing
        },
      );

      const middleware = validate.validateBody(schema);
      const result = await middleware(request, request.env, {});

      expect(result).to.exist;
      expect(result.status).to.equal(400);
      const data = await result.json();
      expect(data.error).to.equal("validation_error");
    });

    it("should handle invalid JSON", async () => {
      const schema = Joi.object({
        name: Joi.string().required(),
      });

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/promotion-codes",
        null,
      );
      request.json = async () => {
        throw new Error("Invalid JSON");
      };

      const middleware = validate.validateBody(schema);
      const result = await middleware(request, request.env, {});

      expect(result).to.exist;
      expect(result.status).to.equal(400);
    });
  });

  describe("validateQuery", () => {
    it("should validate valid query parameters", async () => {
      const schema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(20),
      });

      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/promotion-codes?page=1&limit=20",
      );

      const middleware = validate.validateQuery(schema);
      const result = await middleware(request, request.env, {});

      expect(result).to.be.undefined;
      expect(request.validatedQuery).to.exist;
      expect(request.validatedQuery.page).to.equal(1);
    });

    it("should return 400 for invalid query parameters", async () => {
      const schema = Joi.object({
        page: Joi.number().integer().min(1).required(),
      });

      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/promotion-codes?page=-1",
      );

      const middleware = validate.validateQuery(schema);
      const result = await middleware(request, request.env, {});

      expect(result).to.exist;
      expect(result.status).to.equal(400);
    });
  });
});
