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
  default: { updateCache: jest.fn() },
}));

describe("updateCache middleware", () => {
  let updateCache;
  let log;
  let csmerSvc;
  let req, res, next;

  beforeAll(async () => {
    const winstanModule = await import("@dwtechs/winstan");
    log = winstanModule.log;
    const consumerModule = await import("../../../src/services/consumer.js");
    csmerSvc = consumerModule.default;
    const module = await import("../../../src/middlewares/cache/consumer.js");
    updateCache = module.updateCache;
  });

  const debugMessages = () =>
    log.debug.mock.calls.map(([arg]) =>
      typeof arg === "function" ? arg() : arg,
    );

  beforeEach(() => {
    req = {
      body: {
        rows: [
          {
            id: 5,
            accessToken: "new-access",
            refreshToken: "new-refresh",
            roles: [1, 2],
          },
        ],
      },
    };
    res = { locals: {} };
    next = jest.fn();
  });

  it("should update cache with correct arguments and call next()", () => {
    csmerSvc.updateCache.mockReturnValue(true);

    updateCache(req, res, next);

    expect(debugMessages()).toContain("Updating consumer 5 in cache");
    expect(csmerSvc.updateCache).toHaveBeenCalledWith(
      5,
      "new-access",
      "new-refresh",
      [1, 2],
    );
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next(404) when consumer is not found in cache", () => {
    csmerSvc.updateCache.mockReturnValue(false);

    updateCache(req, res, next);

    expect(csmerSvc.updateCache).toHaveBeenCalledWith(
      5,
      "new-access",
      "new-refresh",
      [1, 2],
    );
    expect(next).toHaveBeenCalledWith({
      status: 404,
      msg: "Consumer not updated in cache",
    });
  });

  it("should read id, accessToken, refreshToken and roles from req.body.rows[0]", () => {
    req.body.rows[0] = {
      id: 99,
      accessToken: "at",
      refreshToken: "rt",
      roles: [3],
    };
    csmerSvc.updateCache.mockReturnValue(true);

    updateCache(req, res, next);

    expect(csmerSvc.updateCache).toHaveBeenCalledWith(99, "at", "rt", [3]);
    expect(next).toHaveBeenCalledWith();
  });
});
