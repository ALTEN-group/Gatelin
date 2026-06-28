import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Resource } from "app/routing/data-access/resources/resource.model";
import { ResourcesService } from "app/routing/data-access/resources/resources.service";
import { Observable } from "rxjs";

export const resourcesResolver: ResolveFn<Resource[]> = (
	_route,
	_state,
): Observable<Resource[]> => {
	const service = inject(ResourcesService);
	return service.getAndCacheAll();
};
