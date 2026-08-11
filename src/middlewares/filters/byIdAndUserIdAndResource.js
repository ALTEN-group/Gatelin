// @ts-check

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function filterByIdAndUserIdAndResource(req, res, next) {
	const userId = res.locals.consumer.userId;
	const { resource, id } = req.params;

	req.body = req.body || {};
	req.body.filters = {
		...req.body.filters,
		id: { value: id, matchMode: "=" },
		userId: { value: userId, matchMode: "=" },
		resourceName: { value: resource, matchMode: "=" },
	};
	next();
}
