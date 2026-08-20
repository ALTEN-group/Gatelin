// @ts-check

import nodeHttp, { STATUS_CODES } from "node:http";
import nodeHttps from "node:https";
import { corsMiddleware } from "../conf/cors.js";
import additionalHeaders from "../middlewares/mappers/additionalHeaders.js";
import { proxyLimiter } from "../middlewares/rate-limit.js";
import { checkRequest } from "../middlewares/validators/check-request.js";
import routeSvc from "../services/route.js";
import {
  copyHeaders,
  PRIVATE_REQUEST_HEADERS,
  resolveUpstreamUrl,
  upstreamTimeoutMs,
} from "../utils/proxy-headers.js";
import { runStack } from "../utils/run-stack.js";
import { agentFor } from "../utils/upstream-agent.js";

const WS_KEEP = ["connection", "upgrade"];

/**
 * @param {import('node:http').IncomingMessage} req
 */
function attachAccessToken(req) {
  if (headerHasBearer(req.headers.authorization)) return;
  let parsed;
  try {
    parsed = new URL(req.url ?? "/", "http://placeholder");
  } catch {
    return;
  }
  const token =
    parsed.searchParams.get("access_token") ?? parsed.searchParams.get("token");
  if (!token) return;
  req.headers.authorization = `Bearer ${token}`;
  parsed.searchParams.delete("access_token");
  parsed.searchParams.delete("token");
  req.url = `${parsed.pathname}${parsed.search}`;
}

/**
 * @param {string|string[]|undefined} value
 */
function headerHasBearer(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" && raw.toLowerCase().startsWith("bearer ");
}

/**
 * @param {import('node:stream').Duplex} socket
 * @param {number} statusCode
 * @param {string} message
 */
function rejectSocket(socket, statusCode, message) {
  if (socket.destroyed) return;
  const reason = STATUS_CODES[statusCode] ?? "Error";
  const body = message || reason;
  socket.write(
    `HTTP/1.1 ${statusCode} ${reason}\r\nContent-Type: text/plain\r\nConnection: close\r\nContent-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`,
  );
  socket.destroy();
}

/**
 * @param {import('node:http').IncomingHttpHeaders} headers
 * @param {number} statusCode
 * @param {string} [statusMessage]
 */
function rawHttpHead(headers, statusCode, statusMessage) {
  const reason = statusMessage || STATUS_CODES[statusCode] || "";
  let out = `HTTP/1.1 ${statusCode} ${reason}\r\n`;
  for (const [name, value] of Object.entries(headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) out += `${name}: ${item}\r\n`;
    } else out += `${name}: ${value}\r\n`;
  }
  return `${out}\r\n`;
}

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:stream').Duplex} socket
 * @param {Buffer} head
 */
export async function handleUpgrade(req, socket, head) {
  const upgrade = String(req.headers.upgrade ?? "").toLowerCase();
  if (upgrade !== "websocket") {
    rejectSocket(socket, 400, "Upgrade must be websocket");
    return;
  }

  req.method = req.method || "GET";
  req.originalUrl ??= req.url;
  attachAccessToken(req);

  const pathOnly = String(req.url ?? "").split("?")[0];
  if (pathOnly === "/gatelin" || pathOnly.startsWith("/gatelin/")) {
    rejectSocket(socket, 404, "Route not found");
    return;
  }

  const route = routeSvc.getOne(req.originalUrl, req.method);
  if (!route) {
    rejectSocket(socket, 404, "Route not found");
    return;
  }

  /** @type {import('express').Response} */
  const res = {
    locals: { route },
    statusCode: 200,
    setHeader() {},
    getHeader() {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    end() {},
  };

  try {
    await runStack(
      [corsMiddleware, ...checkRequest, proxyLimiter, additionalHeaders],
      req,
      res,
    );
  } catch (err) {
    const status = err?.statusCode ?? 500;
    rejectSocket(socket, status, err?.message ?? "Internal Server Error");
    return;
  }

  let target;
  try {
    target = resolveUpstreamUrl(res.locals.route.serviceName, req.url ?? "/");
  } catch {
    rejectSocket(socket, 502, "Invalid upstream URL");
    return;
  }

  const headers = copyHeaders(req.headers, {
    extraBlocked: PRIVATE_REQUEST_HEADERS,
    keep: WS_KEEP,
  });
  headers.host = target.host;
  headers.connection = "Upgrade";
  headers.upgrade = "websocket";
  Object.assign(headers, req.additionalHeaders ?? {});

  const transport = target.protocol === "https:" ? nodeHttps : nodeHttp;
  const upstreamReq = transport.request(target, {
    method: "GET",
    headers,
    agent: agentFor(target),
  });

  const handshakeMs = upstreamTimeoutMs();
  upstreamReq.setTimeout(handshakeMs, () => {
    upstreamReq.destroy();
    rejectSocket(socket, 504, "HTTP(504): Upstream timeout");
  });

  upstreamReq.on("upgrade", (upstreamRes, upstreamSocket, upstreamHead) => {
    upstreamReq.setTimeout(0);
    const responseHeaders = copyHeaders(upstreamRes.headers, {
      keep: WS_KEEP,
    });
    socket.write(
      rawHttpHead(
        responseHeaders,
        upstreamRes.statusCode ?? 101,
        upstreamRes.statusMessage,
      ),
    );
    if (head.length) upstreamSocket.write(head);
    if (upstreamHead.length) socket.write(upstreamHead);
    upstreamSocket.pipe(socket);
    socket.pipe(upstreamSocket);
  });

  upstreamReq.on("response", (upstreamRes) => {
    const responseHeaders = copyHeaders(upstreamRes.headers);
    socket.write(
      rawHttpHead(
        responseHeaders,
        upstreamRes.statusCode ?? 502,
        upstreamRes.statusMessage,
      ),
    );
    upstreamRes.pipe(socket);
  });

  upstreamReq.on("error", () => {
    rejectSocket(socket, 503, "HTTP(503): Service Unavailable");
  });

  socket.on("error", () => {
    upstreamReq.destroy();
  });

  upstreamReq.end();
}

/**
 * @param {import('node:http').Server} server
 */
export function attachWebSocketProxy(server) {
  server.on("upgrade", (req, socket, head) => {
    handleUpgrade(req, socket, head).catch(() => {
      if (!socket.destroyed) socket.destroy();
    });
  });
}
