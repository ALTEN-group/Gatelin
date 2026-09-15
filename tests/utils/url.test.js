/**
 * @jest-environment node
 */

import {
  resolvedPathAndQuery,
  resolvedPathname,
  stripTrailingSlash,
} from "../../src/utils/url.js";

describe("stripTrailingSlash", () => {
  it("should remove a single trailing slash", () => {
    expect(stripTrailingSlash("/api/users/")).toBe("/api/users");
  });

  it("should leave a URL without a trailing slash unchanged", () => {
    expect(stripTrailingSlash("/api/users")).toBe("/api/users");
  });

  it("should only remove the last trailing slash", () => {
    expect(stripTrailingSlash("/api/users//")).toBe("/api/users/");
  });

  it("should not touch slashes in the middle of the path", () => {
    expect(stripTrailingSlash("/api/users/123")).toBe("/api/users/123");
  });

  it("should return an empty string unchanged", () => {
    expect(stripTrailingSlash("")).toBe("");
  });

  it("should reduce a lone slash to an empty string", () => {
    expect(stripTrailingSlash("/")).toBe("");
  });
});

describe("resolvedPathname", () => {
  it("should resolve dot segments before matching", () => {
    expect(resolvedPathname("/users/../admin/1")).toBe("/admin/1");
    expect(resolvedPathname("/files/./secret")).toBe("/files/secret");
  });

  it("should resolve percent-encoded dot segments", () => {
    expect(resolvedPathname("/users/%2e%2e/admin")).toBe("/admin");
  });

  it("should drop the query string and a trailing slash", () => {
    expect(resolvedPathname("/users/123/?page=2")).toBe("/users/123");
  });

  it("should return null for an unparseable URL", () => {
    expect(resolvedPathname("http://[")).toBeNull();
  });
});

describe("resolvedPathAndQuery", () => {
  it("should keep the query after resolving the path", () => {
    expect(resolvedPathAndQuery("/users/../admin/1?foo=bar")).toBe(
      "/admin/1?foo=bar",
    );
  });

  it("should forward only the path of a protocol-relative URL onto the service host", () => {
    expect(resolvedPathAndQuery("//evil/path")).toBe("/path");
  });
});
