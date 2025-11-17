import { API_CONFIG } from '../config.js';

// Track if we're currently refreshing to avoid multiple simultaneous refresh calls
let isRefreshing = false;
let refreshPromise = null;

/**
 * Custom fetch client that handles:
 * - Automatic inclusion of credentials (cookies)
 * - Automatic token refresh on 401 errors
 * - Retry logic for failed requests after token refresh
 */
export async function fetchClient(url, options = {}) {
  // Ensure credentials are always included for cookies
  const fetchOptions = {
    ...options,
    credentials: 'include', // Always include cookies (required for httpOnly cookies)
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Make the initial request
  let response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (error) {
    // Handle CORS and network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`CORS Error: Unable to connect to ${url}. Please ensure CORS is properly configured on the backend.`);
    }
    throw error;
  }
  
  // Check for CORS errors (browser blocks response, but we can detect it)
  if (response.type === 'opaque' || response.type === 'opaqueredirect') {
    throw new Error('CORS Error: The server did not allow the request. Please check CORS configuration.');
  }

  // If we get a 401, try to refresh the token
  if (response.status === 401 && !url.includes('/auth/token/refresh') && !url.includes('/auth/logout')) {
    try {
      // Refresh the token
      const refreshed = await refreshToken();
      
      if (refreshed) {
        // Retry the original request with the new token
        response = await fetch(url, fetchOptions);
      } else {
        // Refresh failed, user needs to login again
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
      throw error;
    }
  }

  return response;
}

/**
 * Refresh the access token using the refresh token cookie
 */
async function refreshToken() {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_CONFIG.AUTH_WORKER_URL}/api/v1/auth/token/refresh`, {
        method: 'POST',
        credentials: 'include', // Include refresh token cookie
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Token refreshed successfully, cookies are set by server
        return true;
      } else {
        // Refresh failed
        const data = await response.json().catch(() => ({}));
        console.error('Token refresh failed:', data);
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Helper to get JSON response with error handling
 */
export async function fetchJSON(url, options = {}) {
  try {
    const response = await fetchClient(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Request failed');
    }
    
    return data;
  } catch (error) {
    // Provide helpful error messages for CORS issues
    if (error.message.includes('CORS')) {
      console.error('CORS Error:', error.message);
      console.error('Make sure CORS is configured on the backend worker.');
      console.error('See CORS_SETUP.md for instructions.');
    }
    throw error;
  }
}

