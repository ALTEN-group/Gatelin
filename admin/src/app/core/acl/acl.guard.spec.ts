import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, GuardResult, Router } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { AuthenticationService } from "@core/auth/auth.service";
import { Observable, isObservable, of } from "rxjs";
import { aclGuard } from "./acl.guard";

describe("aclGuard", () => {
  let router: { navigate: ReturnType<typeof vi.fn> };
  let aclService: {
    enrichAclWithSchema: ReturnType<typeof vi.fn>;
    hasAccess: ReturnType<typeof vi.fn>;
  };
  let authService: { isAuthenticated: ReturnType<typeof signal> };

  beforeEach(() => {
    router = { navigate: vi.fn() };
    aclService = {
      enrichAclWithSchema: vi.fn().mockReturnValue(of(undefined)),
      hasAccess: vi.fn(),
    };
    authService = { isAuthenticated: signal(true) };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: AclService, useValue: aclService },
        { provide: AuthenticationService, useValue: authService },
      ],
    });
  });

  function runGuard(functionality = "consumers") {
    const route = {
      data: { functionality },
    } as unknown as ActivatedRouteSnapshot;

    return TestBed.runInInjectionContext(() =>
      aclGuard()(route, {} as never),
    );
  }

  function readResult(result: GuardResult | Observable<GuardResult>) {
    if (isObservable(result)) {
      let value: GuardResult | undefined;
      result.subscribe((next: GuardResult) => {
        value = next;
      });
      return value;
    }
    return result;
  }

  it("redirects unauthenticated users to login", () => {
    authService.isAuthenticated.set(false);

    const result = runGuard();

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(["/login"]);
  });

  it("allows access when ACL check passes", () => {
    aclService.hasAccess.mockReturnValue(true);

    expect(readResult(runGuard() as GuardResult | Observable<GuardResult>)).toBe(
      true,
    );
    expect(aclService.enrichAclWithSchema).toHaveBeenCalledWith("consumers");
  });

  it("redirects to unauthorized when ACL check fails", () => {
    aclService.hasAccess.mockReturnValue(false);

    expect(readResult(runGuard() as GuardResult | Observable<GuardResult>)).toBe(
      false,
    );
    expect(router.navigate).toHaveBeenCalledWith(["/unauthorized"]);
  });
});
