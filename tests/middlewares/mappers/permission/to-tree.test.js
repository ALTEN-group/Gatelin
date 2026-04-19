/**
 * @jest-environment node
 */

describe("permissionsToTree middleware", () => {
  let permissionsToTree;
  let req, res, next;

  beforeAll(async () => {
    const module = await import(
      "../../../../src/middlewares/mappers/permission/to-tree.js"
    );
    permissionsToTree = module.permissionsToTree;
  });

  beforeEach(() => {
    req = {};
    res = { locals: {} };
    next = jest.fn();
  });

  it("should set empty rows and call next() when res.locals.rows is undefined", () => {
    permissionsToTree(req, res, next);

    expect(res.locals.rows).toEqual([]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should set empty rows and call next() when res.locals.rows is empty", () => {
    res.locals.rows = [];

    permissionsToTree(req, res, next);

    expect(res.locals.rows).toEqual([]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should group a single flat row into a tree", () => {
    res.locals.rows = [
      {
        id: 1,
        roleId: 10,
        routeId: 5,
        serviceName: "userService",
        resourceName: "users",
        routeName: "GET /users",
        operationId: [2],
        operationName: ["read"],
        fields: null,
        archived: false,
        archivedAt: null,
      },
    ];

    permissionsToTree(req, res, next);

    expect(res.locals.rows).toEqual([
      {
        roleId: 10,
        services: [
          {
            serviceName: "userService",
            children: [
              {
                resourceName: "users",
                children: [
                  {
                    id: 1,
                    routeId: 5,
                    routeName: "GET /users",
                    operationId: [2],
                    operationName: ["read"],
                    fields: null,
                    archived: false,
                    archivedAt: null,
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should group multiple routes under the same service and resource", () => {
    res.locals.rows = [
      {
        id: 1,
        roleId: 10,
        routeId: 5,
        serviceName: "userService",
        resourceName: "users",
        routeName: "GET /users",
        operationId: [2],
        operationName: ["read"],
        fields: null,
        archived: false,
        archivedAt: null,
      },
      {
        id: 2,
        roleId: 10,
        routeId: 6,
        serviceName: "userService",
        resourceName: "users",
        routeName: "POST /users",
        operationId: [1],
        operationName: ["create"],
        fields: ["name"],
        archived: false,
        archivedAt: null,
      },
    ];

    permissionsToTree(req, res, next);

    const result = res.locals.rows[0];
    expect(result.roleId).toBe(10);
    expect(result.services).toHaveLength(1);
    expect(result.services[0].serviceName).toBe("userService");
    expect(result.services[0].children).toHaveLength(1);
    expect(result.services[0].children[0].resourceName).toBe("users");
    expect(result.services[0].children[0].children).toHaveLength(2);
    expect(next).toHaveBeenCalledWith();
  });

  it("should group multiple resources under the same service", () => {
    res.locals.rows = [
      {
        id: 1,
        roleId: 10,
        routeId: 5,
        serviceName: "userService",
        resourceName: "users",
        routeName: "GET /users",
        operationId: [2],
        operationName: ["read"],
        fields: null,
        archived: false,
        archivedAt: null,
      },
      {
        id: 2,
        roleId: 10,
        routeId: 6,
        serviceName: "userService",
        resourceName: "roles",
        routeName: "GET /roles",
        operationId: [2],
        operationName: ["read"],
        fields: null,
        archived: false,
        archivedAt: null,
      },
    ];

    permissionsToTree(req, res, next);

    const result = res.locals.rows[0];
    expect(result.services).toHaveLength(1);
    expect(result.services[0].children).toHaveLength(2);
    const resourceNames = result.services[0].children.map(
      (c) => c.resourceName,
    );
    expect(resourceNames).toContain("users");
    expect(resourceNames).toContain("roles");
  });

  it("should group rows into multiple services", () => {
    res.locals.rows = [
      {
        id: 1,
        roleId: 10,
        routeId: 5,
        serviceName: "userService",
        resourceName: "users",
        routeName: "GET /users",
        operationId: [2],
        operationName: ["read"],
        fields: null,
        archived: false,
        archivedAt: null,
      },
      {
        id: 2,
        roleId: 10,
        routeId: 9,
        serviceName: "orderService",
        resourceName: "orders",
        routeName: "GET /orders",
        operationId: [2],
        operationName: ["read"],
        fields: null,
        archived: false,
        archivedAt: null,
      },
    ];

    permissionsToTree(req, res, next);

    const result = res.locals.rows[0];
    expect(result.services).toHaveLength(2);
    const serviceNames = result.services.map((s) => s.serviceName);
    expect(serviceNames).toContain("userService");
    expect(serviceNames).toContain("orderService");
  });

  it("should hoist roleId from the first row to the top level", () => {
    res.locals.rows = [
      {
        id: 1,
        roleId: 42,
        routeId: 5,
        serviceName: "svc",
        resourceName: "res",
        routeName: "GET /res",
        operationId: [2],
        operationName: ["read"],
        fields: null,
        archived: false,
        archivedAt: null,
      },
    ];

    permissionsToTree(req, res, next);

    expect(res.locals.rows[0].roleId).toBe(42);
    expect(
      res.locals.rows[0].services[0].children[0].children[0],
    ).not.toHaveProperty("roleId");
  });

  it("should use empty string when serviceName is null", () => {
    res.locals.rows = [
      {
        id: 1,
        roleId: 10,
        routeId: 5,
        serviceName: null,
        resourceName: "users",
        routeName: "GET /users",
        operationId: [2],
        operationName: ["read"],
        fields: null,
        archived: false,
        archivedAt: null,
      },
    ];

    permissionsToTree(req, res, next);

    expect(res.locals.rows[0].services[0].serviceName).toBe("");
  });

  it("should use empty string when resourceName is null", () => {
    res.locals.rows = [
      {
        id: 1,
        roleId: 10,
        routeId: 5,
        serviceName: "svc",
        resourceName: null,
        routeName: "GET /res",
        operationId: [2],
        operationName: ["read"],
        fields: null,
        archived: false,
        archivedAt: null,
      },
    ];

    permissionsToTree(req, res, next);

    expect(res.locals.rows[0].services[0].children[0].resourceName).toBe("");
  });

  it("should output a single top-level entry regardless of number of rows", () => {
    res.locals.rows = [
      {
        id: 1,
        roleId: 10,
        routeId: 1,
        serviceName: "a",
        resourceName: "x",
        routeName: "r1",
        operationId: [1],
        operationName: ["c"],
        fields: null,
        archived: false,
        archivedAt: null,
      },
      {
        id: 2,
        roleId: 10,
        routeId: 2,
        serviceName: "b",
        resourceName: "y",
        routeName: "r2",
        operationId: [2],
        operationName: ["r"],
        fields: null,
        archived: false,
        archivedAt: null,
      },
      {
        id: 3,
        roleId: 10,
        routeId: 3,
        serviceName: "a",
        resourceName: "z",
        routeName: "r3",
        operationId: [3],
        operationName: ["u"],
        fields: null,
        archived: false,
        archivedAt: null,
      },
    ];

    permissionsToTree(req, res, next);

    expect(res.locals.rows).toHaveLength(1);
  });
});
