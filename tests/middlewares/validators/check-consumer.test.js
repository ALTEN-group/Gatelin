/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
  default: { getOne: jest.fn() },
}));

describe("checkConsumer middleware", () => {
  let checkConsumer;
  let log;
  let csmerSvc;
  let req, res, next;

  beforeAll(async () => {
    const winstanModule = await import("@dwtechs/winstan");
    log = winstanModule.log;
    const consumerModule = await import("../../../src/services/consumer.js");
    csmerSvc = consumerModule.default;
    const module = await import(
      "../../../src/middlewares/validators/check-consumer.js"
    );
    checkConsumer = module.default;
  });

  const debugMessages = () =>
    log.debug.mock.calls.map(([arg]) =>
      typeof arg === "function" ? arg() : arg,
    );

  beforeEach(() => {
    req = {};
    res = { locals: { tokens: { access: "valid-access-token" } } };
    next = jest.fn();
  });

  it("should set res.locals.consumer and call next() when consumer is found", async () => {
    const mockConsumer = {
      id: 1,
      userId: 10,
      nickname: "alice",
      roles: [1, 2],
    };
    csmerSvc.getOne.mockReturnValue(mockConsumer);

    await checkConsumer(req, res, next);

    expect(csmerSvc.getOne).toHaveBeenCalledWith("valid-access-token");
    expect(debugMessages()).toContain("checkConsumer(accessToken=<present>)");
    expect(debugMessages()).toContain(
      `checkConsumer(Consumer: ${mockConsumer.id})`,
    );
    expect(res.locals.consumer).toBe(mockConsumer);
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next(401) when consumer is not found", async () => {
    csmerSvc.getOne.mockReturnValue(null);

    await checkConsumer(req, res, next);

    expect(csmerSvc.getOne).toHaveBeenCalledWith("valid-access-token");
    expect(next).toHaveBeenCalledWith({
      status: 401,
      message: "Unauthorized",
    });
    expect(res.locals.consumer).toBeUndefined();
  });

  it("should call next(401) when consumer service returns undefined", async () => {
    csmerSvc.getOne.mockReturnValue(undefined);

    await checkConsumer(req, res, next);

    expect(next).toHaveBeenCalledWith({
      status: 401,
      message: "Unauthorized",
    });
  });

  it("should read the access token from res.locals.tokens.access", async () => {
    res.locals.tokens.access = "token-xyz";
    csmerSvc.getOne.mockReturnValue({ id: 2 });

    await checkConsumer(req, res, next);

    expect(csmerSvc.getOne).toHaveBeenCalledWith("token-xyz");
    expect(debugMessages()).toContain("checkConsumer(accessToken=<present>)");
  });
});
