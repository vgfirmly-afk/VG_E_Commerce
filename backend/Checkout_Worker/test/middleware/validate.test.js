// test/middleware/validate.test.js
import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import Joi from "joi";
import { validateBody, validateQuery } from "../../src/middleware/validate.js";
import { createMockRequest } from "../setup.js";

describe("Validate Middleware", () => {
  describe("validateBody", () => {
    it("should validate request body successfully", async () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
      });

      const body = { name: "Test", age: 25 };
      const request = createMockRequest(
        "POST",
        "https://example.com/api",
        body,
      );

      const middleware = validateBody(schema);
      const result = await middleware(request, {}, {});

      expect(result).to.be.undefined;
      expect(request.validatedBody).to.deep.equal({ name: "Test", age: 25 });
    });

    it("should return error response for invalid body", async () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
      });

      const body = { name: "Test" }; // Missing age
      const request = createMockRequest(
        "POST",
        "https://example.com/api",
        body,
      );

      const middleware = validateBody(schema);
      const result = await middleware(request, {}, {});

      expect(result).to.be.instanceOf(Response);
      expect(result.status).to.equal(400);
      const responseBody = await result.json();
      expect(responseBody.error).to.equal("validation_error");
    });

    it("should return error for invalid JSON", async () => {
      const schema = Joi.object({
        name: Joi.string().required(),
      });

      const request = createMockRequest(
        "POST",
        "https://example.com/api",
        null,
      );
      request.json = async () => {
        throw new Error("Invalid JSON");
      };

      const middleware = validateBody(schema);
      const result = await middleware(request, {}, {});

      expect(result).to.be.instanceOf(Response);
      expect(result.status).to.equal(400);
      const responseBody = await result.json();
      expect(responseBody.error).to.equal("validation_error");
    });

    it("should strip unknown fields", async () => {
      const schema = Joi.object({
        name: Joi.string().required(),
      });

      const body = { name: "Test", unknown: "field" };
      const request = createMockRequest(
        "POST",
        "https://example.com/api",
        body,
      );

      const middleware = validateBody(schema);
      await middleware(request, {}, {});

      expect(request.validatedBody).to.not.have.property("unknown");
      expect(request.validatedBody.name).to.equal("Test");
    });
  });

  describe("validateQuery", () => {
    it("should validate query parameters successfully", async () => {
      const schema = Joi.object({
        page: Joi.number().default(1),
        limit: Joi.number().default(10),
      });

      const request = createMockRequest(
        "GET",
        "https://example.com/api?page=2&limit=20",
      );

      const middleware = validateQuery(schema);
      const result = await middleware(request, {}, {});

      expect(result).to.be.undefined;
      expect(request.validatedQuery.page).to.equal(2);
      expect(request.validatedQuery.limit).to.equal(20);
    });

    it("should return error response for invalid query params", async () => {
      const schema = Joi.object({
        page: Joi.number().required(),
      });

      const request = createMockRequest(
        "GET",
        "https://example.com/api?page=invalid",
      );

      const middleware = validateQuery(schema);
      const result = await middleware(request, {}, {});

      expect(result).to.be.instanceOf(Response);
      expect(result.status).to.equal(400);
      const responseBody = await result.json();
      expect(responseBody.error).to.equal("validation_error");
    });

    it("should apply default values", async () => {
      const schema = Joi.object({
        page: Joi.number().default(1),
        limit: Joi.number().default(10),
      });

      const request = createMockRequest("GET", "https://example.com/api");

      const middleware = validateQuery(schema);
      await middleware(request, {}, {});

      expect(request.validatedQuery.page).to.equal(1);
      expect(request.validatedQuery.limit).to.equal(10);
    });
  });
});
