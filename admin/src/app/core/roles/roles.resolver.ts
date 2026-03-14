import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Role } from "@core/roles/role.class";
import { RolesService } from "@core/roles/roles.service";
import { Observable } from "rxjs";

export const rolesResolver: ResolveFn<Role[]> = (
  _route,
  _state,
): Observable<Role[]> => {
  const service = inject(RolesService);
  return service.getAll();
};
