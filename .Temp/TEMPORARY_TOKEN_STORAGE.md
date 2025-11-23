# Temporary Token Storage Solution

## Problem

The backend is **NOT setting httpOnly cookies** yet. This means:
- Tokens are only returned in login response body
- Tokens are not persisted across page refreshes
- User gets logged out on page refresh

## Temporary Solution

I've updated the frontend to **temporarily store tokens in localStorage** until the backend properly sets httpOnly cookies.

### What Changed:

1. **Login**: Stores `accessToken` and `refreshToken` in localStorage
2. **Page Refresh**: Reads tokens from localStorage to restore auth
3. **Token Refresh**: Uses stored refreshToken to get new accessToken
4. **Logout**: Clears tokens from localStorage

### Current Flow:

```
1. User logs in
   ↓
2. Backend returns tokens in response body
   ↓
3. Frontend stores tokens in localStorage (TEMPORARY)
   ↓
4. Frontend uses token for /me call
   ↓
5. On page refresh:
   - Frontend reads token from localStorage
   - Uses it to call /me
   - User stays logged in ✅
```

## ⚠️ Important Notes

### This is a TEMPORARY solution!

**Why?**
- Storing tokens in localStorage is less secure than httpOnly cookies
- localStorage is accessible to JavaScript (XSS risk)
- httpOnly cookies are the proper security solution

### What Needs to Happen:

1. **Backend must set httpOnly cookies** in login response
2. **Backend must read tokens from cookies** in `/me` endpoint
3. **Frontend can then remove localStorage token storage**

## Migration Path

Once backend sets httpOnly cookies:

1. Remove token storage from localStorage in:
   - `src/lib/stores/auth.js` - Remove `localStorage.setItem('accessToken', ...)`
   - `src/lib/stores/auth.js` - Remove `localStorage.getItem('accessToken')`
   - `src/lib/api/fetchClient.js` - Remove localStorage refreshToken usage
   - `src/lib/api/auth.js` - Remove localStorage refreshToken usage

2. Keep only user info in localStorage:
   - `userId`
   - `userEmail`
   - `userName`

3. Rely on httpOnly cookies for:
   - `accessToken` (in cookie)
   - `refreshToken` (in cookie)

## Current Status

✅ **Working Now:**
- Login persists across page refresh
- Tokens stored in localStorage (temporary)
- User stays logged in

⚠️ **Security Note:**
- Tokens in localStorage (less secure)
- Should migrate to httpOnly cookies when backend is ready

## Backend Requirements

To properly implement httpOnly cookies, backend needs:

1. **Login endpoint** - Set `Set-Cookie` headers:
   ```javascript
   'Set-Cookie': [
     `accessToken=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`,
     `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000`
   ]
   ```

2. **/me endpoint** - Read token from cookie:
   ```javascript
   const cookies = parseCookies(request.headers.get('Cookie'));
   const token = cookies.accessToken || getTokenFromAuthHeader(request);
   ```

3. **Refresh endpoint** - Read refreshToken from cookie

See `BACKEND_REQUIREMENTS.md` for full implementation details.

