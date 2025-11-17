import { writable } from 'svelte/store';
import * as authAPI from '../api/auth.js';

function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  // Check authentication status on init
  if (typeof window !== 'undefined') {
    checkAuthStatus();
    
    // Listen for logout events (triggered by fetchClient on auth failure)
    window.addEventListener('auth:logout', handleLogout);
  }

  async function checkAuthStatus() {
    try {
      // Try to get user info - this will use httpOnly cookie
      const { user } = await authAPI.getMe();
      
      update(state => ({
        ...state,
        user,
        isAuthenticated: true,
        loading: false,
      }));
      
      // Store user info in localStorage for quick access (not tokens!)
      if (user) {
        localStorage.setItem('userId', user.id || user.user_id);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.name || user.full_name || '');
      }
    } catch (error) {
      // Not authenticated or token expired
      update(state => ({
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      }));
      
      // Clear any stale user info
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
      }
    }
  }

  async function handleLogout() {
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('sessionId');
    }
  }

  const authStore = {
    subscribe,
    
    /**
     * Login user
     * Backend sets httpOnly cookies for tokens
     */
    login: async (email, password) => {
      try {
        update(state => ({ ...state, loading: true }));
        
        // Login - backend sets httpOnly cookies
        await authAPI.login(email, password);
        
        // Get user info using the cookie
        const { user } = await authAPI.getMe();
        
        // Store user info (not tokens - those are in httpOnly cookies)
        if (typeof window !== 'undefined' && user) {
          localStorage.setItem('userId', user.id || user.user_id);
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('userName', user.name || user.full_name || '');
        }

        set({
          user,
          isAuthenticated: true,
          loading: false,
        });

        return { success: true };
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
     * Register new user
     * Backend sets httpOnly cookies after registration
     */
    register: async (userData) => {
      try {
        update(state => ({ ...state, loading: true }));
        
        // Register - backend may set cookies or we need to login after
        await authAPI.register(userData);
        
        // Auto login after registration
        // Backend should set httpOnly cookies on login
        const result = await authStore.login(userData.email, userData.password);
        
        if (!result.success) {
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        }
        
        return result;
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
     * Clears httpOnly cookies on server
     */
    logout: async () => {
      try {
        await authAPI.logout();
      } catch (error) {
        console.error('Logout error:', error);
        // Continue with logout even if API call fails
      } finally {
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
