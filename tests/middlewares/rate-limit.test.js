/**
 * @jest-environment node
 */

import express from "express";
import { ipKeyGenerator } from "express-rate-limit";
import request from "supertest";
import {
  clientIp,
  createIdentityLimiter,
  createSessionLimiter,
  envMax,
  identityKey,
} from "../../src/middlewares/rate-limit.js";

describe("identityKey", () => {
  it("should key authenticated requests by consumer id", () => {
    const req = { ip: "10.0.0.8" };
    const res = { locals: { consumer: { id: 42 } } };
    expect(identityKey(req, res)).toBe("c:42");
  });

  it("should fall back to the client IP when no consumer is present", () => {
    const req = { ip: "10.0.0.8" };
    const res = { locals: {} };
    expect(identityKey(req, res)).toBe(ipKeyGenerator("10.0.0.8"));
  });

  it("should use X-Forwarded-For on a raw upgrade request with no req.ip", () => {
    const req = {
      headers: { "x-forwarded-for": "203.0.113.10" },
      socket: { remoteAddress: "10.0.0.2" },
    };
    const res = { locals: {} };
    expect(identityKey(req, res)).toBe(ipKeyGenerator("203.0.113.10"));
  });
});

describe("clientIp", () => {
  it("should prefer Express req.ip when it is already set", () => {
    expect(
      clientIp({
        ip: "198.51.100.1",
        headers: { "x-forwarded-for": "203.0.113.9" },
        socket: { remoteAddress: "10.0.0.2" },
      }),
    ).toBe("198.51.100.1");
  });

  it("should use the socket address when no forwarded header is present", () => {
    expect(
      clientIp({
        headers: {},
        socket: { remoteAddress: "10.0.0.2" },
      }),
    ).toBe("10.0.0.2");
  });

  it("should take the hop before the trusted proxy from X-Forwarded-For", () => {
    expect(
      clientIp({
        headers: { "x-forwarded-for": "198.51.100.7, 203.0.113.10" },
        socket: { remoteAddress: "10.0.0.2" },
      }),
    ).toBe("203.0.113.10");
  });

  it("should ignore a spoofed leftmost X-Forwarded-For when Traefik appended the client", () => {
    expect(
      clientIp({
        headers: { "x-forwarded-for": "192.0.2.1, 203.0.113.10" },
        socket: { remoteAddress: "10.0.0.2" },
      }),
    ).toBe("203.0.113.10");
  });
});

describe("createIdentityLimiter", () => {
  /** @type {import('express').Express} */
  let app;

  beforeEach(() => {
    app = express();
    app.set("trust proxy", 1);
    app.use((req, res, next) => {
      const raw = req.get("x-consumer-id");
      if (raw) res.locals.consumer = { id: Number(raw) };
      next();
    });
    app.use(createIdentityLimiter(2));
    app.get("/ping", (_req, res) => res.status(204).end());
    app.use((err, _req, res, _next) =>
      res.status(err.statusCode ?? 500).json({ message: err.message }),
    );
  });

  it("should allow requests under the max and reject the next with 429", async () => {
    await request(app)
      .get("/ping")
      .set("X-Forwarded-For", "203.0.113.2")
      .expect(204);
    await request(app)
      .get("/ping")
      .set("X-Forwarded-For", "203.0.113.2")
      .expect(204);
    const denied = await request(app)
      .get("/ping")
      .set("X-Forwarded-For", "203.0.113.2")
      .expect(429);
    expect(denied.body).toEqual({
      message: "HTTP(429): Too Many Requests",
    });
  });

  it("should count consumers separately from IP fallback", async () => {
    await request(app)
      .get("/ping")
      .set("X-Forwarded-For", "203.0.113.9")
      .set("x-consumer-id", "7")
      .expect(204);
    await request(app)
      .get("/ping")
      .set("X-Forwarded-For", "203.0.113.9")
      .set("x-consumer-id", "7")
      .expect(204);
    await request(app)
      .get("/ping")
      .set("X-Forwarded-For", "203.0.113.9")
      .set("x-consumer-id", "7")
      .expect(429);

    await request(app)
      .get("/ping")
      .set("X-Forwarded-For", "203.0.113.9")
      .set("x-consumer-id", "8")
      .expect(204);
  });
});

describe("envMax", () => {
  const key = "PROXY_RATE_LIMIT_MAX";
  /** @type {string|undefined} */
  let previous;

  beforeEach(() => {
    previous = process.env[key];
    delete process.env[key];
  });

  afterEach(() => {
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  });

  it("should fall back when PROXY_RATE_LIMIT_MAX is missing", () => {
    expect(envMax(key, 200)).toBe(200);
  });

  it("should fall back when PROXY_RATE_LIMIT_MAX is not a positive number", () => {
    process.env[key] = "0";
    expect(envMax(key, 200)).toBe(200);
    process.env[key] = "-1";
    expect(envMax(key, 200)).toBe(200);
    process.env[key] = "nope";
    expect(envMax(key, 200)).toBe(200);
  });

  it("should use a positive PROXY_RATE_LIMIT_MAX override", () => {
    process.env[key] = "50";
    expect(envMax(key, 200)).toBe(50);
  });
});

describe("createSessionLimiter", () => {
  /** @type {import('express').Express} */
  let app;

  beforeEach(() => {
    app = express();
    app.set("trust proxy", 1);
    app.use((req, res, next) => {
      const raw = req.get("x-consumer-id");
      if (raw) res.locals.consumer = { id: Number(raw) };
      next();
    });
    app.use(createSessionLimiter(2));
    app.get("/ping", (_req, res) => res.status(204).end());
    app.use((err, _req, res, _next) =>
      res.status(err.statusCode ?? 500).json({ message: err.message }),
    );
  });

  it("should key by IP even when consumer ids differ", async () => {
    await request(app)
      .get("/ping")
      .set("X-Forwarded-For", "203.0.113.4")
      .set("x-consumer-id", "1")
      .expect(204);
    await request(app)
      .get("/ping")
      .set("X-Forwarded-For", "203.0.113.4")
      .set("x-consumer-id", "2")
      .expect(204);
    const denied = await request(app)
      .get("/ping")
      .set("X-Forwarded-For", "203.0.113.4")
      .set("x-consumer-id", "3")
      .expect(429);
    expect(denied.body).toEqual({
      message: "HTTP(429): Too Many Requests",
    });

    await request(app)
      .get("/ping")
      .set("X-Forwarded-For", "203.0.113.5")
      .set("x-consumer-id", "1")
      .expect(204);
  });
});
