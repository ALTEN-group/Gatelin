import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Route } from "app/admin/data-access/routes/route.model";
import { RoutesService } from "app/admin/data-access/routes/routes.service";
import { Observable } from "rxjs";

export const routesResolver: ResolveFn<Route[]> = (
	_route,
	_state,
): Observable<Route[]> => {
	const service = inject(RoutesService);
	return service.getAndCacheAll();
};
