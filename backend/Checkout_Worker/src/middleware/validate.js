// middleware/validate.js
import { logError } from "../utils/logger.js";

/**
 * Validate request body with Joi schema
 */
export function validateBody(schema) {
  return async (request, env, ctx) => {
    try {
      const body = await request.json();
      const { error, value } = schema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return new Response(
          JSON.stringify({
            error: "validation_error",
            message: "Invalid request data",
            details: error.details.map((d) => ({
              path: d.path.join("."),
              message: d.message,
              type: d.type,
            })),
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      // Attach validated data to request
      request.validatedBody = value;
    } catch (err) {
      logError("validateBody: Error parsing JSON", err);
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Invalid JSON in request body",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
  };
}

/**
 * Validate query parameters with Joi schema
 */
export function validateQuery(schema) {
  return async (request, env, ctx) => {
    const url = new URL(request.url);
    const queryParams = {};

    // Convert URLSearchParams to object
    for (const [key, value] of url.searchParams.entries()) {
      queryParams[key] = value;
    }

    const { error, value } = schema.validate(queryParams, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Invalid query parameters",
          details: error.details.map((d) => ({
            path: d.path.join("."),
            message: d.message,
            type: d.type,
          })),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Attach validated query params to request
    request.validatedQuery = value;
  };
}
