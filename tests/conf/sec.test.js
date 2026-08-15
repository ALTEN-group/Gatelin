/**
 * @jest-environment node
 */

/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { security } from "../../src/conf/sec.js";

describe("security middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = { setHeader: jest.fn() };
    next = jest.fn();
  });

  it("should set the Content-Security-Policy header", () => {
    security(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Security-Policy",
      expect.stringContaining("default-src 'self'"),
    );
  });

  it("should set HSTS with preload and includeSubDomains", () => {
    security(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  });

  it("should set the remaining hardening headers", () => {
    security(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith("X-Frame-Options", "DENY");
    expect(res.setHeader).toHaveBeenCalledWith(
      "X-Content-Type-Options",
      "nosniff",
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "X-XSS-Protection",
      "1; mode=block",
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "Referrer-Policy",
      "strict-origin-when-cross-origin",
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "Cross-Origin-Resource-Policy",
      "same-origin",
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "Cross-Origin-Opener-Policy",
      "same-origin",
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "Permissions-Policy",
      expect.stringContaining("camera=()"),
    );
  });

  it("should not send COEP, which only applies to SharedArrayBuffer documents", () => {
    security(req, res, next);

    // require-corp on JSON responses breaks legitimate cross-origin clients
    // without protecting anything the gateway serves.
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "Cross-Origin-Embedder-Policy",
      expect.anything(),
    );
  });

  it("should call next()", () => {
    security(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});
