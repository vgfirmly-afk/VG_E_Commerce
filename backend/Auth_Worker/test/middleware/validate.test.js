// test/middleware/validate.test.js
import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { validate } from '../../src/middleware/validate.js';
import Joi from 'joi';
import { createMockRequest } from '../setup.js';

describe('Validate Middleware', () => {
  describe('validate', () => {
    it('should validate JSON body successfully', async () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
      });

      const body = { name: 'Test User', email: 'test@example.com' };
      const request = createMockRequest('POST', 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/register', body, {
        'Content-Type': 'application/json'
      });

      const validator = validate(schema);
      const result = await validator(request);

      expect(result.ok).to.be.true;
      expect(result.value).to.deep.include(body);
    });

    it('should return error for invalid data', async () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
      });

      const body = { name: '', email: 'invalid-email' };
      const request = createMockRequest('POST', 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/register', body, {
        'Content-Type': 'application/json'
      });

      const validator = validate(schema);
      const result = await validator(request);

      expect(result.ok).to.be.false;
      expect(result.error).to.exist;
    });

    // it('should handle missing Content-Type', async () => {
    //   const schema = Joi.object({
    //     name: Joi.string().required(),
    //   });

    //   // Create request without Content-Type header
    //   const headersMap = new Map();
    //   const request = {
    //     method: 'POST',
    //     url: 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/register',
    //     headers: headersMap,
    //     json: async () => ({}),
    //     env: {},
    //   };
    //   request.headers.get = (key) => {
    //     if (key === 'Content-Type') return null;
    //     return headersMap.get(key) || null;
    //   };

    //   const validator = validate(schema);
    //   const result = await validator(request);

    //   expect(result.ok).to.be.true;
    //   expect(result.value).to.deep.equal({});
    // });

    it('should strip unknown fields', async () => {
      const schema = Joi.object({
        name: Joi.string().required(),
      });

      const body = { name: 'Test', unknownField: 'should be removed' };
      const request = createMockRequest('POST', 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/register', body, {
        'Content-Type': 'application/json'
      });

      const validator = validate(schema);
      const result = await validator(request);

      expect(result.ok).to.be.true;
      expect(result.value).to.not.have.property('unknownField');
    });

    it('should return error for invalid JSON', async () => {
      const schema = Joi.object({
        name: Joi.string().required(),
      });

      const request = createMockRequest('POST', 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/register', null, {
        'Content-Type': 'application/json'
      });
      request.json = async () => { throw new Error('Invalid JSON'); };

      const validator = validate(schema);
      const result = await validator(request);

      expect(result.ok).to.be.false;
      expect(result.error).to.equal('invalid_json');
    });
  });
});

