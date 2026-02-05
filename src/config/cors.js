// @ts-check
import corsSvc from "../services/cors.js";

/**
 * CORS configuration for the gateway.
 * Validates incoming requests against a dynamic whitelist loaded from the database.
 * The whitelist is checked on each request to allow real-time updates through the admin.
 */
export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    // Get fresh whitelist from cache on each request (dynamic updates)
    const currentWhitelist = corsSvc.getAll();
    
    if (currentWhitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
