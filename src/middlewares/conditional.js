import { isArray } from "@dwtechs/checkard";

/**
 * Conditionally runs a middleware or an array of middlewares when condition is true.
 * If the second argument is an array, all middlewares in the array are executed sequentially.
 * If it is a single middleware function, only that middleware is executed.
 *
 * @param {Function} condition - Function that returns boolean (req, res) => boolean
 * @param {Function|Array<Function>} middleware - Middleware function or array of middleware functions to run
 * @returns {Function} Express middleware function
 *
 * @example
 * // Run a single middleware if condition is true
 * when((req, res) => !res.rows?.[0]?.active, activate)
 *
 * @example
 * // Run an array of middlewares if condition is true
 * when((req, res) => req.user?.isAdmin, [logAdmin, notifySecurity, auditAction])
 */
export const when = (condition, middleware) => (req, res, next) => {
	if (condition(req, res)) {
		if (isArray(middleware)) return runArray(middleware)(req, res, next);
		return middleware(req, res, next);
	}
	next();
};

/**
 * Runs an array of middlewares sequentially
 * This is useful when you want to run multiple middlewares as one unit
 * @param {Array<Function>} middlewares - Array of middleware functions to run
 * @returns {Function} Express middleware function
 * @example
 * const activationFlow = runArray([activate, logActivation, sendWelcomeEmail]);
 * router.post('/login', [validate, runArray(activationFlow), generateTokens]);
 */
const runArray = (middlewares) => (req, res, next) => {
	let i = 0;

	function runNext(err) {
		// If there's an error, pass it to the main next function
		if (err) return next(err);

		// If we've run all middlewares, call the main next function
		if (i >= middlewares.length) return next();

		// Run the current middleware and increment index
		const currentMiddleware = middlewares[i++];
		currentMiddleware(req, res, runNext);
	}

	// Start running the first middleware
	runNext();
};
