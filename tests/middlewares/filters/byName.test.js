/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { filterByName } from "../../../src/middlewares/filters/byName.js";

describe("filterByName middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: { resource: "dashboard" } };
    res = {};
    next = jest.fn();
  });

  it("should create req.body when missing and set filters.name from params.resource", () => {
    filterByName(req, res, next);

    expect(req.body).toEqual({
      filters: { name: { value: "dashboard", matchMode: "=" } },
    });
    expect(next).toHaveBeenCalledWith();
  });

  it("should merge with pre-existing req.body.filters without dropping other filters", () => {
    req.body = { filters: { userId: { value: 42, matchMode: "=" } } };

    filterByName(req, res, next);

    expect(req.body.filters).toEqual({
      userId: { value: 42, matchMode: "=" },
      name: { value: "dashboard", matchMode: "=" },
    });
    expect(next).toHaveBeenCalledWith();
  });
});
