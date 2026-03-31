// @ts-check
import express from "express";
import cors from "cors";
import { log } from "@dwtechs/winstan";
import { endTimer, startTimer } from "@dwtechs/winstan-plugin-express-perf";
import { listen } from "@dwtechs/servpico-express";
import { errorHandler } from "@dwtechs/errandler-express";
import healixRouter from "@dwtechs/healix-express";
import helmet from "helmet";
import { helmetConfig } from "./conf/helmet.js";
import { corsOptions } from "./conf/cors.js";

const app = express();
app.use(helmet(helmetConfig));
app.disable("x-powered-by");

import consumerSvc from "./services/consumer.js";
import routeSvc from "./services/route.js";
import corsSvc from "./services/cors.js";
import roleSvc from "./services/role.js";

// Cron jobs
import { startDeleteArchivedEntitiesJob } from "./jobs/delete-archived-entities.js";
import { startDeleteOldHistoryJob } from "./jobs/delete-old-history.js";

// middlewares
import { send } from "./middlewares/res/send.js";
import checkRoute from "./middlewares/validators/check-route.js";
import { checkRequest as cr } from "./middlewares/validators/check-request.js"; // Authenticate request and load consumer session

// Routes
import session from "./routes/session.js";
import consumer from "./routes/consumer.js";
import proxy from "./routes/proxy.js";
import route from "./routes/route.js";
import service from "./routes/service.js";
import resource from "./routes/resource.js";
import operation from "./routes/operation.js";
import corsRoutes from "./routes/cors.js";
import field from "./routes/field.js";
import preference from "./routes/preference.js";

const svc = "/gateway/";

app.use(express.json());
app.use(`${svc}health`, healixRouter);
// performance measurement starts for any call to the following routes
app.use(startTimer);
// Validate route
app.use(checkRoute);
// Routes
app.use(`${svc}sessions`, session);
app.use(`${svc}consumers`, ...cr, consumer);
app.use(`${svc}routes`, ...cr, route, send);
app.use(`${svc}services`, ...cr, service, send);
app.use(`${svc}resources`, ...cr, resource, send);
app.use(`${svc}operations`, ...cr, operation, send);
app.use(`${svc}cors`, ...cr, corsRoutes, send);
app.use(`${svc}fields`, ...cr, field, send);
app.use(`${svc}preferences`, ...cr, preference, send);
app.use("/", ...cr, proxy);

// Performance measurement ends
app.use(endTimer);

// Error handling
errorHandler(app);

// Init cached reference data
Promise.all([
  routeSvc.init(),
  consumerSvc.init(),
  corsSvc.init(),
  roleSvc.init(),
])
  .then(() => {
    app.use(cors(corsOptions));
    // Start cron jobs
    startDeleteArchivedEntitiesJob();
    startDeleteOldHistoryJob();
    listen(app);
  })
  .catch((err) => log.error(`App cannot start: ${err.message || err.msg}`));
