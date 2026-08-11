// @ts-check

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function filterByIdAndActiveNotArchived(req, res, next) {
	const userId = res.locals.consumer.userId; // userId from authenticated consumer
	req.body.filters = {
		id: { value: userId, matchMode: "=" },
		active: { value: true, matchMode: "IS" },
		archived: { value: false, matchMode: "IS" },
	};
	next();
}
