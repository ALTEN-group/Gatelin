// @ts-check

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
export function filterByEmailNotArchived(req, _res, next) {
	const email = req.body.email; // email from request body
	req.body.filters = {
		email: { value: email, matchMode: "equals" },
		archived: { value: false, matchMode: "IS" },
	};
	next();
}
