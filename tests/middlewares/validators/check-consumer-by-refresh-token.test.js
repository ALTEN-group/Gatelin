/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const consumerSvcPath = path.join(
  __dirname,
  "../../../src/services/consumer.js",
);

jest.unstable_mockModule("@dwtechs/winstan", () => ({
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  },
}));
jest.unstable_mockModule(consumerSvcPath, () => ({
  __esModule: true,
  default: { getByRefreshToken: jest.fn() },
}));

describe("checkConsumerByRefreshToken middleware", () => {
  let checkConsumerByRefreshToken;
  let log;
  let csmerSvc;
  let req, res, next;

  beforeAll(async () => {
    const winstanModule = await import("@dwtechs/winstan");
    log = winstanModule.log;
    const consumerModule = await import("../../../src/services/consumer.js");
    csmerSvc = consumerModule.default;
    const module = await import(
      "../../../src/middlewares/validators/check-consumer-by-refresh-token.js"
    );
    checkConsumerByRefreshToken = module.default;
  });

  const debugMessages = () =>
    log.debug.mock.calls.map(([arg]) =>
      typeof arg === "function" ? arg() : arg,
    );

  beforeEach(() => {
    req = { body: { refreshToken: "valid-refresh-token" }, cookies: {} };
    res = { locals: { route: { protected: true } } };
    next = jest.fn();
    csmerSvc.getByRefreshToken.mockReset();
  });

  it("should bypass the cache lookup for an unprotected route", () => {
    res.locals.route.protected = false;

    checkConsumerByRefreshToken(req, res, next);

    expect(csmerSvc.getByRefreshToken).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  it("should set res.locals.consumer and call next() when consumer is found from the request body", () => {
    const mockConsumer = {
      id: 1,
      userId: 10,
      refreshToken: "valid-refresh-token",
    };
    csmerSvc.getByRefreshToken.mockReturnValue(mockConsumer);

    checkConsumerByRefreshToken(req, res, next);

    expect(csmerSvc.getByRefreshToken).toHaveBeenCalledWith(
      "valid-refresh-token",
    );
    expect(debugMessages()).toContain(
      "checkConsumerByRefreshToken(refreshToken=<present>)",
    );
    expect(debugMessages()).toContain(
      `checkConsumerByRefreshToken(Consumer: ${mockConsumer.id})`,
    );
    expect(res.locals.consumer).toBe(mockConsumer);
    expect(next).toHaveBeenCalledWith();
  });

  it("should fall back to the refreshToken cookie when the body has none", () => {
    req = { body: {}, cookies: { refreshToken: "cookie-refresh-token" } };
    const mockConsumer = { id: 2 };
    csmerSvc.getByRefreshToken.mockReturnValue(mockConsumer);

    checkConsumerByRefreshToken(req, res, next);

    expect(csmerSvc.getByRefreshToken).toHaveBeenCalledWith(
      "cookie-refresh-token",
    );
    expect(res.locals.consumer).toBe(mockConsumer);
  });

  it("should call next(401) without querying the cache when no refresh token is present", () => {
    req = { body: {}, cookies: {} };

    checkConsumerByRefreshToken(req, res, next);

    expect(csmerSvc.getByRefreshToken).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith({
      statusCode: 401,
      message: "Unauthorized",
    });
  });

  it("should call next(401) when consumer is not found", () => {
    csmerSvc.getByRefreshToken.mockReturnValue(undefined);

    checkConsumerByRefreshToken(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 401,
      message: "Unauthorized",
    });
    expect(res.locals.consumer).toBeUndefined();
  });
});
