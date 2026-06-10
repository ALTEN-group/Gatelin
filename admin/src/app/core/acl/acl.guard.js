import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { AuthenticationService } from "@core/auth/auth.service";
import { AppPaths } from "app/app.routes";
export function aclGuard() {
    return (route) => {
        const router = inject(Router);
        const aclService = inject(AclService);
        const authService = inject(AuthenticationService);
        if (!authService.isAuthenticated()) {
            router.navigate([`/${AppPaths.LOGIN}`]);
            return false;
        }
        const hasAccess = resolveAccess(route, aclService);
        if (!hasAccess)
            redirectsToUnauthorized(router);
        return hasAccess;
    };
}
function resolveAccess(route, aclService) {
    const requiredFunctionality = route.data.functionality;
    return aclService.hasAccess(requiredFunctionality, "get");
}
function redirectsToUnauthorized(router) {
    router.navigate([`/${AppPaths.UNAUTHORIZED}`]);
}
//# sourceMappingURL=acl.guard.js.map