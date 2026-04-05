// @ts-check
import { log } from "@dwtechs/winstan";

export function checkRefreshToken(req, res, next) {
  const brt = req.body.refreshToken;
  const crt = res.locals.consumer.refreshToken;
  log.debug(
    () =>
      `checkRefreshToken(bodyRefreshToken: ${brt}, consumerRefreshToken: ${crt})`,
  );

  if (brt !== crt)
    return next({ statusCode: 404, message: "Refresh token not found" });

  next();
}
