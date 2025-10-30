export default {
  // Test environment
  testEnvironment: 'node',

  // Stop running tests after failures
  bail: true,

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "./tests/coverage",

  // Test match patterns
  testMatch: [
    "**/tests/**/*.test.js",
    "**/?(*.)+(spec|test).js"
  ],

  // Native ES module support
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // Transform ES modules from node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(@dwtechs)/)'
  ],

  // Module name mapping for internal packages
  moduleNameMapper: {
    "^httpclient$": "<rootDir>/../common/libs/src/http/http.js",
    "^error$": "<rootDir>/../common/libs/src/error/error.js",
    "^health$": "<rootDir>/../common/libs/src/health/route.js",
    "^prom$": "<rootDir>/../common/libs/src/prom/prom.js",
    "^res$": "<rootDir>/../common/libs/src/res/res.js",
    "^@internal/req$": "<rootDir>/../common/libs/src/req/req.js"
  },

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],

  // Coverage settings
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/app.js",
    "!**/node_modules/**"
  ],

  // Test timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true
};