import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { AppPaths } from "app/app.routes";

export function accessGuard(): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const aclService = inject(AclService);
    const hasAccess = resolveAccess(route, aclService);
    if (!hasAccess) redirectsToHome(router);
    return hasAccess;
  };
}

function resolveAccess(
  route: ActivatedRouteSnapshot,
  aclService: AclService,
): boolean {
  const requiredFunctionality: string | undefined = route.data.functionality;
  return aclService.hasAccess(requiredFunctionality, "get");
}

function redirectsToHome(router: Router): void {
  router.navigate([`/${AppPaths.ROUTES}`]);
}
