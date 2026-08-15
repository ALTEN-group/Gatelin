/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";
import supertest from "supertest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeSvcPath = path.join(__dirname, "../../src/services/route.js");

jest.unstable_mockModule("@dwtechs/winstan", () => ({
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));
// Real toker-express throws at import time without TOKEN_SECRET; mock it like the other route tests.
jest.unstable_mockModule("@dwtechs/toker-express", () => ({
  parseBearer: jest.fn((_req, _res, next) => next()),
  decodeAccess: jest.fn((_req, _res, next) => next()),
  decodeRefresh: jest.fn((_req, _res, next) => next()),
  createTokens: jest.fn(),
  refreshTokens: jest.fn(),
  clearRefreshCookie: jest.fn(),
}));
// Cache never initialized in tests (app.js no longer calls svc.init()) so getOne is fully controlled here.
jest.unstable_mockModule(routeSvcPath, () => ({
  __esModule: true,
  default: { getOne: jest.fn(), init: jest.fn(), deleteArchived: jest.fn() },
}));

describe("GET /gateway/health", () => {
  let app;
  let routeSvc;

  beforeAll(async () => {
    const routeModule = await import("../../src/services/route.js");
    routeSvc = routeModule.default;
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne.mockReset();
  });

  it("responds without hitting checkRoute (mounted before it)", async () => {
    const res = await supertest(app).get("/gateway/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "ok",
      uptime: expect.any(Number),
      timestamp: expect.any(Number),
    });
    expect(routeSvc.getOne).not.toHaveBeenCalled();
  });

  it("stays 200 with no database, so an outage cannot trigger a restart loop", async () => {
    // Liveness must not depend on Postgres — killing every instance would not
    // bring the database back.
    const res = await supertest(app).get("/gateway/health");

    expect(res.status).toBe(200);
  });
});

describe("GET /gateway/health/ready", () => {
  let app;
  let routeSvc;

  beforeAll(async () => {
    const routeModule = await import("../../src/services/route.js");
    routeSvc = routeModule.default;
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne.mockReset();
  });

  it("reports the database unavailable when it cannot be reached", async () => {
    // No Postgres in the test environment, which is exactly the condition the
    // probe exists to detect.
    const res = await supertest(app).get("/gateway/health/ready");

    expect(res.status).toBe(503);
    expect(res.body.status).toBe("unavailable");
    expect(res.body.checks.db.status).toBe("error");
    expect(typeof res.body.checks.db.error).toBe("string");
  });

  it("is mounted before checkRoute", async () => {
    await supertest(app).get("/gateway/health/ready");

    expect(routeSvc.getOne).not.toHaveBeenCalled();
  });
});

describe("unknown routes", () => {
  let app;
  let routeSvc;

  beforeAll(async () => {
    const routeModule = await import("../../src/services/route.js");
    routeSvc = routeModule.default;
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne.mockReset();
  });

  it("returns 404 when checkRoute finds no matching route", async () => {
    routeSvc.getOne.mockReturnValue(undefined);

    const res = await supertest(app).get("/gateway/does-not-exist");

    expect(res.status).toBe(404);
    expect(routeSvc.getOne).toHaveBeenCalledWith(
      "/gateway/does-not-exist",
      "GET",
    );
  });
});
