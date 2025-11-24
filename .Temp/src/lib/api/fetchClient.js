import { API_CONFIG } from "../config.js";
import { getCookie, setCookie, deleteCookie } from "../utils/cookies.js";

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
    credentials: "include", // Always include cookies (required for httpOnly cookies)
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  // Make the initial request
  let response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (error) {
    // Handle CORS and network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        `CORS Error: Unable to connect to ${url}. Please ensure CORS is properly configured on the backend.`,
      );
    }
    throw error;
  }

  // Check for CORS errors (browser blocks response, but we can detect it)
  if (response.type === "opaque" || response.type === "opaqueredirect") {
    throw new Error(
      "CORS Error: The server did not allow the request. Please check CORS configuration.",
    );
  }

  // If we get a 401, try to refresh the token
  if (
    response.status === 401 &&
    !url.includes("/auth/token/refresh") &&
    !url.includes("/auth/logout")
  ) {
    try {
      // Refresh the token
      const refreshed = await refreshToken();

      if (refreshed) {
        // Retry the original request with the new token
        response = await fetch(url, fetchOptions);
      } else {
        // Refresh failed, user needs to login again
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }
      throw error;
    }
  }

  return response;
}

/**
 * Refresh the access token using the refresh token cookie
 * Gets refreshToken from cookie and stores new tokens in cookies
 */
async function refreshToken() {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      // Get refreshToken from cookie
      const storedRefreshToken =
        typeof window !== "undefined" ? getCookie("refreshToken") : null;

      if (!storedRefreshToken) {
        console.error("No refresh token found in cookie");
        return false;
      }

      const requestBody = JSON.stringify({ refreshToken: storedRefreshToken });

      const response = await fetch(
        `${API_CONFIG.AUTH_WORKER_URL}/api/v1/auth/token/refresh`,
        {
          method: "POST",
          credentials: "include", // Include cookies
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        },
      );

      if (response.ok) {
        const data = await response.json().catch(() => ({}));

        // Store new tokens in cookies
        if (data.accessToken && typeof window !== "undefined") {
          setCookie("accessToken", data.accessToken, 0.25); // 15 minutes
          if (data.refreshToken) {
            setCookie("refreshToken", data.refreshToken, 30); // 30 days
          }
        }

        // Token refreshed successfully
        return true;
      } else {
        // Refresh failed
        const data = await response.json().catch(() => ({}));
        console.error("Token refresh failed:", data);

        // Clear stored tokens on refresh failure
        if (typeof window !== "undefined") {
          deleteCookie("accessToken");
          deleteCookie("refreshToken");
        }

        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);

      // Clear stored tokens on error
      if (typeof window !== "undefined") {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
      }

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
      throw new Error(data.error || data.message || "Request failed");
    }

    return data;
  } catch (error) {
    // Provide helpful error messages for CORS issues
    if (error.message.includes("CORS")) {
      console.error("CORS Error:", error.message);
      console.error("Make sure CORS is configured on the backend worker.");
      console.error("See CORS_SETUP.md for instructions.");
    }
    throw error;
  }
}
