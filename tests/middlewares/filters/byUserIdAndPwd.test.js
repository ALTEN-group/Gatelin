/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { filterByUserIdAndPwd } from "../../../src/middlewares/filters/byUserIdAndPwd.js";

describe("filterByUserIdAndPwd middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: { pwd: "s3cr3t" } };
    res = { locals: { user: { id: 42 } } };
    next = jest.fn();
  });

  it("should set req.body.filters from res.locals.user.id and req.body.pwd, then call next()", () => {
    filterByUserIdAndPwd(req, res, next);

    expect(req.body.filters).toEqual({
      userId: { value: 42, matchMode: "=" },
      pwd: { value: "s3cr3t", matchMode: "=" },
    });
    expect(next).toHaveBeenCalledWith();
  });

  it("should overwrite any pre-existing req.body.filters", () => {
    req.body.filters = { other: { value: 1, matchMode: "=" } };

    filterByUserIdAndPwd(req, res, next);

    expect(req.body.filters).toEqual({
      userId: { value: 42, matchMode: "=" },
      pwd: { value: "s3cr3t", matchMode: "=" },
    });
    expect(next).toHaveBeenCalledWith();
  });
});
