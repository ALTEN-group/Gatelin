// @ts-check

/**
 * Helmet security configuration for production-grade security headers
 * @see https://helmetjs.github.io/
 */
export const helmetConfig = {
  // Content Security Policy - Restrict resource loading
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  // HTTP Strict Transport Security - Force HTTPS
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  // X-Frame-Options - Prevent clickjacking
  frameguard: {
    action: 'deny',
  },
  // X-Content-Type-Options - Prevent MIME sniffing
  noSniff: true,
  // X-XSS-Protection - Enable XSS filter
  xssFilter: true,
  // Referrer-Policy - Control referrer information
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
  // Cross-Origin-Resource-Policy - Control resource sharing
  crossOriginResourcePolicy: {
    policy: 'same-origin',
  },
  // Cross-Origin-Opener-Policy - Isolate browsing context
  crossOriginOpenerPolicy: {
    policy: 'same-origin',
  },
  // Cross-Origin-Embedder-Policy - Control embedding
  crossOriginEmbedderPolicy: true,
  // Hide X-Powered-By header
  hidePoweredBy: true,
};
