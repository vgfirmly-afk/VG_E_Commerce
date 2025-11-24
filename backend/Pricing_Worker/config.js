// config.js
export const RATE_LIMIT_WINDOW_SECONDS = 60;
export const RATE_LIMIT_MAX_REQUESTS = 10;
export const CACHE_TTL_SECONDS = 3600; // 1 hour cache for pricing data
export const DEFAULT_PRICE = 0.0; // Default price when SKU is created
export const PRICING_CURRENCY = "USD"; // Default currency

// Whitelisted Catalog Worker URL for inter-worker communication
// This should match the Catalog Worker's deployed URL
export const getCatalogWorkerUrl = (env) => {
  return (
    env.CATALOG_WORKER_URL || "https://w2-catalog-worker.vg-firmly.workers.dev"
  );
};

// Get whitelisted URLs (can be array for multiple sources)
export const getWhitelistedUrls = (env) => {
  const catalogUrl = getCatalogWorkerUrl(env);
  // Return array of whitelisted URLs (without trailing slash)
  return [catalogUrl.replace(/\/$/, "")];
};
