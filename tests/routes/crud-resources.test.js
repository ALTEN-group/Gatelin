/**
 * @jest-environment node
 * Parameterized wiring check for the generic CRUD resources: each mounts
 * `...checkRequest, <router>, send` in app.js with `router.post("/search", XEnt.get)`.
 */

import { jest } from "@jest/globals";
import supertest from "supertest";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeSvcPath = path.join(__dirname, "../../src/services/route.js");
const consumerSvcPath = path.join(__dirname, "../../src/services/consumer.js");

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

// One "get" spy per entity, tagging its rows with the entity name so cross-resource wiring bugs surface.
const entityGets = {};
for (const { entity } of RESOURCES) {
  const get = jest.fn((_req, res, next) => {
    res.locals.rows = [{ id: 1, entity }];
    res.locals.total = 1;
    next();
  });
  entityGets[entity] = get;
  jest.unstable_mockModule(
    path.join(__dirname, `../../src/entities/${entity}.js`),
    () => ({
      __esModule: true,
      default: {
        get,
        addArraySubstack: jest.fn(),
        updateArraySubstack: jest.fn(),
        archive: jest.fn(),
        delete: jest.fn(),
        properties: [],
      },
    }),
  );
}

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
