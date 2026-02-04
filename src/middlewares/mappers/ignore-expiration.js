
export function ignoreExpiration(_req, res, next) {

  res.locals.tokens = { ...res.locals.tokens, ignoreExpiration: true };

  next();
}


