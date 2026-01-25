import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { AccessLevelsService } from "@core/access/access-levels.service";
import { AppPaths } from "app/app.routes";

export function accessGuard(): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const accessLevelsService = inject(AccessLevelsService);
    const hasSufficientRights = hasAccess(route, accessLevelsService);
    if (!hasSufficientRights) {
      redirectsToHome(router);
    }
    return hasSufficientRights;
  };
}

function hasAccess(
  route: ActivatedRouteSnapshot,
  accessLevelsService: AccessLevelsService,
): boolean {
  const requiredFunctionality: string | undefined = route.data.functionality;
  return accessLevelsService.userHasAccess(requiredFunctionality);
}

function redirectsToHome(router: Router): void {
  router.navigate([`/${AppPaths.HOME}`]);
}
