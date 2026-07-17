// @ts-check

/**
 * Express middleware that injects a filter (name) into req.body.filters for
 * the following resource entity's `get` middleware, so it fetches the
 * resource row matching req.params.resource by name.
 *
 * Stashes the caller's own req.body.rows (the preference rows to create,
 * an array of entities) into res.locals before overwriting req.body -
 * SQLEntity.get() reads req.body.rows too, but as a pagination "how many
 * rows to return" limit, not an array of entities. Running it directly on
 * the client's original body would misinterpret that array as the LIMIT
 * value and break the query.
 *
 * @param {import('express').Request} req
 * @param {Object} req.params
 * @param {string} req.params.resource - Resource name from the URL
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function filterByName(req, res, next) {
  const { resource } = req.params;
  req.body.filters = {
    name: { value: resource, matchMode: "=" },
  };
  next();
}
