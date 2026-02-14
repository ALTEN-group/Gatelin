import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Operation } from "app/admin/data-access/operations/operation.model";
import { OperationsService } from "app/admin/data-access/operations/operations.service";
import { Observable } from "rxjs";

export const operationsResolver: ResolveFn<Operation[]> = (
	_route,
	_state,
): Observable<Operation[]> => {
	const service = inject(OperationsService);
	return service.getAndCacheAll();
};
