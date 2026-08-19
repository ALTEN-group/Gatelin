/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
// proxy.js is the catch-all mounted at "/" after every named resource route in app.js.
import { jest } from "@jest/globals";
import supertest from "supertest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeSvcPath = path.join(__dirname, "../../src/services/route.js");
const consumerSvcPath = path.join(__dirname, "../../src/services/consumer.js");
const httpUtilPath = path.join(__dirname, "../../src/utils/http.js");

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

const getServiceBaseUrl = jest.fn(() => "http://ms-downstream:3000");
jest.unstable_mockModule(routeSvcPath, () => ({
  __esModule: true,
  default: {
    getOne: jest.fn(),
    getServiceBaseUrl,
    init: jest.fn(),
    deleteArchived: jest.fn(),
  },
}));
jest.unstable_mockModule(consumerSvcPath, () => ({
  __esModule: true,
  default: { getOne: jest.fn(), init: jest.fn(), deleteArchived: jest.fn() },
}));

const query = jest.fn();
jest.unstable_mockModule(httpUtilPath, () => ({
  __esModule: true,
  default: { query },
}));

describe("catch-all proxy route", () => {
  let app;
  let routeSvc;
  let consumerSvc;
  const proxiedRoute = {
    id: 1,
    url: "/downstream/ping",
    protected: false,
    serviceName: "downstream",
  };

  beforeAll(async () => {
    ({ default: routeSvc } = await import("../../src/services/route.js"));
    ({ default: consumerSvc } = await import("../../src/services/consumer.js"));
    ({ default: app } = await import("../../src/app.js"));
  });

  beforeEach(() => {
    routeSvc.getOne.mockReset().mockReturnValue(proxiedRoute);
    getServiceBaseUrl.mockClear();
    consumerSvc.getOne.mockReset();
    query.mockReset();
  });

  it("rejects an unauthenticated request before forwarding", async () => {
    const res = await supertest(app).get("/downstream/ping");

    expect(res.status).toBe(401);
    expect(query).not.toHaveBeenCalled();
  });

  it("forwards an authenticated request to the resolved service base URL", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });
    query.mockResolvedValue({ status: 200, data: { pong: true } });

    const res = await supertest(app)
      .get("/downstream/ping")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ pong: true });
    expect(getServiceBaseUrl).toHaveBeenCalledWith("downstream");
    expect(query).toHaveBeenCalledWith(
      "GET",
      "http://ms-downstream:3000/downstream/ping",
      undefined,
      undefined,
      {},
    );
  });

  it("forwards a POST body and preserves the query string in the target URL", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });
    query.mockResolvedValue({ status: 201, data: { id: 1 } });

    const res = await supertest(app)
      .post("/downstream/ping?foo=bar")
      .set("Authorization", "Bearer valid-token")
      .send({ hello: "world" });

    expect(res.status).toBe(201);
    // forwardToService mirrors the client Content-Type upstream so HTML form
    // posts stay urlencoded instead of being rewritten as JSON.
    expect(query).toHaveBeenCalledWith(
      "POST",
      "http://ms-downstream:3000/downstream/ping?foo=bar",
      undefined,
      { hello: "world" },
      { "Content-Type": "application/json" },
    );
  });

  it("forwards the downstream response status as-is", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });
    query.mockResolvedValue({ status: 404, data: { message: "not found" } });

    const res = await supertest(app)
      .get("/downstream/ping")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "not found" });
  });

  it("passes downstream failures to the error handler instead of hanging", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });
    query.mockRejectedValue(new Error("connect ECONNREFUSED"));

    const res = await supertest(app)
      .get("/downstream/ping")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBeGreaterThanOrEqual(500);
  });
});
