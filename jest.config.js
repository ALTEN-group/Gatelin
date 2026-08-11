export default {
	// Test environment
	testEnvironment: "node",

	// Stop running tests after failures
	bail: true,

	// Automatically clear mock calls and instances between every test
	clearMocks: true,

	// The directory where Jest should output its coverage files
	coverageDirectory: "./tests/coverage",

	// Coverage reporters
	coverageReporters: ["text", "lcov", "json-summary"],

	// Test match patterns
	testMatch: ["**/tests/**/*.test.js", "**/?(*.)+(spec|test).js"],

	// Native ES module support
	transform: {
		"^.+\\.js$": "babel-jest",
	},

	// Transform ES modules from node_modules
	transformIgnorePatterns: ["node_modules/(?!(@dwtechs|@babel)/)"],

	// Module name mapping for internal packages
	moduleNameMapper: {
		"^httpclient$": "<rootDir>/../common/libs/src/http/http.js",
		"^error$": "<rootDir>/../common/libs/src/error/error.js",
		"^health$": "<rootDir>/../common/libs/src/health/route.js",
		"^prom$": "<rootDir>/../common/libs/src/prom/prom.js",
		"^res$": "<rootDir>/../common/libs/src/res/res.js",
		"^@internal/req$": "<rootDir>/../common/libs/src/req/req.js",
		// @dwtechs/checkard's package.json omits "type": "module", so Jest's
		// native-ESM loader misdetects dist/ch.js (which uses `export {}`) as
		// CommonJS and fails to parse it. Force resolution to the real CJS build.
		"^@dwtechs/checkard$":
			"<rootDir>/node_modules/@dwtechs/checkard/dist/ch.cjs.js",
	},

	// Setup files
	setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],

	// Coverage settings
	collectCoverageFrom: ["src/**/*.js", "!src/server.js", "!**/node_modules/**"],

	// Test timeout
	testTimeout: 10000,

	// Verbose output
	verbose: true,

	// Jest 30 emits a "worker failed to exit gracefully" warning when a worker
	// races past its shutdown deadline. With `--experimental-vm-modules`, ESM
	// module-graph teardown can intermittently trip this even in leak-free code
	// (see jestjs/jest#15709). Force-exiting after the run is completed keeps
	// output clean; individual leaks would still be caught by `--detectOpenHandles`.
	forceExit: true,
};
