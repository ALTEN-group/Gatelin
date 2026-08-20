/**
 * @jest-environment node
 */

import nodeHttp from "node:http";
import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

const getServiceBaseUrl = jest.fn();
jest.unstable_mockModule("../../src/services/route.js", () => ({
  __esModule: true,
  default: { getServiceBaseUrl },
}));

describe("forwardToService", () => {
  let forwardToService;
  let upstream;
  let upstreamUrl;
  let proxyApp;

  beforeAll(async () => {
    const module = await import("../../src/controllers/forward.js");
    forwardToService = module.forwardToService;

    upstream = nodeHttp.createServer((req, res) => {
      if (req.url === "/sse") {
        res.writeHead(200, {
          "content-type": "text/event-stream",
          "cache-control": "no-cache",
        });
        const delay = (Number(process.env.UPSTREAM_TIMEOUT_MS) || 30) + 40;
        setTimeout(() => {
          res.write("data: hello\n\n");
          res.end();
        }, delay);
        return;
      }

      const chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => {
        const body = Buffer.concat(chunks);

        if (req.url === "/binary") {
          res.writeHead(206, {
            "content-type": "application/octet-stream",
            "set-cookie": ["workflow=abc; HttpOnly", "theme=dark"],
            "x-upstream": "binary-service",
          });
          res.end(Buffer.from([0, 1, 2, 255]));
          return;
        }

        res.writeHead(201, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            body: body.toString("base64"),
            headers: req.headers,
            method: req.method,
            url: req.url,
          }),
        );
      });
    });
    await new Promise((resolve) => upstream.listen(0, "127.0.0.1", resolve));
    const address = upstream.address();
    upstreamUrl = `http://127.0.0.1:${address.port}`;

    proxyApp = express();
    proxyApp.use((req, res, next) => {
      res.locals.route = { serviceName: "user" };
      req.additionalHeaders = {
        "x-consumer-name": "alice",
        "x-consumer-user-id": "1",
      };
      forwardToService(req, res, next);
    });
    proxyApp.use((err, _req, res, _next) =>
      res.status(err.statusCode ?? 500).json({ message: err.message }),
    );
  });

  afterAll(() => new Promise((resolve) => upstream.close(resolve)));

  beforeEach(() => {
    getServiceBaseUrl.mockReset();
    getServiceBaseUrl.mockReturnValue(upstreamUrl);
  });

  it("streams the request body and forwards safe client headers", async () => {
    const body = Buffer.from([0, 10, 127, 128, 255]);
    const response = await request(proxyApp)
      .post("/echo?foo=bar")
      .set("content-type", "application/octet-stream")
      .set("x-client-header", "kept")
      .set("authorization", "Bearer gateway-token")
      .set("cookie", "refreshToken=secret")
      .set("x-csrf-token", "secret")
      .send(body)
      .expect(201);

    expect(getServiceBaseUrl).toHaveBeenCalledWith("user");
    expect(response.body.body).toBe(body.toString("base64"));
    expect(response.body.method).toBe("POST");
    expect(response.body.url).toBe("/echo?foo=bar");
    expect(response.body.headers["content-type"]).toBe(
      "application/octet-stream",
    );
    expect(response.body.headers["x-client-header"]).toBe("kept");
    expect(response.body.headers["x-consumer-user-id"]).toBe("1");
    expect(response.body.headers["x-consumer-name"]).toBe("alice");
    expect(response.body.headers.authorization).toBeUndefined();
    expect(response.body.headers.cookie).toBeUndefined();
    expect(response.body.headers["x-csrf-token"]).toBeUndefined();
    expect(response.body.headers.connection).toBe("keep-alive");
  });

  it("passes multipart bodies through byte-for-byte", async () => {
    const boundary = "gatelin-boundary";
    const multipart = Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.bin"\r\nContent-Type: application/octet-stream\r\n\r\n\u0000\u0001binary\r\n--${boundary}--\r\n`,
    );
    const response = await request(proxyApp)
      .post("/upload")
      .set("content-type", `multipart/form-data; boundary=${boundary}`)
      .send(multipart)
      .expect(201);

    expect(response.body.body).toBe(multipart.toString("base64"));
  });

  it("relays status, binary bodies, and response headers unchanged", async () => {
    const response = await request(proxyApp)
      .get("/binary")
      .buffer(true)
      .parse((res, callback) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => callback(null, Buffer.concat(chunks)));
      })
      .expect(206);

    expect(response.body).toEqual(Buffer.from([0, 1, 2, 255]));
    expect(response.headers["content-type"]).toBe("application/octet-stream");
    expect(response.headers["x-upstream"]).toBe("binary-service");
    expect(response.headers["set-cookie"]).toEqual([
      "workflow=abc; HttpOnly",
      "theme=dark",
    ]);
  });

  it("normalizes dot segments before forwarding", async () => {
    const response = await request(proxyApp)
      .get("/users/../admin/1?foo=bar")
      .expect(201);

    expect(response.body.url).toBe("/admin/1?foo=bar");
  });

  it("maps an unavailable upstream to 503", async () => {
    getServiceBaseUrl.mockReturnValue("http://127.0.0.1:1");

    const response = await request(proxyApp).get("/users/1").expect(503);

    expect(response.body).toEqual({
      message: "HTTP(503): Service Unavailable",
    });
  });

  it("rejects an invalid upstream URL as 502", async () => {
    getServiceBaseUrl.mockReturnValue("not a URL");

    const response = await request(proxyApp).get("/users/1").expect(502);

    expect(response.body).toEqual({
      message: "Invalid upstream URL",
    });
  });

  it("does not forward connection-nominated hop-by-hop headers", async () => {
    const response = await request(proxyApp)
      .get("/headers")
      .set("connection", "x-remove-me")
      .set("x-remove-me", "secret")
      .expect(201);

    expect(response.body.headers["x-remove-me"]).toBeUndefined();
    expect(response.body.headers.connection).not.toContain("x-remove-me");
  });

  it("keeps SSE connections open past the generic idle timeout", async () => {
    const previous = process.env.UPSTREAM_TIMEOUT_MS;
    process.env.UPSTREAM_TIMEOUT_MS = "40";
    try {
      const response = await request(proxyApp)
        .get("/sse")
        .set("Accept", "text/event-stream")
        .expect(200);

      expect(response.headers["content-type"]).toBe("text/event-stream");
      expect(response.text).toContain("data: hello");
    } finally {
      process.env.UPSTREAM_TIMEOUT_MS = previous;
    }
  });
});
