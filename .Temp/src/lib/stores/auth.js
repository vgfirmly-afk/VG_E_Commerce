import { writable } from "svelte/store";
import * as authAPI from "../api/auth.js";
import { setCookie, getCookie, deleteCookie } from "../utils/cookies.js";

function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  // Check authentication status on init
  if (typeof window !== "undefined") {
    checkAuthStatus();

    // Listen for logout events (triggered by fetchClient on auth failure)
    window.addEventListener("auth:logout", handleLogout);
  }

  async function checkAuthStatus() {
    try {
      // Try to get accessToken from cookie
      const storedAccessToken =
        typeof window !== "undefined" ? getCookie("accessToken") : null;

      // Try to get user info - use stored token if available
      const { user } = await authAPI.getMe(storedAccessToken);

      update((state) => ({
        ...state,
        user,
        isAuthenticated: true,
        loading: false,
      }));

      // Store user info in localStorage for quick access (not tokens!)
      if (user && typeof window !== "undefined") {
        localStorage.setItem("userId", user.id || user.user_id);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userName", user.name || user.full_name || "");
      }
    } catch (error) {
      // Not authenticated or token expired
      // Clear stored tokens if auth fails
      if (typeof window !== "undefined") {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
      }

      update((state) => ({
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      }));

      // Clear any stale user info
      if (typeof window !== "undefined") {
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
      }
    }
  }

  async function handleLogout() {
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    });

    if (typeof window !== "undefined") {
      // Clear all stored data including tokens
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("sessionId");

      // Clear token cookies
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    }
  }

  const authStore = {
    subscribe,

    /**
     * Login user
     * Backend returns tokens in response body, we store them in cookies
     * Cookies are automatically sent with requests via credentials: 'include'
     */
    login: async (email, password) => {
      try {
        update((state) => ({ ...state, loading: true }));

        // Login - backend returns tokens in response body
        const loginResponse = await authAPI.login(email, password);

        // Extract tokens from response
        // Backend should return: { accessToken, refreshToken } in response body
        const accessToken = loginResponse.accessToken;
        const refreshToken = loginResponse.refreshToken;

        // Store tokens in cookies
        // Access token expires in 15 minutes (0.25 days), refresh token in 30 days
        if (typeof window !== "undefined" && accessToken && refreshToken) {
          setCookie("accessToken", accessToken, 0.25); // 15 minutes
          setCookie("refreshToken", refreshToken, 30); // 30 days
        }

        // Get user info - use token from response for immediate call
        const { user } = await authAPI.getMe(accessToken);

        // Store user info in localStorage
        if (typeof window !== "undefined" && user) {
          localStorage.setItem("userId", user.id || user.user_id);
          localStorage.setItem("userEmail", user.email);
          localStorage.setItem("userName", user.name || user.full_name || "");
        }

        set({
          user,
          isAuthenticated: true,
          loading: false,
        });

        return { success: true };
      } catch (error) {
        // Clear tokens on error
        if (typeof window !== "undefined") {
          deleteCookie("accessToken");
          deleteCookie("refreshToken");
        }

        set({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
        return { success: false, error: error.message };
      }
    },

    /**
     * Register new user
     * On 201 success, automatically calls login to get tokens in httpOnly cookies
     */
    register: async (userData) => {
      try {
        update((state) => ({ ...state, loading: true }));

        // Register - should return 201 on success
        const registerResult = await authAPI.register(userData);

        // If registration successful (201), automatically login to get tokens
        // Backend will set httpOnly cookies for accessToken and refreshToken
        if (registerResult.success) {
          // Auto login after successful registration
          // This will set httpOnly cookies with tokens
          const loginResult = await authStore.login(
            userData.email,
            userData.password,
          );

          if (!loginResult.success) {
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
            });
            return {
              success: false,
              error:
                loginResult.error ||
                "Registration successful but login failed. Please try logging in manually.",
            };
          }

          return { success: true };
        } else {
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
          return { success: false, error: "Registration failed" };
        }
      } catch (error) {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
        return { success: false, error: error.message };
      }
    },

    /**
     * Logout user
     * Clears httpOnly cookies on server and local storage
     */
    logout: async () => {
      try {
        // Try to logout on server (clears httpOnly cookies if they exist)
        await authAPI.logout();
      } catch (error) {
        console.error("Logout error:", error);
        // Continue with logout even if API call fails
      } finally {
        // Always clear local storage
        await handleLogout();
      }
    },

    /**
     * Refresh authentication status
     */
    refresh: async () => {
      await checkAuthStatus();
    },
  };

  return authStore;
}

export const authStore = createAuthStore();

// Helper function for logout
export function logout() {
  authStore.logout();
}
