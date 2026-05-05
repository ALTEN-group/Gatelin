// @ts-check
import { timingSafeEqual } from "crypto";
import { log } from "@dwtechs/winstan";

export function checkRefreshToken(req, res, next) {
  const brt = req.body.refreshToken;
  const crt = res.locals.consumer.refreshToken;
  const tokensMatch =
    typeof brt === "string" &&
    typeof crt === "string" &&
    brt.length === crt.length &&
    timingSafeEqual(Buffer.from(brt), Buffer.from(crt));
  log.debug(() => `checkRefreshToken(match=${tokensMatch})`);

  if (!tokensMatch) return next({ statusCode: 401, message: "Unauthorized" });

  next();
}
