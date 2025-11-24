import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { getMe } from "../api/auth.js";

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
      // Clear user state, cookies will be cleared by backend
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    },
    init: async () => {
      // Check authentication by calling /me endpoint
      // Cookies are automatically sent
      if (browser) {
        set({ user: null, isAuthenticated: false, loading: true });
        try {
          const user = await getMe();
          set({
            user,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          // Not authenticated or error
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
