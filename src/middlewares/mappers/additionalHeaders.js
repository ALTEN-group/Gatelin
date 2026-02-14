// @ts-check
import { log } from "@dwtechs/winstan";

export default function updateHeaderWithConsumer(req, res, next) {
  if (!res.locals.route.isProtected) return next(); // if no jwt protection for this route
  
  const decodedAccessToken = res.locals.tokens.decodedAccess;
  log.debug(`updateHeaderWithConsumer(decodedAccessToken=${JSON.stringify(decodedAccessToken)})`);
  const consumer = res.locals.consumer;
  const nickname = consumer.nickname;
  
  req.additionalHeaders = {
    "x-consumer-id": decodedAccessToken.iss,
    "x-consumer-name": nickname,
  };
  log.debug(`updateHeaders(${JSON.stringify(req.additionalHeaders)})`);
  next();
}
