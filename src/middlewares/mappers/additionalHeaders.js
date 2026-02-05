// @ts-check
import { log } from "@dwtechs/winstan";

export default function updateHeaderWithConsumer(req, res, next) {
  if (!res.locals.isProtected) return next(); // if no jwt protection for this route
  
  const decodedAccessToken = req.decodedAccessToken;
  const consumer = res.rows[0];
  const nickname = consumer.nickname;
  if (!decodedAccessToken.iss) return next();
  req.additionalHeaders = {
    "x-consumer-id": decodedAccessToken.iss,
    "x-consumer-name": nickname,
  };
  log.debug(`updateHeaders(${JSON.stringify(req.additionalHeaders)})`);
  next();
}
