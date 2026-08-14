import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AuthenticationService } from "@core/auth/auth.service";
import { loginGuard } from "./login.guard";

describe("loginGuard", () => {
  let authService: {
    isAuthenticated: ReturnType<typeof signal>;
    redirectToApp: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authService = {
      isAuthenticated: signal(false),
      redirectToApp: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: AuthenticationService, useValue: authService }],
    });
  });

  function runGuard() {
    return TestBed.runInInjectionContext(() =>
      loginGuard()(),
    );
  }

  it("allows the login page for anonymous users", () => {
    expect(runGuard()).toBe(true);
    expect(authService.redirectToApp).not.toHaveBeenCalled();
  });

  it("redirects authenticated users away from login", () => {
    authService.isAuthenticated.set(true);

    expect(runGuard()).toBe(false);
    expect(authService.redirectToApp).toHaveBeenCalled();
  });
});
