import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { TokenService } from "@core/auth/token.service";
import { AuthenticationService } from "./auth.service";

describe("AuthenticationService", () => {
  let service: AuthenticationService;
  let http: HttpTestingController;
  let tokenService: {
    saveAccessToken: ReturnType<typeof vi.fn>;
    getAccessToken: ReturnType<typeof vi.fn>;
    deleteAccessToken: ReturnType<typeof vi.fn>;
  };
  let aclService: {
    storeAccessLevels: ReturnType<typeof vi.fn>;
    resetAccessLevels: ReturnType<typeof vi.fn>;
  };
  let router: { navigate: ReturnType<typeof vi.fn>; url: string };
  let queryParams: Record<string, string | null>;

  beforeEach(() => {
    tokenService = {
      saveAccessToken: vi.fn(),
      getAccessToken: vi.fn(),
      deleteAccessToken: vi.fn(),
    };
    aclService = {
      storeAccessLevels: vi.fn(),
      resetAccessLevels: vi.fn(),
    };
    router = { navigate: vi.fn(), url: "/routes" };
    queryParams = { returnUrl: null };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthenticationService,
        { provide: TokenService, useValue: tokenService },
        { provide: AclService, useValue: aclService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) => queryParams[key] ?? null,
              },
            },
          },
        },
        {
          provide: APP_CONFIG,
          useValue: {
            apiGateway: "/api/",
            apiUsers: "/api/users/",
            storageKeys: {},
            sidenavItems: [],
            title: "Admin",
            appKey: "admin",
            env: {},
          },
        },
      ],
    });

    service = TestBed.inject(AuthenticationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it("rejects empty credentials without calling the API", () => {
    let result: boolean | undefined;
    service.login("", "pwd").subscribe((value) => {
      result = value;
    });
    expect(result).toBe(false);
  });

  it("logs in, stores token/ACLs and redirects home", () => {
    let result: boolean | undefined;
    service.login("a@b.c", "secret").subscribe((value) => {
      result = value;
    });

    const session = http.expectOne("/api/sessions");
    expect(session.request.method).toBe("POST");
    session.flush({
      accessToken: "tok",
      permissions: [{ route: 4, operations: [], fields: [] }],
    });

    const me = http.expectOne("/api/users/users/me");
    me.flush({ firstName: "Ada", lastName: "Lovelace", nickname: "ada" });

    expect(result).toBe(true);
    expect(tokenService.saveAccessToken).toHaveBeenCalledWith("tok");
    expect(aclService.storeAccessLevels).toHaveBeenCalled();
    expect(service.isAuthenticated()).toBe(true);
    expect(service.user()?.firstName).toBe("Ada");
    expect(router.navigate).toHaveBeenCalledWith(["/"]);
  });

  it("sends the browser to the challenge page on a 202 login", () => {
    const assign = vi.fn();
    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      assign,
    } as unknown as Location);

    let result: boolean | undefined;
    service.login("a@b.c", "secret").subscribe((value) => {
      result = value;
    });

    http.expectOne("/api/sessions").flush(
      {
        challengeRequired: true,
        kind: "2fa",
        url: "http://localhost/api/pwd/web/2fa/verify?challenge=abc",
      },
      { status: 202, statusText: "Accepted" },
    );

    expect(result).toBe(true);
    expect(assign).toHaveBeenCalledWith(
      "http://localhost/api/pwd/web/2fa/verify?challenge=abc",
    );
    expect(tokenService.saveAccessToken).not.toHaveBeenCalled();
    expect(service.isAuthenticated()).toBe(false);
  });

  it("resumes a challenged login with a ticket", () => {
    let result: boolean | undefined;
    service.resumeLogin("tick").subscribe((value) => {
      result = value;
    });

    const resume = http.expectOne("/api/sessions/resume");
    expect(resume.request.method).toBe("POST");
    expect(resume.request.body).toEqual({ ticket: "tick" });
    resume.flush({
      accessToken: "tok",
      permissions: [{ route: 4, operations: [], fields: [] }],
    });

    http
      .expectOne("/api/users/users/me")
      .flush({ firstName: "Ada", lastName: "Lovelace", nickname: "ada" });

    expect(result).toBe(true);
    expect(tokenService.saveAccessToken).toHaveBeenCalledWith("tok");
    expect(service.isAuthenticated()).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(["/"]);
  });

  it("rejects an empty resume ticket without calling the API", () => {
    let result: boolean | undefined;
    service.resumeLogin("").subscribe((value) => {
      result = value;
    });
    expect(result).toBe(false);
  });

  it("returns false when login fails", () => {
    let result: boolean | undefined;
    service.login("a@b.c", "secret").subscribe((value) => {
      result = value;
    });

    http.expectOne("/api/sessions").flush("nope", {
      status: 401,
      statusText: "Unauthorized",
    });

    expect(result).toBe(false);
  });

  it("logs out and redirects to login", () => {
    service.logout().subscribe();

    http.expectOne("/api/sessions").flush(null);
    expect(tokenService.deleteAccessToken).toHaveBeenCalled();
    expect(aclService.resetAccessLevels).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(["/login"], {
      queryParams: { returnUrl: "/routes" },
    });
  });

  it("skips refresh when no access token is stored", () => {
    tokenService.getAccessToken.mockReturnValue(null);
    let result: boolean | undefined;
    service.refreshToken().subscribe((value) => {
      result = value;
    });
    expect(result).toBe(false);
  });

  it("refreshes the session and stores permissions", () => {
    tokenService.getAccessToken.mockReturnValue("old");
    let result: boolean | undefined;
    service.refreshToken().subscribe((value) => {
      result = value;
    });

    const req = http.expectOne("/api/sessions");
    expect(req.request.method).toBe("PUT");
    req.flush({
      accessToken: "new",
      permissions: [{ route: 4, operations: [], fields: [] }],
    });

    expect(result).toBe(true);
    expect(tokenService.saveAccessToken).toHaveBeenCalledWith("new");
    expect(aclService.resetAccessLevels).toHaveBeenCalled();
    expect(aclService.storeAccessLevels).toHaveBeenCalled();
  });

  it("redirects to returnUrl when present", () => {
    queryParams.returnUrl = "/consumers";
    service.redirectToApp();
    expect(router.navigate).toHaveBeenCalledWith(["/consumers"]);
  });
});
