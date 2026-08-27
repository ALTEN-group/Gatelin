import express from "express";
import helmet from "helmet";
import { healix } from "@dwtechs/healix-express";
import { listen } from "@dwtechs/servpico-express";
import { log } from "@dwtechs/winstan";
import { isStringOfLength, isValidInteger } from "@dwtechs/checkard";
import { compare } from "@dwtechs/passken-express";
import { errorHandler } from "@dwtechs/errandler-express";
import { mockCredentials } from "./data/credentials.js";
import { mountChallenges } from "./challenges.js";
import { mountRecoverPages } from "./recover.js";

const app = express();

app.use(
  helmet({
    // Mock HTML recovery page uses a small inline stylesheet.
    contentSecurityPolicy: false,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// In-memory mock — no dependencies to probe; readiness still exposes /ready.
app.use("/auth/health", healix());

function validateBody(req, _res, next) {
  log.debug(
    `POST /foxnox/compare - Full request body: ${JSON.stringify(req.body, null, 2)}`,
  );

  const userId = req.body.userId;
  const pwd = req.body.pwd;

  // Validate userId format
  if (!isValidInteger(userId, 1, undefined, true))
    return next({ statusCode: 400, message: "Invalid userId format" });

  // Validate pwd (min 1, max 255 characters)
  if (!isStringOfLength(pwd, 1, 255))
    return next({ statusCode: 400, message: "Invalid pwd format" });

  req.userId = userId;
  next();
}

function findCredential(req, res, next) {
  // Find credentials by userId only, let passken-express compare the password hash
  const credential = mockCredentials.find((c) => c.userId === req.userId);
  if (!credential)
    return next({ statusCode: 401, message: "Invalid credentials" });

  res.locals.rows = [credential];
  next();
}

/**
 * Same envelope as Foxnox `sendPwd`: the pwd row minus its private columns.
 * Gatelin's challenge-login reads `pwdExpiry`, `lockedUntil` and
 * `twoFactorEnabled` from it to decide whether a mid-login challenge is needed.
 */
function sendSuccess(_req, res) {
  const credential = res.locals.rows[0];
  // Defaults keep older generated credentials.js files (no auth-state columns) working.
  const row = {
    id: credential.id,
    userId: credential.userId,
    pwdExpiry: credential.pwdExpiry ?? null,
    failedAttempts: credential.failedAttempts ?? 0,
    lockedUntil: credential.lockedUntil ?? null,
    twoFactorEnabled: credential.twoFactorEnabled ?? false,
    archived: credential.archived ?? false,
  };
  log.debug(`POST /foxnox/compare - success: ${JSON.stringify(row)}`);
  res.status(200).json({ rows: [row], total: 1 });
}

// POST /foxnox/compare - Validate user credentials (used by Gatelin check-pwd middleware)
app.post("/foxnox/compare", validateBody, findCredential, compare, sendSuccess);

// Stand-in for Foxnox password-recovery workflow (admin login link tests)
mountRecoverPages(app);

// Stand-in for Foxnox mid-login challenges + login-resume tickets
mountChallenges(app);

errorHandler(app);

listen(app);
