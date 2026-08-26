import { computed, inject, Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRouteSnapshot } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { AdminEntity } from "@core/app-config/app.entities";
import { Calls, CrudRepository } from "@dwtechs/ngx-crud-builder";
import { ROUTE_COLUMNS } from "app/routing/data-access/routes/route.conf";
import { Route, routeFactory } from "app/routing/data-access/routes/route.model";
import { Observable } from "rxjs";

const routesApi: AdminEntity = "routes";

/**
 * Service to manage Gatelin routes
 */
@Injectable({
  providedIn: "root",
})
export class RoutesService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly aclsService = inject(AclService);
  private readonly acls = computed(() =>
    this.aclsService.getEntityAcls(routesApi),
  );
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
    ROUTE_COLUMNS(payload, this.sanitizer, this.acls());
  public readonly entityFactory = routeFactory;

  public getAndCacheAll(): Observable<Route[]> {
    return this.crud.getAndCacheAll();
  }
}
