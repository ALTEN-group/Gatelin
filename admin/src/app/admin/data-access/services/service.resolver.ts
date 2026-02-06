import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Service } from "app/admin/data-access/services/service.model";
import { ServicesService } from "app/admin/data-access/services/services.service";
import { Observable } from "rxjs";

export const serviceResolver: ResolveFn<Service[]> = (
	_route,
	_state,
): Observable<Service[]> => {
	const service = inject(ServicesService);
	return service.getAndCacheAll();
};
