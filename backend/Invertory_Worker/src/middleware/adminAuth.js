// middleware/adminAuth.js
// Middleware for admin/service role authentication
// Validates whitelisted Catalog Worker URL and service token

import { logError, logWarn } from '../utils/logger.js';
import { getWhitelistedUrls } from '../../config.js';

/**
 * Validate if request is from whitelisted Catalog Worker URL or Service Binding
 */
function validateCatalogWorkerSource(request, env) {
  try {
    // Check if request is from Service Binding (internal, secure)
    const sourceHeader = request.headers.get('X-Source');
    if (sourceHeader === 'catalog-worker-service-binding') {
      // Service binding requests are internal and secure - trust them
      return true;
    }
    
    const whitelistedUrls = getWhitelistedUrls(env);
    if (!whitelistedUrls || whitelistedUrls.length === 0) {
      logWarn('validateCatalogWorkerSource: No whitelisted URLs configured');
      return false;
    }
    
    // Check X-Source header (sent by Catalog Worker via HTTP)
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
  if (!env.INVENTORY_SERVICE_TOKEN) {
    logWarn('validateServiceToken: INVENTORY_SERVICE_TOKEN not configured');
    return false;
  }
  
  return token === env.INVENTORY_SERVICE_TOKEN;
}

/**
 * Require admin/service authentication for inter-worker requests
 * Returns { ok: true, user: {...} } if authenticated, { ok: false, error: ... } otherwise
 */
export async function requireAdmin(request, env) {
  try {
    // Check if request is from Service Binding (internal, secure)
    const sourceHeader = request.headers.get('X-Source');
    if (sourceHeader === 'catalog-worker-service-binding') {
      return { 
        ok: true, 
        user: { 
          userId: 'catalog_worker_service', 
          role: 'service', 
          source: 'service_binding' 
        } 
      };
    }
    
    // For HTTP requests, validate whitelisted URL and service token
    const isWhitelisted = validateCatalogWorkerSource(request, env);
    if (!isWhitelisted) {
      logWarn('requireAdmin: Request not from whitelisted source', {
        url: request.url,
        method: request.method
      });
      return {
        ok: false,
        error: 'unauthorized',
        message: 'Request not from whitelisted source'
      };
    }
    
    // Validate service token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logWarn('requireAdmin: Missing or invalid Authorization header');
      return {
        ok: false,
        error: 'unauthorized',
        message: 'Missing or invalid Authorization header'
      };
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const isValidToken = validateServiceToken(token, env);
    
    if (!isValidToken) {
      logWarn('requireAdmin: Invalid service token');
      return {
        ok: false,
        error: 'unauthorized',
        message: 'Invalid service token'
      };
    }
    
    return {
      ok: true,
      user: {
        userId: 'catalog_worker_service',
        role: 'service',
        source: 'http'
      }
    };
  } catch (err) {
    logError('requireAdmin: Error during authentication', err);
    return {
      ok: false,
      error: 'internal_error',
      message: 'Authentication error'
    };
  }
}

