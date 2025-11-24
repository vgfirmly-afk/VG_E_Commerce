# Backend Token Fix for /me Endpoint

## Problem

The `/me` endpoint fails with "missing_token" error after login because:

1. Backend sets httpOnly cookies with tokens
2. But `requireAuth` middleware only checks `Authorization` header, not cookies
3. Frontend can't read httpOnly cookies to set Authorization header

## Solution Options

### Option 1: Update Backend to Support Both Cookies and Authorization Header (Recommended)

Update `backend/Auth_Worker/src/middleware/authRequired.js`:

```javascript
// middleware/authRequired.js
import { verifyJWT } from "../utils/jwt.js";
import { isTokenRevoked } from "../db/db1.js";
import { logError, logWarn, logInfo } from "../utils/logger.js";

// Helper to parse cookies
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
}

export async function requireAuth(request, env) {
  try {
    let token = null;

    // Try to get token from httpOnly cookie first
    const cookieHeader = request.headers.get("Cookie");
    if (cookieHeader) {
      const cookies = parseCookies(cookieHeader);
      token = cookies.accessToken;
    }

    // Fallback to Authorization header (for backward compatibility)
    if (!token) {
      const header = request.headers.get("Authorization") || "";
      if (header.startsWith("Bearer ")) {
        token = header.slice(7);
      }
    }

    // If no token found, return error
    if (!token) {
      logInfo("requireAuth: Missing token (checked cookie and header)", {
        hasCookie: !!cookieHeader,
        hasAuthHeader: !!request.headers.get("Authorization"),
      });
      return { ok: false, status: 401, message: "missing_token" };
    }

    // Verify the token
    const payload = await verifyJWT(token, env);
    if (!payload) {
      logInfo("requireAuth: JWT verification failed", { hasToken: !!token });
      return { ok: false, status: 401, message: "invalid_token" };
    }

    // Check if token is revoked (blacklist check)
    if (payload.jti) {
      try {
        const revoked = await isTokenRevoked(payload.jti, env);
        if (revoked) {
          logInfo("requireAuth: Token is revoked", { jti: payload.jti });
          return { ok: false, status: 401, message: "token_revoked" };
        }
      } catch (revokeCheckError) {
        logWarn(
          "requireAuth: Error checking token revocation, allowing request",
          {
            error: revokeCheckError.message,
          },
        );
      }
    }

    return { ok: true, payload };
  } catch (err) {
    logError("requireAuth error", err, { function: "requireAuth" });
    return { ok: false, status: 401, message: "invalid_token" };
  }
}
```

### Option 2: Return Tokens in Login Response Body (Current Frontend Solution)

The frontend is now updated to:

1. Get `accessToken` from login response body
2. Use it in `Authorization` header for immediate `/me` call
3. Rely on httpOnly cookies for subsequent requests

**Backend Login Handler should:**

- Set httpOnly cookies (for automatic auth)
- **ALSO** return tokens in response body (for immediate use)

```javascript
// In authHandlers.js login function
export const login = async (request, env) => {
  // ... existing login logic ...

  // Set httpOnly cookies
  const response = new Response(
    JSON.stringify({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      success: true,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": [
          `accessToken=${result.accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`,
          `refreshToken=${result.refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000`,
        ],
      },
    },
  );

  return response;
};
```

## Recommended Approach

**Use Option 1** - Update `requireAuth` to check cookies first, then Authorization header. This provides:

- Full httpOnly cookie support
- Backward compatibility with Authorization header
- Better security (tokens in httpOnly cookies)
- No need to return tokens in response body

## Testing

After implementing Option 1:

1. Login should set httpOnly cookies
2. `/me` endpoint should work with cookies (no Authorization header needed)
3. Subsequent API calls should work automatically with cookies
4. Authorization header should still work for backward compatibility
