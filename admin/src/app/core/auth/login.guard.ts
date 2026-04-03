import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { AuthenticationService } from "@core/auth/auth.service";

export function loginGuard(): CanActivateFn {
  return () => {
    const authService = inject(AuthenticationService);
    if (authService.isAuthenticated()) {
      authService.redirectToApp();
      return false;
    }
    return true;
  };
}
