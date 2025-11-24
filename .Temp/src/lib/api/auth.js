import { API_CONFIG } from "../config.js";
import { fetchClient, fetchJSON } from "./fetchClient.js";
import { getCookie, setCookie, deleteCookie } from "../utils/cookies.js";

const AUTH_URL = API_CONFIG.AUTH_WORKER_URL;

/**
 * Register a new user account
 * Returns 201 on success, then we call login to get tokens in httpOnly cookies
 */
export async function register(userData) {
  const response = await fetchClient(`${AUTH_URL}/api/v1/auth/register`, {
    method: "POST",
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  // Check for 201 (Created) status code
  if (response.status === 201) {
    return { success: true, data };
  }

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return { success: true, data };
}

/**
 * Login user
 * Backend should set httpOnly cookies for accessToken and refreshToken
 * Also returns tokens in response body for immediate use in Authorization header
 */
export async function login(email, password) {
  const response = await fetchClient(`${AUTH_URL}/api/v1/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  // Backend should:
  // 1. Set httpOnly cookies (for automatic cookie-based auth)
  // 2. Return tokens in response body (for Authorization header in immediate requests)
  // We'll use the token from response body for the /me call, then rely on cookies for subsequent requests
  return data;
}

/**
 * Logout user
 * Clears cookies on the server and client
 */
export async function logout() {
  try {
    // Get refreshToken from cookie to send to server
    const refreshToken =
      typeof window !== "undefined" ? getCookie("refreshToken") : null;

    const response = await fetchClient(`${AUTH_URL}/api/v1/auth/logout`, {
      method: "POST",
      body: JSON.stringify({ refreshToken }), // Send refresh token in body
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Logout failed");
    }

    // Clear cookies on client side
    if (typeof window !== "undefined") {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    }

    return await response.json();
  } catch (error) {
    // Even if logout fails, clear cookies on client
    if (typeof window !== "undefined") {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    }
    console.error("Logout error:", error);
    throw error;
  }
}

/**
 * Get current user info
 * Uses access token from cookie OR Authorization header
 * If accessToken is provided, uses it in Authorization header (for immediate use after login)
 * Otherwise gets token from cookie
 */
export async function getMe(accessToken = null) {
  try {
    const headers = {};

    // If accessToken is provided (from login response), use it in Authorization header
    // Otherwise, get token from cookie
    if (!accessToken && typeof window !== "undefined") {
      accessToken = getCookie("accessToken");
    }

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const data = await fetchJSON(`${AUTH_URL}/api/v1/auth/me`, {
      method: "GET",
      headers,
    });
    return data;
  } catch (error) {
    // If 401, token refresh will be handled by fetchClient
    throw error;
  }
}

/**
 * Refresh access token
 * Uses refresh token from cookie and stores new tokens in cookies
 */
export async function refreshAccessToken() {
  // Get refreshToken from cookie
  const storedRefreshToken =
    typeof window !== "undefined" ? getCookie("refreshToken") : null;

  if (!storedRefreshToken) {
    throw new Error("No refresh token found");
  }

  const requestBody = JSON.stringify({ refreshToken: storedRefreshToken });

  const response = await fetchClient(`${AUTH_URL}/api/v1/auth/token/refresh`, {
    method: "POST",
    body: requestBody,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Token refresh failed");
  }

  // Store new tokens in cookies
  if (data.accessToken && typeof window !== "undefined") {
    setCookie("accessToken", data.accessToken, 0.25); // 15 minutes
    if (data.refreshToken) {
      setCookie("refreshToken", data.refreshToken, 30); // 30 days
    }
  }

  return data;
}
