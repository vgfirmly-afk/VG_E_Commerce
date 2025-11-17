// middleware/adminAuth.js
// Middleware for admin/service role authentication
// Validates whitelisted Catalog Worker URL and service token

import { logError, logWarn } from '../utils/logger.js';
import { getWhitelistedUrls } from '../../config.js';

/**
 * Validate if request is from whitelisted Catalog Worker URL
 */
function validateCatalogWorkerSource(request, env) {
  try {
    const whitelistedUrls = getWhitelistedUrls(env);
    if (!whitelistedUrls || whitelistedUrls.length === 0) {
      logWarn('validateCatalogWorkerSource: No whitelisted URLs configured');
      return false;
    }
    
    // Check X-Source header (sent by Catalog Worker)
    const sourceHeader = request.headers.get('X-Source');
    if (sourceHeader) {
      const sourceUrl = sourceHeader.replace(/\/$/, ''); // Remove trailing slash
      const isWhitelisted = whitelistedUrls.some(url => {
        const normalizedUrl = url.replace(/\/$/, '');
        return sourceUrl === normalizedUrl || sourceUrl.startsWith(normalizedUrl);
      });
      
      if (isWhitelisted) {
        return true;
      }
      
      logWarn('validateCatalogWorkerSource: X-Source header not whitelisted', {
        source: sourceHeader,
        whitelisted: whitelistedUrls
      });
    }
    
    // Fallback: Check Origin header
    const origin = request.headers.get('Origin');
    if (origin) {
      const originUrl = origin.replace(/\/$/, '');
      const isWhitelisted = whitelistedUrls.some(url => {
        const normalizedUrl = url.replace(/\/$/, '');
        return originUrl === normalizedUrl || originUrl.startsWith(normalizedUrl);
      });
      
      if (isWhitelisted) {
        return true;
      }
      
      logWarn('validateCatalogWorkerSource: Origin header not whitelisted', {
        origin,
        whitelisted: whitelistedUrls
      });
    }
    
    // Fallback: Check Referer header
    const referer = request.headers.get('Referer');
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
        const isWhitelisted = whitelistedUrls.some(url => {
          const normalizedUrl = url.replace(/\/$/, '');
          return refererOrigin === normalizedUrl || refererOrigin.startsWith(normalizedUrl);
        });
        
        if (isWhitelisted) {
          return true;
        }
      } catch (e) {
        // Invalid Referer URL, ignore
      }
    }
    
    return false;
  } catch (err) {
    logError('validateCatalogWorkerSource: Error validating source', err);
    return false;
  }
}

/**
 * Validate service token for inter-worker communication
 */
function validateServiceToken(token, env) {
  if (!env.PRICING_SERVICE_TOKEN) {
    logWarn('validateServiceToken: PRICING_SERVICE_TOKEN not configured');
    return false;
  }
  
  return token === env.PRICING_SERVICE_TOKEN;
}

/**
 * Require admin or service role authentication
 * For inter-worker communication:
 * - Validates whitelisted Catalog Worker URL
 * - Validates service token
 * For regular admin requests:
 * - Validates JWT token (if configured)
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
    
    // Check if this is an inter-worker request from Catalog Worker
    const isFromCatalogWorker = validateCatalogWorkerSource(request, env);
    
    if (isFromCatalogWorker) {
      // Validate service token for inter-worker communication
      if (validateServiceToken(token, env)) {
        return { 
          ok: true, 
          user: { 
            userId: 'catalog_worker_service', 
            role: 'service',
            source: 'catalog_worker'
          } 
        };
      } else {
        logWarn('requireAdmin: Invalid service token from Catalog Worker', {
          source: request.headers.get('X-Source') || request.headers.get('Origin')
        });
        return {
          ok: false,
          error: 'authentication_error',
          message: 'Invalid service token',
          status: 401
        };
      }
    }
    
    // For non-whitelisted sources, require JWT validation (regular admin requests)
    if (!env.JWT_PUBLIC_KEY) {
      logError('requireAdmin: JWT_PUBLIC_KEY not configured and request not from whitelisted source');
      return {
        ok: false,
        error: 'authentication_error',
        message: 'JWT verification not configured',
        status: 401
      };
    }
    
    // TODO: Implement JWT verification for regular admin requests
    // For now, reject non-whitelisted requests without proper JWT verification
    logWarn('requireAdmin: Request not from whitelisted Catalog Worker and JWT verification not implemented');
    return {
      ok: false,
      error: 'authentication_error',
      message: 'Request must come from whitelisted Catalog Worker or provide valid JWT',
      status: 401
    };
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

