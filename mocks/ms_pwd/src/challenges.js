import { randomBytes } from "node:crypto";
import { log } from "@dwtechs/winstan";
import { mockCredentials } from "./data/credentials.js";
import { escapeHtml, renderPage } from "./render.js";

// Mirrors Foxnox src/services/challenge.js so Gatelin sees the same contract.
const CHALLENGE_KINDS = Object.freeze({
  "2fa": { path: "/2fa/verify", heading: "Two-factor verification" },
  "expired-password": { path: "/password/expired", heading: "Password expired" },
  "trusted-device": {
    path: "/trusted-devices/prompt",
    heading: "Trust this device?",
  },
});

const TRUSTED_DEVICE_COOKIE = "trusted_device";
const CHALLENGE_TTL_MS = 10 * 60 * 1000;
const TICKET_TTL_MS = 2 * 60 * 1000;
const TRUSTED_DEVICE_TTL_MS = 90 * 24 * 60 * 60 * 1000;
// Any 6 digits are accepted; this one is printed on the page so manual runs are quick.
const DEMO_TOTP_CODE = "123456";

/** @type {Map<string, { userId: number, kind: string, expiresAt: number }>} */
const challenges = new Map();
/** @type {Map<string, { userId: number, expiresAt: number }>} */
const tickets = new Map();
/** @type {Map<string, { userId: number, expiresAt: number }>} */
const trustedDevices = new Map();

/** @returns {string} */
function randomToken() {
  return randomBytes(32).toString("base64url");
}

/**
 * Browser-facing base for the mock workflow pages (behind Traefik: /api/foxnox/web).
 * @returns {string}
 */
function publicBase() {
  return (
    process.env.WEB_PUBLIC_BASE_URL || "http://localhost:8100/api/foxnox/web"
  ).replace(/\/$/, "");
}

/** @returns {string} */
function loginResumeUrl() {
  return process.env.WEB_LOGIN_RESUME_URL || "http://localhost:8100/gatelin/login";
}

/**
 * @param {Map<string, { expiresAt: number }>} store
 */
function sweep(store) {
  const now = Date.now();
  for (const [key, value] of store)
    if (value.expiresAt <= now) store.delete(key);
}

/**
 * @param {number} userId
 * @param {string} kind
 * @returns {{ kind: string, challenge: string, path: string, url: string, expiresAt: string }}
 */
function mintChallenge(userId, kind) {
  const spec = CHALLENGE_KINDS[kind];
  const challenge = randomToken();
  const expiresAt = Date.now() + CHALLENGE_TTL_MS;
  challenges.set(challenge, { userId, kind, expiresAt });
  log.info(`mock challenge minted kind=${kind} userId=${userId}`);
  return {
    kind,
    challenge,
    path: spec.path,
    url: `${publicBase()}${spec.path}?challenge=${encodeURIComponent(challenge)}`,
    expiresAt: new Date(expiresAt).toISOString(),
  };
}

/**
 * @param {string} kind
 * @param {unknown} raw
 * @returns {{ challenge: string, userId: number } | null}
 */
function takeChallenge(kind, raw) {
  sweep(challenges);
  const challenge = String(raw ?? "").trim();
  const entry = challenges.get(challenge);
  if (!entry || entry.kind !== kind) return null;
  return { challenge, userId: entry.userId };
}

/**
 * @param {number} userId
 * @returns {string}
 */
function mintTicket(userId) {
  const ticket = randomToken();
  tickets.set(ticket, { userId, expiresAt: Date.now() + TICKET_TTL_MS });
  return ticket;
}

/**
 * @param {import('express').Response} res
 * @param {number} userId
 */
function finishLogin(res, userId) {
  const url = `${loginResumeUrl()}?ticket=${encodeURIComponent(mintTicket(userId))}`;
  log.info(`mock challenge complete userId=${userId} → resume`);
  res.redirect(303, url);
}

/**
 * @param {import('express').Response} res
 * @param {string} plaintext
 */
function setTrustedDeviceCookie(res, plaintext) {
  const maxAge = Math.floor(TRUSTED_DEVICE_TTL_MS / 1000);
  res.append(
    "Set-Cookie",
    `${TRUSTED_DEVICE_COOKIE}=${encodeURIComponent(plaintext)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`,
  );
}

/**
 * @param {import('express').Response} res
 * @param {string} heading
 * @param {string} message
 */
function sendInvalid(res, heading, message) {
  res
    .status(400)
    .type("html")
    .send(
      renderPage(
        heading,
        `<p class="err">${escapeHtml(message)}</p><p>Restart the login to get a fresh link.</p>`,
      ),
    );
}

/**
 * @param {string} kind
 * @param {string} challenge
 * @param {string} intro
 * @param {string} fields
 * @param {string} [error]
 * @returns {string}
 */
function challengeForm(kind, challenge, intro, fields, error) {
  const spec = CHALLENGE_KINDS[kind];
  return renderPage(
    spec.heading,
    `${error ? `<p class="err">${escapeHtml(error)}</p>` : ""}
     <p>${intro}</p>
     <form method="post">
       <input type="hidden" name="challenge" value="${escapeHtml(challenge)}" />
       ${fields}
     </form>`,
  );
}

/**
 * Stand-in for the Foxnox challenge API + SSR workflow pages, so Gatelin's
 * challenge-login / redeem-login-ticket middlewares run end to end locally.
 *
 * @param {import('express').Express} app
 */
export function mountChallenges(app) {
  // --- API consumed by Gatelin -------------------------------------------

  app.post("/foxnox/challenges", (req, res) => {
    const userId = Number(req.body?.userId);
    const kind = String(req.body?.kind ?? "").trim();
    if (!Number.isInteger(userId) || userId < 1)
      return res.status(400).json({ error: "userId must be a positive integer" });
    if (!Object.hasOwn(CHALLENGE_KINDS, kind))
      return res.status(400).json({ error: "Invalid kind" });

    res.status(201).json(mintChallenge(userId, kind));
  });

  app.post("/foxnox/trusted-devices/verify", (req, res) => {
    sweep(trustedDevices);
    const userId = Number(req.body?.userId);
    const deviceToken = String(req.body?.deviceToken ?? "");
    if (!Number.isInteger(userId) || userId < 1 || !deviceToken)
      return res.status(400).json({ error: "Invalid payload" });

    const entry = trustedDevices.get(deviceToken);
    const trusted = Boolean(entry && entry.userId === userId);
    log.debug(`mock trusted-device verify userId=${userId} trusted=${trusted}`);
    res.status(200).json({ trusted });
  });

  app.post("/foxnox/login-tickets/redeem", (req, res) => {
    sweep(tickets);
    const ticket = String(req.body?.ticket ?? "").trim();
    if (!ticket) return res.status(400).json({ error: "Missing ticket" });

    const entry = tickets.get(ticket);
    if (!entry)
      return res.status(400).json({ error: "Invalid or expired ticket" });

    // One-shot, like the real Foxnox workflow token.
    tickets.delete(ticket);
    log.info(`mock login ticket redeemed userId=${entry.userId}`);
    res.status(200).json({ userId: entry.userId });
  });

  // --- SSR challenge pages driven by the browser -------------------------

  app.get("/foxnox/web/2fa/verify", (req, res) => {
    const found = takeChallenge("2fa", req.query?.challenge);
    if (!found) return sendInvalid(res, "Two-factor verification", "Invalid or expired challenge.");

    res.type("html").send(
      challengeForm(
        "2fa",
        found.challenge,
        `Mock TOTP step. Any 6-digit code works — try <code>${DEMO_TOTP_CODE}</code>.`,
        `<label for="code">Authentication code</label>
         <input id="code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code" required />
         <button type="submit">Verify</button>`,
      ),
    );
  });

  app.post("/foxnox/web/2fa/verify", (req, res) => {
    const found = takeChallenge("2fa", req.body?.challenge);
    if (!found) return sendInvalid(res, "Two-factor verification", "Invalid or expired challenge.");

    const code = String(req.body?.code ?? "").trim();
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).type("html").send(
        challengeForm(
          "2fa",
          found.challenge,
          `Mock TOTP step. Any 6-digit code works — try <code>${DEMO_TOTP_CODE}</code>.`,
          `<label for="code">Authentication code</label>
           <input id="code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code" required />
           <button type="submit">Verify</button>`,
          "Enter a 6-digit code.",
        ),
      );
    }

    challenges.delete(found.challenge);
    // Foxnox chains 2FA → trusted-device prompt before handing back a ticket.
    res.redirect(303, mintChallenge(found.userId, "trusted-device").url);
  });

  app.get("/foxnox/web/trusted-devices/prompt", (req, res) => {
    const found = takeChallenge("trusted-device", req.query?.challenge);
    if (!found) return sendInvalid(res, "Trust this device?", "Invalid or expired challenge.");

    res.type("html").send(
      challengeForm(
        "trusted-device",
        found.challenge,
        "Skip two-factor on this browser next time?",
        `<div class="row">
           <button type="submit" name="trust" value="yes">Trust</button>
           <button class="ghost" type="submit" name="trust" value="no">Not now</button>
         </div>`,
      ),
    );
  });

  app.post("/foxnox/web/trusted-devices/prompt", (req, res) => {
    const found = takeChallenge("trusted-device", req.body?.challenge);
    if (!found) return sendInvalid(res, "Trust this device?", "Invalid or expired challenge.");

    challenges.delete(found.challenge);
    if (String(req.body?.trust ?? "") === "yes") {
      const deviceToken = randomToken();
      trustedDevices.set(deviceToken, {
        userId: found.userId,
        expiresAt: Date.now() + TRUSTED_DEVICE_TTL_MS,
      });
      setTrustedDeviceCookie(res, deviceToken);
      log.info(`mock trusted device stored userId=${found.userId}`);
    }
    finishLogin(res, found.userId);
  });

  app.get("/foxnox/web/password/expired", (req, res) => {
    const found = takeChallenge("expired-password", req.query?.challenge);
    if (!found) return sendInvalid(res, "Password expired", "Invalid or expired challenge.");

    res.type("html").send(
      challengeForm(
        "expired-password",
        found.challenge,
        "Mock rotation step. The new password is not stored — only the flow is exercised.",
        `<label for="pwd">New password</label>
         <input id="pwd" name="pwd" type="password" required minlength="9" autocomplete="new-password" />
         <button type="submit">Update password</button>`,
      ),
    );
  });

  app.post("/foxnox/web/password/expired", (req, res) => {
    const found = takeChallenge("expired-password", req.body?.challenge);
    if (!found) return sendInvalid(res, "Password expired", "Invalid or expired challenge.");

    const pwd = String(req.body?.pwd ?? "");
    if (pwd.length < 9) {
      return res.status(400).type("html").send(
        challengeForm(
          "expired-password",
          found.challenge,
          "Mock rotation step. The new password is not stored — only the flow is exercised.",
          `<label for="pwd">New password</label>
           <input id="pwd" name="pwd" type="password" required minlength="9" autocomplete="new-password" />
           <button type="submit">Update password</button>`,
          "Password must be at least 9 characters.",
        ),
      );
    }

    challenges.delete(found.challenge);
    const credential = mockCredentials.find((c) => c.userId === found.userId);
    // Rotation clears the expiry for the rest of this container's lifetime.
    if (credential) credential.pwdExpiry = null;

    if (credential?.twoFactorEnabled)
      return res.redirect(303, mintChallenge(found.userId, "2fa").url);

    finishLogin(res, found.userId);
  });
}
