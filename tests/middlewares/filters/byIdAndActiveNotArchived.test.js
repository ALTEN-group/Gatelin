/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { filterByIdAndActiveNotArchived } from "../../../src/middlewares/filters/byIdAndActiveNotArchived.js";

describe("filterByIdAndActiveNotArchived middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = { locals: { consumer: { userId: 42 } } };
    next = jest.fn();
  });

  it("should set req.body.filters from the authenticated consumer's userId and call next()", () => {
    filterByIdAndActiveNotArchived(req, res, next);

    expect(req.body.filters).toEqual({
      id: { value: 42, matchMode: "=" },
      active: { value: true, matchMode: "IS" },
      archived: { value: false, matchMode: "IS" },
    });
    expect(next).toHaveBeenCalledWith();
  });

  it("should overwrite any pre-existing req.body.filters", () => {
    req.body = { filters: { other: { value: 1, matchMode: "=" } } };

    filterByIdAndActiveNotArchived(req, res, next);

    expect(req.body.filters).toEqual({
      id: { value: 42, matchMode: "=" },
      active: { value: true, matchMode: "IS" },
      archived: { value: false, matchMode: "IS" },
    });
    expect(next).toHaveBeenCalledWith();
  });
});
