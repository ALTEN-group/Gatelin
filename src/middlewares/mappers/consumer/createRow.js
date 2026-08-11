// @ts-check

export function createRow(req, res, next) {
	// Ensure req.body exists (DELETE requests may not have a body)
	if (!req.body) req.body = {};
	// Attach consumer id to request for downstream middleware
	req.body.rows = [{ id: res.locals.consumer.id }];

	next();
}
