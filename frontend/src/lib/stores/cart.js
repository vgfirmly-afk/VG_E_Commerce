import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const createCartStore = () => {
	const { subscribe, set, update } = writable({
		cartId: null,
		items: [],
		total: 0,
		itemCount: 0
	});

	return {
		subscribe,
		setCart: (cart) => {
			if (browser && cart.cart_id) {
				// Only store cartId in localStorage for quick access, not sensitive data
				localStorage.setItem('cartId', cart.cart_id);
			}
			set({
				cartId: cart.cart_id,
				items: cart.items || [],
				total: 0,
				itemCount: cart.items?.length || 0
			});
		},
		updateItems: (items) => {
			update(state => ({
				...state,
				items,
				itemCount: items.length
			}));
		},
		clear: () => {
			if (browser) {
				localStorage.removeItem('cartId');
			}
			set({
				cartId: null,
				items: [],
				total: 0,
				itemCount: 0
			});
		},
		init: () => {
			if (browser) {
				const cartId = localStorage.getItem('cartId');
				if (cartId) {
					update(state => ({
						...state,
						cartId
					}));
				}
			}
		}
	};
};

export const cart = createCartStore();
