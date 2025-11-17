// config.js
export const RATE_LIMIT_WINDOW_SECONDS = 60;
export const RATE_LIMIT_MAX_REQUESTS = 10;
export const CACHE_TTL_SECONDS = 3600; // 1 hour cache for cart data
export const CART_EXPIRY_DAYS = 30; // Cart expires after 30 days of inactivity
export const MAX_CART_ITEMS = 100; // Maximum items per cart
export const MAX_QUANTITY_PER_ITEM = 999; // Maximum quantity per item

// Worker URLs for service bindings
export const getPricingWorkerUrl = (env) => {
  return env.PRICING_WORKER_URL || 'https://w2-pricing-worker.vg-firmly.workers.dev';
};

export const getInventoryWorkerUrl = (env) => {
  return env.INVENTORY_WORKER_URL || 'https://w2-inventory-worker.vg-firmly.workers.dev';
};
