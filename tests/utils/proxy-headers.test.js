import { afterEach, describe, expect, it } from "@jest/globals";
import { upstreamCookies } from "../../src/utils/proxy-headers.js";

describe("upstreamCookies", () => {
  afterEach(() => {
    delete process.env.CSRF_COOKIE_NAME;
    delete process.env.REFRESH_TOKEN_COOKIE_NAME;
  });

  it("returns undefined when the service registered no cookie", () => {
    expect(upstreamCookies("a=1", undefined)).toBeUndefined();
    expect(upstreamCookies("a=1", null)).toBeUndefined();
    expect(upstreamCookies("a=1", [])).toBeUndefined();
  });

  it("returns undefined when the request has no cookie", () => {
    expect(upstreamCookies(undefined, ["a"])).toBeUndefined();
    expect(upstreamCookies("", ["a"])).toBeUndefined();
  });

  it("keeps only the registered cookies", () => {
    expect(upstreamCookies("a=1; b=2; c=3", ["a", "c"])).toBe("a=1; c=3");
  });

  it("matches names exactly, not by prefix", () => {
    expect(upstreamCookies("ab=1; a=2", ["a"])).toBe("a=2");
  });

  it("ignores pairs without a name", () => {
    expect(upstreamCookies("=1; flag; a=2", ["a", ""])).toBe("a=2");
  });

  it("returns undefined when no registered cookie is present", () => {
    expect(upstreamCookies("b=2", ["a"])).toBeUndefined();
  });

  it("never forwards Gatelin's own cookies, even when registered", () => {
    expect(
      upstreamCookies("refreshToken=r; csrfToken=c; app=1", [
        "refreshToken",
        "csrfToken",
        "app",
      ]),
    ).toBe("app=1");
  });

  it("honors custom Gatelin cookie names", () => {
    process.env.CSRF_COOKIE_NAME = "xsrf";
    process.env.REFRESH_TOKEN_COOKIE_NAME = "rt";
    expect(
      upstreamCookies("xsrf=1; rt=2; csrfToken=3", ["xsrf", "rt", "csrfToken"]),
    ).toBe("csrfToken=3");
  });
});
