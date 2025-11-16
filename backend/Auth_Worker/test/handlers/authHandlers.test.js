// test/handlers/authHandlers.test.js
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import * as handlers from '../../src/handlers/authHandlers.js';
import { createMockRequest, createMockEnv } from '../setup.js';

describe('Auth Handlers', () => {
  let env;
  let request;

  beforeEach(() => {
    env = createMockEnv();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      request = createMockRequest('POST', 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/register', body);

      // Mock database - no existing user, then successful creation
      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [] }); // No existing user
      env.AUTH_DB.prepare().bind().run.onFirstCall().resolves({ success: true }); // User created

      const response = await handlers.register(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(201);
      expect(responseBody.success).to.be.true;
      expect(responseBody.userId).to.exist;
    });

    it('should return 400 for invalid input', async () => {
      const body = {
        name: '',
        email: 'invalid-email',
        password: 'short'
      };
      request = createMockRequest('POST', 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/register', body);

      const response = await handlers.register(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(400);
      expect(responseBody.error).to.equal('invalid_input');
    });

    it('should return 409 for existing email', async () => {
      const body = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };
      request = createMockRequest('POST', 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/register', body);

      // Mock database - user already exists
      env.AUTH_DB.prepare().bind().all.resolves({ results: [{ id: 'existing-user', email: 'existing@example.com' }] });

      const response = await handlers.register(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(409);
      expect(responseBody.error).to.equal('email_exists');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const body = {
        email: 'test@example.com',
        password: 'password123'
      };
      request = createMockRequest('POST', 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/login', body);

      // Mock database - user exists with properly hashed password
      const crypto = await import('../../src/utils/crypto.js');
      const salt = crypto.genSalt();
      const hashedPassword = await crypto.hashPassword('password123', salt, env.PEPPER);
      
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        pwd_hash: hashedPassword,
        pwd_salt: salt,
        role: 'user'
      };
      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [mockUser] }); // User found
      env.AUTH_DB.prepare().bind().all.onCall(1).resolves({ results: [] }); // No existing refresh token
      env.AUTH_DB.prepare().bind().run.onFirstCall().resolves({ success: true }); // Refresh token created

      const response = await handlers.login(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(200);
      expect(responseBody.accessToken).to.exist;
      expect(responseBody.refreshToken).to.exist;
    });

    it('should return 401 for invalid credentials', async () => {
      const body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };
      request = createMockRequest('POST', 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/login', body);

      // Mock database - user not found OR wrong password
      env.AUTH_DB.prepare().bind().all.resolves({ results: [] }); // User not found

      const response = await handlers.login(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(401);
      expect(responseBody.error).to.equal('invalid_credentials');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const body = { refreshToken: 'valid-refresh-token' };
      request = createMockRequest('POST', 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/token/refresh', body);

      // Mock database - find refresh token, get user, revoke old, create new
      const crypto = await import('../../src/utils/crypto.js');
      const refreshTokenHash = await crypto.sha256('valid-refresh-token');
      
      const mockToken = {
        id: 'token-id',
        user_id: 'user123',
        token_hash: refreshTokenHash,
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        revoked: 0
      };
      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [mockToken] }); // Token found
      env.AUTH_DB.prepare().bind().all.onCall(1).resolves({ results: [{ id: 'user123', role: 'user' }] }); // User found
      env.AUTH_DB.prepare().bind().run.onCall(0).resolves({ success: true }); // Old token revoked
      env.AUTH_DB.prepare().bind().run.onCall(1).resolves({ success: true }); // New token created

      const response = await handlers.refreshToken(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(200);
      expect(responseBody.accessToken).to.exist;
      expect(responseBody.refreshToken).to.exist;
    });

    it('should return 400 for missing refresh token', async () => {
      request = createMockRequest('POST', 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/token/refresh', {});

      const response = await handlers.refreshToken(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(400);
      expect(responseBody.error).to.equal('missing_refresh_token');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const body = { refreshToken: 'valid-refresh-token' };
      request = createMockRequest('POST', 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/logout', body, {
        'Authorization': 'Bearer access-token'
      });

      // Mock database - find refresh token, revoke it
      const crypto = await import('../../src/utils/crypto.js');
      const refreshTokenHash = await crypto.sha256('valid-refresh-token');
      
      const mockToken = {
        id: 'token-id',
        user_id: 'user123',
        token_hash: refreshTokenHash
      };
      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [mockToken] }); // Token found
      env.AUTH_DB.prepare().bind().run.onFirstCall().resolves({ success: true }); // Token revoked
      env.AUTH_DB.prepare().bind().run.onCall(1).resolves({ success: true }); // Access token revoked

      const response = await handlers.logout(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(200);
      expect(responseBody.success).to.be.true;
    });

    it('should return 400 for missing refresh token', async () => {
      request = createMockRequest('POST', 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/logout', {});

      const response = await handlers.logout(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(400);
      expect(responseBody.error).to.equal('missing_refresh_token');
    });
  });

  describe('me', () => {
    it('should return user data when authenticated', async () => {
      // Create a valid JWT token for testing
      const jwt = await import('../../src/utils/jwt.js');
      const validToken = await jwt.signJWT({ sub: 'user123' }, { env });
      
      request = createMockRequest('GET', 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me', null, {
        'Authorization': `Bearer ${validToken}`
      });

      // Mock database - token not revoked (first call), then get user (second call)
      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [] }); // Token not in revoked list
      env.AUTH_DB.prepare().bind().all.onCall(1).resolves({ results: [{
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User'
      }] });

      const response = await handlers.me(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(200);
      expect(responseBody.user).to.exist;
      expect(responseBody.user.id).to.equal('user123');
    });

    it('should return 401 when not authenticated', async () => {
      request = createMockRequest('GET', 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me');
      // No Authorization header - requireAuth will fail

      const response = await handlers.me(request, env);
      const responseBody = await response.json();

      expect(response.status).to.equal(401);
      expect(responseBody.error).to.equal('missing_token');
    });

    it('should redact sensitive fields', async () => {
      // Create a valid JWT token for testing
      const jwt = await import('../../src/utils/jwt.js');
      const validToken = await jwt.signJWT({ sub: 'user123' }, { env });
      
      request = createMockRequest('GET', 'https://w2-auth-worker.vg-firmly.workers.dev/api/v1/auth/me', null, {
        'Authorization': `Bearer ${validToken}`
      });

      // Mock database - token not revoked (first call), then get user with sensitive fields (second call)
      env.AUTH_DB.prepare().bind().all.onFirstCall().resolves({ results: [] }); // Token not in revoked list
      env.AUTH_DB.prepare().bind().all.onCall(1).resolves({ results: [{
        id: 'user123',
        email: 'test@example.com',
        pwd_hash: 'hash',
        pwd_salt: 'salt'
      }] });

      const response = await handlers.me(request, env);
      const responseBody = await response.json();

      expect(responseBody.user.pwd_hash).to.not.exist;
      expect(responseBody.user.pwd_salt).to.not.exist;
    });
  });
});

