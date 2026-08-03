// @ts-check
import express from "express";
import { join } from "node:path";
import { log } from "@dwtechs/winstan";

const { ADMIN_PORT } = process.env;
// Path relative to src/ where the Angular dist is copied in the Docker image
const ADMIN_DIST = join(import.meta.dirname, "..", "admin-dist");

export function startAdminServer() {
  if (!ADMIN_PORT) return;

  const app = express();
  app.disable("x-powered-by");

  // Serve Angular static assets
  app.use("/admin", express.static(ADMIN_DIST, { index: false }));

  // SPA fallback — /admin and any /admin/* route that isn't a file serves index.html
  app.get(["/admin", "/admin/", "/admin/*path"], (_req, res) => {
    res.sendFile(join(ADMIN_DIST, "index.html"));
  });

  app.listen(Number(ADMIN_PORT), () =>
    log.info(`Admin UI listening on port ${ADMIN_PORT}`)
  );
}
