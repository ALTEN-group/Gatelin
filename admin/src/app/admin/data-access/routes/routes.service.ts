import { inject, Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Calls, CrudRepository } from "@dwtechs/crud-builder";
import { ROUTE_COLUMNS } from "app/admin/data-access/routes/route.conf";
import { Route, routeFactory } from "app/admin/data-access/routes/route.model";
import { Observable } from "rxjs";

const routesApi: string = "gateway/routes";

/**
 * Service to manage gateway routes
 */
@Injectable({
  providedIn: "root",
})
export class RoutesService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly crud = new CrudRepository<Route>().with({
    endpoint: routesApi,
  });

  public readonly httpCalls: Calls<Route> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    getHistory: this.crud.getHistory,
  };

  public readonly config = (payload: ActivatedRouteSnapshot) =>
    ROUTE_COLUMNS(payload, this.sanitizer);
  public readonly entityFactory = routeFactory;

  public getAndCacheAll(): Observable<Route[]> {
    return this.crud.getAndCacheAll();
  }
}
