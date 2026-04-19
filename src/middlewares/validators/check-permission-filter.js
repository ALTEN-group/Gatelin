// @ts-check

/**
 * Express middleware that ensures a permission search is always filtered by roleId.
 * Returns 400 if roleId is missing from the request body filters.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function requireRoleIdFilter(req, res, next) {
  const roleId = req.body?.filters?.roleId?.value ?? req.body?.roleId;
  if (!roleId) {
    return res
      .status(400)
      .json({ message: '"roleId" filter is required to search permissions.' });
  }
  next();
}

export { requireRoleIdFilter };
