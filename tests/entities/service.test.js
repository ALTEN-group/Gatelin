/**
 * @jest-environment node
 */

import sEnt from "../../src/entities/service.js";

describe("service entity forwardedCookies validator", () => {
  const validate = sEnt.properties.find(
    (p) => p.key === "forwardedCookies",
  ).validator;

  it("should accept valid cookie names", () => {
    expect(() => validate(["foxnox_csrf", "app.session-1"])).not.toThrow();
    expect(() => validate([])).not.toThrow();
  });

  it.each([
    ["non-array", "foxnox_csrf"],
    ["non-string name", [1]],
    ["empty name", [""]],
    ["space", ["a b"]],
    ["semicolon", ["a;b"]],
    ["equals sign", ["a=b"]],
    ["too long name", ["a".repeat(65)]],
    ["duplicates", ["a", "a"]],
    ["too many names", Array.from({ length: 21 }, (_, i) => `c${i}`)],
  ])("should reject %s", (_label, value) => {
    expect(() => validate(value)).toThrow();
  });
});
