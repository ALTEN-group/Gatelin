import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Color } from "app/admin/data-access/colors/color.model";
import { ColorsService } from "app/admin/data-access/colors/colors.service";
import { Observable } from "rxjs";

export const colorsResolver: ResolveFn<Color[]> = (
  _route,
  _state,
): Observable<Color[]> => {
  const service = inject(ColorsService);
  return service.getAndCacheAll();
};
