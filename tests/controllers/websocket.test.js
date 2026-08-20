/**
 * @jest-environment node
 */

import nodeHttp from "node:http";
import { jest } from "@jest/globals";

jest.unstable_mockModule("@dwtechs/winstan", () => ({
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const parseBearer = jest.fn((req, res, next) => {
  if (!res.locals.route?.protected) return next();
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return next({ statusCode: 401, message: "Unauthorized" });
  res.locals.tokens = {
    access: header.slice(7),
    decodedAccess: { iss: "42" },
  };
  next();
});
const decodeAccess = jest.fn((_req, _res, next) => next());
jest.unstable_mockModule("@dwtechs/toker-express", () => ({
  parseBearer,
  decodeAccess,
  decodeRefresh: jest.fn((_req, _res, next) => next()),
  createTokens: jest.fn(),
  refreshTokens: jest.fn(),
  clearRefreshCookie: jest.fn(),
}));

jest.unstable_mockModule("../../src/services/role.js", () => ({
  __esModule: true,
  default: {
    getOne: jest.fn(() => ({
      permissions: new Map([
        [
          9,
          {
            operations: [1],
            scopes: null,
            conditions: null,
            _fieldsSet: null,
          },
        ],
      ]),
    })),
    init: jest.fn(),
  },
}));

const getServiceBaseUrl = jest.fn();
jest.unstable_mockModule("../../src/services/route.js", () => ({
  __esModule: true,
  default: {
    getOne: jest.fn(),
    getServiceBaseUrl,
    init: jest.fn(),
    deleteArchived: jest.fn(),
  },
}));
jest.unstable_mockModule("../../src/services/consumer.js", () => ({
  __esModule: true,
  default: {
    getOne: jest.fn(() => ({ id: 1, nickname: "alice", roles: [1] })),
    init: jest.fn(),
    deleteArchived: jest.fn(),
  },
}));
const proxyLimiter = jest.fn((_req, _res, next) => next());
jest.unstable_mockModule("../../src/middlewares/rate-limit.js", () => ({
  proxyLimiter,
}));

const corsHas = jest.fn(() => true);
jest.unstable_mockModule("../../src/services/cors.js", () => ({
  __esModule: true,
  default: {
    has: corsHas,
    getCredentials: jest.fn(() => true),
    init: jest.fn(),
  },
}));

const WS_KEY = "dGhlIHNhbXBsZSBub25jZQ==";
const WS_ACCEPT = "s3pPLMBiTxaQ9kYGzzhZRbK+xOo=";

function openUpgrade(port, pathName, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const req = nodeHttp.request({
      hostname: "127.0.0.1",
      port,
      path: pathName,
      headers: {
        Connection: "Upgrade",
        Upgrade: "websocket",
        "Sec-WebSocket-Key": WS_KEY,
        "Sec-WebSocket-Version": "13",
        ...extraHeaders,
      },
    });
    req.on("upgrade", (res, socket, head) =>
      resolve({ res, socket, head, status: res.statusCode }),
    );
    req.on("response", (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () =>
        resolve({
          res,
          socket: null,
          head: Buffer.alloc(0),
          status: res.statusCode,
          body: Buffer.concat(chunks).toString(),
        }),
      );
    });
    req.on("error", reject);
    req.end();
  });
}

describe("handleUpgrade", () => {
  let handleUpgrade;
  let routeSvc;
  let gateway;
  let gatewayPort;
  let upstream;
  let upstreamUrl;
  let upstreamHeaders;
  let upstreamPath;
  /** @type {import('node:net').Socket[]} */
  const sockets = [];

  const publicRoute = {
    id: 9,
    url: "/events",
    protected: false,
    serviceName: "events",
    resourceName: "events",
    operationId: [1],
  };

  beforeAll(async () => {
    ({ handleUpgrade } = await import("../../src/controllers/websocket.js"));
    ({ default: routeSvc } = await import("../../src/services/route.js"));

    upstream = nodeHttp.createServer();
    upstream.on("upgrade", (req, socket, head) => {
      sockets.push(socket);
      upstreamHeaders = req.headers;
      upstreamPath = req.url;
      socket.write(
        `HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${WS_ACCEPT}\r\n\r\n`,
      );
      if (head.length) socket.write(head);
      socket.on("data", (chunk) => socket.write(chunk));
    });
    await new Promise((resolve) => upstream.listen(0, "127.0.0.1", resolve));
    const address = upstream.address();
    upstreamUrl = `http://127.0.0.1:${address.port}`;

    gateway = nodeHttp.createServer();
    gateway.on("upgrade", (req, socket, head) => {
      sockets.push(socket);
      handleUpgrade(req, socket, head);
    });
    await new Promise((resolve) => gateway.listen(0, "127.0.0.1", resolve));
    gatewayPort = gateway.address().port;
  });

  afterAll(() => {
    for (const socket of sockets) socket.destroy();
    gateway.close();
    upstream.close();
  });

  beforeEach(() => {
    routeSvc.getOne.mockReset().mockReturnValue(publicRoute);
    getServiceBaseUrl.mockReset().mockReturnValue(upstreamUrl);
    corsHas.mockReset().mockReturnValue(true);
    proxyLimiter.mockReset().mockImplementation((_req, _res, next) => next());
    upstreamHeaders = null;
    upstreamPath = null;
  });

  it("pipes an authorized websocket handshake to the upstream service", async () => {
    const result = await openUpgrade(gatewayPort, "/events");

    expect(result.status).toBe(101);
    expect(result.res.headers.upgrade).toBe("websocket");
    expect(result.res.headers["sec-websocket-accept"]).toBe(WS_ACCEPT);
    expect(getServiceBaseUrl).toHaveBeenCalledWith("events");
    expect(upstreamHeaders.authorization).toBeUndefined();
    expect(upstreamHeaders.cookie).toBeUndefined();
    expect(upstreamHeaders.upgrade).toBe("websocket");

    await new Promise((resolve, reject) => {
      result.socket.once("data", (chunk) => {
        try {
          expect(chunk.toString()).toBe("ping");
          result.socket.end();
          resolve();
        } catch (err) {
          reject(err);
        }
      });
      result.socket.write("ping");
    });
    result.socket.destroy();
  });

  it("reads the access token from the query string and does not forward it", async () => {
    routeSvc.getOne.mockReturnValue({ ...publicRoute, protected: true });

    const result = await openUpgrade(
      gatewayPort,
      "/events?access_token=secret-jwt&keep=1",
    );

    expect(result.status).toBe(101);
    expect(upstreamHeaders.authorization).toBeUndefined();
    expect(upstreamPath).toBe("/events?keep=1");
    result.socket?.destroy();
  });

  it("rejects a handshake when the route is not registered", async () => {
    routeSvc.getOne.mockReturnValue(undefined);

    const result = await openUpgrade(gatewayPort, "/events");

    expect(result.status).toBe(404);
    expect(result.socket).toBeNull();
  });

  it("rejects a handshake that fails the CORS origin whitelist", async () => {
    corsHas.mockReturnValue(false);

    const result = await openUpgrade(gatewayPort, "/events", {
      Origin: "https://evil.example",
    });

    expect(result.status).toBe(403);
    expect(result.socket).toBeNull();
  });

  it("rejects a protected handshake without a bearer token", async () => {
    routeSvc.getOne.mockReturnValue({ ...publicRoute, protected: true });

    const result = await openUpgrade(gatewayPort, "/events");

    expect(result.status).toBe(401);
    expect(result.socket).toBeNull();
  });

  it("rejects a handshake when the proxy rate limiter returns 429", async () => {
    proxyLimiter.mockImplementation((_req, _res, next) => {
      next({ statusCode: 429, message: "HTTP(429): Too Many Requests" });
    });

    const result = await openUpgrade(gatewayPort, "/events");

    expect(proxyLimiter).toHaveBeenCalled();
    expect(result.status).toBe(429);
    expect(result.body).toBe("HTTP(429): Too Many Requests");
    expect(result.socket).toBeNull();
    expect(getServiceBaseUrl).not.toHaveBeenCalled();
  });
});
