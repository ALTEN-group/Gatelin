/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

jest.unstable_mockModule("@dwtechs/winstan", () => ({
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  },
}));

describe("injectFilters middleware", () => {
  let injectFilters;
  let req, res, next;

  beforeAll(async () => {
    const module = await import(
      "../../../../src/middlewares/mappers/preference/injectFilters.js"
    );
    injectFilters = module.injectFilters;
  });

  beforeEach(() => {
    req = { params: { resource: "dashboard" } };
    res = { locals: { consumer: { userId: 11 } } };
    next = jest.fn();
  });

  it("should build req.body.filters from userId and resource, and call next()", () => {
    injectFilters(req, res, next);

    expect(req.body).toEqual({
      filters: {
        userId: { value: [-1, 11], matchMode: "in" },
        resource: { value: "dashboard", matchMode: "equals" },
      },
      sortField: "name",
      sortOrder: 1,
    });
    expect(next).toHaveBeenCalledWith();
  });

  it("should reflect a different userId/resource combination", () => {
    req.params.resource = "consumers";
    res.locals.consumer.userId = 99;

    injectFilters(req, res, next);

    expect(req.body.filters.userId.value).toEqual([-1, 99]);
    expect(req.body.filters.resource.value).toBe("consumers");
    expect(next).toHaveBeenCalledWith();
  });
});
