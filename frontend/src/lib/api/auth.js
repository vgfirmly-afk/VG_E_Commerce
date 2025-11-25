import { API_BASE_URLS } from "../config.js";
import {
  hasAuthCookies,
  setUserIdCookie,
  clearUserIdCookie,
  getUserIdCookie,
} from "../utils/cookies.js";

const API_BASE = API_BASE_URLS.AUTH;

// Helper function for API calls with credentials
async function fetchWithCredentials(url, options = {}) {
  return fetch(url, {
    ...options,
    credentials: "include", // Include cookies in requests
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });
}

// Helper to refresh token and retry request
async function refreshTokenAndRetry(originalRequest) {
  try {
    // Get refresh token from cookie (it's httpOnly, so we just make the request)
    const refreshResponse = await fetchWithCredentials(
      `${API_BASE}/api/v1/auth/token/refresh`,
      {
        method: "POST",
        body: JSON.stringify({}), // Backend reads refreshToken from cookie
      },
    );

    if (!refreshResponse.ok) {
      // Refresh failed, clear userId cookie
      clearUserIdCookie();
      throw new Error("Token refresh failed");
    }

    // New tokens are set in cookies by backend via Set-Cookie headers
    // Retry the original request
    return await originalRequest();
  } catch (err) {
    clearUserIdCookie();
    throw err;
  }
}

export async function register(
  name,
  email,
  password,
  phoneNumber,
  address,
  fullName,
) {
  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/auth/register`,
    {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        phoneNumber,
        address,
        fullName,
      }),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }
  return data;
}

// Helper to get user data with access token (used immediately after login)
async function getMeWithToken(accessToken) {
  const response = await fetchWithCredentials(`${API_BASE}/api/v1/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to get user info");
  }

  const data = await response.json();
  return data;
}

export async function login(email, password) {
  const response = await fetchWithCredentials(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  // Tokens are in httpOnly cookies set by backend AND in response body
  // Use accessToken from response to immediately fetch user data
  // This avoids waiting for cookies to be set
  if (data.accessToken) {
    try {
      const userData = await getMeWithToken(data.accessToken);
      if (userData.userId || userData.id) {
        const userId = userData.userId || userData.id;
        setUserIdCookie(userId, 30); // Store for 30 days
        // Return user data so auth store can use it
        return { ...data, user: userData, userId };
      } else {
        // User data returned but no userId - try to extract from token
        // For now, just return user data as-is
        return { ...data, user: userData };
      }
    } catch (err) {
      console.error("Could not fetch user ID after login:", err);
      // Even if /me fails, tokens are in cookies
      // Try to extract userId from token payload (sub field contains userId)
      try {
        // Decode JWT to get userId (we only need the payload, no verification needed for this)
        const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
        if (payload.sub) {
          setUserIdCookie(payload.sub, 30);
          return { ...data, userId: payload.sub };
        }
      } catch (decodeErr) {
        console.warn("Could not decode token to get userId:", decodeErr);
      }
      // Return login response - tokens are set, user can call getMe() later
      return data;
    }
  }

  return data;
}

export async function refreshToken() {
  // Refresh token is in httpOnly cookie, no need to pass it
  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/auth/token/refresh`,
    {
      method: "POST",
      body: JSON.stringify({}), // Backend will read from cookie
    },
  );

  const data = await response.json();
  if (!response.ok) {
    // Refresh failed, clear userId cookie
    clearUserIdCookie();
    throw new Error(data.message || "Token refresh failed");
  }

  // New tokens are set in cookies by backend via Set-Cookie headers
  // Update userId cookie if we have user info
  if (data.userId || data.user?.userId) {
    const userId = data.userId || data.user.userId;
    setUserIdCookie(userId, 30);
  }

  return data;
}

export async function logout() {
  // Clear userId cookie immediately
  clearUserIdCookie();

  // Logout - backend will clear httpOnly cookies
  try {
    const response = await fetchWithCredentials(
      `${API_BASE}/api/v1/auth/logout`,
      {
        method: "POST",
        body: JSON.stringify({}), // Backend will read refresh token from cookie
      },
    );

    const data = await response.json();
    return data;
  } catch (err) {
    // Even if logout fails, we've cleared the userId cookie
    console.warn("Logout request failed:", err);
    return { success: true };
  }
}

export async function getMe() {
  // Check if we have auth cookies before making request
  // Since httpOnly cookies can't be read by JS, we check userId cookie as proxy
  const userId = getUserIdCookie();
  if (!userId && !hasAuthCookies()) {
    // No tokens available, don't make unnecessary request
    throw new Error("Not authenticated");
  }

  // Get current user - uses httpOnly cookie for auth
  const makeRequest = async () => {
    return await fetchWithCredentials(`${API_BASE}/api/v1/auth/me`, {
      method: "GET",
    });
  };

  let response = await makeRequest();

  // If 401, try to refresh token and retry
  if (response.status === 401) {
    try {
      response = await refreshTokenAndRetry(makeRequest);
    } catch (err) {
      clearUserIdCookie();
      throw new Error("Authentication failed");
    }
  }

  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      clearUserIdCookie();
    }
    throw new Error(data.message || "Failed to get user info");
  }

  // Always update userId cookie if we got user data
  // This ensures the cookie persists across page refreshes
  if (data.userId || data.id) {
    const userId = data.userId || data.id;
    setUserIdCookie(userId, 30);
  } else if (data.user?.userId || data.user?.id) {
    const userId = data.user.userId || data.user.id;
    setUserIdCookie(userId, 30);
  }

  return data;
}
