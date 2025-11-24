// middleware/validate.js
import { logError } from "../utils/logger.js";

/**
 * Validate request body with Joi schema
 */
export function validateBody(schema) {
  return async (request, env, ctx) => {
    try {
      // Check Content-Type for POST/PUT/PATCH requests
      const method = request.method.toUpperCase();
      if (["POST", "PUT", "PATCH"].includes(method)) {
        const contentType = request.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          return new Response(
            JSON.stringify({
              error: "validation_error",
              message: "Content-Type must be application/json",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }
      }

      // Parse JSON body
      let body;
      try {
        body = await request.json();
      } catch (parseErr) {
        logError("validateBody: Error parsing JSON", parseErr, {
          method: request.method,
          contentType: request.headers.get("content-type"),
          url: request.url,
        });

        // Provide more helpful error message
        let errorMessage = "Invalid JSON in request body";
        if (
          parseErr.message &&
          parseErr.message.includes("Unexpected end of JSON")
        ) {
          errorMessage = "Request body is empty or incomplete";
        } else if (
          parseErr.message &&
          parseErr.message.includes("Unexpected token")
        ) {
          errorMessage = "Invalid JSON format in request body";
        } else if (parseErr.message) {
          errorMessage = `Invalid JSON: ${parseErr.message}`;
        }

        return new Response(
          JSON.stringify({
            error: "validation_error",
            message: errorMessage,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      // Validate with schema
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
      logError("validateBody: Unexpected error", err);
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: err.message || "Invalid JSON in request body",
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
