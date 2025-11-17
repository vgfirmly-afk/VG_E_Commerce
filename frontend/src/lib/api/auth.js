import { API_CONFIG } from '../config.js';
import { fetchClient, fetchJSON } from './fetchClient.js';

const AUTH_URL = API_CONFIG.AUTH_WORKER_URL;

/**
 * Register a new user account
 * Backend should set httpOnly cookies for tokens
 */
export async function register(userData) {
  const response = await fetchClient(`${AUTH_URL}/api/v1/auth/register`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  return data;
}

/**
 * Login user
 * Backend should set httpOnly cookies for accessToken and refreshToken
 */
export async function login(email, password) {
  const response = await fetchClient(`${AUTH_URL}/api/v1/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }
  
  // Backend should set httpOnly cookies, but we can also store user info
  // Note: Tokens are in httpOnly cookies, not in response body
  return data;
}

/**
 * Logout user
 * Clears httpOnly cookies on the server
 */
export async function logout() {
  try {
    const response = await fetchClient(`${AUTH_URL}/api/v1/auth/logout`, {
      method: 'POST',
      body: JSON.stringify({}), // Refresh token is in httpOnly cookie
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Logout failed');
    }
    
    return await response.json();
  } catch (error) {
    // Even if logout fails, clear local state
    console.error('Logout error:', error);
    throw error;
  }
}

/**
 * Get current user info
 * Uses access token from httpOnly cookie
 */
export async function getMe() {
  try {
    const data = await fetchJSON(`${AUTH_URL}/api/v1/auth/me`, {
      method: 'GET',
    });
    return data;
  } catch (error) {
    // If 401, token refresh will be handled by fetchClient
    throw error;
  }
}

/**
 * Refresh access token
 * Uses refresh token from httpOnly cookie
 */
export async function refreshAccessToken() {
  const response = await fetchClient(`${AUTH_URL}/api/v1/auth/token/refresh`, {
    method: 'POST',
    body: JSON.stringify({}), // Refresh token is in httpOnly cookie
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Token refresh failed');
  }
  
  // Backend should set new httpOnly cookies
  return data;
}
