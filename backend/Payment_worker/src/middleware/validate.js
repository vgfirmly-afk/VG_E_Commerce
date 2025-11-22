// middleware/validate.js
// Middleware for request body and query parameter validation

/**
 * Validate request body against a Joi schema
 * Usage: router.post('/path', validateBody(schema), handler)
 */
export function validateBody(schema) {
  return async (request, env, ctx) => {
    try {
      const contentType = request.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return new Response(
          JSON.stringify({ 
            error: 'validation_error', 
            message: 'Content-Type must be application/json' 
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      let body;
      try {
        body = await request.json();
      } catch (parseErr) {
        return new Response(
          JSON.stringify({ 
            error: 'validation_error', 
            message: 'Invalid JSON in request body',
            details: [{ field: 'body', message: parseErr.message }]
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const { error, value } = schema.validate(body, { abortEarly: false, stripUnknown: true });
      
      if (error) {
        return new Response(
          JSON.stringify({
            error: 'validation_error',
            message: 'Invalid request data',
            details: error.details.map(d => ({
              path: d.path.join('.'),
              message: d.message,
              type: d.type
            }))
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Attach validated body to request for downstream handlers
      request.validatedBody = value;
      
      // Continue to next handler (return undefined to continue)
      return undefined;
    } catch (err) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: err.message 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}

