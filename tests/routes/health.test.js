/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import supertest from "supertest";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
      uptime: expect.any(Number),
      message: "OK",
      timestamp: expect.any(Number),
    });
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
