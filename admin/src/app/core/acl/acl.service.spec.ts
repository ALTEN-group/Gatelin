import { TestBed } from "@angular/core/testing";
import { Permission } from "@core/auth/auth.dto";
import { SchemaService } from "@core/schema/schema.service";
import { of, throwError } from "rxjs";
import { AclService } from "./acl.service";

describe("AclService", () => {
  let service: AclService;
  let schemaService: { get: ReturnType<typeof vi.fn> };

  const permissions: Permission[] = [
    { route: 4, operations: [1], fields: [] }, // consumers.get
    { route: 9, operations: [1], fields: ["name"] }, // routes.create
    { route: 8, operations: [1], fields: ["path"] }, // routes.update
  ];

  beforeEach(() => {
    schemaService = { get: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        AclService,
        { provide: SchemaService, useValue: schemaService },
      ],
    });

    service = TestBed.inject(AclService);
  });

  it("denies access until ACLs are stored", () => {
    expect(service.hasAccess("consumers", "get")).toBe(false);
    expect(service.areAclResolved()).toBe(false);
  });

  it("allows undefined functionality", () => {
    expect(service.hasAccess(undefined, "get")).toBe(true);
  });

  it("stores permissions and resolves access checks", () => {
    service.storeAccessLevels(permissions);

    expect(service.areAclResolved()).toBe(true);
    expect(service.hasAccess("consumers", "get")).toBe(true);
    expect(service.hasAccess("consumers", "create")).toBe(false);
    expect(service.hasAccess("routes", "create")).toBe(true);
    expect(service.hasAccess("routes", undefined)).toBe(false);
    expect(service.getEntityAcls("routes")?.create?.fields).toEqual(["name"]);
  });

  it("resets access levels", () => {
    service.storeAccessLevels(permissions);
    service.resetAccessLevels();

    expect(service.accessLevels()).toBeUndefined();
    expect(service.hasAccess("consumers", "get")).toBe(false);
  });

  it("updates fields for a mapped route id", () => {
    service.storeAccessLevels(permissions);
    service.updateFieldsForRoute(9, ["name", "path"]);

    expect(service.getEntityAcls("routes")?.create?.fields).toEqual([
      "name",
      "path",
    ]);
  });

  it("enriches create/update fields from schema when permission fields are empty", () => {
    service.storeAccessLevels([
      { route: 9, operations: [], fields: [] },
      { route: 8, operations: [], fields: [] },
    ]);
    schemaService.get.mockReturnValue(
      of([
        { key: "name", operations: ["INSERT", "UPDATE"] },
        { key: "secret", operations: ["INSERT"] },
        { key: "path", operations: ["UPDATE"] },
      ]),
    );

    let done = false;
    service.enrichAclWithSchema("routes").subscribe(() => {
      done = true;
    });

    expect(done).toBe(true);
    expect(schemaService.get).toHaveBeenCalledWith("routes");
    expect(service.getEntityAcls("routes")?.create?.fields).toEqual([
      "name",
      "secret",
    ]);
    expect(service.getEntityAcls("routes")?.update?.fields).toEqual([
      "name",
      "path",
    ]);
  });

  it("keeps permission fields when they are non-empty", () => {
    service.storeAccessLevels(permissions);
    schemaService.get.mockReturnValue(
      of([{ key: "fromSchema", operations: ["INSERT", "UPDATE"] }]),
    );

    service.enrichAclWithSchema("routes").subscribe();

    expect(service.getEntityAcls("routes")?.create?.fields).toEqual(["name"]);
    expect(service.getEntityAcls("routes")?.update?.fields).toEqual(["path"]);
  });

  it("swallows schema errors", () => {
    service.storeAccessLevels(permissions);
    schemaService.get.mockReturnValue(throwError(() => new Error("boom")));

    let completed = false;
    service.enrichAclWithSchema("routes").subscribe({
      next: () => {
        completed = true;
      },
    });

    expect(completed).toBe(true);
  });
});
