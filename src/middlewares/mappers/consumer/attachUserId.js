// @ts-check

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function attachUserId(req, res, next) {
	const userId = res.locals.user.id; // user id from previous middleware
	req.body.userId = userId; // pwd is already flat on req.body from the client payload
	next();
}
