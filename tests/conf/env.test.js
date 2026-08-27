/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

jest.unstable_mockModule("@dwtechs/winstan", () => ({
  log: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

const REQUIRED = ["APP_NAME", "ENV_NAME", "PWD_CHECK_URL", "USER_SEARCH_URL"];

describe("env validation", () => {
  let collectEnvErrors;
  let validateEnv;
  let original;

  beforeAll(async () => {
    const module = await import("../../src/conf/env.js");
    collectEnvErrors = module.collectEnvErrors;
    validateEnv = module.validateEnv;
  });

  beforeEach(() => {
    original = { ...process.env };
    process.env.APP_NAME = "gatelin";
    process.env.ENV_NAME = "prod";
    process.env.PWD_CHECK_URL = "http://ms-pwd:3000/compare";
    process.env.USER_SEARCH_URL = "http://ms-user:3000/search";
  });

  afterEach(() => {
    process.env = original;
  });

  it("should report no errors for a complete environment", () => {
    expect(collectEnvErrors()).toEqual([]);
    expect(() => validateEnv()).not.toThrow();
  });

  it.each(REQUIRED)("should report %s when it is missing", (name) => {
    delete process.env[name];

    expect(collectEnvErrors()).toEqual([expect.stringContaining(name)]);
  });

  it("should treat a whitespace-only value as missing", () => {
    process.env.APP_NAME = "   ";

    expect(collectEnvErrors()).toEqual([expect.stringContaining("APP_NAME")]);
  });

  it("should reject a malformed upstream URL", () => {
    process.env.PWD_CHECK_URL = "not a url";

    expect(collectEnvErrors()).toEqual([
      expect.stringContaining("not a valid URL"),
    ]);
  });

  it("should accept empty optional password endpoints", () => {
    process.env.PWD_CHALLENGES_URL = "";
    process.env.PWD_TRUSTED_DEVICES_URL = "  ";
    process.env.PWD_LOGIN_TICKET_URL = "";

    expect(collectEnvErrors()).toEqual([]);
  });

  it.each([
    "PWD_CHALLENGES_URL",
    "PWD_TRUSTED_DEVICES_URL",
    "PWD_LOGIN_TICKET_URL",
  ])("should reject a malformed %s", (name) => {
    process.env[name] = "not a url";

    expect(collectEnvErrors()).toEqual([expect.stringContaining(name)]);
  });

  it("should report every problem at once so one restart surfaces them all", () => {
    delete process.env.APP_NAME;
    delete process.env.ENV_NAME;

    expect(collectEnvErrors()).toHaveLength(2);
  });

  it("should throw listing the problems", () => {
    delete process.env.USER_SEARCH_URL;

    expect(() => validateEnv()).toThrow(/USER_SEARCH_URL/);
  });
});
