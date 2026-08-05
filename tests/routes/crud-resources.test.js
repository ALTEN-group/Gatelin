/**
 * @jest-environment node
 * Parameterized wiring check for the generic CRUD resources: each mounts
 * `...checkRequest, <router>, send` in app.js with `router.post("/search", XEnt.get)`.
 * Also covers /:id/history, add, update, archive and /schema for the resources that
 * expose them (method has no history/add/archive; permission has a differently
 * shaped history route and DELETE instead of archive - see the dedicated blocks below).
 */

import { jest } from "@jest/globals";
import supertest from "supertest";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeSvcPath = path.join(__dirname, "../../src/services/route.js");
const consumerSvcPath = path.join(__dirname, "../../src/services/consumer.js");
const historyPath = path.join(__dirname, "../../src/middlewares/history.js");

// { mount segment used in app.js, entity file name under src/entities/ }
const RESOURCES = [
  { name: "applications", entity: "application" },
  { name: "conditions", entity: "condition" },
  { name: "fields", entity: "field" },
  { name: "methods", entity: "method" },
  { name: "operations", entity: "operation" },
  { name: "permissions", entity: "permission" },
  { name: "resources", entity: "resource" },
  { name: "roles", entity: "role" },
  { name: "scopes", entity: "scope" },
  { name: "services", entity: "service" },
];
// method has no history/add/archive; permission's history/archive shape differs (see dedicated blocks)
const STANDARD_CRUD = RESOURCES.filter(
  ({ entity }) => entity !== "method" && entity !== "permission",
);
// method has no add route
const HAS_ADD = RESOURCES.filter(({ entity }) => entity !== "method");

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

// One spy set per entity, tagging rows/schema with the entity name so cross-resource wiring bugs surface.
const entityGets = {};
const entityAdds = {};
const entityUpdates = {};
const entityArchives = {};
const entityDeletes = {};
for (const { entity } of RESOURCES) {
  const get = jest.fn((_req, res, next) => {
    res.locals.rows = [{ id: 1, entity }];
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
  const del = jest.fn((req, res, next) => {
    res.locals.rows = req.body.rows ?? [];
    res.locals.total = res.locals.rows.length;
    next();
  });
  entityGets[entity] = get;
  entityAdds[entity] = addArraySubstack;
  entityUpdates[entity] = updateArraySubstack;
  entityArchives[entity] = archive;
  entityDeletes[entity] = del;
  jest.unstable_mockModule(
    path.join(__dirname, `../../src/entities/${entity}.js`),
    () => ({
      __esModule: true,
      default: {
        get,
        addArraySubstack,
        updateArraySubstack,
        archive,
        delete: del,
        properties: [
          { key: entity, type: "string", min: null, max: null, operations: ["SELECT"], requiredFor: [], isFilterable: true, isPrivate: false },
          { key: `${entity}Secret`, type: "string", min: null, max: null, operations: ["SELECT"], requiredFor: [], isFilterable: true, isPrivate: true },
        ],
      },
    }),
  );
}

// history.get(tableName) is called at router module-load time, so the middleware must be created eagerly per call.
const historyMiddlewares = {};
const historyGet = jest.fn((tableName) => {
  const mw = jest.fn((_req, res, next) => {
    res.locals.rows = [{ id: 1, operation: "UPDATE", record: { id: 1, entity: tableName } }];
    res.locals.total = 1;
    next();
  });
  historyMiddlewares[tableName] = mw;
  return mw;
});
const permissionHistoryMiddleware = jest.fn((_req, res, next) => {
  res.locals.rows = [
    { id: 1, operation: "UPDATE", record: { id: 1, entity: "permission" } },
  ];
  res.locals.total = 1;
  next();
});
const historyGetByField = jest.fn(() => permissionHistoryMiddleware);
jest.unstable_mockModule(historyPath, () => ({
  __esModule: true,
  default: { get: historyGet, getByField: historyGetByField },
}));

describe.each(RESOURCES)("POST /gateway/$name/search", ({ name, entity }) => {
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
      .mockReturnValue({ id: 1, url: `/gateway/${name}/search`, protected: false });
    consumerSvc.getOne.mockReset();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app).post(`/gateway/${name}/search`).send({});

    expect(res.status).toBe(401);
    expect(entityGets[entity]).not.toHaveBeenCalled();
  });

  it("routes an authenticated request to its own entity", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

    const res = await supertest(app)
      .post(`/gateway/${name}/search`)
      .set("Authorization", "Bearer valid-token")
      .send({});

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ rows: [{ id: 1, entity }], total: 1 });
    expect(entityGets[entity]).toHaveBeenCalledTimes(1);
  });
});

describe.each(STANDARD_CRUD)(
  "GET /gateway/$name/:id/history",
  ({ name, entity }) => {
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
        .mockReturnValue({ id: 1, url: `/gateway/${name}/1/history`, protected: false });
      consumerSvc.getOne.mockReset();
      historyMiddlewares[entity].mockClear();
    });

    it("rejects an unauthenticated request", async () => {
      const res = await supertest(app).get(`/gateway/${name}/1/history`);

      expect(res.status).toBe(401);
      expect(historyMiddlewares[entity]).not.toHaveBeenCalled();
    });

    it("routes an authenticated request to its own entity's history", async () => {
      consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

      const res = await supertest(app)
        .get(`/gateway/${name}/1/history`)
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(200);
      expect(res.body.rows[0].record.entity).toBe(entity);
      expect(historyMiddlewares[entity]).toHaveBeenCalledTimes(1);
    });
  },
);

describe.each(HAS_ADD)("POST /gateway/$name (add)", ({ name, entity }) => {
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
      .mockReturnValue({ id: 1, url: `/gateway/${name}`, protected: false });
    consumerSvc.getOne.mockReset().mockReturnValue({ id: 1, roles: [1] });
    entityAdds[entity].mockClear();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app)
      .post(`/gateway/${name}`)
      .send({ rows: [{ id: 1 }] });

    expect(res.status).toBe(401);
    expect(entityAdds[entity]).not.toHaveBeenCalled();
  });

  it("routes an authenticated request to its own entity", async () => {
    const rows = [{ id: 1 }];

    const res = await supertest(app)
      .post(`/gateway/${name}`)
      .set("Authorization", "Bearer valid-token")
      .send({ rows });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ rows, total: 1 });
    expect(entityAdds[entity]).toHaveBeenCalledTimes(1);
  });
});

describe.each(RESOURCES)("PUT /gateway/$name (update)", ({ name, entity }) => {
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
      .mockReturnValue({ id: 1, url: `/gateway/${name}`, protected: false });
    consumerSvc.getOne.mockReset().mockReturnValue({ id: 1, roles: [1] });
    entityUpdates[entity].mockClear();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app)
      .put(`/gateway/${name}`)
      .send({ rows: [{ id: 1 }] });

    expect(res.status).toBe(401);
    expect(entityUpdates[entity]).not.toHaveBeenCalled();
  });

  it("routes an authenticated request to its own entity", async () => {
    const rows = [{ id: 1 }];

    const res = await supertest(app)
      .put(`/gateway/${name}`)
      .set("Authorization", "Bearer valid-token")
      .send({ rows });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ rows, total: 1 });
    expect(entityUpdates[entity]).toHaveBeenCalledTimes(1);
  });
});

describe.each(STANDARD_CRUD)(
  "POST /gateway/$name/archive",
  ({ name, entity }) => {
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
        .mockReturnValue({ id: 1, url: `/gateway/${name}/archive`, protected: false });
      consumerSvc.getOne.mockReset().mockReturnValue({ id: 1, roles: [1] });
      entityArchives[entity].mockClear();
    });

    it("rejects an unauthenticated request", async () => {
      const res = await supertest(app)
        .post(`/gateway/${name}/archive`)
        .send({ rows: [{ id: 1 }] });

      expect(res.status).toBe(401);
      expect(entityArchives[entity]).not.toHaveBeenCalled();
    });

    it("routes an authenticated request to its own entity", async () => {
      const rows = [{ id: 1 }];

      const res = await supertest(app)
        .post(`/gateway/${name}/archive`)
        .set("Authorization", "Bearer valid-token")
        .send({ rows });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ rows, total: 1 });
      expect(entityArchives[entity]).toHaveBeenCalledTimes(1);
    });
  },
);

describe.each(RESOURCES)("GET /gateway/$name/schema", ({ name, entity }) => {
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
      .mockReturnValue({ id: 1, url: `/gateway/${name}/schema`, protected: false });
    consumerSvc.getOne.mockReset();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app).get(`/gateway/${name}/schema`);

    expect(res.status).toBe(401);
  });

  it("returns only its own entity's non-private fields", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

    const res = await supertest(app)
      .get(`/gateway/${name}/schema`)
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ rows: [{ key: entity }], total: 1 });
  });
});

// permission.js has its own history shape: GET /history/route/:routeId (history.getByField), not /:id/history.
describe("GET /gateway/permissions/history/route/:routeId", () => {
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
    routeSvc.getOne.mockReset().mockReturnValue({
      id: 1,
      url: "/gateway/permissions/history/route/1",
      protected: false,
    });
    consumerSvc.getOne.mockReset();
    permissionHistoryMiddleware.mockClear();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app).get(
      "/gateway/permissions/history/route/1",
    );

    expect(res.status).toBe(401);
    expect(permissionHistoryMiddleware).not.toHaveBeenCalled();
  });

  it("returns grouped history rows once authenticated", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

    const res = await supertest(app)
      .get("/gateway/permissions/history/route/1")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(200);
    expect(res.body.rows[0].record.entity).toBe("permission");
    expect(permissionHistoryMiddleware).toHaveBeenCalledTimes(1);
  });
});

// permission.js uses DELETE / (uncheck route) instead of POST /archive.
describe("DELETE /gateway/permissions", () => {
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
      .mockReturnValue({ id: 1, url: "/gateway/permissions", protected: false });
    consumerSvc.getOne.mockReset().mockReturnValue({ id: 1, roles: [1] });
    entityDeletes.permission.mockClear();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app)
      .delete("/gateway/permissions")
      .send({ rows: [{ id: 1 }] });

    expect(res.status).toBe(401);
    expect(entityDeletes.permission).not.toHaveBeenCalled();
  });

  it("deletes via the entity handler", async () => {
    const rows = [{ id: 1 }];

    const res = await supertest(app)
      .delete("/gateway/permissions")
      .set("Authorization", "Bearer valid-token")
      .send({ rows });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ rows, total: 1 });
    expect(entityDeletes.permission).toHaveBeenCalledTimes(1);
  });
});
