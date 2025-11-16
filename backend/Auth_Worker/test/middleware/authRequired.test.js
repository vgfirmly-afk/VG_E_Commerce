// test/middleware/authRequired.test.js
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { requireAuth } from '../../src/middleware/authRequired.js';
import { createMockRequest, createMockEnv } from '../setup.js';

describe('authRequired Middleware', () => {
  let env;
  let request;

  beforeEach(() => {
    env = createMockEnv();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('requireAuth', () => {
    it('should return error if Authorization header is missing', async () => {
      request = createMockRequest('GET', 'https://example.com/api/v1/auth/me', null, {});
      request.headers.delete('Authorization');

      const result = await requireAuth(request, env);
      
      expect(result.ok).to.be.false;
      expect(result.status).to.equal(401);
      expect(result.message).to.equal('missing_token');
    });

    it('should return error if Bearer token is missing', async () => {
      request = createMockRequest('GET', 'https://example.com/api/v1/auth/me', null, {
        'Authorization': 'Invalid token'
      });

      const result = await requireAuth(request, env);
      
      expect(result.ok).to.be.false;
      expect(result.status).to.equal(401);
      expect(result.message).to.equal('missing_token');
    });

    it('should return error if token is invalid', async () => {
      request = createMockRequest('GET', 'https://example.com/api/v1/auth/me', null, {
        'Authorization': 'Bearer invalid.token.here'
      });

      const result = await requireAuth(request, env);
      
      expect(result.ok).to.be.false;
      expect(result.status).to.equal(401);
    });

    it('should return error if token is revoked', async () => {
      // Create a valid JWT token
      const jwt = await import('../../src/utils/jwt.js');
      const validToken = await jwt.signJWT({ sub: 'user123' }, { env });
      
      // Decode token to get jti (base64url decode)
      const parts = validToken.split('.');
      let payloadStr = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      while (payloadStr.length % 4) payloadStr += '=';
      const payloadBytes = Uint8Array.from(atob(payloadStr), c => c.charCodeAt(0));
      const payload = JSON.parse(new TextDecoder().decode(payloadBytes));
      const jti = payload.jti;

      request = createMockRequest('GET', 'https://example.com/api/v1/auth/me', null, {
        'Authorization': `Bearer ${validToken}`
      });

      // Mock database - token is revoked
      env.AUTH_DB.prepare().bind().all.resolves({ results: [{ jti }] }); // Token found in revoked list

      const result = await requireAuth(request, env);
      
      // Should check revocation and return error
      expect(result.ok).to.be.false;
    });

    it('should return success if token is valid and not revoked', async () => {
      // Create a valid JWT token
      const jwt = await import('../../src/utils/jwt.js');
      const validToken = await jwt.signJWT({ sub: 'user123', role: 'user' }, { env });

      request = createMockRequest('GET', 'https://example.com/api/v1/auth/me', null, {
        'Authorization': `Bearer ${validToken}`
      });

      // Mock database - token not revoked
      env.AUTH_DB.prepare().bind().all.resolves({ results: [] }); // Token not in revoked list

      const result = await requireAuth(request, env);
      
      expect(result.ok).to.be.true;
      expect(result.payload.sub).to.equal('user123');
    });

    it('should handle errors gracefully', async () => {
      // Use an invalid token format to trigger error
      request = createMockRequest('GET', 'https://example.com/api/v1/auth/me', null, {
        'Authorization': 'Bearer invalid.token.format.here.missing.parts'
      });

      const result = await requireAuth(request, env);
      
      expect(result.ok).to.be.false;
      expect(result.status).to.equal(401);
    });
  });
});

