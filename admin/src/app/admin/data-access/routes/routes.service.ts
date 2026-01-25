import { Injectable } from "@angular/core";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { ROUTE_COLUMNS } from "app/admin/data-access/routes/route.conf";
import { Route, routeFactory } from "app/admin/data-access/routes/route.model";

const routesApi: string = "routes";

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
  };

  public readonly config = ROUTE_COLUMNS;
  public readonly entityFactory = routeFactory;
}
