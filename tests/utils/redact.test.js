/**
 * @jest-environment node
 */

import { redact } from "../../src/utils/redact.js";

describe("redact", () => {
  it("should return null for null and undefined", () => {
    expect(redact(null)).toBeNull();
    expect(redact(undefined)).toBeNull();
  });

  it("should mask sensitive keys regardless of case", () => {
    const out = redact({
      userId: 7,
      pwd: "hunter2",
      Password: "s3cret",
      AUTHORIZATION: "Bearer abc",
    });

    expect(out).toContain('"userId":7');
    expect(out).not.toContain("hunter2");
    expect(out).not.toContain("s3cret");
    expect(out).not.toContain("Bearer abc");
    expect(out).toContain("[REDACTED]");
  });

  it("should mask sensitive keys nested inside objects and arrays", () => {
    const out = redact({
      rows: [
        { id: 1, refreshToken: "rt-1" },
        { id: 2, accessToken: "at-2" },
      ],
    });

    expect(out).not.toContain("rt-1");
    expect(out).not.toContain("at-2");
    expect(out).toContain('"id":1');
  });

  it("should leave non-sensitive values untouched", () => {
    expect(redact({ page: 1, sort: "ASC" })).toBe('{"page":1,"sort":"ASC"}');
  });

  it("should not throw on circular structures", () => {
    const obj = { id: 1 };
    obj.self = obj;

    expect(() => redact(obj)).not.toThrow();
    expect(redact(obj)).toContain("[Circular]");
  });
});
