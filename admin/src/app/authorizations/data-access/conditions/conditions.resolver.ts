import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Condition } from "app/authorizations/data-access/conditions/condition.model";
import { ConditionsService } from "app/authorizations/data-access/conditions/conditions.service";
import { Observable } from "rxjs";

export const conditionsResolver: ResolveFn<Condition[]> = (
  _route,
  _state,
): Observable<Condition[]> => {
  const service = inject(ConditionsService);
  return service.getAndCacheAll();
};
