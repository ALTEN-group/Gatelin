// @ts-check
import { log } from "@dwtechs/winstan";
import http from "../../utils/http.js";

const TRUSTED_DEVICE_COOKIE = "trusted_device";

/**
 * Derive Foxnox base URL from PWD_CHECK_URL (…/pwd/compare → …).
 * @returns {string}
 */
function pwdBaseUrl() {
  const check = process.env.PWD_CHECK_URL || "";
  return check.replace(/\/pwd\/compare\/?$/i, "");
}

/**
 * @param {number} userId
 * @param {"2fa"|"expired-password"|"trusted-device"} kind
 * @returns {Promise<{ url: string, kind: string, challenge?: string }>}
 */
async function mintChallenge(userId, kind) {
  const url = `${pwdBaseUrl()}/pwd/challenges`;
  const result = await http.query("POST", url, undefined, { userId, kind });
  const data = result?.data ?? {};
  if (!data.url) {
    throw Object.assign(new Error("Challenge mint failed"), { statusCode: 502 });
  }
  return data;
}

/**
 * @param {number} userId
 * @param {string|undefined} deviceToken
 * @returns {Promise<boolean>}
 */
async function isTrustedDevice(userId, deviceToken) {
  if (!deviceToken) return false;
  const url = `${pwdBaseUrl()}/pwd/trusted-devices/verify`;
  try {
    const result = await http.query("POST", url, undefined, {
      userId,
      deviceToken,
    });
    return Boolean(result?.data?.trusted);
  } catch (err) {
    log.warn(
      `trusted-device verify failed: ${err?.message || err}`,
    );
    return false;
  }
}

/**
 * After password OK: enforce lockout, then mint mid-login challenges when needed.
 * Responds 202 with `{ challengeRequired, kind, url }` instead of creating a session.
 *
 * @type {import('express').RequestHandler}
 */
export async function gateLoginChallenges(req, res, next) {
  try {
    const userId = Number(req.body?.userId);
    const row = res.locals.pwdRow;

    if (!userId) {
      return next({ statusCode: 401, message: "Wrong credentials" });
    }

    // The password already checked out upstream. A pwd service that answers
    // without the pwd row simply carries no lockout/expiry/2FA state, so there
    // is nothing to challenge on — log it rather than locking everyone out.
    if (!row) {
      log.warn(
        `pwd service returned no row for userId=${userId} — mid-login challenges disabled`,
      );
      return next();
    }

    if (row.lockedUntil && new Date(row.lockedUntil) > new Date()) {
      return next({ statusCode: 403, message: "Account locked" });
    }

    if (row.pwdExpiry && new Date(row.pwdExpiry) < new Date()) {
      const minted = await mintChallenge(userId, "expired-password");
      return res.status(202).json({
        challengeRequired: true,
        kind: "expired-password",
        url: minted.url,
      });
    }

    if (row.twoFactorEnabled) {
      const deviceToken =
        req.cookies?.[TRUSTED_DEVICE_COOKIE] ||
        req.cookies?.[TRUSTED_DEVICE_COOKIE.replace(/_/g, "-")];
      const trusted = await isTrustedDevice(userId, deviceToken);
      if (!trusted) {
        const minted = await mintChallenge(userId, "2fa");
        return res.status(202).json({
          challengeRequired: true,
          kind: "2fa",
          url: minted.url,
        });
      }
    }

    return next();
  } catch (err) {
    return next(err);
  }
}
