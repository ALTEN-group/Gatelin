import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Field } from "app/authorizations/data-access/fields/field.model";
import { FieldsService } from "app/authorizations/data-access/fields/fields.service";
import { Observable } from "rxjs";

export const fieldsResolver: ResolveFn<Field[]> = (
  _route,
  _state,
): Observable<Field[]> => {
  const service = inject(FieldsService);
  return service.getAndCacheAll();
};
