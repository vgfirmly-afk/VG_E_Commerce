// Backend API base URLs - Update these with your actual Cloudflare Worker URLs
export const API_BASE_URLS = {
	AUTH: import.meta.env.VITE_AUTH_BASE_URL || 'https://w2-auth-worker.vg-firmly.workers.dev',
	CATALOG: import.meta.env.VITE_CATALOG_BASE_URL || 'https://w2-catalog-worker.vg-firmly.workers.dev',
	CART: import.meta.env.VITE_CART_BASE_URL || 'https://w2-cart-worker.vg-firmly.workers.dev',
	CHECKOUT: import.meta.env.VITE_CHECKOUT_BASE_URL || 'https://w2-checkout-worker.vg-firmly.workers.dev',
	PAYMENT: import.meta.env.VITE_PAYMENT_BASE_URL || 'https://w2-payment-worker.vg-firmly.workers.dev',
	PRICING: import.meta.env.VITE_PRICING_BASE_URL || 'https://w2-pricing-worker.vg-firmly.workers.dev',
	INVENTORY: import.meta.env.VITE_INVENTORY_BASE_URL || 'https://w2-inventory-worker.vg-firmly.workers.dev'
};

// PayPal configuration
export const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';

// Frontend base URL for PayPal return URLs
export const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL || 'http://localhost:5173';

