// @ts-check

import { readFileSync } from "node:fs";
import http from "node:http";
import { join } from "node:path";
import { log } from "@dwtechs/winstan";
import express from "express";

const { ADMIN_PORT, ADMIN_BASE_PATH, PORT } = process.env;
// Path relative to src/ where the Angular dist is copied in the Docker image
const ADMIN_DIST = join(import.meta.dirname, "..", "admin-dist");
const BASE_PATH = (ADMIN_BASE_PATH || "/admin").replace(/\/+$/, "");

export function startAdminServer() {
  if (!ADMIN_PORT) return;

  // Angular is compiled once with a fixed placeholder baseHref (see
  // admin/angular.json) — the real prefix is injected into <base href> here at
  // runtime, so changing ADMIN_BASE_PATH only needs a container restart, never
  // an Angular rebuild.
  const indexHtml = readFileSync(
    join(ADMIN_DIST, "index.html"),
    "utf8",
  ).replace(/<base href="[^"]*">/, () => `<base href="${BASE_PATH}/">`);

  const app = express();
  app.disable("x-powered-by");

  // Proxy /api/* to the main API server so Angular's relative URLs work when
  // the admin port is accessed directly (without a reverse proxy in front).
  app.all("/api/*path", (req, res) => {
    const options = {
      hostname: "localhost",
      port: Number(PORT),
      path: req.originalUrl,
      method: req.method,
      headers: req.headers,
    };
    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
      proxyRes.pipe(res);
    });
    proxyReq.on("error", (err) => {
      log.error(`Admin proxy error: ${err.message}`);
      res.status(502).end();
    });
    req.pipe(proxyReq);
  });

  // Serve Angular static assets
  app.use(BASE_PATH, express.static(ADMIN_DIST, { index: false }));

  // SPA fallback — BASE_PATH and any BASE_PATH/* route that isn't a file serves index.html
  app.get([BASE_PATH, `${BASE_PATH}/`, `${BASE_PATH}/*path`], (_req, res) => {
    res.type("html").send(indexHtml);
  });

  app.listen(Number(ADMIN_PORT), () =>
    log.info(`Admin UI listening on port ${ADMIN_PORT}`),
  );
}
