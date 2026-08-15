// @ts-check
import { endTimer } from "@dwtechs/winstan-plugin-express-perf";

const noop = () => {};

/**
 * Records the end of the performance timer once the response is flushed.
 *
 * `endTimer` is an ordinary middleware, so mounting it after the routers only
 * works for handlers that call `next()` after responding. The admin `send`
 * middleware and the proxy controller both terminate the chain, which silently
 * dropped timings for the busiest paths. Hooking `finish` covers every
 * response, including proxied and error ones.
 *
 * @type {import('express').RequestHandler}
 */
export function trackPerf(req, res, next) {
  res.on("finish", () => endTimer(req, res, noop));
  next();
}
