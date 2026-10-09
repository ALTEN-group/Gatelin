/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
// Parameterized wiring check for the generic CRUD resources: each mounts
// `...checkRequest, <router>, send` in app.js with `router.post("/search", XEnt.get)`.
// Also covers /:id/history, add, update, archive and /schema for the resources that
// expose them (method has no history/add/archive; permission has a differently
// shaped history route and DELETE instead of archive - see the dedicated blocks below).
import { jest } from "@jest/globals";
import supertest from "supertest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeSvcPath = path.join(__dirname, "../../src/services/route.js");
const consumerSvcPath = path.join(__dirname, "../../src/services/consumer.js");
const roleSvcPath = path.join(__dirname, "../../src/services/role.js");
const scopeSvcPath = path.join(__dirname, "../../src/services/scope.js");

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
// Mutating routes reload these caches so admin edits take effect without a
// restart; without the mocks each write would try to reach Postgres.
jest.unstable_mockModule(roleSvcPath, () => ({
  __esModule: true,
  default: { getOne: jest.fn(), init: jest.fn(), deleteArchived: jest.fn() },
}));
jest.unstable_mockModule(scopeSvcPath, () => ({
  __esModule: true,
  default: {
    getValues: jest.fn(() => []),
    init: jest.fn(),
    deleteArchived: jest.fn(),
  },
}));

// One spy set per entity, tagging rows/schema with the entity name so cross-resource wiring bugs surface.
const entityGets = {};
const entityAdds = {};
const entityUpdates = {};
const entityArchives = {};
const entityDeletes = {};
// history middleware per entity, and the options each router passed to entity.history(...).
// Plain object on purpose: jest's clearMocks would wipe the arguments of a jest.fn
// recorded at router module-load time, before the tests run.
const historyMiddlewares = {};
const historyCalls = {};
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
  // SQLEntity.getHistory / history(options) come from @dwtechs/antity-pgsql
  const getHistory = jest.fn((_req, res, next) => {
    res.locals.rows = [
      { id: 1, operation: "UPDATE", record: { id: 1, entity } },
    ];
    res.locals.total = 1;
    next();
  });
  historyMiddlewares[entity] = getHistory;
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
        getHistory,
        history: (options) => {
          historyCalls[entity] = options;
          return getHistory;
        },
        properties: [
          {
            key: entity,
            type: "string",
            min: null,
            max: null,
            operations: ["SELECT"],
            requiredFor: [],
            isFilterable: true,
            isPrivate: false,
          },
          {
            key: `${entity}Secret`,
            type: "string",
            min: null,
            max: null,
            operations: ["SELECT"],
            requiredFor: [],
            isFilterable: true,
            isPrivate: true,
          },
        ],
      },
    }),
  );
}

describe.each(RESOURCES)("POST /gatelin/$name/search", ({ name, entity }) => {
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
      url: `/gatelin/${name}/search`,
      protected: false,
    });
    consumerSvc.getOne.mockReset();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app).post(`/gatelin/${name}/search`).send({});

    expect(res.status).toBe(401);
    expect(entityGets[entity]).not.toHaveBeenCalled();
  });

  it("routes an authenticated request to its own entity", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

    const res = await supertest(app)
      .post(`/gatelin/${name}/search`)
      .set("Authorization", "Bearer valid-token")
      .send({});

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ rows: [{ id: 1, entity }], total: 1 });
    expect(entityGets[entity]).toHaveBeenCalledTimes(1);
  });
});

describe.each(STANDARD_CRUD)(
  "GET /gatelin/$name/:id/history",
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
      routeSvc.getOne.mockReset().mockReturnValue({
        id: 1,
        url: `/gatelin/${name}/1/history`,
        protected: false,
      });
      consumerSvc.getOne.mockReset();
      historyMiddlewares[entity].mockClear();
    });

    it("rejects an unauthenticated request", async () => {
      const res = await supertest(app).get(`/gatelin/${name}/1/history`);

      expect(res.status).toBe(401);
      expect(historyMiddlewares[entity]).not.toHaveBeenCalled();
    });

    it("routes an authenticated request to its own entity's history", async () => {
      consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

      const res = await supertest(app)
        .get(`/gatelin/${name}/1/history`)
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(200);
      expect(res.body.rows[0].record.entity).toBe(entity);
      expect(historyMiddlewares[entity]).toHaveBeenCalledTimes(1);
    });
  },
);

describe.each(HAS_ADD)("POST /gatelin/$name (add)", ({ name, entity }) => {
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
      .mockReturnValue({ id: 1, url: `/gatelin/${name}`, protected: false });
    consumerSvc.getOne.mockReset().mockReturnValue({ id: 1, roles: [1] });
    entityAdds[entity].mockClear();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app)
      .post(`/gatelin/${name}`)
      .send({ rows: [{ id: 1 }] });

    expect(res.status).toBe(401);
    expect(entityAdds[entity]).not.toHaveBeenCalled();
  });

  it("routes an authenticated request to its own entity", async () => {
    const rows = [{ id: 1 }];

    const res = await supertest(app)
      .post(`/gatelin/${name}`)
      .set("Authorization", "Bearer valid-token")
      .send({ rows });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ rows, total: 1 });
    expect(entityAdds[entity]).toHaveBeenCalledTimes(1);
  });
});

describe.each(RESOURCES)("PUT /gatelin/$name (update)", ({ name, entity }) => {
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
      .mockReturnValue({ id: 1, url: `/gatelin/${name}`, protected: false });
    consumerSvc.getOne.mockReset().mockReturnValue({ id: 1, roles: [1] });
    entityUpdates[entity].mockClear();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app)
      .put(`/gatelin/${name}`)
      .send({ rows: [{ id: 1 }] });

    expect(res.status).toBe(401);
    expect(entityUpdates[entity]).not.toHaveBeenCalled();
  });

  it("routes an authenticated request to its own entity", async () => {
    const rows = [{ id: 1 }];

    const res = await supertest(app)
      .put(`/gatelin/${name}`)
      .set("Authorization", "Bearer valid-token")
      .send({ rows });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ rows, total: 1 });
    expect(entityUpdates[entity]).toHaveBeenCalledTimes(1);
  });
});

describe.each(STANDARD_CRUD)(
  "POST /gatelin/$name/archive",
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
      routeSvc.getOne.mockReset().mockReturnValue({
        id: 1,
        url: `/gatelin/${name}/archive`,
        protected: false,
      });
      consumerSvc.getOne.mockReset().mockReturnValue({ id: 1, roles: [1] });
      entityArchives[entity].mockClear();
    });

    it("rejects an unauthenticated request", async () => {
      const res = await supertest(app)
        .post(`/gatelin/${name}/archive`)
        .send({ rows: [{ id: 1 }] });

      expect(res.status).toBe(401);
      expect(entityArchives[entity]).not.toHaveBeenCalled();
    });

    it("routes an authenticated request to its own entity", async () => {
      const rows = [{ id: 1 }];

      const res = await supertest(app)
        .post(`/gatelin/${name}/archive`)
        .set("Authorization", "Bearer valid-token")
        .send({ rows });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ rows, total: 1 });
      expect(entityArchives[entity]).toHaveBeenCalledTimes(1);
    });
  },
);

describe.each(RESOURCES)("GET /gatelin/$name/schema", ({ name, entity }) => {
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
      url: `/gatelin/${name}/schema`,
      protected: false,
    });
    consumerSvc.getOne.mockReset();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app).get(`/gatelin/${name}/schema`);

    expect(res.status).toBe(401);
  });

  it("returns only its own entity's non-private fields", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

    const res = await supertest(app)
      .get(`/gatelin/${name}/schema`)
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      rows: [
        {
          key: entity,
          type: "string",
          min: null,
          max: null,
          operations: ["SELECT"],
          requiredFor: [],
          isFilterable: true,
        },
      ],
      total: 1,
    });
  });
});

// permission.js has its own history shape: GET /history/route/:routeId (permission history matched on routeId), not /:id/history.
describe("GET /gatelin/permissions/history/route/:routeId", () => {
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
      url: "/gatelin/permissions/history/route/1",
      protected: false,
    });
    consumerSvc.getOne.mockReset();
    historyMiddlewares.permission.mockClear();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app).get(
      "/gatelin/permissions/history/route/1",
    );

    expect(res.status).toBe(401);
    expect(historyMiddlewares.permission).not.toHaveBeenCalled();
  });

  it("returns grouped history rows once authenticated", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

    const res = await supertest(app)
      .get("/gatelin/permissions/history/route/1")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(200);
    expect(res.body.rows[0].record.entity).toBe("permission");
    expect(historyMiddlewares.permission).toHaveBeenCalledTimes(1);
  });
});

// permission.js uses DELETE / (uncheck route) instead of POST /archive.
describe("DELETE /gatelin/permissions", () => {
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
      url: "/gatelin/permissions",
      protected: false,
    });
    consumerSvc.getOne.mockReset().mockReturnValue({ id: 1, roles: [1] });
    entityDeletes.permission.mockClear();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await supertest(app)
      .delete("/gatelin/permissions")
      .send({ rows: [{ id: 1 }] });

    expect(res.status).toBe(401);
    expect(entityDeletes.permission).not.toHaveBeenCalled();
  });

  it("deletes via the entity handler", async () => {
    const rows = [{ id: 1 }];

    const res = await supertest(app)
      .delete("/gatelin/permissions")
      .set("Authorization", "Bearer valid-token")
      .send({ rows });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ rows, total: 1 });
    expect(entityDeletes.permission).toHaveBeenCalledTimes(1);
  });
});

describe("POST /gatelin/permissions/archive", () => {
  let app;
  let routeSvc;
  let consumerSvc;

  beforeAll(async () => {
    ({ default: routeSvc } = await import("../../src/services/route.js"));
    ({ default: consumerSvc } = await import("../../src/services/consumer.js"));
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne.mockReset();
    consumerSvc.getOne.mockReset().mockReturnValue({ id: 1, roles: [1] });
    entityDeletes.permission.mockClear();
  });

  it("should 404 when no deletePermissions archive route is registered", async () => {
    routeSvc.getOne.mockReturnValue(undefined);

    const res = await supertest(app)
      .post("/gatelin/permissions/archive")
      .set("Authorization", "Bearer valid-token")
      .send({ rows: [{ id: 1 }] });

    expect(res.status).toBe(404);
    expect(entityDeletes.permission).not.toHaveBeenCalled();
  });
});

// The entities of these resources read a view (roles, resources, ...), but the history
// trigger sits on the base table, so log.history records e.g. "role" - not "roles".
// Reading history for the entity's own table would silently return nothing.
describe("history tables", () => {
  beforeAll(async () => {
    await import("../../src/app.js");
  });

  it.each([
    ["role", ["role"]],
    ["resource", ["resource"]],
    ["scope", ["scope"]],
    ["field", ["field"]],
    ["condition", ["condition"]],
  ])("%s reads the history of its base table", (entity, tables) => {
    expect(historyCalls[entity]).toEqual({ tables });
  });

  it("permission reads permission and its condition assignments, matched on routeId", () => {
    expect(historyCalls.permission).toEqual({
      tables: ["permission", "permission_condition"],
      field: "routeId",
    });
  });
});
