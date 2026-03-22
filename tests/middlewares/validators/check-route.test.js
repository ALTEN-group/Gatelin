/**
 * @jest-environment node
 */

import checkRoute from "../../../src/middlewares/validators/check-route.js";
import routeSvc from "../../../src/services/route.js";
import { log } from "@dwtechs/winstan";

jest.mock("@dwtechs/winstan");
jest.mock("../../../src/services/route.js", () => ({
  __esModule: true,
  default: { getOne: jest.fn(), init: jest.fn(), deleteArchived: jest.fn() },
}));

describe("checkRoute middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { originalUrl: "/api/users", method: "GET" };
    res = { locals: {} };
    next = jest.fn();
  });

  it("should set res.locals.route and call next() when route is found", () => {
    const mockRoute = { id: 1, url: "/api/users", isProtected: true };
    routeSvc.getOne.mockReturnValue(mockRoute);

    checkRoute(req, res, next);

    expect(routeSvc.getOne).toHaveBeenCalledWith("/api/users", "GET");
    expect(log.debug).toHaveBeenCalledWith(
      "checkRoute(url: /api/users, method: GET)",
    );
    expect(log.debug).toHaveBeenCalledWith(
      `checkRoute(Route: ${JSON.stringify(mockRoute)})`,
    );
    expect(res.locals.route).toEqual(mockRoute);
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next(404) when route is not found", () => {
    routeSvc.getOne.mockReturnValue(null);

    checkRoute(req, res, next);

    expect(routeSvc.getOne).toHaveBeenCalledWith("/api/users", "GET");
    expect(log.debug).toHaveBeenCalledWith(
      "checkRoute(url: /api/users, method: GET)",
    );
    expect(next).toHaveBeenCalledWith({
      statusCode: 404,
      message: "Route not found",
    });
    expect(res.locals.route).toBeUndefined();
  });

  it("should call next(404) when route service returns undefined", () => {
    routeSvc.getOne.mockReturnValue(undefined);

    checkRoute(req, res, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 404,
      message: "Route not found",
    });
  });

  it("should pass method and url to routeSvc.getOne", () => {
    req.originalUrl = "/api/users/123/profile";
    req.method = "PUT";
    const mockRoute = {
      id: 4,
      url: "/api/users/:id/profile",
      isProtected: true,
    };
    routeSvc.getOne.mockReturnValue(mockRoute);

    checkRoute(req, res, next);

    expect(routeSvc.getOne).toHaveBeenCalledWith(
      "/api/users/123/profile",
      "PUT",
    );
    expect(log.debug).toHaveBeenCalledWith(
      "checkRoute(url: /api/users/123/profile, method: PUT)",
    );
    expect(res.locals.route).toEqual(mockRoute);
    expect(next).toHaveBeenCalledWith();
  });

  it("should work for POST method", () => {
    req.method = "POST";
    const mockRoute = { id: 3, url: "/api/users", isProtected: true };
    routeSvc.getOne.mockReturnValue(mockRoute);

    checkRoute(req, res, next);

    expect(routeSvc.getOne).toHaveBeenCalledWith("/api/users", "POST");
    expect(res.locals.route).toEqual(mockRoute);
    expect(next).toHaveBeenCalledWith();
  });

  it("should handle URL with query parameters", () => {
    req.originalUrl = "/api/users?limit=10&offset=0";
    const mockRoute = { id: 5, url: "/api/users", isProtected: false };
    routeSvc.getOne.mockReturnValue(mockRoute);

    checkRoute(req, res, next);

    expect(routeSvc.getOne).toHaveBeenCalledWith(
      "/api/users?limit=10&offset=0",
      "GET",
    );
    expect(res.locals.route).toEqual(mockRoute);
  });
});
