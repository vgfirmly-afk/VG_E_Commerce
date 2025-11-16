// middleware/authRequired.js
import { verifyJWT } from '../utils/jwt.js';
import { isTokenRevoked } from '../db/db1.js';
import { logError, logWarn, logInfo } from '../utils/logger.js';

export async function requireAuth(request, env) {
  try {
    const header = request.headers.get('Authorization') || '';
    if (!header.startsWith('Bearer ')) {
      logInfo('requireAuth: Missing Bearer token', { hasHeader: !!header });
      return { ok: false, status: 401, message: 'missing_token' };
    }
    const token = header.slice(7);
    const payload = await verifyJWT(token, env);
    if (!payload) {
      logInfo('requireAuth: JWT verification failed', { hasToken: !!token });
      return { ok: false, status: 401, message: 'invalid_token' };
    }
    
    // Check if token is revoked (blacklist check)
    // Only check if jti exists (new tokens have jti, old tokens might not)
    if (payload.jti) {
      try {
        const revoked = await isTokenRevoked(payload.jti, env);
        if (revoked) {
          logInfo('requireAuth: Token is revoked', { jti: payload.jti });
          return { ok: false, status: 401, message: 'token_revoked' };
        }
      } catch (revokeCheckError) {
        // If revocation check fails, log but don't block (graceful degradation)
        // This allows the system to work even if revoked_tokens table doesn't exist yet
        logWarn('requireAuth: Error checking token revocation, allowing request', { error: revokeCheckError.message });
      }
    }
    
    return { ok: true, payload };
  } catch (err) {
    logError('requireAuth error', err, { function: 'requireAuth' });
    return { ok: false, status: 401, message: 'invalid_token' };
  }
}
