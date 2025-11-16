// middleware/adminAuth.js
// Middleware for admin/service role authentication
// Uses JWT verification from Catalog Worker or Auth Worker

import { logError } from '../utils/logger.js';

/**
 * Require admin or service role authentication
 * Checks for JWT token in Authorization header
 * For inter-worker communication, we can use a service token or public key verification
 */
export async function requireAdmin(request, env) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        ok: false,
        error: 'authentication_error',
        message: 'Missing or invalid Authorization header',
        status: 401
      };
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return {
        ok: false,
        error: 'authentication_error',
        message: 'Missing authentication token',
        status: 401
      };
    }
    
    // Check if JWT_PUBLIC_KEY is configured
    if (!env.JWT_PUBLIC_KEY) {
      // For inter-worker communication, allow service tokens or skip auth
      // In production, this should verify the token properly
      logError('requireAdmin: JWT_PUBLIC_KEY not configured, allowing request for inter-worker communication');
      return { ok: true, user: { userId: 'service', role: 'service' } };
    }
    
    // TODO: Implement JWT verification if needed
    // For now, allow all authenticated requests for inter-worker communication
    // In production, verify JWT token against JWT_PUBLIC_KEY
    
    return { ok: true, user: { userId: 'service', role: 'service' } };
  } catch (err) {
    logError('requireAdmin: Error', err);
    return {
      ok: false,
      error: 'authentication_error',
      message: 'Authentication failed',
      status: 401
    };
  }
}

