import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { AdminEntity } from "@core/app-config/app.entities";
import { AuthenticationService } from "@core/auth/auth.service";
import { AppPaths } from "app/app.routes";
import { map } from "rxjs";

export function aclGuard(): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const aclService = inject(AclService);
    const authService = inject(AuthenticationService);

    if (!authService.isAuthenticated()) {
      router.navigate([`/${AppPaths.LOGIN}`]);
      return false;
    }

    const functionality = route.data.functionality as AdminEntity | undefined;

    return aclService.enrichAclWithSchema(functionality).pipe(
      map(() => {
        const hasAccess = aclService.hasAccess(functionality, "get");
        if (!hasAccess) redirectsToUnauthorized(router);
        return hasAccess;
      }),
    );
  };
}

function redirectsToUnauthorized(router: Router): void {
  router.navigate([`/${AppPaths.UNAUTHORIZED}`]);
}
