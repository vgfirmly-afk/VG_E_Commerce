# Backend Requirements for httpOnly Cookie Authentication

This document outlines the backend changes required to support httpOnly cookie-based authentication in the frontend.

## Overview

The frontend has been updated to use httpOnly cookies for storing access and refresh tokens instead of localStorage. This provides better security by preventing XSS attacks from accessing tokens.

## Required Backend Changes

### 1. Auth Worker - Login Endpoint (`/api/v1/auth/login`)

**Current Behavior:**

- Returns tokens in JSON response body

**Required Behavior:**

- Set httpOnly cookies for both `accessToken` and `refreshToken`
- Cookies should be:
  - `HttpOnly: true` (prevents JavaScript access)
  - `Secure: true` (HTTPS only in production)
  - `SameSite: 'Strict'` or `'Lax'` (CSRF protection)
  - Appropriate `Path` and `Max-Age` values

**Example Response:**

```javascript
// Set cookies in response headers
response.headers.set("Set-Cookie", [
  `accessToken=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`, // 15 minutes
  `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000`, // 30 days
]);

// Optionally still return user info in body (not tokens)
return new Response(
  JSON.stringify({ success: true, user: { id, email, name } }),
  {
    status: 200,
    headers: response.headers,
  },
);
```

### 2. Auth Worker - Register Endpoint (`/api/v1/auth/register`)

**Current Behavior:**

- Returns success message

**Required Behavior:**

- After successful registration, automatically log the user in
- Set httpOnly cookies (same as login endpoint)
- Return user info in response body

### 3. Auth Worker - Refresh Token Endpoint (`/api/v1/auth/token/refresh`)

**Current Behavior:**

- Expects refreshToken in request body

**Required Behavior:**

- Read refreshToken from httpOnly cookie instead of request body
- Validate and rotate the refresh token
- Set new httpOnly cookies for both accessToken and refreshToken
- Return success response

**Example:**

```javascript
// Read refresh token from cookie
const cookies = request.headers.get("Cookie");
const refreshToken = parseCookies(cookies).refreshToken;

if (!refreshToken) {
  return new Response(JSON.stringify({ error: "missing_refresh_token" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

// Validate and rotate token
const result = await authService.rotateRefreshToken({ refreshToken }, env);

// Set new cookies
response.headers.set("Set-Cookie", [
  `accessToken=${result.accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`,
  `refreshToken=${result.refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000`,
]);

return new Response(JSON.stringify({ success: true }), {
  status: 200,
  headers: response.headers,
});
```

### 4. Auth Worker - Logout Endpoint (`/api/v1/auth/logout`)

**Current Behavior:**

- Expects refreshToken in request body

**Required Behavior:**

- Read refreshToken from httpOnly cookie
- Revoke the refresh token
- Clear both cookies by setting them with `Max-Age=0` or `Expires` in the past

**Example:**

```javascript
// Clear cookies
response.headers.set("Set-Cookie", [
  `accessToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
  `refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
]);

return new Response(JSON.stringify({ success: true }), {
  status: 200,
  headers: response.headers,
});
```

### 5. Auth Worker - Get User Endpoint (`/api/v1/auth/me`)

**Current Behavior:**

- Reads accessToken from Authorization header

**Required Behavior:**

- Read accessToken from httpOnly cookie OR Authorization header (for backward compatibility)
- Validate token and return user info

**Example:**

```javascript
// Try cookie first, then header
let accessToken = parseCookies(request.headers.get("Cookie")).accessToken;

if (!accessToken) {
  const authHeader = request.headers.get("Authorization") || "";
  accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
}

if (!accessToken) {
  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

// Verify token and return user
const payload = await verifyJWT(accessToken, env);
const user = await authService.getUserById(payload.sub, env);
// ... return user
```

### 6. All Protected Endpoints

**Required Behavior:**

- Support reading accessToken from httpOnly cookie OR Authorization header
- This allows backward compatibility during migration

## Cookie Helper Functions

You may want to create utility functions for cookie handling:

```javascript
// Parse cookies from Cookie header
export function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookies[name] = decodeURIComponent(value);
  });

  return cookies;
}

// Set cookie helper
export function setCookie(name, value, options = {}) {
  const {
    maxAge = 3600,
    httpOnly = true,
    secure = true,
    sameSite = "Strict",
    path = "/",
  } = options;

  return `${name}=${value}; HttpOnly=${httpOnly}; Secure=${secure}; SameSite=${sameSite}; Path=${path}; Max-Age=${maxAge}`;
}
```

## Security Considerations

1. **Secure Flag**: Set `Secure: true` in production (HTTPS only)
2. **SameSite**: Use `Strict` for maximum CSRF protection, or `Lax` for better UX
3. **Domain**: Don't set domain unless necessary for subdomain sharing
4. **Path**: Set appropriate path (usually `/`)
5. **Max-Age**:
   - Access token: 15 minutes (900 seconds)
   - Refresh token: 30 days (2592000 seconds)

## Testing

After implementing these changes:

1. Test login - cookies should be set
2. Test refresh - new cookies should be set
3. Test logout - cookies should be cleared
4. Test protected endpoints - should work with cookies
5. Test token expiration - should auto-refresh

## Migration Notes

- The frontend will automatically include cookies with all requests (`credentials: 'include'`)
- The frontend will automatically retry requests after token refresh on 401 errors
- During migration, support both cookie and header-based auth for backward compatibility
