/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

// Invoke the lazy debug callback (like the real winstan) so logStart/logEnd's
// message-building branches get exercised instead of skipped as "never called".
const debug = jest.fn((cb) => cb());
jest.unstable_mockModule("@dwtechs/winstan", () => ({
  log: { debug, info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

describe("http.query", () => {
  let query;
  let fetchMock;

  beforeAll(async () => {
    const module = await import("../../src/utils/http.js");
    query = module.default.query;
  });

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
    debug.mockClear();
  });

  function jsonResponse(status, data, ok = status >= 200 && status < 300) {
    return {
      status,
      ok,
      statusText: "Status",
      json: jest.fn().mockResolvedValue(data),
    };
  }

  it("should send a GET request with query params appended to the URL", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { id: 1 }));

    const result = await query("get", "http://svc/users", { id: 1 });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://svc/users?id=1",
      expect.objectContaining({ method: "get" }),
    );
    expect(result).toEqual({ status: 200, data: { id: 1 } });
  });

  it("should not append a query string when params are omitted", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, {}));

    await query("get", "http://svc/users");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://svc/users",
      expect.anything(),
    );
  });

  it("should JSON-encode the body for verbs that support one", async () => {
    fetchMock.mockResolvedValue(jsonResponse(201, { id: 2 }));

    await query("post", "http://svc/users", undefined, { name: "a" });

    const init = fetchMock.mock.calls[0][1];
    expect(init.method).toBe("post");
    expect(init.body).toBe(JSON.stringify({ name: "a" }));
    expect(init.headers["Content-Type"]).toBe("application/json");
  });

  it("should not attach a body for verbs that don't support one", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, {}));

    await query("get", "http://svc/users", undefined, { name: "a" });

    expect(fetchMock.mock.calls[0][1].body).toBeUndefined();
  });

  it("should merge custom headers with the default Content-Type", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, {}));

    await query("get", "http://svc/users", undefined, undefined, {
      Authorization: "Bearer x",
    });

    expect(fetchMock.mock.calls[0][1].headers).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer x",
    });
  });

  it("should not parse a body on 204 No Content", async () => {
    const res = jsonResponse(204, null);
    fetchMock.mockResolvedValue(res);

    const result = await query("delete", "http://svc/users/1");

    expect(res.json).not.toHaveBeenCalled();
    expect(result).toEqual({ status: 204, data: null });
  });

  it("should resolve to null data when the response body isn't valid JSON", async () => {
    const res = {
      status: 200,
      ok: true,
      statusText: "OK",
      json: jest.fn().mockRejectedValue(new Error("bad json")),
    };
    fetchMock.mockResolvedValue(res);

    const result = await query("get", "http://svc/users");

    expect(result).toEqual({ status: 200, data: null });
  });

  it("should throw an error carrying the status code on a non-ok response", async () => {
    fetchMock.mockResolvedValue(jsonResponse(404, { message: "not found" }));

    await expect(query("get", "http://svc/users/1")).rejects.toMatchObject({
      status: 404,
      msg: expect.stringContaining("404"),
    });
  });

  it("should default the status to 503 when fetch rejects with no status", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));

    await expect(query("get", "http://svc/users")).rejects.toMatchObject({
      status: 503,
      msg: expect.stringContaining("network down"),
    });
  });

  it("should preserve an existing status on a rejected error", async () => {
    const err = new Error("boom");
    err.status = 418;
    fetchMock.mockRejectedValue(err);

    await expect(query("get", "http://svc/users")).rejects.toMatchObject({
      status: 418,
    });
  });

  it("should log a debug message with params, data and header keys on success", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { id: 1 }));

    await query(
      "post",
      "http://svc/users",
      { page: 1 },
      { name: "a" },
      {
        Authorization: "Bearer x",
      },
    );

    expect(debug).toHaveBeenCalledTimes(2);
    expect(debug.mock.calls[0][0]()).toEqual(
      expect.stringContaining("headers: [Authorization]"),
    );
    expect(debug.mock.calls[1][0]()).toEqual(
      expect.stringContaining("status: 200"),
    );
  });

  it("should log null params/data and headers when none are given", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, {}));

    await query("get", "http://svc/users");

    expect(debug.mock.calls[0][0]()).toEqual(
      expect.stringContaining("headers: [null]"),
    );
  });
});
