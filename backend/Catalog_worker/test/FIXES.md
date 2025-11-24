# Test Fixes Applied

## Issues Fixed:

1. **Validators return format**: Changed from `{success, data}` to Joi's `{error, value}` format
2. **Sinon assertions**: Added sinon-chai plugin for better assertions
3. **Encryption key**: Updated to use actual 32-byte key from setup
4. **JWT expired token test**: Changed to use short expiration instead of manually setting exp
5. **DB test assertions**: Fixed to check stub calls properly
6. **Validate middleware**: Fixed Content-Type handling test

## Remaining Issues (ES Module Stubbing):

ES modules cannot be stubbed directly with Sinon. For handlers and services tests that need to stub ES modules, we have two options:

### Option 1: Use `sinon.replace` (Recommended)

Instead of `sinon.stub(module, 'function')`, use:

```javascript
import * as authService from "../../src/services/authService.js";
sinon.replace(authService, "register", sinon.fake.resolves({ ok: true }));
```

### Option 2: Refactor to test behavior, not implementation

Test the actual behavior with mocked dependencies (database, etc.) rather than stubbing the service functions.

## Rate Limit Config Issue:

The rate limit middleware uses `config.js` imports, not env vars. The test should either:

1. Mock the config module
2. Test with the actual config values (60 seconds, 10 requests)
