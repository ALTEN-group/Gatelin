// @ts-check

import nodeHttp from "node:http";
import nodeHttps from "node:https";
import { pipeline } from "node:stream";
import {
  copyHeaders,
  isEventStream,
  PRIVATE_REQUEST_HEADERS,
  resolveUpstreamUrl,
  upstreamTimeoutMs,
} from "../utils/proxy-headers.js";
import { agentFor } from "../utils/upstream-agent.js";

/**
 * Streams an incoming HTTP request to its configured microservice and streams
 * the upstream response back without parsing or re-serializing either body.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
export function forwardToService(req, res, next) {
  let target;
  try {
    // URL resolves dot segments before forwarding, preventing traversal from
    // escaping the route path while retaining the original query string.
    target = resolveUpstreamUrl(res.locals.route.serviceName, req.url);
  } catch {
    return next({ statusCode: 502, message: "Invalid upstream URL" });
  }

  const headers = copyHeaders(req.headers, {
    extraBlocked: PRIVATE_REQUEST_HEADERS,
  });
  headers.host = target.host;
  Object.assign(headers, req.additionalHeaders ?? {});

  const transport = target.protocol === "https:" ? nodeHttps : nodeHttp;
  let responseStarted = false;
  let failed = false;

  /**
   * @param {NodeJS.ErrnoException} err
   */
  const fail = (err) => {
    if (failed) return;
    failed = true;
    if (responseStarted || res.headersSent) {
      res.destroy(err);
      return;
    }
    const timedOut = err.code === "ETIMEDOUT";
    next({
      statusCode: timedOut ? 504 : 503,
      message: timedOut
        ? "HTTP(504): Upstream timeout"
        : "HTTP(503): Service Unavailable",
    });
  };

  const abortOnIdle = () => {
    const err = new Error("Upstream timeout");
    // @ts-expect-error Error.code is supplied for status mapping.
    err.code = "ETIMEDOUT";
    upstreamReq.destroy(err);
  };

  const upstreamReq = transport.request(
    target,
    { method: req.method, headers, agent: agentFor(target) },
    (upstreamRes) => {
      responseStarted = true;
      // Long-lived event streams must not inherit the generic idle timeout.
      if (isEventStream(req, upstreamRes)) upstreamReq.setTimeout(0);
      res.statusCode = upstreamRes.statusCode ?? 502;
      if (upstreamRes.statusMessage)
        res.statusMessage = upstreamRes.statusMessage;
      for (const [name, value] of Object.entries(
        copyHeaders(upstreamRes.headers),
      )) {
        if (value !== undefined) res.setHeader(name, value);
      }
      pipeline(upstreamRes, res, (err) => {
        if (err) fail(/** @type {NodeJS.ErrnoException} */ (err));
      });
    },
  );

  if (!isEventStream(req))
    upstreamReq.setTimeout(upstreamTimeoutMs(), abortOnIdle);
  upstreamReq.on("error", fail);
  pipeline(req, upstreamReq, (err) => {
    if (err) fail(/** @type {NodeJS.ErrnoException} */ (err));
  });
}
