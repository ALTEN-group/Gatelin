// @ts-check

/**
 * Express middleware that injects filters (id, userId, resourceName) into
 * req.body.filters for the following pEnt.get middleware, so it only ever
 * matches a preference row owned by the authenticated user for this
 * resource. Templates ("userId" IS NULL) are excluded implicitly - NULL
 * never matches "=" - so no separate locked check is needed.
 *
 * @param {import('express').Request} req
 * @param {Object} req.params
 * @param {string} req.params.resource - Resource name from URL, matched against resourceName
 * @param {string} req.params.id - Preference id from URL
 * @param {import('express').Response} res
 * @param {number} res.locals.consumer.userId - Authenticated user ID
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
