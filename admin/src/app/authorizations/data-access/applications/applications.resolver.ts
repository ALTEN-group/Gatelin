import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { GatelinApplication } from "app/authorizations/data-access/applications/application.model";
import { GatelinApplicationsService } from "app/authorizations/data-access/applications/applications.service";
import { Observable } from "rxjs";

export const gatelinApplicationsResolver: ResolveFn<GatelinApplication[]> = (
  _route,
  _state,
): Observable<GatelinApplication[]> => {
  const service = inject(GatelinApplicationsService);
  return service.getAndCacheAll();
};
