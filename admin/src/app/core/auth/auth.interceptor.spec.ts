import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { TokenService } from "@core/auth/token.service";
import { authInterceptor } from "./auth.interceptor";

describe("authInterceptor", () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let tokenService: { getAccessToken: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    tokenService = { getAccessToken: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: tokenService },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("passes the request through when there is no token", () => {
    tokenService.getAccessToken.mockReturnValue(null);

    http.get("/api/ping").subscribe();
    const req = httpMock.expectOne("/api/ping");
    expect(req.request.headers.has("Authorization")).toBe(false);
    req.flush({});
  });

  it("attaches a Bearer token when present", () => {
    tokenService.getAccessToken.mockReturnValue("abc");

    http.get("/api/ping").subscribe();
    const req = httpMock.expectOne("/api/ping");
    expect(req.request.headers.get("Authorization")).toBe("Bearer abc");
    req.flush({});
  });
});
