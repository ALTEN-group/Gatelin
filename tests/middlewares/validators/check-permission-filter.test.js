/**
 * @jest-environment node
 */

describe("requireRoleIdFilter middleware", () => {
  let requireRoleIdFilter;
  let req, res, next;

  beforeAll(async () => {
    const module = await import(
      "../../../src/middlewares/validators/check-permission-filter.js"
    );
    requireRoleIdFilter = module.requireRoleIdFilter;
  });

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should call next() when filters.roleId.value is provided", () => {
    req.body = { filters: { roleId: { value: 42 } } };

    requireRoleIdFilter(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should call next() when req.body.roleId is provided", () => {
    req.body = { roleId: 7 };

    requireRoleIdFilter(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 400 when body is empty", () => {
    req.body = {};

    requireRoleIdFilter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: '"roleId" filter is required to search permissions.',
    });
  });

  it("should return 400 when filters object has no roleId", () => {
    req.body = { filters: { serviceId: { value: 1 } } };

    requireRoleIdFilter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: '"roleId" filter is required to search permissions.',
    });
  });

  it("should return 400 when filters.roleId.value is undefined", () => {
    req.body = { filters: { roleId: { value: undefined } } };

    requireRoleIdFilter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 when filters.roleId.value is null", () => {
    req.body = { filters: { roleId: { value: null } } };

    requireRoleIdFilter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 when body is null", () => {
    req.body = null;

    requireRoleIdFilter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
