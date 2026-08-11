// @ts-check

import { errorHandler } from "@dwtechs/errandler-express";
import healixRouter from "@dwtechs/healix-express";
import { endTimer, startTimer } from "@dwtechs/winstan-plugin-express-perf";
import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import { security } from "./conf/sec.js";

const app = express();
app.set("trust proxy", 1); // Trust first proxy (Traefik)
app.use(security);
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

// Rate limiters
const sessionLimiter = rateLimit({
	windowMs: SESSION_WINDOW_MS,
	max: 20, // max 20 login/refresh attempts per IP per window
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
app.use(cookieParser());
app.use(`${s}health`, healixRouter);
// performance measurement starts for any call to the following routes
app.use(startTimer);
// Validate route
app.use(checkRoute);
// Routes
app.use(`${s}sessions`, sessionLimiter, session);
app.use(`${s}consumers`, ...cr, consumer);
app.use(`${s}routes`, ...cr, route, send);
app.use(`${s}services`, ...cr, service, send);
app.use(`${s}resources`, ...cr, resource, send);
app.use(`${s}operations`, ...cr, operation, send);
app.use(`${s}cors`, ...cr, cors, send);
app.use(`${s}fields`, ...cr, field, send);
app.use(`${s}scopes`, ...cr, scope, send);
app.use(`${s}preferences/`, ...cr, preference, send);
app.use(`${s}roles`, ...cr, role, send);
app.use(`${s}permissions`, ...cr, permission, send);
app.use(`${s}methods`, ...cr, method, send);
app.use(`${s}applications`, ...cr, application, send);
app.use(`${s}conditions`, ...cr, condition, send);
app.use("/", proxyLimiter, ...cr, proxy);

// Performance measurement ends
app.use(endTimer);

// Error handling
errorHandler(app);

export default app;
