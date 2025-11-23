// handlers/authHandlers.js
import Joi from 'joi';
import { validate } from '../middleware/validate.js';
import * as authService from '../services/authService.js';
import { requireAuth } from '../middleware/authRequired.js';
import { logger, logError } from '../utils/logger.js';
import { registerSchema, loginSchema } from '../utils/validators.js';



export const register = async (request, env) => {
  try {
    // throw new Error('test');
    const validator = await validate(registerSchema)(request);
    if (!validator.ok) return new Response(JSON.stringify({ error: 'invalid_input', details: validator.error }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const { name, email, password, phoneNumber, address, dateOfBirth, ssn, fullName } = validator.value;
    const result = await authService.register({ 
      name, 
      email, 
      password, 
      phoneNumber: phoneNumber || null, 
      address: address || null, 
      dateOfBirth: dateOfBirth || null, 
      ssn: ssn || null, 
      fullName: fullName || null 
    }, env);
    if (!result.ok) {
      return new Response(JSON.stringify({ error: result.error }), { status: result.status || 400, headers: { 'Content-Type': 'application/json' } });
    }
    logger('user.register', { userId: result.userId });
    return new Response(JSON.stringify({ success: true, userId: result.userId }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    logError('register handler error', err, { handler: 'register' });
    return new Response(JSON.stringify({ error: 'internal_error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const login = async (request, env) => {
  try {
    // throw new Error('test');
    const validator = await validate(loginSchema)(request);
    if (!validator.ok) return new Response(JSON.stringify({ error: 'invalid_input', details: validator.error }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const { email, password } = validator.value;
    const result = await authService.login({ email, password }, env);
    if (!result.ok) {
      logger('user.login.failed', { emailHash: result.emailHash || null });
      return new Response(JSON.stringify({ error: result.error }), { status: result.status || 401, headers: { 'Content-Type': 'application/json' } });
    }
    logger('user.login', { userId: result.userId });
    // NOTE: This returns both accessToken and refreshToken in JSON.
    // For stronger security prefer setting refresh token in HttpOnly secure cookie (set-Cookie).

    // build headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    // ⚠️ For cross-site (different port/frontend/backend), SameSite=None is required
    // ⚠️ For localhost dev you must REMOVE Secure (browsers ignore Secure cookies on http)

    headers.append(
      "Set-Cookie",
      `accessToken=${result.accessToken}; HttpOnly; Path=/; Domain=w2-auth-worker.vg-firmly.workers.dev; SameSite=None; Secure; Max-Age=900`
    );
    
    headers.append(
      "Set-Cookie",
      `refreshToken=${result.refreshToken}; HttpOnly; Path=/; Domain=.vg-firmly.workers.dev; SameSite=None; Secure; Max-Age=${30 * 24 * 60 * 60}`
    );
    

    // return minimal JSON + cookies
    return new Response(
      JSON.stringify({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      }),
      { status: 200, headers }
    );


  } catch (err) {
    logError('login handler error', err, { handler: 'login' });
    return new Response(JSON.stringify({ error: 'internal_error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const refreshToken = async (request, env) => {
  try {
    const contentType = request.headers.get('Content-Type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'invalid_content_type' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const body = await request.json();
    const { refreshToken } = body || {};
    if (!refreshToken) return new Response(JSON.stringify({ error: 'missing_refresh_token' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const result = await authService.rotateRefreshToken({ refreshToken }, env);
    if (!result.ok) return new Response(JSON.stringify({ error: result.error }), { status: result.status || 401, headers: { 'Content-Type': 'application/json' } });

    logger('token.refresh', { userId: result.userId });
    return new Response(JSON.stringify({ accessToken: result.accessToken, refreshToken: result.refreshToken }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    logError('refreshToken handler error', err, { handler: 'refreshToken' });
    return new Response(JSON.stringify({ error: 'internal_error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const logout = async (request, env) => {
  try {
    // Get access token from Authorization header
    const authHeader = request.headers.get('Authorization') || '';
    const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    const contentType = request.headers.get('Content-Type') || '';
    let body = {};
    if (contentType.includes('application/json')) body = await request.json();
    const { refreshToken } = body || {};
    if (!refreshToken) return new Response(JSON.stringify({ error: 'missing_refresh_token' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    // Revoke both refresh token and access token
    const result = await authService.revokeRefreshToken({ refreshToken, accessToken }, env);
    if (!result.ok) return new Response(JSON.stringify({ error: result.error }), { status: result.status || 400, headers: { 'Content-Type': 'application/json' } });

    logger('user.logout', { userId: result.userId });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    logError('logout handler error', err, { handler: 'logout' });
    return new Response(JSON.stringify({ error: 'internal_error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const me = async (request, env) => {
  try {
    const auth = await requireAuth(request, env);
    if (!auth.ok) return new Response(JSON.stringify({ error: auth.message }), { status: auth.status || 401, headers: { 'Content-Type': 'application/json' } });

    const user = await authService.getUserById(auth.payload.sub, env);
    if (!user) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

    // redact sensitive fields
    delete user.pwd_hash;
    delete user.pwd_salt;
    return new Response(JSON.stringify({ user }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    logError('me handler error', err, { handler: 'me' });
    return new Response(JSON.stringify({ error: 'internal_error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
