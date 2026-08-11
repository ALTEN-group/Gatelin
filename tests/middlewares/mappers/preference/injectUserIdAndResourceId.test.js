/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { injectUserIdAndResourceId } from "../../../../src/middlewares/mappers/preference/injectUserIdAndResourceId.js";

describe("injectUserIdAndResourceId middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        rows: [
          { name: "a", conf: {} },
          { name: "b", conf: {} },
        ],
      },
    };
    res = { locals: { consumer: { userId: 42 }, rows: [{ id: 99 }] } };
    next = jest.fn();
  });

  it("should stamp every row with the authenticated consumer's userId and the resolved resourceId", () => {
    injectUserIdAndResourceId(req, res, next);

    expect(req.body.rows).toEqual([
      { name: "a", conf: {}, userId: 42, resourceId: 99 },
      { name: "b", conf: {}, userId: 42, resourceId: 99 },
    ]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should ignore any client-supplied userId/resourceId on the rows", () => {
    req.body.rows = [{ name: "a", userId: 1, resourceId: 2 }];

    injectUserIdAndResourceId(req, res, next);

    expect(req.body.rows).toEqual([{ name: "a", userId: 42, resourceId: 99 }]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should set an empty rows array unchanged when req.body.rows is empty", () => {
    req.body.rows = [];

    injectUserIdAndResourceId(req, res, next);

    expect(req.body.rows).toEqual([]);
    expect(next).toHaveBeenCalledWith();
  });
});
