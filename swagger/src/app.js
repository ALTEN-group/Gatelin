const express = require("express");
const { log } = require("@dwtechs/winstan");
const { endTimer, startTimer } = require("@dwtechs/winstan-plugin-express-perf");
const helmet = require("helmet");
const app = express();
app.use(helmet());
app.disable("x-powered-by");

const swaggerUi = require("swagger-ui-express");
const doc = require("./gatelin.openapi.json");
const swaggerOptions = {
  explorer: false,
};

const pe = process.env;
const PORT = pe.PORT;

// Mandatory modules for any service
// const error = require("error");
// const health = require("health");
// const listen = require("@internal/serve");

// app.use(express.json());
// performance measurement starts for any call to the following routes
app.use(startTimer);
app.use(express.static(`${__dirname}/public`));
// Routes
app.use(
  "/",
  swaggerUi.serveFiles(doc, swaggerOptions),
  swaggerUi.setup(swaggerOptions),
);
// Performance measurement ends
app.use(endTimer);
app.listen(PORT, () => log.info(`App listening on port ${PORT}`));
