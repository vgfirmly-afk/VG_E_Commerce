// test/middleware/validate.test.js
import { describe, it } from "mocha";
import Joi from "joi";
import { validateBody, validateQuery } from "../../src/middleware/validate.js";
import { createMockRequest, createMockEnv } from "../setup.js";

describe("Validate Middleware", () => {
  describe("validateBody", () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().integer().min(0),
    });

    it("should validate correct body", async () => {
      const middleware = validateBody(schema);
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart",
        {
          name: "Test",
          age: 25,
        },
      );

      const result = await middleware(request, createMockEnv(), {});

      expect(result).to.be.undefined;
      expect(request.validatedBody).to.deep.equal({ name: "Test", age: 25 });
    });

    it("should return error response for invalid body", async () => {
      const middleware = validateBody(schema);
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart",
        {
          age: 25,
        },
      );

      const result = await middleware(request, createMockEnv(), {});

      expect(result).to.be.instanceOf(Response);
      expect(result.status).to.equal(400);
      const body = await result.json();
      expect(body.error).to.equal("validation_error");
    });

    it("should return error for invalid JSON", async () => {
      const middleware = validateBody(schema);
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart",
      );
      request.json = async () => {
        throw new Error("Invalid JSON");
      };

      const result = await middleware(request, createMockEnv(), {});

      expect(result).to.be.instanceOf(Response);
      expect(result.status).to.equal(400);
      const body = await result.json();
      expect(body.error).to.equal("validation_error");
    });

    it("should strip unknown fields", async () => {
      const middleware = validateBody(schema);
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart",
        {
          name: "Test",
          age: 25,
          unknown: "field",
        },
      );

      const result = await middleware(request, createMockEnv(), {});

      expect(result).to.be.undefined;
      expect(request.validatedBody).to.not.have.property("unknown");
    });
  });

  describe("validateQuery", () => {
    const schema = Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
    });

    it("should validate correct query params", async () => {
      const middleware = validateQuery(schema);
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/cart?page=2&limit=10",
      );

      const result = await middleware(request, createMockEnv(), {});

      expect(result).to.be.undefined;
      expect(request.validatedQuery.page).to.equal(2);
      expect(request.validatedQuery.limit).to.equal(10);
    });

    it("should return error response for invalid query", async () => {
      const middleware = validateQuery(schema);
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/cart?page=-1",
      );

      const result = await middleware(request, createMockEnv(), {});

      expect(result).to.be.instanceOf(Response);
      expect(result.status).to.equal(400);
      const body = await result.json();
      expect(body.error).to.equal("validation_error");
    });

    it("should apply default values", async () => {
      const middleware = validateQuery(schema);
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/cart",
      );

      const result = await middleware(request, createMockEnv(), {});

      expect(result).to.be.undefined;
      expect(request.validatedQuery.page).to.equal(1);
      expect(request.validatedQuery.limit).to.equal(20);
    });
  });
});
