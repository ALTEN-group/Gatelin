import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Scope } from "app/admin/data-access/scopes/scope.model";
import { ScopesService } from "app/admin/data-access/scopes/scopes.service";
import { Observable } from "rxjs";

export const scopesResolver: ResolveFn<Scope[]> = (
  _route,
  _state,
): Observable<Scope[]> => {
  const service = inject(ScopesService);
  return service.getAndCacheAll();
};
