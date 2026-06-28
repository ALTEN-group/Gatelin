import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Method } from "app/routing/data-access/methods/method.model";
import { MethodsService } from "app/routing/data-access/methods/methods.service";
import { Observable } from "rxjs";

export const methodsResolver: ResolveFn<Method[]> = (
  _route,
  _state,
): Observable<Method[]> => {
  const service = inject(MethodsService);
  return service.getAndCacheAll();
};
