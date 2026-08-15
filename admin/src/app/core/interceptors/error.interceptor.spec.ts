import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { AuthenticationService } from "@core/auth/auth.service";
import { TokenService } from "@core/auth/token.service";
import { LoadingService } from "@core/utils/loading/loading.service";
import { SnackbarService } from "@core/utils/snackbar/snackbar.service";
import { of } from "rxjs";
import { errorInterceptor } from "./error.interceptor";

describe("errorInterceptor", () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let snackbar: { displayError: ReturnType<typeof vi.fn> };
  let loading: { stop: ReturnType<typeof vi.fn> };
  let auth: {
    refreshToken: ReturnType<typeof vi.fn>;
    redirectToLogin: ReturnType<typeof vi.fn>;
  };
  let tokenService: { getAccessToken: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    snackbar = { displayError: vi.fn() };
    loading = { stop: vi.fn() };
    auth = {
      refreshToken: vi.fn(),
      redirectToLogin: vi.fn(),
    };
    tokenService = { getAccessToken: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: SnackbarService, useValue: snackbar },
        { provide: LoadingService, useValue: loading },
        { provide: AuthenticationService, useValue: auth },
        { provide: TokenService, useValue: tokenService },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it("rethrows 404 without a snackbar message", () => {
    let error: HttpErrorResponse | undefined;
    http.get("/api/missing").subscribe({
      error: (err) => {
        error = err;
      },
    });

    httpMock.expectOne("/api/missing").flush("gone", {
      status: 404,
      statusText: "Not Found",
    });

    expect(error?.status).toBe(404);
    expect(snackbar.displayError).not.toHaveBeenCalled();
    expect(loading.stop).toHaveBeenCalled();
  });

  it("refreshes the token and replays the request on 401", () => {
    auth.refreshToken.mockReturnValue(of(true));
    tokenService.getAccessToken.mockReturnValue("fresh");

    let body: unknown;
    http.get("/api/secure").subscribe((res) => {
      body = res;
    });

    httpMock.expectOne("/api/secure").flush("nope", {
      status: 401,
      statusText: "Unauthorized",
    });

    const replay = httpMock.expectOne("/api/secure");
    expect(replay.request.headers.get("Authorization")).toBe("Bearer fresh");
    replay.flush({ ok: true });

    expect(body).toEqual({ ok: true });
    expect(auth.refreshToken).toHaveBeenCalled();
  });

  it("redirects to login when session refresh itself returns 401", () => {
    let error: HttpErrorResponse | undefined;
    http.put("/api/sessions", {}).subscribe({
      error: (err) => {
        error = err;
      },
    });

    httpMock.expectOne("/api/sessions").flush("nope", {
      status: 401,
      statusText: "Unauthorized",
    });

    expect(auth.redirectToLogin).toHaveBeenCalled();
    expect(error?.status).toBe(401);
    expect(auth.refreshToken).not.toHaveBeenCalled();
  });

  it("shows a snackbar for other HTTP errors", () => {
    http.get("/api/broken").subscribe({ error: () => undefined });

    httpMock.expectOne("/api/broken").flush("boom", {
      status: 500,
      statusText: "Server Error",
    });

    expect(snackbar.displayError).toHaveBeenCalled();
    expect(loading.stop).toHaveBeenCalled();
  });
});
