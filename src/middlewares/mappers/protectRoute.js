// @ts-check

export default function protectRoute(req, res, next) {
  
  // Add custom properties to request object for downstream middleware
  // @ts-ignore - Adding custom properties to Express request
  res.locals.isProtected = true;
  
  next();

}
