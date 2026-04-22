import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { GatewayApplication } from "app/admin/data-access/applications/application.model";
import { GatewayApplicationsService } from "app/admin/data-access/applications/applications.service";
import { Observable } from "rxjs";

export const gatewayApplicationsResolver: ResolveFn<GatewayApplication[]> = (
  _route,
  _state,
): Observable<GatewayApplication[]> => {
  const service = inject(GatewayApplicationsService);
  return service.getAndCacheAll();
};
