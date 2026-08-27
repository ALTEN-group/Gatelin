// @ts-check
import { log } from "@dwtechs/winstan";
import { challengesUrl, trustedDevicesUrl } from "../../conf/pwd.js";
import http from "../../utils/http.js";

const TRUSTED_DEVICE_COOKIE = "trusted_device";

/**
 * @param {number} userId
 * @param {"2fa"|"expired-password"|"trusted-device"} kind
 * @returns {Promise<{ url: string, kind: string, challenge?: string }>}
 */
async function mintChallenge(userId, kind) {
  const result = await http.query("POST", challengesUrl, undefined, {
    userId,
    kind,
  });
  const data = result?.data ?? {};
  if (!data.url)
    throw Object.assign(new Error("Challenge mint failed"), {
      statusCode: 502,
    });

  return data;
}

/**
 * @param {number} userId
 * @param {string|undefined} deviceToken
 * @returns {Promise<boolean>}
 */
async function isTrustedDevice(userId, deviceToken) {
  if (!deviceToken || !trustedDevicesUrl) return false;
  try {
    const result = await http.query("POST", trustedDevicesUrl, undefined, {
      userId,
      deviceToken,
    });
    return Boolean(result?.data?.trusted);
  } catch (err) {
    log.warn(`trusted-device verify failed: ${err?.message || err}`);
    return false;
  }
}

/**
 * After password OK: enforce lockout, then mint mid-login challenges when needed.
 * Responds 202 with `{ challengeRequired, kind, url }` instead of creating a session.
 *
 * @type {import('express').RequestHandler}
 */
export async function challengeLogin(req, res, next) {
  try {
    const userId = Number(req.body?.userId);
    const row = res.locals.pwdRow;

    if (!userId) return next({ statusCode: 401, message: "Wrong credentials" });

    // The password already checked out upstream. A pwd service that answers
    // without the pwd row simply carries no lockout/expiry/2FA state, so there
    // is nothing to challenge on — log it rather than locking everyone out.
    if (!row) {
      log.warn(
        `pwd service returned no row for userId=${userId} — mid-login challenges disabled`,
      );
      return next();
    }

    if (row.lockedUntil && new Date(row.lockedUntil) > new Date())
      return next({ statusCode: 403, message: "Account locked" });

    if (row.pwdExpiry && new Date(row.pwdExpiry) < new Date()) {
      if (!challengesUrl) {
        log.warn(
          `expired-password challenge skipped for userId=${userId} — PWD_CHALLENGES_URL is empty`,
        );
        return next();
      }
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
        if (!challengesUrl) {
          log.warn(
            `2fa challenge skipped for userId=${userId} — PWD_CHALLENGES_URL is empty`,
          );
          return next();
        }
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
