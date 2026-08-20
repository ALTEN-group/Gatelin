// @ts-check

import { execute } from "@dwtechs/antity-pgsql";
import { errorHandler } from "@dwtechs/errandler-express";
import { healix } from "@dwtechs/healix-express";
import { startTimer } from "@dwtechs/winstan-plugin-express-perf";
import cookieParser from "cookie-parser";
import express from "express";
import { corsMiddleware } from "./conf/cors.js";
import { security } from "./conf/sec.js";

const app = express();
app.set("trust proxy", 1); // Trust first proxy (Traefik)
app.use(security);
app.use(corsMiddleware);
app.disable("x-powered-by");

import {
  adminLimiter,
  proxyLimiter,
  sessionLimiter,
} from "./middlewares/rate-limit.js";
// middlewares
import { send } from "./middlewares/res/send.js";
import { checkRequest as cr } from "./middlewares/validators/check-request.js"; // Authenticate request and load consumer session
import checkRoute from "./middlewares/validators/check-route.js";
import application from "./routes/application.js";
import condition from "./routes/condition.js";
import consumer from "./routes/consumer.js";
import cors from "./routes/cors.js";
import field from "./routes/field.js";
import method from "./routes/method.js";
import operation from "./routes/operation.js";
import permission from "./routes/permission.js";
import preference from "./routes/preference.js";
import proxy from "./routes/proxy.js";
import resource from "./routes/resource.js";
import role from "./routes/role.js";
import route from "./routes/route.js";
import scope from "./routes/scope.js";
import service from "./routes/service.js";
// Routes
import session from "./routes/session.js";

const s = "/gatelin/";

// Gatelin's own APIs operate on structured bodies. Keep these parsers scoped
// to the control plane so catch-all proxy requests remain readable streams:
// parsing them here would consume multipart, binary, and other request bodies
// before the proxy can pipe them to the upstream service.
app.use(
  "/gatelin",
  express.json({ limit: "100kb" }),
  express.urlencoded({ extended: false, limit: "100kb" }),
);
app.use(cookieParser());
// OPTIONS preflight short-circuits here — must run before checkRoute
app.use(corsMiddleware);
app.use(
  `${s}health`,
  healix({
    // Liveness stays dependency-free; readiness proves Gatelin can still
    // reach Postgres, so an instance that lost the database leaves rotation.
    checks: { db: () => execute("SELECT 1", [], null) },
  }),
);

app.use(startTimer);
// Validate route
app.use(checkRoute);
// Routes
app.use(`${s}sessions`, sessionLimiter, session);
app.use(`${s}consumers`, ...cr, adminLimiter, consumer);
app.use(`${s}routes`, ...cr, adminLimiter, route, send);
app.use(`${s}services`, ...cr, adminLimiter, service, send);
app.use(`${s}resources`, ...cr, adminLimiter, resource, send);
app.use(`${s}operations`, ...cr, adminLimiter, operation, send);
app.use(`${s}cors`, ...cr, adminLimiter, cors, send);
app.use(`${s}fields`, ...cr, adminLimiter, field, send);
app.use(`${s}scopes`, ...cr, adminLimiter, scope, send);
app.use(`${s}preferences/`, ...cr, adminLimiter, preference, send);
app.use(`${s}roles`, ...cr, adminLimiter, role, send);
app.use(`${s}permissions`, ...cr, adminLimiter, permission, send);
app.use(`${s}methods`, ...cr, adminLimiter, method, send);
app.use(`${s}applications`, ...cr, adminLimiter, application, send);
app.use(`${s}conditions`, ...cr, adminLimiter, condition, send);
app.use("/", ...cr, proxyLimiter, proxy);

// Error handling
errorHandler(app);

export default app;
