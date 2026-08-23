# Gatelin Tests

This document explains how to run tests for the Gatelin BFF.

## Setup

1. Install dependencies:
```powershell
npm install
```

2. Install dev dependencies for testing:
```powershell
npm install --save-dev @babel/core @babel/preset-env @types/jest @types/node babel-jest jest supertest
```

## Running Tests

### Run all tests
```powershell
npm test
```

### Run tests in watch mode
```powershell
npm run test:watch
```

### Run tests with coverage
```powershell
npm run test:coverage
```

### Run specific test file
```powershell
npx jest tests/middlewares/login.test.js
```

## Test Structure

```
tests/
├── setup.js              # Global test setup and helpers
├── middlewares/           # Middleware unit tests
│   └── login.test.js     # Login middleware tests
└── coverage/             # Test coverage reports (generated)
```

## Test Files

### `tests/middlewares/login.test.js`

Comprehensive unit tests for the login middleware including:

- **Successful Authentication**
  - Valid credentials handling
  - Empty response handling
  
- **Authentication Failures**
  - Invalid credentials error handling
  - Service unavailable error handling
  - Network timeout handling
  
- **Request Validation** 
  - Different email formats
  - Malformed requests
  
- **Environment Configuration**
  - Service URL configuration
  - Missing environment variables

## Mocking

The tests use Jest mocks for:

- `httpclient` - HTTP client for service communication
- `@dwtechs/winstan` - Logging library

## Configuration

- `jest.config.js` - Jest configuration with ES module support
- `babel.config.json` - Babel configuration for ES6+ transpilation
- `tests/setup.js` - Global test setup and utilities

## Coverage

Coverage reports are generated in `tests/coverage/` directory and include:

- HTML report: `tests/coverage/lcov-report/index.html`
- LCOV file: `tests/coverage/lcov.info`
- Console summary during test runs

## Environment Variables

The following environment variables are mocked in tests:

- `NODE_ENV=test`
- `MSUSER_URL=http://user-service:3001`
- `MSMAIL_URL=http://mail-service:3002`
- `MSNOTIF_URL=http://notif-service:3003`
- `MSEVENT_URL=http://event-service:3004`

## Example Test Run

```powershell
PS> npm test

> gatelin@0.1.0-alpha.7 test
> jest

 PASS  tests/middlewares/login.test.js
  Login Middleware
    Successful Authentication
      ✓ should authenticate user with valid credentials (5ms)
      ✓ should handle empty user response (2ms)
    Authentication Failures
      ✓ should handle invalid credentials error (2ms)
      ✓ should handle service unavailable error (1ms)
      ✓ should handle network timeout (1ms)
    Request Validation
      ✓ should handle different email formats (3ms)
    Environment Configuration
      ✓ should use correct service URL from environment (1ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        2.345s
```

## Adding New Tests

1. Create test files in the appropriate subdirectory of `tests/`
2. Follow the naming convention: `*.test.js`
3. Use the provided mocking patterns for external dependencies
4. Use the global helper functions from `tests/setup.js`

## Common Issues

### ES Module Import Errors

If you encounter ES module import errors, ensure:
- `babel.config.json` is properly configured
- `jest.config.js` has the correct transform settings
- Dependencies are properly mocked before imports

### Environment Variable Issues

Use `delete process.env.VARIABLE_NAME` in `afterEach` to clean up environment variables between tests.

### Mock Reset Issues

Use `jest.clearAllMocks()` in `beforeEach` or `afterEach` to reset mock call counts and return values.