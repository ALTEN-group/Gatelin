/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";
import supertest from "supertest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeSvcPath = path.join(__dirname, "../src/services/route.js");
const consumerSvcPath = path.join(__dirname, "../src/services/consumer.js");
const corsSvcPath = path.join(__dirname, "../src/services/cors.js");

jest.unstable_mockModule("@dwtechs/winstan", () => ({
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));
jest.unstable_mockModule("@dwtechs/toker-express", () => ({
  parseBearer: jest.fn((_req, _res, next) => next()),
  decodeAccess: jest.fn((_req, _res, next) => next()),
  decodeRefresh: jest.fn((_req, _res, next) => next()),
  createTokens: jest.fn(),
  refreshTokens: jest.fn(),
  clearRefreshCookie: jest.fn(),
}));
jest.unstable_mockModule(routeSvcPath, () => ({
  __esModule: true,
  default: { getOne: jest.fn(), init: jest.fn(), deleteArchived: jest.fn() },
}));
jest.unstable_mockModule(consumerSvcPath, () => ({
  __esModule: true,
  default: { getOne: jest.fn(), init: jest.fn(), deleteArchived: jest.fn() },
}));

const has = jest.fn();
const getCredentials = jest.fn();
jest.unstable_mockModule(corsSvcPath, () => ({
  __esModule: true,
  default: { has, getCredentials },
}));

describe("CORS middleware registration order (AUDIT-002)", () => {
  let app;
  let routeSvc;

  beforeAll(async () => {
    const routeModule = await import("../src/services/route.js");
    routeSvc = routeModule.default;
    ({ default: app } = await import("../src/app.js"));
  });

  beforeEach(() => {
    has.mockReset();
    getCredentials.mockReset();
    routeSvc.getOne.mockReset();
  });

  it("applies CORS headers on the health route (mounted first)", async () => {
    has.mockReturnValue(true);
    getCredentials.mockReturnValue(false);

    const res = await supertest(app)
      .get("/gateway/health")
      .set("Origin", "http://ok.example.com");

    expect(res.headers["access-control-allow-origin"]).toBe(
      "http://ok.example.com",
    );
  });

  it("applies CORS headers on requests reaching the catch-all proxy route", async () => {
    has.mockReturnValue(true);
    getCredentials.mockReturnValue(false);
    routeSvc.getOne.mockReturnValue(undefined);

    const res = await supertest(app)
      .get("/gateway/does-not-exist")
      .set("Origin", "http://ok.example.com");

    expect(res.headers["access-control-allow-origin"]).toBe(
      "http://ok.example.com",
    );
  });

  it("rejects disallowed origins before any route runs", async () => {
    has.mockReturnValue(false);

    const res = await supertest(app)
      .get("/gateway/does-not-exist")
      .set("Origin", "http://evil.example.com");

    expect(res.status).toBe(403);
    expect(routeSvc.getOne).not.toHaveBeenCalled();
  });
});
