/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { filterByEmailAndActiveNotArchived } from "../../../src/middlewares/filters/byEmailAndActiveNotArchived.js";

describe("filterByEmailAndActiveNotArchived middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: { email: "test@example.com" } };
    res = {};
    next = jest.fn();
  });

  it("should set req.body.filters from req.body.email and call next()", () => {
    filterByEmailAndActiveNotArchived(req, res, next);

    expect(req.body.filters).toEqual({
      email: { value: "test@example.com", matchMode: "equals" },
      active: { value: true, matchMode: "IS" },
      archived: { value: false, matchMode: "IS" },
    });
    expect(next).toHaveBeenCalledWith();
  });

  it("should set filters.email.value to undefined when req.body.email is missing", () => {
    req.body = {};

    filterByEmailAndActiveNotArchived(req, res, next);

    expect(req.body.filters.email.value).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });
});
