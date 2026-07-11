// @ts-check
import { timingSafeEqual } from "crypto";
import { log } from "@dwtechs/winstan";

const cookieName = process.env.CSRF_COOKIE_NAME || "csrfToken";

export function checkCsrf(req, _res, next) {
  const cct = req.cookies?.[cookieName];
  const hct = req.headers["x-csrf-token"];
  const tokensMatch =
    typeof cct === "string" &&
    typeof hct === "string" &&
    cct.length === hct.length &&
    timingSafeEqual(Buffer.from(cct), Buffer.from(hct));
  log.debug(() => `checkCsrf(match=${tokensMatch})`);

  if (!tokensMatch)
    return next({ statusCode: 403, message: "Invalid CSRF token" });

  next();
}
