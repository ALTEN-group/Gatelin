/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const checkAclPath = path.join(
  __dirname,
  "../../../src/middlewares/validators/check-acl.js",
);
const checkConsumerPath = path.join(
  __dirname,
  "../../../src/middlewares/validators/check-consumer.js",
);
const applyAclConditionsPath = path.join(
  __dirname,
  "../../../src/middlewares/mappers/apply-acl-conditions.js",
);

const parseBearer = jest.fn();
const decodeAccess = jest.fn();
const checkAcl = jest.fn();
const checkConsumer = jest.fn();
const applyAclConditions = jest.fn();

jest.unstable_mockModule("@dwtechs/toker-express", () => ({
  parseBearer,
  decodeAccess,
}));
jest.unstable_mockModule(checkAclPath, () => ({
  __esModule: true,
  default: checkAcl,
}));
jest.unstable_mockModule(checkConsumerPath, () => ({
  __esModule: true,
  default: checkConsumer,
}));
jest.unstable_mockModule(applyAclConditionsPath, () => ({
  __esModule: true,
  default: applyAclConditions,
}));

describe("checkRequest middleware stack", () => {
  let checkRequest;

  beforeAll(async () => {
    const module = await import(
      "../../../src/middlewares/validators/check-request.js"
    );
    checkRequest = module.checkRequest;
  });

  it("should compose the full auth/ACL pipeline in the correct order", () => {
    expect(checkRequest).toEqual([
      parseBearer,
      decodeAccess,
      checkConsumer,
      checkAcl,
      applyAclConditions,
    ]);
  });

  it("should export exactly 5 middlewares", () => {
    expect(checkRequest).toHaveLength(5);
  });
});
