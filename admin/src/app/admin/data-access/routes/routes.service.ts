import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { ROUTE_COLUMNS } from "app/admin/data-access/routes/route.conf";
import { Route, routeFactory } from "app/admin/data-access/routes/route.model";
import { map, Observable } from "rxjs";

const routesApi: string = "gateway/routes";

/**
 * Service to manage gateway routes
 */
@Injectable({
  providedIn: "root",
})
export class RoutesService {
  private readonly crud = new CrudRepository<Route>().with({
    endpoint: routesApi,
  });

  public readonly httpCalls: Calls<Route> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    history: this.crud.history,
  };

  public readonly config = (payload: ActivatedRouteSnapshot) =>
    ROUTE_COLUMNS(payload);
  public readonly entityFactory = routeFactory;

  public getAndCacheAll(): Observable<Route[]> {
    return this.crud.getAll().pipe(map((res) => res.rows ?? []));
  }
}
