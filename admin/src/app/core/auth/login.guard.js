import { inject } from "@angular/core";
import { AuthenticationService } from "@core/auth/auth.service";
export function loginGuard() {
    return () => {
        const authService = inject(AuthenticationService);
        if (authService.isAuthenticated()) {
            authService.redirectToApp();
            return false;
        }
        return true;
    };
}
//# sourceMappingURL=login.guard.js.map