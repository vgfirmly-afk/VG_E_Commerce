// config.js
export const RATE_LIMIT_WINDOW_SECONDS = 60;
export const RATE_LIMIT_MAX_REQUESTS = 10;
export const CACHE_TTL_SECONDS = 3600; // 1 hour cache for pricing data
export const DEFAULT_PRICE = 0.00; // Default price when SKU is created
export const PRICING_CURRENCY = 'USD'; // Default currency
export const CATALOG_WORKER_URL = 'http://localhost:8787'; // Catalog Worker URL for inter-worker communication

