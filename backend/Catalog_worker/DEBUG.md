# Catalog Worker Debugging Guide

## Available Debug Scripts

### Local Development & Debugging

```bash
# Standard local development (uses local D1, KV, R2)
npm run start:local

# Remote development (uses Cloudflare's edge environment)
npm run start:remote

# Debug mode with verbose logging (local)
npm run debug

# Debug mode with verbose logging (remote)
npm run debug:remote

# Maximum verbosity debug mode
npm run debug:verbose
```

### Live Log Streaming

```bash
# Stream logs from deployed worker (pretty format)
npm run tail

# Stream logs in JSON format (for parsing)
npm run tail:json

# Stream logs in pretty format (formatted)
npm run tail:pretty
```

## Debugging Techniques

### 1. Local Debugging with Breakpoints

**Using VS Code:**

1. Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Catalog Worker",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "debug"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

2. Set breakpoints in your code
3. Press F5 to start debugging

### 2. Console Logging

Add strategic console.log statements:

```javascript
console.log("[DEBUG]", {
  variable: value,
  request: request.url,
  env: Object.keys(env),
});
```

### 3. Remote Log Streaming

Watch live logs from production:

```bash
npm run tail:pretty
```

This shows:

- Request/response logs
- Error stack traces
- Console.log output
- Performance metrics

### 4. Debugging Inter-Worker Communication

To debug the Pricing Worker health check issue:

1. **Start local debug mode:**

```bash
npm run debug
```

2. **In another terminal, tail Pricing Worker logs:**

```bash
cd ../Pricing_Worker
npm run tail:pretty
```

3. **Make a test request:**

```bash
curl -X POST http://localhost:8787/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Product","skus":[{"price":10.99}]}'
```

4. **Watch both terminals** to see:
   - Catalog Worker making health check request
   - Pricing Worker receiving/responding to health check
   - Any errors or mismatches

### 5. Debugging with Wrangler Dev Inspector

For advanced debugging, use Chrome DevTools:

1. Start with inspector:

```bash
wrangler dev --local --inspector-port=9229
```

2. Open Chrome and navigate to:

```
chrome://inspect
```

3. Click "inspect" under your worker

### 6. Environment-Specific Debugging

**Local (.dev.vars):**

- Uses local D1 database
- Uses local KV (in-memory)
- Uses local R2 (Miniflare)

**Remote (Cloudflare Edge):**

- Uses production D1
- Uses production KV
- Uses production R2
- More accurate to production behavior

### 7. Debugging Tips

**For the health check issue:**

1. **Check request URL:**

```javascript
console.log("[HEALTH CHECK]", {
  pricingWorkerUrl: env.PRICING_WORKER_URL,
  healthEndpoint: `${pricingWorkerUrl}/_/health`,
  constructedUrl: healthEndpoint,
});
```

2. **Check response details:**

```javascript
console.log("[HEALTH RESPONSE]", {
  status: healthResponse.status,
  statusText: healthResponse.statusText,
  headers: Object.fromEntries(healthResponse.headers),
  body: parsedBody,
});
```

3. **Compare with direct curl:**

```bash
curl -v https://w2-pricing-worker.vg-firmly.workers.dev/_/health
```

### 8. Common Debug Commands

```bash
# Check worker status
wrangler deployments list

# View worker configuration
wrangler whoami

# Test specific endpoint locally
curl http://localhost:8787/api/v1/products

# Test with authentication
curl http://localhost:8787/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check D1 database locally
wrangler d1 execute catalog_db --local --command "SELECT * FROM products LIMIT 5"
```

## Debugging Checklist

When debugging the health check issue:

- [ ] Verify Pricing Worker is deployed: `cd ../Pricing_Worker && wrangler deployments list`
- [ ] Test health endpoint directly: `curl https://w2-pricing-worker.vg-firmly.workers.dev/_/health`
- [ ] Check Catalog Worker logs: `npm run tail:pretty`
- [ ] Check Pricing Worker logs: `cd ../Pricing_Worker && npm run tail:pretty`
- [ ] Verify environment variables: Check `.dev.vars` and `wrangler.toml`
- [ ] Test locally: `npm run debug` and make a test request
- [ ] Compare local vs remote behavior

## Performance Debugging

```bash
# Enable performance monitoring
wrangler dev --local --log-level=debug --compatibility-date=2025-11-15

# Check request timing in logs
# Look for: [Performance] entries in console
```

## Network Debugging

```bash
# Enable network request logging
wrangler dev --local --log-level=debug

# All fetch() calls will be logged with:
# - Request URL
# - Request method
# - Request headers
# - Response status
# - Response time
```
