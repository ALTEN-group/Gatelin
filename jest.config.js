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
	// exceeds the hard-coded 500 ms graceful shutdown deadline (see
	// jest-worker/build/index.js `workerGracefulExitTimeout ?? 500`). With
	// `--experimental-vm-modules`, ESM module-graph teardown intermittently
	// exceeds that budget on child processes even in leak-free code. Using
	// worker threads instead avoids the fork/exit overhead and shuts down
	// well within the deadline.
	workerThreads: true,

	// `forceExit` covers the *main* Jest process (unrelated to the worker
	// shutdown warning above): if for any reason the top-level process still
	// has pending async work after tests finish, exit rather than hang.
	// Real leaks are still surfaced by running with `--detectOpenHandles`.
	forceExit: true,
};
