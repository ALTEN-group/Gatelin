// @ts-check
import { failFast, listen } from "@dwtechs/servpico-express";
import { startAdminServer } from "./admin-server.js";
import app from "./app.js";
// Cron jobs
import { startDeleteArchivedEntitiesJob } from "./jobs/delete-archived-entities.js";
import { startDeleteOldHistoryJob } from "./jobs/delete-old-history.js";
import consumerSvc from "./services/consumer.js";
import corsSvc from "./services/cors.js";
import roleSvc from "./services/role.js";
import routeSvc from "./services/route.js";
import scopeSvc from "./services/scope.js";

// Init cached reference data
Promise.all([
  routeSvc.init(),
  consumerSvc.init(),
  corsSvc.init(),
  roleSvc.init(),
  scopeSvc.init(),
])
  .then(() => {
    // Start cron jobs
    startDeleteArchivedEntitiesJob();
    startDeleteOldHistoryJob();
    startAdminServer();
    listen(app);
  })
  .catch(failFast);
