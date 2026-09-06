// @ts-check

/**
 * Login and resume are public and skip CSRF. A cross-site HTML form can POST
 * `application/x-www-form-urlencoded` (Express parses that on `/gatelin`) and
 * set the refresh cookie on this origin. JSON cannot be set from a simple form.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
export function requireJson(req, _res, next) {
  const type = (req.headers["content-type"] ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (type !== "application/json")
    return next({
      statusCode: 415,
      message: "Content-Type must be application/json",
    });
  next();
}
