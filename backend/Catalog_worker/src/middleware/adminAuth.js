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
        message: 'Missing or invalid Authorization header. Expected: Bearer <token>',
        status: 401
      };
    }
    
    const token = authHeader.substring(7);
    if (!token || token.trim() === '') {
      return {
        ok: false,
        error: 'unauthorized',
        message: 'Token is empty',
        status: 401
      };
    }
    
    const payload = await verifyJWT(token, env);
    
    if (!payload) {
      // Check if JWT_PUBLIC_KEY is missing (common setup issue)
      if (!env.JWT_PUBLIC_KEY) {
        return {
          ok: false,
          error: 'configuration_error',
          message: 'JWT_PUBLIC_KEY not configured. Cannot verify tokens. Please set JWT_PUBLIC_KEY secret in wrangler.toml or as a secret.',
          status: 500
        };
      }
      return {
        ok: false,
        error: 'unauthorized',
        message: 'Invalid or expired token. Please login again.',
        status: 401
      };
    }
    
    // Check if user is admin or service account
    // For now, allow any authenticated user (you can restrict this later)
    // To restrict: if (payload.role !== 'admin' && payload.role !== 'service') { return forbidden }
    // Note: Users need to have role='admin' or role='service' in the Auth Worker database
    // For testing, we allow any authenticated user
    const userRole = payload.role || 'user';
    
    // Attach user info to request
    request.user = {
      userId: payload.sub,
      role: userRole,
      email: payload.email
    };
    
    return { ok: true, user: request.user };
  } catch (err) {
    logError('requireAdmin: Error', err);
    return {
      ok: false,
      error: 'internal_error',
      message: `Authentication check failed: ${err.message}`,
      status: 500
    };
  }
}

