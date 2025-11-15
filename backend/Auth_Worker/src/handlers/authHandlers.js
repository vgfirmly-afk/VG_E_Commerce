// handlers/authHandlers.js
import Joi from 'joi';
import { validate } from '../middleware/validate.js';
import * as authService from '../services/authService.js';
import { requireAuth } from '../middleware/authRequired.js';
import { logger } from '../utils/logger.js';

const registerSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
});

export const register = async (request, env) => {
  try {
    const validator = await validate(registerSchema)(request);
    if (!validator.ok) return new Response(JSON.stringify({ error: 'invalid_input', details: validator.error }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const { name, email, password } = validator.value;
    const result = await authService.register({ name, email, password }, env);
    if (!result.ok) {
      return new Response(JSON.stringify({ error: result.error }), { status: result.status || 400, headers: { 'Content-Type': 'application/json' } });
    }
    logger('user.register', { userId: result.userId });
    return new Response(JSON.stringify({ success: true, userId: result.userId }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('register handler error', err);
    return new Response(JSON.stringify({ error: 'internal_error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const login = async (request, env) => {
  try {
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
    return new Response(JSON.stringify({ accessToken: result.accessToken, refreshToken: result.refreshToken }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('login handler error', err);
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
    console.error('refreshToken handler error', err);
    return new Response(JSON.stringify({ error: 'internal_error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const logout = async (request, env) => {
  try {
    const contentType = request.headers.get('Content-Type') || '';
    let body = {};
    if (contentType.includes('application/json')) body = await request.json();
    const { refreshToken } = body || {};
    if (!refreshToken) return new Response(JSON.stringify({ error: 'missing_refresh_token' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const result = await authService.revokeRefreshToken({ refreshToken }, env);
    if (!result.ok) return new Response(JSON.stringify({ error: result.error }), { status: result.status || 400, headers: { 'Content-Type': 'application/json' } });

    logger('user.logout', { userId: result.userId });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('logout handler error', err);
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
    console.error('me handler error', err);
    return new Response(JSON.stringify({ error: 'internal_error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
