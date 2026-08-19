/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";
import supertest from "supertest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeSvcPath = path.join(__dirname, "../../src/services/route.js");
const consumerSvcPath = path.join(__dirname, "../../src/services/consumer.js");
const routeEntityPath = path.join(__dirname, "../../src/entities/route.js");
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

// Cache never initialized in tests (app.js no longer calls svc.init()) so getOne is fully controlled here.
jest.unstable_mockModule(routeSvcPath, () => ({
  __esModule: true,
  default: { getOne: jest.fn(), init: jest.fn(), deleteArchived: jest.fn() },
}));
jest.unstable_mockModule(consumerSvcPath, () => ({
  __esModule: true,
  default: { getOne: jest.fn(), init: jest.fn(), deleteArchived: jest.fn() },
}));
const get = jest.fn((_req, res, next) => {
  res.locals.rows = [{ id: 1, url: "/gateway/consumers", method: "GET" }];
  res.locals.total = 1;
  next();
});
const addArraySubstack = jest.fn((req, res, next) => {
  res.locals.rows = req.body.rows;
  res.locals.total = req.body.rows.length;
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
jest.unstable_mockModule(routeEntityPath, () => ({
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
        isPrivate: true,
      },
      {
        key: "url",
        type: "string",
        min: 1,
        max: 255,
        operations: ["SELECT", "INSERT", "UPDATE"],
        requiredFor: ["POST"],
        isFilterable: true,
        isPrivate: false,
      },
    ],
  },
}));

const historyMiddleware = jest.fn((_req, res, next) => {
  res.locals.rows = [
    { id: 1, operation: "UPDATE", record: { id: 1, url: "/gateway/things" } },
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

describe("POST /gateway/routes/search", () => {
  let app;
  let routeSvc;
  let consumerSvc;
  const mockRoute = {
    id: 1,
    url: "/gateway/routes/search",
    protected: false,
  };

  beforeAll(async () => {
    ({ default: routeSvc } = await import("../../src/services/route.js"));
    ({ default: consumerSvc } = await import("../../src/services/consumer.js"));
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne.mockReset().mockReturnValue(mockRoute);
    consumerSvc.getOne.mockReset();
    parseBearer.mockClear();
    decodeAccess.mockClear();
  });

  it("rejects a request with no Authorization header", async () => {
    const res = await supertest(app).post("/gateway/routes/search").send({});

    expect(res.status).toBe(401);
    expect(consumerSvc.getOne).not.toHaveBeenCalled();
  });

  it("rejects a request whose access token has no matching consumer session", async () => {
    // checkConsumer only hits the consumer cache for protected routes.
    routeSvc.getOne.mockReturnValue({ ...mockRoute, protected: true });
    consumerSvc.getOne.mockReturnValue(undefined);

    const res = await supertest(app)
      .post("/gateway/routes/search")
      .set("Authorization", "Bearer unknown-token")
      .send({});

    expect(res.status).toBe(401);
    expect(consumerSvc.getOne).toHaveBeenCalledWith("unknown-token");
  });

  it("returns rows from the entity handler once authenticated", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

    const res = await supertest(app)
      .post("/gateway/routes/search")
      .set("Authorization", "Bearer valid-token")
      .send({});

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      rows: [{ id: 1, url: "/gateway/consumers", method: "GET" }],
      total: 1,
    });
  });
});

describe("GET /gateway/routes/:id/history", () => {
  let app;
  let routeSvc;
  let consumerSvc;
  const mockRoute = {
    id: 1,
    url: "/gateway/routes/1/history",
    protected: false,
  };

  beforeAll(async () => {
    ({ default: routeSvc } = await import("../../src/services/route.js"));
    ({ default: consumerSvc } = await import("../../src/services/consumer.js"));
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne.mockReset().mockReturnValue(mockRoute);
    consumerSvc.getOne.mockReset();
    historyMiddleware.mockClear();
  });

  it("rejects a request with no Authorization header", async () => {
    const res = await supertest(app).get("/gateway/routes/1/history");

    expect(res.status).toBe(401);
    expect(historyMiddleware).not.toHaveBeenCalled();
  });

  it("returns grouped history rows once authenticated", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

    const res = await supertest(app)
      .get("/gateway/routes/1/history")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      rows: [
        {
          id: 1,
          operation: "UPDATE",
          record: { id: 1, url: "/gateway/things" },
        },
      ],
      total: 1,
    });
  });
});

describe("POST /gateway/routes (create)", () => {
  let app;
  let routeSvc;
  let consumerSvc;
  const mockRoute = { id: 1, url: "/gateway/routes", protected: false };

  beforeAll(async () => {
    ({ default: routeSvc } = await import("../../src/services/route.js"));
    ({ default: consumerSvc } = await import("../../src/services/consumer.js"));
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne.mockReset().mockReturnValue(mockRoute);
    consumerSvc.getOne.mockReset().mockReturnValue({ id: 1, roles: [1] });
    addArraySubstack.mockClear();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app)
      .post("/gateway/routes")
      .send({ rows: [{ url: "/gateway/things", serviceId: 1 }] });

    expect(res.status).toBe(401);
    expect(addArraySubstack).not.toHaveBeenCalled();
  });

  it("rejects a route pattern with catastrophic backtracking risk", async () => {
    const res = await supertest(app)
      .post("/gateway/routes")
      .set("Authorization", "Bearer valid-token")
      .send({ rows: [{ url: "/gateway/things", pattern: "(a+)+" }] });

    expect(res.status).toBe(400);
    expect(addArraySubstack).not.toHaveBeenCalled();
  });

  it("adds routes and returns them via addArraySubstack", async () => {
    const rows = [{ url: "/gateway/things", serviceId: 1 }];

    const res = await supertest(app)
      .post("/gateway/routes")
      .set("Authorization", "Bearer valid-token")
      .send({ rows });

    expect(res.status).toBe(200);
    expect(addArraySubstack).toHaveBeenCalledTimes(1);
    expect(res.body).toEqual({ rows, total: 1 });
  });
});

describe("PUT /gateway/routes (update)", () => {
  let app;
  let routeSvc;
  let consumerSvc;
  const mockRoute = { id: 1, url: "/gateway/routes", protected: false };

  beforeAll(async () => {
    ({ default: routeSvc } = await import("../../src/services/route.js"));
    ({ default: consumerSvc } = await import("../../src/services/consumer.js"));
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne.mockReset().mockReturnValue(mockRoute);
    consumerSvc.getOne.mockReset().mockReturnValue({ id: 1, roles: [1] });
    updateArraySubstack.mockClear();
  });

  it("rejects an invalid route pattern with 400", async () => {
    const res = await supertest(app)
      .put("/gateway/routes")
      .set("Authorization", "Bearer valid-token")
      .send({ rows: [{ id: 1, pattern: "(" }] });

    expect(res.status).toBe(400);
    expect(updateArraySubstack).not.toHaveBeenCalled();
  });

  it("updates routes via updateArraySubstack", async () => {
    const rows = [{ id: 1, url: "/gateway/things-updated" }];

    const res = await supertest(app)
      .put("/gateway/routes")
      .set("Authorization", "Bearer valid-token")
      .send({ rows });

    expect(res.status).toBe(200);
    expect(updateArraySubstack).toHaveBeenCalledTimes(1);
    expect(res.body).toEqual({ rows, total: 1 });
  });
});

describe("POST /gateway/routes/archive", () => {
  let app;
  let routeSvc;
  let consumerSvc;
  const mockRoute = { id: 1, url: "/gateway/routes/archive", protected: false };

  beforeAll(async () => {
    ({ default: routeSvc } = await import("../../src/services/route.js"));
    ({ default: consumerSvc } = await import("../../src/services/consumer.js"));
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne.mockReset().mockReturnValue(mockRoute);
    consumerSvc.getOne.mockReset().mockReturnValue({ id: 1, roles: [1] });
    archive.mockClear();
  });

  it("archives routes via the entity handler", async () => {
    const rows = [{ id: 1 }];

    const res = await supertest(app)
      .post("/gateway/routes/archive")
      .set("Authorization", "Bearer valid-token")
      .send({ rows });

    expect(res.status).toBe(200);
    expect(archive).toHaveBeenCalledTimes(1);
    expect(res.body).toEqual({ rows, total: 1 });
  });
});

describe("GET /gateway/routes/schema", () => {
  let app;
  let routeSvc;
  let consumerSvc;
  const mockRoute = { id: 1, url: "/gateway/routes/schema", protected: false };

  beforeAll(async () => {
    ({ default: routeSvc } = await import("../../src/services/route.js"));
    ({ default: consumerSvc } = await import("../../src/services/consumer.js"));
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne.mockReset().mockReturnValue(mockRoute);
    consumerSvc.getOne.mockReset();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app).get("/gateway/routes/schema");

    expect(res.status).toBe(401);
  });

  it("returns only the non-private fields", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

    const res = await supertest(app)
      .get("/gateway/routes/schema")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      rows: [
        {
          key: "url",
          type: "string",
          min: 1,
          max: 255,
          operations: ["SELECT", "INSERT", "UPDATE"],
          requiredFor: ["POST"],
          isFilterable: true,
        },
      ],
      total: 1,
    });
  });
});
