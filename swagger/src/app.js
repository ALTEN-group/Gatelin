const express = require("express");
const { log } = require("@dwtechs/winstan");
const helmet = require("helmet");
const app = express();
app.use(helmet());
app.disable("x-powered-by");

const swaggerUi = require("swagger-ui-express");
const doc = require("./gatelin.openapi.json");
const swaggerOptions = {
  explorer: false,
  swaggerOptions: {
    persistAuthorization: true
  }
};

const pe = process.env;
const PORT = pe.PORT;
const BASE_PATH = pe.BASE_PATH || "";

// Routes
app.use(
  BASE_PATH + "/",
  swaggerUi.serveFiles(doc),
  swaggerUi.setup(doc, swaggerOptions),
);

app.listen(PORT, () => log.info(`App listening on port ${PORT}`));
