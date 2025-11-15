// middleware/validate.js
import Joi from 'joi';

export function validate(schema) {
  return async (request) => {
    try {
      const contentType = request.headers.get('Content-Type') || '';
      let body = {};
      if (contentType.includes('application/json')) {
        body = await request.json();
      } else {
        body = {};
      }
      const { error, value } = schema.validate(body, { stripUnknown: true });
      if (error) {
        return { ok: false, error: error.details.map(d => d.message).join(', ') };
      }
      return { ok: true, value };
    } catch (err) {
      return { ok: false, error: 'invalid_json' };
    }
  };
}
