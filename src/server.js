// @ts-check
import { failFast, listen } from "@dwtechs/servpico-express";
import { log } from "@dwtechs/winstan";
import { startAdminServer } from "./admin-server.js";
import app from "./app.js";
import { validateEnv } from "./conf/env.js";
import { attachWebSocketProxy } from "./controllers/websocket.js";
// Cron jobs
import { startDeleteArchivedEntitiesJob } from "./jobs/delete-archived-entities.js";
import { startDeleteOldHistoryJob } from "./jobs/delete-old-history.js";
import consumerSvc from "./services/consumer.js";
import corsSvc from "./services/cors.js";
import roleSvc from "./services/role.js";
import routeSvc from "./services/route.js";
import scopeSvc from "./services/scope.js";

// Anything that escapes Express's error pipeline would otherwise die with no
// structured log and no orderly shutdown.
process.on("unhandledRejection", (reason) => {
  failFast(reason instanceof Error ? reason : new Error(String(reason)));
});
process.on("uncaughtException", (err) => {
  failFast(err);
});

// Init cached reference data before listen — corsMiddleware reads the
// whitelist at request time, so init must finish before accepting traffic.
Promise.resolve()
  .then(validateEnv)
  .then(() =>
    Promise.all([
      routeSvc.init(),
      consumerSvc.init(),
      corsSvc.init(),
      roleSvc.init(),
      scopeSvc.init(),
    ]),
  )
  .then(() => {
    // Start cron jobs
    startDeleteArchivedEntitiesJob();
    startDeleteOldHistoryJob();
    const adminServer = startAdminServer();
    // servpico's listen() only closes the Gatelin server, so in-flight admin UI
    // requests would be cut off when it calls process.exit.
    if (adminServer) {
      for (const signal of ["SIGTERM", "SIGINT", "SIGHUP"]) {
        process.once(signal, () =>
          adminServer.close(() => log.info("Admin UI server closed")),
        );
      }
    }
    // WebSocket upgrades never enter Express. Hook the HTTP server that
    // servpico creates via app.listen() so GET+Upgrade is authorized and piped.
    const originalListen = app.listen.bind(app);
    app.listen = (...args) => {
      const server = originalListen(...args);
      attachWebSocketProxy(server);
      return server;
    };
    listen(app);
  })
  .catch(failFast);
