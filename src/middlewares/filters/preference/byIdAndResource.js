// @ts-check

/**
 * Express middleware that injects filters (id, userId, resource) into
 * req.body.filters for the following pEnt.get middleware, so it only ever
 * matches a preference row that belongs to the authenticated user for this
 * resource. Prevents deleting another user's preference or a shared system
 * default (userId = -1) via id guessing.
 *
 * @param {import('express').Request} req
 * @param {Object} req.params
 * @param {string} req.params.resource - Table/component identifier from URL
 * @param {string} req.params.id - Preference id from URL
 * @param {import('express').Response} res
 * @param {number} res.locals.consumer.userId - Authenticated user ID
 * @param {import('express').NextFunction} next
 */
export function filterByIdAndResource(req, res, next) {
  const { resource, id } = req.params;

  req.body = req.body || {};
  req.body.filters = {
    ...req.body.filters,
    id: { value: id, matchMode: "=" },
    resource: { value: resource, matchMode: "=" },
  };
  next();
}
