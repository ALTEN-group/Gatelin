// @ts-check
import { log } from "@dwtechs/winstan";

export default function updateHeaderWithConsumer(req, res, next) {
  if (!res.locals.route.protected) return next(); // if no jwt protection for this route

  const dat = res.locals.tokens.decodedAccess;
  log.debug(() => `updateHeaderWithConsumer(decodedAccessToken=<present>)`);
  const c = res.locals.consumer;

  req.additionalHeaders = {
    "x-consumer-user-id": dat.iss,
    "x-consumer-name": c.nickname,
  };
  if (req.aclConditions?.length)
    req.additionalHeaders["x-acl-conditions"] = JSON.stringify(
      req.aclConditions,
    );
  // Present iff checkAcl set a field allow-list (including empty = id only).
  // Omitted when unrestricted (aclFields is null/undefined).
  const aclFields = res.locals.aclFields;
  if (aclFields instanceof Set)
    req.additionalHeaders["x-acl-fields"] = [...aclFields].join(",");

  log.debug(() => `updateHeaders(${JSON.stringify(req.additionalHeaders)})`);
  next();
}
