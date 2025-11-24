// config.js
export const PAYPAL_CONFIG = {
  // Sandbox URLs
  BASE_URL: "https://api-m.sandbox.paypal.com",
  // Production URL (for later): 'https://api-m.paypal.com'
};

export const DEFAULT_CURRENCY = "USD";
export const PAYMENT_TIMEOUT_SECONDS = 3600; // 1 hour

// Frontend URLs for payment success/failure redirects
// These should be set in wrangler.toml or as environment variables
export function getFrontendUrls(env) {
  return {
    successUrl:
      env.FRONTEND_SUCCESS_URL || "http://localhost:5173/payment/success",
    failureUrl:
      env.FRONTEND_FAILURE_URL || "http://localhost:5173/payment/failure",
  };
}
