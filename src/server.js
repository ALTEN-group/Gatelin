// @ts-check
import { log } from "@dwtechs/winstan";
import { listen } from "@dwtechs/servpico-express";
import app from "./app.js";
import { corsMiddleware } from "./conf/cors.js";
import { startAdminServer } from "./admin-server.js";

import consumerSvc from "./services/consumer.js";
import routeSvc from "./services/route.js";
import corsSvc from "./services/cors.js";
import roleSvc from "./services/role.js";
import scopeSvc from "./services/scope.js";

// Cron jobs
import { startDeleteArchivedEntitiesJob } from "./jobs/delete-archived-entities.js";
import { startDeleteOldHistoryJob } from "./jobs/delete-old-history.js";

// Init cached reference data
Promise.all([
  routeSvc.init(),
  consumerSvc.init(),
  corsSvc.init(),
  roleSvc.init(),
  scopeSvc.init(),
])
  .then(() => {
    app.use(corsMiddleware);
    // Start cron jobs
    startDeleteArchivedEntitiesJob();
    startDeleteOldHistoryJob();
    startAdminServer();
    listen(app);
  })
  .catch((err) => log.error(`App cannot start: ${err.message || err.msg}`));
