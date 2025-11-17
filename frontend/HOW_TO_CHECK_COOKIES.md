# How to Check httpOnly Cookies

## Why You Can't See httpOnly Cookies in JavaScript

**httpOnly cookies are intentionally hidden from JavaScript** - this is a security feature to prevent XSS attacks. You cannot access them via:
- `document.cookie`
- DevTools Console
- Application → Cookies tab (they won't show up there)

## How to Verify Cookies Are Set

### Method 1: Browser DevTools Network Tab

1. Open DevTools (F12 or Right-click → Inspect)
2. Go to **Network** tab
3. Make a login request
4. Click on the login request
5. Go to **Headers** tab
6. Look for **Response Headers** section
7. Check for `Set-Cookie` headers:

```
Set-Cookie: accessToken=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900
Set-Cookie: refreshToken=abc123...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000
```

If you see these headers, cookies are being set by the backend.

### Method 2: Check Subsequent Requests

1. After login, make another API call (e.g., `/api/v1/auth/me`)
2. In Network tab, click on that request
3. Go to **Headers** tab
4. Look for **Request Headers** section
5. Check for `Cookie` header:

```
Cookie: accessToken=eyJhbGc...; refreshToken=abc123...
```

If you see this, cookies are being sent with requests.

### Method 3: Application Tab (Limited)

1. Open DevTools
2. Go to **Application** tab
3. Click **Cookies** in the left sidebar
4. Select your domain (e.g., `w2-auth-worker.vg-firmly.workers.dev`)
5. **Note**: httpOnly cookies might not show here in some browsers, but they're still there

### Method 4: Check Backend Response

The backend login handler should set cookies in the response. Check if your backend is actually setting them.

## Current Status

Based on the backend code, **the login endpoint is NOT setting httpOnly cookies yet**. It only returns tokens in the response body:

```javascript
// Current backend code (authHandlers.js)
return new Response(
  JSON.stringify({ accessToken: result.accessToken, refreshToken: result.refreshToken }), 
  { status: 200, headers: { 'Content-Type': 'application/json' } }
);
```

## What Needs to Happen

The backend login handler needs to be updated to SET cookies:

```javascript
// Updated backend code should be:
const response = new Response(
  JSON.stringify({ accessToken: result.accessToken, refreshToken: result.refreshToken }), 
  { 
    status: 200, 
    headers: { 
      'Content-Type': 'application/json',
      'Set-Cookie': [
        `accessToken=${result.accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`,
        `refreshToken=${result.refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000`
      ]
    } 
  }
);
return response;
```

## Quick Test

1. Login via your frontend
2. Open Network tab in DevTools
3. Check the login request response headers
4. If you DON'T see `Set-Cookie` headers, the backend is not setting cookies yet
5. The tokens are currently only in the response body, which is why the frontend uses them in the Authorization header

## Summary

- **httpOnly cookies are invisible to JavaScript** (by design for security)
- **Check Network tab → Response Headers** to see if `Set-Cookie` is present
- **Your backend currently doesn't set cookies** - it only returns tokens in response body
- **Frontend currently works** by using tokens from response body in Authorization header
- **To use httpOnly cookies**, backend must be updated to set them (see BACKEND_REQUIREMENTS.md)

