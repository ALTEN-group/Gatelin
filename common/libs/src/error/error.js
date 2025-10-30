import { log } from "@dwtechs/winstan";

const EC_BAD_REQUEST = 400;
const EC_UNAUTHORIZED = 401;
const EC_FORBIDDEN = 403;
const EC_NOT_FOUND = 404;
const EC_MALFORMED_SYNTAX = 422;
const EC_INTERNAL_ERROR = 500;

/**
 * Handles the case when an invalid path is requested.
 */
const invalidPathHandler = (req, res, next) => {
  res.status(EC_NOT_FOUND).send("invalid path");
};

/**
 * Logs the error stack and message, and passes the error to the next middleware.
 */
function logError(err, req, res, next) {
  log.error(err.stack);
  log.error(err.message);
  next(err);
}

/**
 * Rolls back the current transaction if any.
 */
function rollbackTransaction(err, req, res, next) {
  req.dbClient
    .query("ROLLBACK")
    .catch((err) => err)
    .finally(() => req.dbClient.release()); // release to avoid memory leak);
  next(err);
}

/**
 * send error to the client
 */
function clientErrorHandler(err, req, res, next) {
  const status = err.statusCode || EC_BAD_REQUEST;
  res.status(status).send(err.message);
}

function use(app) {
  // Mandatory error handlers
  app.use(logError);
  // Mandatory if the service uses Postgre
  app.use(rollbackTransaction);
  // Attach the fallback Middleware
  // function which sends back the response for invalid paths)
  app.use(invalidPathHandler);
  app.use(clientErrorHandler);
}

export default {
  use,
  EC_BAD_REQUEST,
  EC_UNAUTHORIZED,
  EC_FORBIDDEN,
  EC_NOT_FOUND,
  EC_MALFORMED_SYNTAX,
  EC_INTERNAL_ERROR,
};
