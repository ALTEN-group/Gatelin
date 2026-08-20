import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { GatelinRole } from "app/authorizations/data-access/roles/role.model";
import { GatelinRolesService } from "app/authorizations/data-access/roles/roles.service";
import { Observable } from "rxjs";

export const gatelinRolesResolver: ResolveFn<GatelinRole[]> = (
  _route,
  _state,
): Observable<GatelinRole[]> => {
  const service = inject(GatelinRolesService);
  return service.getAndCacheAll();
};
