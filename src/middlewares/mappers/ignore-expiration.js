
export default function ignoreExpiration(req, res, next) {

  res.locals.tokens = { ...res.locals.tokens, ignoreExpiration: true };

  next();
}


