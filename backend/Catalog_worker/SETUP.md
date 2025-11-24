# Catalog Worker Setup Guide

## JWT Configuration

The Catalog Worker needs to verify JWT tokens from the Auth Worker. Both workers must share the same JWT key pair.

### Steps:

1. **Generate JWT Keys** (if not already done):

   ```bash
   cd Auth_Worker
   node generate_keys.js
   ```

2. **Set JWT_PRIVATE_KEY in Auth Worker**:

   ```bash
   cd Auth_Worker
   wrangler secret put JWT_PRIVATE_KEY
   # Paste the private key when prompted
   ```

3. **Set JWT_PUBLIC_KEY in Catalog Worker**:
   ```bash
   cd Catalog_worker
   wrangler secret put JWT_PUBLIC_KEY
   # Paste the SAME public key from step 1
   ```

### Important Notes:

- Both workers MUST use the same key pair
- Auth Worker uses `JWT_PRIVATE_KEY` to **sign** tokens
- Catalog Worker uses `JWT_PUBLIC_KEY` to **verify** tokens
- Never commit keys to git - use `wrangler secret put` instead

## Database Setup

1. **Apply migrations**:

   ```bash
   # Local database
   wrangler d1 execute catalog_db --local --file=./migrations/001-init.sql

   # Remote database
   wrangler d1 execute catalog_db --remote --file=./migrations/001-init.sql
   ```

## Testing

Use the Postman collection to test:

1. First, login via Auth Worker to get tokens
2. Tokens are automatically saved to collection variables
3. Use admin endpoints - tokens are automatically added to requests
