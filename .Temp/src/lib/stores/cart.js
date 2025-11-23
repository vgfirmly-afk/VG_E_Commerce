import { writable } from 'svelte/store';
import * as cartAPI from '../api/cart.js';

function createCartStore() {
  const { subscribe, set, update } = writable({
    cart: null,
    items: [],
    total: 0,
    loading: false,
  });

  // Initialize session ID if not exists
  if (typeof window !== 'undefined' && !localStorage.getItem('sessionId')) {
    localStorage.setItem('sessionId', `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }

  return {
    subscribe,
    loadCart: async () => {
      update(state => ({ ...state, loading: true }));
      try {
        const cart = await cartAPI.getCart();
        const total = cart.cart_id ? await cartAPI.getCartTotal(cart.cart_id) : { total: 0 };
        
        set({
          cart,
          items: cart.items || [],
          total: total.total || 0,
          loading: false,
        });
      } catch (error) {
        console.error('Failed to load cart:', error);
        update(state => ({ ...state, loading: false }));
      }
    },
    addItem: async (cartId, item) => {
      try {
        const result = await cartAPI.addItemToCart(cartId, item);
        await cartStore.loadCart();
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    updateItem: async (cartId, itemId, quantity) => {
      try {
        await cartAPI.updateCartItem(cartId, itemId, quantity);
        await cartStore.loadCart();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    removeItem: async (cartId, itemId) => {
      try {
        await cartAPI.removeCartItem(cartId, itemId);
        await cartStore.loadCart();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    clearCart: async (cartId) => {
      try {
        await cartAPI.clearCart(cartId);
        await cartStore.loadCart();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
  };
}

export const cartStore = createCartStore();

