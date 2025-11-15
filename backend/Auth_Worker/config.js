// config.js
export const ACCESS_TOKEN_EXPIRY = '15m';
export const REFRESH_TOKEN_DAYS = 30;
// PBKDF2 iterations are set in utils/crypto.js (200000). Tune if needed.
// Bind secrets in worker environment: JWT_PRIVATE_KEY, JWT_PUBLIC_KEY, PEPPER, JWT_ISSUER, JWT_AUDIENCE
// Bind KV: RATE_LIMIT_KV
// Bind D1: D1
