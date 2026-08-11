/**
 * @jest-environment node
 *
 * Contract test — codifies which fields `@dwtechs/errandler-express`
 * actually reads off an error object passed to `next({...})`, so future
 * contributors have one authoritative place to look before writing a new
 * error-emitting middleware.
 *
 * Why this test exists:
 *   The 2026-08 audit surfaced 7 call sites (in src/middlewares/history.js
 *   and src/middlewares/cache/consumer.js) that used `{ status, msg }`.
 *   That shape:
 *     - `status`  → works (errandler falls back to it, see below)
 *     - `msg`     → SILENTLY DROPPED — errandler reads `.message` only, so
 *                   clients received responses with a body of `undefined`
 *                   and server logs recorded `log.error(undefined)`.
 *   The unit tests for those middlewares mocked `next` and asserted the
 *   exact `{ status, msg }` shape, so they PASSED while the runtime was
 *   broken. A pure unit-test approach couldn't catch that class of drift
 *   because it never touched the errandler seam.
 *
 *   This file wires the actual production `errorHandler` into a mock Express
 *   app, extracts the `clientErrorHandler` middleware it registers, and
 *   drives it directly with well-known error shapes to pin what the library
 *   observably does. If `@dwtechs/errandler-express` ever changes what
 *   fields it reads (adds `.msg` support, drops `.status` fallback, etc.),
 *   these tests break immediately and the maintainer gets a clear signal
 *   to audit call sites — rather than discovering it via a bug report on
 *   an empty response body months later.
 */

import { jest } from "@jest/globals";
import { errorHandler } from "@dwtechs/errandler-express";

/**
 * Reproduces the production wiring: `errorHandler(app)` calls `app.use(fn)`
 * four times, registering:
 *   [0] logError            — server-side error logger
 *   [1] rollbackTransaction — releases any leased pg client
 *   [2] clientErrorHandler  — writes status + body to the response
 *   [3] invalidPathHandler  — 404 fallback for unmatched routes
 *
 * We extract [2] and drive it directly. If errandler ever reorders these,
 * the assertions below will surface the change; the position-based lookup
 * is intentional so the test isn't silently rebound to the wrong middleware.
 */
function captureClientErrorHandler() {
  const registered = [];
  const mockApp = { use: (fn) => registered.push(fn) };
  errorHandler(mockApp);
  if (registered.length !== 4)
    throw new Error(
      `errandler-express registered ${registered.length} middlewares; ` +
        `expected 4 — the library's wiring changed, revisit this contract test`,
    );
  return registered[2];
}

describe("@dwtechs/errandler-express error-shape contract", () => {
  let clientErrorHandler;
  let res;
  let next;

  beforeAll(() => {
    clientErrorHandler = captureClientErrorHandler();
  });

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe("HTTP status source of truth", () => {
    it("reads .statusCode as the primary field (canonical shape)", () => {
      clientErrorHandler(
        { statusCode: 403, message: "forbidden" },
        {},
        res,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("falls back to .status when .statusCode is absent", () => {
      // Fallback exists but is not blessed for new call sites — always use
      // .statusCode. This test documents the fallback so a future contributor
      // reviewing legacy code understands why { status, ... } "worked" without
      // being tempted to keep using it.
      clientErrorHandler(
        { status: 401, message: "unauthorized" },
        {},
        res,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("prefers .statusCode over .status when both are present", () => {
      // Guards against a subtle regression where a middleware sets both keys
      // (e.g. carelessly spreading an upstream error). The library must
      // always resolve to .statusCode's value, never .status's.
      clientErrorHandler(
        { statusCode: 422, status: 500, message: "unprocessable" },
        {},
        res,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(422);
    });

    it("defaults to 400 when neither .statusCode nor .status is present", () => {
      clientErrorHandler({ message: "malformed" }, {}, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("response body source of truth", () => {
    it("reads .message for the response body (canonical shape)", () => {
      clientErrorHandler(
        { statusCode: 400, message: "missing id" },
        {},
        res,
        next,
      );

      expect(res.send).toHaveBeenCalledWith("missing id");
    });

    it("does NOT read .msg — this is the audit-4 bug shape", () => {
      // Regression pin: this documents the failure mode our historical
      // { status, msg } call sites produced (empty response body). If a
      // future version of errandler-express ever starts reading .msg as a
      // fallback, this test breaks — alerting the maintainer to decide
      // whether we should embrace that or keep enforcing .message only.
      // Recommendation is to keep enforcing .message: fewer legal shapes
      // means less drift risk and simpler grep-audits.
      clientErrorHandler(
        { statusCode: 400, msg: "missing id" },
        {},
        res,
        next,
      );

      expect(res.send).toHaveBeenCalledWith(undefined);
    });

    it("sends undefined body when .message is missing entirely", () => {
      // Same failure mode as { msg: ... }, reached by a different route.
      // Any new middleware that omits .message will surface as an empty
      // response body — no exception, no log, just silence.
      clientErrorHandler({ statusCode: 400 }, {}, res, next);

      expect(res.send).toHaveBeenCalledWith(undefined);
    });
  });

  describe("canonical shape for all future next() error calls", () => {
    it("{ statusCode, message } produces the expected status AND body", () => {
      // If you're writing a new middleware that calls next({...}) with an
      // error, use exactly these two keys and no others. Concrete examples
      // that follow this shape:
      //   src/middlewares/validators/check-consumer.js
      //   src/middlewares/validators/check-refreshToken.js
      //   src/middlewares/validators/check-csrf.js
      //   src/middlewares/validators/check-route.js
      //   src/middlewares/validators/check-acl.js
      //   src/middlewares/http/get-user.js
      //   src/middlewares/history.js
      //   src/middlewares/cache/consumer.js
      //   src/middlewares/mappers/preference/assertRowsOwnedAndUnlocked.js
      //   src/controllers/forward.js
      //   src/conf/cors.js
      clientErrorHandler(
        { statusCode: 422, message: "invalid payload" },
        {},
        res,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.send).toHaveBeenCalledWith("invalid payload");
    });
  });
});
