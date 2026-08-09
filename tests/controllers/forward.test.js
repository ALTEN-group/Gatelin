/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const httpUtilPath = path.join(__dirname, "../../src/utils/http.js");
const routeSvcPath = path.join(__dirname, "../../src/services/route.js");

const query = jest.fn();
jest.unstable_mockModule(httpUtilPath, () => ({
  __esModule: true,
  default: { query },
}));

const getServiceBaseUrl = jest.fn();
jest.unstable_mockModule(routeSvcPath, () => ({
  __esModule: true,
  default: { getServiceBaseUrl },
}));

// forwardToService doesn't return its internal http.query() promise chain,
// so tests must flush the macrotask queue instead of awaiting its return value.
function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}

describe("forwardToService", () => {
  let forwardToService;
  let req, res, next;

  beforeAll(async () => {
    const module = await import("../../src/controllers/forward.js");
    forwardToService = module.forwardToService;
  });

  beforeEach(() => {
    query.mockReset();
    getServiceBaseUrl.mockReset();
    getServiceBaseUrl.mockReturnValue("http://ms_user-test:3000");
    req = {
      method: "GET",
      url: "/users/1",
      body: undefined,
      additionalHeaders: { "x-consumer-user-id": "1" },
    };
    res = {
      locals: { route: { serviceName: "user" } },
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it("should forward the request to the resolved service base URL and relay the response", async () => {
    query.mockResolvedValue({ status: 200, data: { id: 1 } });

    forwardToService(req, res, next);
    await flushPromises();

    expect(getServiceBaseUrl).toHaveBeenCalledWith("user");
    expect(query).toHaveBeenCalledWith(
      "GET",
      "http://ms_user-test:3000/users/1",
      undefined,
      undefined,
      { "x-consumer-user-id": "1" },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ id: 1 });
  });

  it("should forward the parsed request body for verbs like POST", async () => {
    req.method = "POST";
    req.body = { name: "a" };
    query.mockResolvedValue({ status: 201, data: { id: 2 } });

    forwardToService(req, res, next);
    await flushPromises();

    expect(query).toHaveBeenCalledWith(
      "POST",
      "http://ms_user-test:3000/users/1",
      undefined,
      { name: "a" },
      { "x-consumer-user-id": "1" },
    );
  });

  it("should preserve the query string while normalizing the path", async () => {
    req.url = "/users/1?foo=bar";
    query.mockResolvedValue({ status: 200, data: {} });

    forwardToService(req, res, next);
    await flushPromises();

    expect(query).toHaveBeenCalledWith(
      "GET",
      "http://ms_user-test:3000/users/1?foo=bar",
      undefined,
      undefined,
      expect.anything(),
    );
  });

  it("should resolve path traversal sequences before forwarding", async () => {
    req.url = "/users/../admin/1";
    query.mockResolvedValue({ status: 200, data: {} });

    forwardToService(req, res, next);
    await flushPromises();

    expect(query).toHaveBeenCalledWith(
      "GET",
      "http://ms_user-test:3000/admin/1",
      undefined,
      undefined,
      expect.anything(),
    );
  });

  it("should pass downstream failures to the error handler as a 502", async () => {
    query.mockRejectedValue(new Error("ECONNREFUSED"));

    forwardToService(req, res, next);
    await flushPromises();

    expect(next).toHaveBeenCalledWith({
      statusCode: 502,
      message: "ECONNREFUSED",
    });
    expect(res.status).not.toHaveBeenCalled();
  });
});
