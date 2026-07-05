/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import applyAclConditions from "../../../src/middlewares/mappers/apply-acl-conditions.js";

describe("applyAclConditions middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  it("should call next() and leave req.body untouched when req.aclConditions is undefined", () => {
    applyAclConditions(req, res, next);

    expect(req.body).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next() and leave req.body untouched when req.aclConditions is empty", () => {
    req.aclConditions = [];

    applyAclConditions(req, res, next);

    expect(req.body).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });

  it("should inject a filter for each condition that has an op, creating req.body/filters as needed", () => {
    req.aclConditions = [{ field: "archived", op: "equals", value: false }];

    applyAclConditions(req, res, next);

    expect(req.body.filters).toEqual({
      archived: [{ value: false, op: "equals" }],
    });
    expect(next).toHaveBeenCalledWith();
  });

  it("should skip conditions without an op", () => {
    req.aclConditions = [{ field: "archived", value: false }];

    applyAclConditions(req, res, next);

    expect(req.body.filters).toEqual({});
    expect(next).toHaveBeenCalledWith();
  });

  it("should preserve existing req.body.filters and add multiple conditions", () => {
    req.body = { filters: { existing: [{ value: 1, op: "equals" }] } };
    req.aclConditions = [
      { field: "archived", op: "equals", value: false },
      { field: "ownerId", op: "in", value: [1, 2] },
    ];

    applyAclConditions(req, res, next);

    expect(req.body.filters).toEqual({
      existing: [{ value: 1, op: "equals" }],
      archived: [{ value: false, op: "equals" }],
      ownerId: [{ value: [1, 2], op: "in" }],
    });
    expect(next).toHaveBeenCalledWith();
  });
});
