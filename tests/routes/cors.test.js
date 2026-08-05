/**
 * @jest-environment node
 * cors.js is mounted with the outer app.js `send`, but add/update run a cache-sync substack first.
 */

import { jest } from "@jest/globals";
import supertest from "supertest";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeSvcPath = path.join(__dirname, "../../src/services/route.js");
const consumerSvcPath = path.join(__dirname, "../../src/services/consumer.js");
const corsEntityPath = path.join(__dirname, "../../src/entities/cors.js");
const cacheCorsPath = path.join(__dirname, "../../src/middlewares/cache/cors.js");

jest.unstable_mockModule("@dwtechs/winstan", () => ({
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const parseBearer = jest.fn((req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return next({ statusCode: 401, message: "Unauthorized" });
  res.locals.tokens = { access: header.slice(7) };
  next();
});
const decodeAccess = jest.fn((_req, _res, next) => next());
jest.unstable_mockModule("@dwtechs/toker-express", () => ({
  parseBearer,
  decodeAccess,
}));

jest.unstable_mockModule(routeSvcPath, () => ({
  __esModule: true,
  default: { getOne: jest.fn(), init: jest.fn(), deleteArchived: jest.fn() },
}));
jest.unstable_mockModule(consumerSvcPath, () => ({
  __esModule: true,
  default: { getOne: jest.fn(), init: jest.fn(), deleteArchived: jest.fn() },
}));

const get = jest.fn((_req, res, next) => {
  res.locals.rows = [{ id: 1, name: "https://example.com" }];
  res.locals.total = 1;
  next();
});
const addArraySubstack = jest.fn((req, res, next) => {
  req.body.rows = [{ id: 1, name: "https://example.com" }];
  res.locals.rows = req.body.rows;
  res.locals.total = 1;
  next();
});
jest.unstable_mockModule(corsEntityPath, () => ({
  __esModule: true,
  default: {
    get,
    addArraySubstack,
    updateArraySubstack: jest.fn(),
    archive: jest.fn(),
    properties: [],
  },
}));

const addToCache = jest.fn((_req, _res, next) => next());
jest.unstable_mockModule(cacheCorsPath, () => ({
  addToCache,
  updateCache: jest.fn(),
  deleteFromCache: jest.fn(),
}));

describe("/gateway/cors", () => {
  let app;
  let routeSvc;
  let consumerSvc;

  beforeAll(async () => {
    ({ default: routeSvc } = await import("../../src/services/route.js"));
    ({ default: consumerSvc } = await import(
      "../../src/services/consumer.js"
    ));
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne
      .mockReset()
      .mockReturnValue({ id: 1, url: "/gateway/cors", protected: false });
    consumerSvc.getOne.mockReset();
  });

  it("rejects an unauthenticated search", async () => {
    const res = await supertest(app).post("/gateway/cors/search").send({});

    expect(res.status).toBe(401);
    expect(get).not.toHaveBeenCalled();
  });

  it("returns rows for an authenticated search", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

    const res = await supertest(app)
      .post("/gateway/cors/search")
      .set("Authorization", "Bearer valid-token")
      .send({});

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      rows: [{ id: 1, name: "https://example.com" }],
      total: 1,
    });
  });

  it("adds a CORS entry and syncs the cache", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

    const res = await supertest(app)
      .post("/gateway/cors")
      .set("Authorization", "Bearer valid-token")
      .send({ rows: [{ name: "https://example.com" }] });

    expect(res.status).toBe(200);
    expect(addArraySubstack).toHaveBeenCalledTimes(1);
    expect(addToCache).toHaveBeenCalledTimes(1);
  });
});
