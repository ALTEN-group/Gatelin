// @ts-check
import express from "express";
import cors from "cors";
import { log } from '@dwtechs/winstan';
import { endTimer, startTimer } from "@dwtechs/winstan-plugin-express-perf";
import { listen } from "@dwtechs/servpico-express";
import { errorHandler } from "@dwtechs/errandler-express";
import healixRouter from "@dwtechs/healix-express";
import helmet from "helmet";
import { helmetConfig } from "./config/helmet.js";
import { corsOptions } from "./config/cors.js";

const app = express();
app.use(helmet(helmetConfig));
app.disable("x-powered-by");

import consumerSvc from "./services/consumer.js";
import routeSvc from "./services/route.js";
import corsSvc from "./services/cors.js";

// middlewares
import { send } from "./middlewares/res/send.js";
import checkRoute from "./middlewares/validators/check-route.js";
import { checkRequest } from "./middlewares/validators/check-request.js"; // Authenticate request and load consumer session

// Routes
import consumer from "./routes/consumer.js";
import proxy from "./routes/proxy.js";
import route from "./routes/route.js";
import service from "./routes/service.js";
import corsRoutes from "./routes/cors.js";

app.use(express.json());
app.use("/health", healixRouter);
// performance measurement starts for any call to the following routes
app.use(startTimer);
// Validate route
app.use(checkRoute);
// Routes
app.use("/gatelin/consumers", consumer);
app.use("/gatelin/routes", ...checkRequest, route, send);
app.use("/gatelin/services", ...checkRequest, service, send);
app.use("/gatelin/cors", ...checkRequest, corsRoutes, send);
app.use("/", proxy);

// Performance measurement ends
app.use(endTimer);

// Error handling
errorHandler(app);

// Init cached reference data
Promise.all([
    routeSvc.init(), 
    consumerSvc.init(),
    corsSvc.init(),
  ])
  .then(() => { 
    app.use(cors(corsOptions));
    listen(app);
  })
  .catch((err) => log.error(`App cannot start: ${err.message || err.msg}`));
