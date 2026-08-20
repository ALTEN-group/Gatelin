/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
// cors.js is mounted with the outer app.js `send`, but add/update run a cache-sync substack first.
import { jest } from "@jest/globals";
import supertest from "supertest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeSvcPath = path.join(__dirname, "../../src/services/route.js");
const consumerSvcPath = path.join(__dirname, "../../src/services/consumer.js");
const corsEntityPath = path.join(__dirname, "../../src/entities/cors.js");
const cacheCorsPath = path.join(
  __dirname,
  "../../src/middlewares/cache/cors.js",
);
const historyPath = path.join(__dirname, "../../src/middlewares/history.js");

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
const decodeRefresh = jest.fn((_req, _res, next) => next());
jest.unstable_mockModule("@dwtechs/toker-express", () => ({
  parseBearer,
  decodeAccess,
  decodeRefresh,
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
const updateArraySubstack = jest.fn((req, res, next) => {
  res.locals.rows = req.body.rows;
  res.locals.total = req.body.rows.length;
  next();
});
const archive = jest.fn((req, res, next) => {
  res.locals.rows = req.body.rows ?? [];
  res.locals.total = res.locals.rows.length;
  next();
});
jest.unstable_mockModule(corsEntityPath, () => ({
  __esModule: true,
  default: {
    get,
    addArraySubstack,
    updateArraySubstack,
    archive,
    properties: [
      {
        key: "id",
        type: "integer",
        min: null,
        max: null,
        operations: ["SELECT"],
        requiredFor: [],
        isFilterable: true,
        isPrivate: false,
      },
      {
        key: "name",
        type: "string",
        min: 1,
        max: 50,
        operations: ["SELECT", "INSERT", "UPDATE"],
        requiredFor: ["POST"],
        isFilterable: true,
        isPrivate: false,
      },
      {
        key: "description",
        type: "string",
        min: null,
        max: 100,
        operations: ["SELECT", "INSERT", "UPDATE"],
        requiredFor: [],
        isFilterable: true,
        isPrivate: false,
      },
      {
        key: "archived",
        type: "boolean",
        min: null,
        max: null,
        operations: ["SELECT"],
        requiredFor: ["POST"],
        isFilterable: true,
        isPrivate: false,
      },
    ],
  },
}));

const addToCache = jest.fn((_req, _res, next) => next());
const updateCache = jest.fn((_req, _res, next) => next());
const deleteFromCache = jest.fn((_req, _res, next) => next());
jest.unstable_mockModule(cacheCorsPath, () => ({
  addToCache,
  updateCache,
  deleteFromCache,
}));

const historyMiddleware = jest.fn((_req, res, next) => {
  res.locals.rows = [
    {
      id: 1,
      operation: "UPDATE",
      record: { id: 1, name: "https://example.com" },
    },
  ];
  res.locals.total = 1;
  next();
});
const historyGet = jest.fn(() => historyMiddleware);
const historyGetByField = jest.fn(() => jest.fn((_req, _res, next) => next()));
jest.unstable_mockModule(historyPath, () => ({
  __esModule: true,
  default: { get: historyGet, getByField: historyGetByField },
}));

describe("/gatelin/cors", () => {
  let app;
  let routeSvc;
  let consumerSvc;

  beforeAll(async () => {
    ({ default: routeSvc } = await import("../../src/services/route.js"));
    ({ default: consumerSvc } = await import("../../src/services/consumer.js"));
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne
      .mockReset()
      .mockReturnValue({ id: 1, url: "/gatelin/cors", protected: false });
    consumerSvc.getOne.mockReset();
  });

  it("rejects an unauthenticated search", async () => {
    const res = await supertest(app).post("/gatelin/cors/search").send({});

    expect(res.status).toBe(401);
    expect(get).not.toHaveBeenCalled();
  });

  it("returns rows for an authenticated search", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

    const res = await supertest(app)
      .post("/gatelin/cors/search")
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
      .post("/gatelin/cors")
      .set("Authorization", "Bearer valid-token")
      .send({ rows: [{ name: "https://example.com" }] });

    expect(res.status).toBe(200);
    expect(addArraySubstack).toHaveBeenCalledTimes(1);
    expect(addToCache).toHaveBeenCalledTimes(1);
  });
});

describe("GET /gatelin/cors/:id/history", () => {
  let app;
  let routeSvc;
  let consumerSvc;

  beforeAll(async () => {
    ({ default: routeSvc } = await import("../../src/services/route.js"));
    ({ default: consumerSvc } = await import("../../src/services/consumer.js"));
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne.mockReset().mockReturnValue({
      id: 1,
      url: "/gatelin/cors/1/history",
      protected: false,
    });
    consumerSvc.getOne.mockReset();
    historyMiddleware.mockClear();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app).get("/gatelin/cors/1/history");

    expect(res.status).toBe(401);
    expect(historyMiddleware).not.toHaveBeenCalled();
  });

  it("returns grouped history rows once authenticated", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

    const res = await supertest(app)
      .get("/gatelin/cors/1/history")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      rows: [
        {
          id: 1,
          operation: "UPDATE",
          record: { id: 1, name: "https://example.com" },
        },
      ],
      total: 1,
    });
  });
});

describe("PUT /gatelin/cors (update)", () => {
  let app;
  let routeSvc;
  let consumerSvc;

  beforeAll(async () => {
    ({ default: routeSvc } = await import("../../src/services/route.js"));
    ({ default: consumerSvc } = await import("../../src/services/consumer.js"));
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne
      .mockReset()
      .mockReturnValue({ id: 1, url: "/gatelin/cors", protected: false });
    consumerSvc.getOne.mockReset().mockReturnValue({ id: 1, roles: [1] });
    updateArraySubstack.mockClear();
    updateCache.mockClear();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app)
      .put("/gatelin/cors")
      .send({ rows: [{ id: 1, name: "https://updated.com" }] });

    expect(res.status).toBe(401);
    expect(updateArraySubstack).not.toHaveBeenCalled();
  });

  it("updates a CORS entry and syncs the cache", async () => {
    const rows = [{ id: 1, name: "https://updated.com" }];

    const res = await supertest(app)
      .put("/gatelin/cors")
      .set("Authorization", "Bearer valid-token")
      .send({ rows });

    expect(res.status).toBe(200);
    expect(updateArraySubstack).toHaveBeenCalledTimes(1);
    expect(updateCache).toHaveBeenCalledTimes(1);
    expect(res.body).toEqual({ rows, total: 1 });
  });
});

describe("POST /gatelin/cors/archive", () => {
  let app;
  let routeSvc;
  let consumerSvc;

  beforeAll(async () => {
    ({ default: routeSvc } = await import("../../src/services/route.js"));
    ({ default: consumerSvc } = await import("../../src/services/consumer.js"));
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne.mockReset().mockReturnValue({
      id: 1,
      url: "/gatelin/cors/archive",
      protected: false,
    });
    consumerSvc.getOne.mockReset().mockReturnValue({ id: 1, roles: [1] });
    archive.mockClear();
    deleteFromCache.mockClear();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app)
      .post("/gatelin/cors/archive")
      .send({ rows: [{ id: 1 }] });

    expect(res.status).toBe(401);
    expect(archive).not.toHaveBeenCalled();
  });

  it("archives, syncs the cache, then returns rows", async () => {
    const rows = [{ id: 1 }];

    const res = await supertest(app)
      .post("/gatelin/cors/archive")
      .set("Authorization", "Bearer valid-token")
      .send({ rows });

    expect(res.status).toBe(200);
    expect(archive).toHaveBeenCalledTimes(1);
    expect(deleteFromCache).toHaveBeenCalledTimes(1);
    expect(res.body).toEqual({ rows, total: 1 });
  });
});

describe("GET /gatelin/cors/schema", () => {
  let app;
  let routeSvc;
  let consumerSvc;

  beforeAll(async () => {
    ({ default: routeSvc } = await import("../../src/services/route.js"));
    ({ default: consumerSvc } = await import("../../src/services/consumer.js"));
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne.mockReset().mockReturnValue({
      id: 1,
      url: "/gatelin/cors/schema",
      protected: false,
    });
    consumerSvc.getOne.mockReset();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app).get("/gatelin/cors/schema");

    expect(res.status).toBe(401);
  });

  it("returns only the non-private fields", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

    const res = await supertest(app)
      .get("/gatelin/cors/schema")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(4);
    expect(res.body.rows.map((r) => r.key)).toEqual([
      "id",
      "name",
      "description",
      "archived",
    ]);
  });
});
