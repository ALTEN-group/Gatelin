// @ts-check

import { execute } from "@dwtechs/antity-pgsql";
import { errorHandler } from "@dwtechs/errandler-express";
import { healix } from "@dwtechs/healix-express";
import { startTimer } from "@dwtechs/winstan-plugin-express-perf";
import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import { corsMiddleware } from "./conf/cors.js";
import { security } from "./conf/sec.js";

const app = express();
app.set("trust proxy", 1); // Trust first proxy (Traefik)
app.use(security);
app.use(corsMiddleware);
app.disable("x-powered-by");

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

const s = "/gateway/";

const SESSION_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const PROXY_WINDOW_MS = 60 * 1000; // 1 minute
const ADMIN_WINDOW_MS = 60 * 1000; // 1 minute
const SESSION_RATE_LIMIT_MAX = Number(process.env.SESSION_RATE_LIMIT_MAX) || 20;
const ADMIN_RATE_LIMIT_MAX = Number(process.env.ADMIN_RATE_LIMIT_MAX) || 300;

// Rate limiters
const sessionLimiter = rateLimit({
  windowMs: SESSION_WINDOW_MS,
  max: SESSION_RATE_LIMIT_MAX, // login/refresh attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
});
// Caps what a stolen token can do against the admin API — without it, a leaked
// JWT enumerates or bulk-archives every entity at wire speed.
const adminLimiter = rateLimit({
  windowMs: ADMIN_WINDOW_MS,
  max: ADMIN_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});
const proxyLimiter = rateLimit({
  windowMs: PROXY_WINDOW_MS,
  max: 200, // max 200 proxied requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: "100kb" }));
// HTML workflow forms (Foxnox /pwd/web/…) POST as urlencoded; without this
// parser req.body stays empty and the proxy rewrites them as `{}` JSON.
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(cookieParser());
// OPTIONS preflight short-circuits here — must run before checkRoute
app.use(corsMiddleware);
app.use(
  `${s}health`,
  healix({
    // Liveness stays dependency-free; readiness proves the gateway can still
    // reach Postgres, so an instance that lost the database leaves rotation.
    checks: { db: () => execute("SELECT 1", [], null) },
  }),
);

app.use(startTimer);
// Validate route
app.use(checkRoute);
// Routes
app.use(`${s}sessions`, sessionLimiter, session);
app.use(`${s}consumers`, adminLimiter, ...cr, consumer);
app.use(`${s}routes`, adminLimiter, ...cr, route, send);
app.use(`${s}services`, adminLimiter, ...cr, service, send);
app.use(`${s}resources`, adminLimiter, ...cr, resource, send);
app.use(`${s}operations`, adminLimiter, ...cr, operation, send);
app.use(`${s}cors`, adminLimiter, ...cr, cors, send);
app.use(`${s}fields`, adminLimiter, ...cr, field, send);
app.use(`${s}scopes`, adminLimiter, ...cr, scope, send);
app.use(`${s}preferences/`, adminLimiter, ...cr, preference, send);
app.use(`${s}roles`, adminLimiter, ...cr, role, send);
app.use(`${s}permissions`, adminLimiter, ...cr, permission, send);
app.use(`${s}methods`, adminLimiter, ...cr, method, send);
app.use(`${s}applications`, adminLimiter, ...cr, application, send);
app.use(`${s}conditions`, adminLimiter, ...cr, condition, send);
app.use("/", proxyLimiter, ...cr, proxy);

// Error handling
errorHandler(app);

export default app;
