// Test setup file for gateway service

// Mock environment variables
process.env.NODE_ENV = "test";
// Note: Service URLs are set in individual tests since we mock HTTP calls

// Mock console to reduce test noise
global.console = {
  ...console,
  // Uncomment to silence console output during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Global test helpers
global.createMockRequest = (overrides = {}) => ({
  body: { rows: [] },
  params: {},
  query: {},
  headers: {},
  ...overrides,
});

global.createMockResponse = (overrides = {}) => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  ...overrides,
});

global.createMockNext = () => jest.fn();

// Increase timeout for async tests
jest.setTimeout(10000);
