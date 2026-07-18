// @ts-check

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function filterByUserIdAndPwd(req, res, next) {
  const id = res.locals.user.id; // user id from previous middleware
  const pwd = req.body.pwd; // password from request body
  req.body.filters = {
    userId: { value: id, matchMode: "=" },
    pwd: { value: pwd, matchMode: "=" },
  };
  next();
}
