// @ts-check

/**
 * Express middleware run after pEnt.get: fails with 403 if the preference is locked.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Array<object>} res.locals.rows
 * @param {import('express').NextFunction} next
 */
export function checkUserId(req, res, next) {
  if (res.locals.rows[0].userId !== res.locals.consumer.userId)
    return next({
      statusCode: 403,
      message: "This preference is not owned by you",
    });
  next();
}
