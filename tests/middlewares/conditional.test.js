/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";
import { when } from "../../src/middlewares/conditional.js";

describe("when middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  it("should run the middleware directly when condition is true and middleware is a function", () => {
    const middleware = jest.fn((r, s, n) => n());

    when(() => true, middleware)(req, res, next);

    expect(middleware).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next() directly when condition is false, without invoking middleware", () => {
    const middleware = jest.fn();

    when(() => false, middleware)(req, res, next);

    expect(middleware).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  it("should pass req and res to the condition function", () => {
    const condition = jest.fn(() => false);

    when(condition, jest.fn())(req, res, next);

    expect(condition).toHaveBeenCalledWith(req, res);
  });

  it("should run an array of middlewares sequentially when condition is true", () => {
    const order = [];
    const mw1 = jest.fn((r, s, n) => {
      order.push(1);
      n();
    });
    const mw2 = jest.fn((r, s, n) => {
      order.push(2);
      n();
    });

    when(() => true, [mw1, mw2])(req, res, next);

    expect(order).toEqual([1, 2]);
    expect(mw1).toHaveBeenCalledWith(req, res, expect.any(Function));
    expect(mw2).toHaveBeenCalledWith(req, res, expect.any(Function));
    expect(next).toHaveBeenCalledWith();
  });

  it("should stop and call next(err) if a middleware in the array errors, skipping later ones", () => {
    const err = new Error("boom");
    const mw1 = jest.fn((r, s, n) => n(err));
    const mw2 = jest.fn();

    when(() => true, [mw1, mw2])(req, res, next);

    expect(mw2).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(err);
  });

  it("should call next() once, with no args, after all middlewares in the array complete", () => {
    const mw1 = jest.fn((r, s, n) => n());
    const mw2 = jest.fn((r, s, n) => n());

    when(() => true, [mw1, mw2])(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next() immediately for an empty middleware array", () => {
    when(() => true, [])(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});
