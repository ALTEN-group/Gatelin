// @ts-check

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
export function filterByName(req, _res, next) {
	const { resource } = req.params;
	req.body = req.body || {};
	req.body.filters = {
		...req.body.filters,
		name: { value: resource, matchMode: "=" },
	};
	next();
}
