// @ts-check
import express from "express";
// const cors = require("cors");
import { log } from '@dwtechs/winstan';
import { endTimer, startTimer } from "@dwtechs/winstan-plugin-express-perf";
import { listen } from "@dwtechs/servpico-express";
import helmet from "helmet";
// import swaggerUi from "swagger-ui-express";
// import openapi from "./openapi.json" with { type: "json" };

const app = express();
app.use(helmet());
app.disable("x-powered-by");

// const swaggerOptions = {
//   explorer: false,
// };

// const { CORS, METHODS } = process.env;
// const whitelist = [CORS]
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (whitelist.indexOf(origin) !== -1)
//       callback(null, true)
//     else
//       callback(new Error('Not allowed by CORS'))
//   },
//   methods: METHODS, // Allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
// };

// app.use(cors('*',corsOptions));

// Mandatory modules for any service
import error from "error";
import health from "health";
import prom from "prom";
import res from "res";

import consumerSvc from "./services/consumer.js";
import routeSvc from "./services/route.js";

// middlewares
import checkRoute from "./middlewares/validators/check-route.js";

// Routes
import consumer from "./routes/consumer.js";
import proxy from "./routes/proxy.js";
import route from "./routes/route.js";

app.use(express.json());
app.use("/metrics", prom);
app.use("/health", health);
// app.use(
//   "/swagger",
//   swaggerUi.serveFiles(openapi, swaggerOptions),
//   swaggerUi.setup(swaggerOptions),
// );
// performance measurement starts for any call to the following routes
app.use(startTimer);
// Validate route
app.use(checkRoute);
// Routes
app.use("/consumers", consumer, res.send);
app.use("/routes", route, res.send);
app.use("/", proxy);

// Performance measurement ends
app.use(endTimer);

// Error handling
error.use(app);

// Init reference data
Promise.all([
    routeSvc.init(), 
    consumerSvc.init(),
  ])
  .then(() => listen(app))
  .catch((err) => log.error(`App cannot start: ${err.msg}`));
