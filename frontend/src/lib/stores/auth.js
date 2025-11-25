import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { getMe } from "../api/auth.js";
import { getUserIdCookie, clearUserIdCookie } from "../utils/cookies.js";

// Auth state - uses httpOnly cookies, no localStorage for tokens
const createAuthStore = () => {
  const { subscribe, set, update } = writable({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  return {
    subscribe,
    login: async (user) => {
      // Tokens are stored in httpOnly cookies by backend
      // Just update user state
      set({
        user,
        isAuthenticated: true,
        loading: false,
      });
    },
    logout: () => {
      // Clear user state and userId cookie
      clearUserIdCookie();
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    },
    init: async () => {
      // Check authentication by calling /me endpoint
      // Only call if we have userId cookie (indicates tokens might exist)
      if (browser) {
        set({ user: null, isAuthenticated: false, loading: true });

        // Check if userId cookie exists before making request
        const userId = getUserIdCookie();
        if (!userId) {
          // No userId cookie, definitely not authenticated
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
          return;
        }

        try {
          const user = await getMe();
          set({
            user,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          // Not authenticated or error
          clearUserIdCookie(); // Clear invalid userId cookie
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      } else {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    },
    setUser: (user) => {
      update((state) => ({
        ...state,
        user,
        isAuthenticated: !!user,
      }));
    },
  };
};

export const auth = createAuthStore();

// Guest session management
const createGuestSessionStore = () => {
  const { subscribe, set } = writable(null);

  return {
    subscribe,
    init: () => {
      if (browser) {
        let sessionId = localStorage.getItem("guestSessionId");
        if (!sessionId) {
          sessionId = `session-${crypto.randomUUID()}`;
          localStorage.setItem("guestSessionId", sessionId);
        }
        set(sessionId);
      }
    },
    get: () => {
      if (browser) {
        return localStorage.getItem("guestSessionId");
      }
      return null;
    },
  };
};

export const guestSession = createGuestSessionStore();
