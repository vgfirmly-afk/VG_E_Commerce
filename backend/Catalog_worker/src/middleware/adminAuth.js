// middleware/adminAuth.js
import { verifyJWT } from '../utils/jwt.js';
import { logError } from '../utils/logger.js';

/**
 * Middleware to require admin authentication
 * Expects JWT token in Authorization header
 * Verifies token and checks for admin/service role
 */
export async function requireAdmin(request, env) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        ok: false,
        error: 'unauthorized',
        message: 'Missing or invalid Authorization header',
        status: 401
      };
    }
    
    const token = authHeader.substring(7);
    const payload = await verifyJWT(token, env);
    
    if (!payload) {
      return {
        ok: false,
        error: 'unauthorized',
        message: 'Invalid or expired token',
        status: 401
      };
    }
    
    // Check if user is admin or service account
    if (payload.role !== 'admin' && payload.role !== 'service') {
      return {
        ok: false,
        error: 'forbidden',
        message: 'Admin access required',
        status: 403
      };
    }
    
    // Attach user info to request
    request.user = {
      userId: payload.sub,
      role: payload.role,
      email: payload.email
    };
    
    return { ok: true, user: request.user };
  } catch (err) {
    logError('requireAdmin: Error', err);
    return {
      ok: false,
      error: 'internal_error',
      message: 'Authentication check failed',
      status: 500
    };
  }
}

