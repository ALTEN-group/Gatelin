import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { GatewayRole } from "app/authorizations/data-access/roles/role.model";
import { GatewayRolesService } from "app/authorizations/data-access/roles/roles.service";
import { Observable } from "rxjs";

export const gatewayRolesResolver: ResolveFn<GatewayRole[]> = (
  _route,
  _state,
): Observable<GatewayRole[]> => {
  const service = inject(GatewayRolesService);
  return service.getAndCacheAll();
};
