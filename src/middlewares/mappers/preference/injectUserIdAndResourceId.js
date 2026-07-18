// @ts-check

/**
 * Express middleware that sets req.body.rows[].userId to the authenticated
 * consumer's id - never trusting whatever the client posted, since that
 * field decides row ownership and, if null, would create a shared template -
 * and injects the resourceId resolved by the preceding resource entity's
 * `get` middleware (res.locals.rows[0].id) into every row. Restores
 * req.body.rows from res.locals.pendingRows (stashed by filterResourceByName
 * before it overwrote req.body for the resource lookup). Runs before
 * pEnt.addArraySubstack / pEnt.updateArraySubstack so the entity never sees
 * a client-supplied userId or resourceId.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function injectUserIdAndResourceId(req, res, next) {
  const userId = res.locals.consumer.userId;
  const resourceId = res.locals.rows[0].id;

  req.body.rows = req.body.rows.map((r) => ({
    ...r,
    userId,
    resourceId,
  }));
  next();
}
