# Unit Tests for Auth Worker

This directory contains comprehensive unit tests for all modules in the Auth Worker using Mocha, Chai, Sinon, and NYC for coverage.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up JWT keys for testing (optional, some tests will skip if keys are not set):
```bash
export TEST_JWT_PRIVATE_KEY="your-private-key-here"
export TEST_JWT_PUBLIC_KEY="your-public-key-here"
```

Or replace the placeholders in `test/setup.js`:
- `YOUR_JWT_PRIVATE_KEY_HERE` → Your actual JWT private key
- `YOUR_JWT_PUBLIC_KEY_HERE` → Your actual JWT public key

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run tests with coverage:
```bash
npm run test:coverage
```

Coverage reports will be generated in:
- `coverage/` directory (HTML report)
- `coverage/lcov.info` (LCOV format)

## Test Structure

```
test/
├── setup.js                    # Test utilities and mocks
├── utils/
│   ├── crypto.test.js          # Tests for crypto utilities
│   ├── jwt.test.js             # Tests for JWT utilities
│   ├── validators.test.js      # Tests for validation schemas
│   └── logger.test.js          # Tests for logging utilities
├── db/
│   └── db1.test.js             # Tests for database functions
├── services/
│   └── authService.test.js     # Tests for auth service
├── handlers/
│   └── authHandlers.test.js    # Tests for request handlers
└── middleware/
    ├── authRequired.test.js    # Tests for auth middleware
    ├── validate.test.js        # Tests for validation middleware
    └── rateLimit.test.js       # Tests for rate limiting
```

## Coverage Goals

The project is configured to require:
- 80% line coverage
- 80% function coverage
- 80% branch coverage
- 80% statement coverage

## Notes

- Some JWT tests will skip if keys are not configured (this is expected)
- Tests use Sinon for mocking Cloudflare Workers environment
- All tests are isolated and can run independently
- Mock data is provided via `test/setup.js` helpers

