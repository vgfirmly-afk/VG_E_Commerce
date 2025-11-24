// API Configuration
export const API_CONFIG = {
  // Production URLs - can be overridden with environment variables
  AUTH_WORKER_URL:
    import.meta.env.VITE_AUTH_WORKER_URL ||
    "https://w2-auth-worker.vg-firmly.workers.dev",
  CART_WORKER_URL:
    import.meta.env.VITE_CART_WORKER_URL ||
    "https://w2-cart-worker.vg-firmly.workers.dev",
  CATALOG_WORKER_URL:
    import.meta.env.VITE_CATALOG_WORKER_URL ||
    "https://w2-catalog-worker.vg-firmly.workers.dev",
  INVENTORY_WORKER_URL:
    import.meta.env.VITE_INVENTORY_WORKER_URL ||
    "https://w2-inventory-worker.vg-firmly.workers.dev",
  PRICING_WORKER_URL:
    import.meta.env.VITE_PRICING_WORKER_URL ||
    "https://w2-pricing-worker.vg-firmly.workers.dev",
};
