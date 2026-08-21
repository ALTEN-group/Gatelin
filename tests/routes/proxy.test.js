/**
 * @jest-environment node
 */

import nodeHttp from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
// proxy.js is the catch-all mounted at "/" after every named resource route in app.js.
import { jest } from "@jest/globals";
import supertest from "supertest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeSvcPath = path.join(__dirname, "../../src/services/route.js");
const consumerSvcPath = path.join(__dirname, "../../src/services/consumer.js");

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

const getServiceBaseUrl = jest.fn();
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

function rawBufferParser(res, callback) {
  const chunks = [];
  res.on("data", (chunk) => chunks.push(chunk));
  res.on("end", () => callback(null, Buffer.concat(chunks)));
}

describe("catch-all proxy route", () => {
  let app;
  let routeSvc;
  let consumerSvc;
  let upstream;
  let upstreamUrl;
  let upstreamRequest;
  let upstreamResponse;
  let gatelin;
  let gatelinPort;
  const proxiedRoute = {
    id: 1,
    url: "/downstream/ping",
    protected: false,
    serviceName: "downstream",
  };

  beforeAll(async () => {
    upstream = nodeHttp.createServer((req, res) => {
      const chunks = [];
      let firstByteAt;
      req.on("data", (chunk) => {
        if (firstByteAt === undefined) firstByteAt = Date.now();
        chunks.push(chunk);
      });
      req.on("end", () => {
        upstreamRequest = {
          body: Buffer.concat(chunks),
          headers: req.headers,
          method: req.method,
          url: req.url,
          firstByteAt,
          endAt: Date.now(),
        };
        const status = upstreamResponse.status ?? 200;
        const headers = {
          "content-type": "application/json",
          ...upstreamResponse.headers,
        };
        res.writeHead(status, headers);
        if (Buffer.isBuffer(upstreamResponse.body)) {
          res.end(upstreamResponse.body);
          return;
        }
        res.end(JSON.stringify(upstreamResponse.body));
      });
    });
    await new Promise((resolve) => upstream.listen(0, "127.0.0.1", resolve));
    const address = upstream.address();
    upstreamUrl = `http://127.0.0.1:${address.port}`;

    ({ default: routeSvc } = await import("../../src/services/route.js"));
    ({ default: consumerSvc } = await import("../../src/services/consumer.js"));
    ({ default: app } = await import("../../src/app.js"));

    gatelin = nodeHttp.createServer(app);
    await new Promise((resolve) => gatelin.listen(0, "127.0.0.1", resolve));
    gatelinPort = gatelin.address().port;
  });

  afterAll(async () => {
    await new Promise((resolve) => gatelin.close(resolve));
    await new Promise((resolve) => upstream.close(resolve));
  });

  beforeEach(() => {
    routeSvc.getOne.mockReset().mockReturnValue(proxiedRoute);
    getServiceBaseUrl.mockReset().mockReturnValue(upstreamUrl);
    consumerSvc.getOne.mockReset();
    upstreamRequest = null;
    upstreamResponse = { status: 200, body: { pong: true } };
  });

  it("rejects an unauthenticated request before forwarding", async () => {
    const res = await supertest(app).get("/downstream/ping");

    expect(res.status).toBe(401);
    expect(getServiceBaseUrl).not.toHaveBeenCalled();
  });

  it("forwards an authenticated request to the resolved service base URL", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });

    const res = await supertest(app)
      .get("/downstream/ping")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ pong: true });
    expect(getServiceBaseUrl).toHaveBeenCalledWith("downstream");
    expect(upstreamRequest.method).toBe("GET");
    expect(upstreamRequest.url).toBe("/downstream/ping");
    // The gateway bearer token authenticates to Gatelin and must not leak.
    expect(upstreamRequest.headers.authorization).toBeUndefined();
  });

  it("forwards a POST body and preserves the query string in the target URL", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });
    upstreamResponse = { status: 201, body: { id: 1 } };

    const res = await supertest(app)
      .post("/downstream/ping?foo=bar")
      .set("Authorization", "Bearer valid-token")
      .send({ hello: "world" });

    expect(res.status).toBe(201);
    expect(upstreamRequest.url).toBe("/downstream/ping?foo=bar");
    expect(upstreamRequest.headers["content-type"]).toMatch(
      /^application\/json/,
    );
    expect(JSON.parse(upstreamRequest.body.toString())).toEqual({
      hello: "world",
    });
  });

  it("forwards a binary request body through the Express stack byte-for-byte", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });
    const body = Buffer.from([0, 10, 127, 128, 255]);

    const res = await supertest(app)
      .post("/downstream/ping")
      .set("Authorization", "Bearer valid-token")
      .set("content-type", "application/octet-stream")
      .send(body);

    expect(res.status).toBe(200);
    expect(upstreamRequest.headers["content-type"]).toBe(
      "application/octet-stream",
    );
    expect(upstreamRequest.body).toEqual(body);
  });

  it("forwards a multipart body through the Express stack byte-for-byte", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });
    const boundary = "gatelin-boundary";
    const multipart = Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.bin"\r\nContent-Type: application/octet-stream\r\n\r\n\u0000\u0001binary\r\n--${boundary}--\r\n`,
    );

    const res = await supertest(app)
      .post("/downstream/ping")
      .set("Authorization", "Bearer valid-token")
      .set("content-type", `multipart/form-data; boundary=${boundary}`)
      .send(multipart);

    expect(res.status).toBe(200);
    expect(upstreamRequest.headers["content-type"]).toBe(
      `multipart/form-data; boundary=${boundary}`,
    );
    expect(upstreamRequest.body).toEqual(multipart);
  });

  it("does not apply the /gatelin JSON body limit to proxied binary uploads", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });
    const body = Buffer.alloc(120 * 1024, 0xab);

    const res = await supertest(app)
      .post("/downstream/ping")
      .set("Authorization", "Bearer valid-token")
      .set("content-type", "application/octet-stream")
      .send(body);

    expect(res.status).toBe(200);
    expect(upstreamRequest.body.length).toBe(body.length);
    expect(upstreamRequest.body).toEqual(body);
  });

  it("relays a binary upstream response through the Express stack unchanged", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });
    upstreamResponse = {
      status: 206,
      headers: {
        "content-type": "application/octet-stream",
        "x-upstream": "binary-service",
      },
      body: Buffer.from([0, 1, 2, 255]),
    };

    const res = await supertest(app)
      .get("/downstream/ping")
      .set("Authorization", "Bearer valid-token")
      .buffer(true)
      .parse(rawBufferParser);

    expect(res.status).toBe(206);
    expect(res.body).toEqual(Buffer.from([0, 1, 2, 255]));
    expect(res.headers["content-type"]).toBe("application/octet-stream");
    expect(res.headers["x-upstream"]).toBe("binary-service");
  });

  it("forwards the first chunked request byte before the client finishes the body", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });
    const first = Buffer.from([0, 1, 2, 255]);
    const rest = Buffer.alloc(64, 7);
    const pauseMs = 80;
    let restWrittenAt;

    const result = await new Promise((resolve, reject) => {
      const req = nodeHttp.request(
        {
          hostname: "127.0.0.1",
          port: gatelinPort,
          path: "/downstream/ping",
          method: "POST",
          headers: {
            authorization: "Bearer valid-token",
            "content-type": "application/octet-stream",
            "transfer-encoding": "chunked",
          },
        },
        (res) => {
          const chunks = [];
          res.on("data", (chunk) => chunks.push(chunk));
          res.on("end", () =>
            resolve({
              status: res.statusCode,
              body: Buffer.concat(chunks),
            }),
          );
        },
      );
      req.on("error", reject);
      req.write(first);
      setTimeout(() => {
        restWrittenAt = Date.now();
        req.write(rest);
        req.end();
      }, pauseMs);
    });

    expect(result.status).toBe(200);
    expect(upstreamRequest.body).toEqual(Buffer.concat([first, rest]));
    expect(upstreamRequest.firstByteAt).toBeDefined();
    expect(upstreamRequest.firstByteAt).toBeLessThan(restWrittenAt);
  });

  it("forwards the downstream response status as-is", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });
    upstreamResponse = { status: 404, body: { message: "not found" } };

    const res = await supertest(app)
      .get("/downstream/ping")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "not found" });
  });

  it("passes downstream failures to the error handler instead of hanging", async () => {
    consumerSvc.getOne.mockReturnValue({ id: 1, roles: [1] });
    getServiceBaseUrl.mockReturnValue("http://127.0.0.1:1");

    const res = await supertest(app)
      .get("/downstream/ping")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBeGreaterThanOrEqual(500);
  });
});
