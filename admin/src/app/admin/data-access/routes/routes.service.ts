import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { ROUTE_COLUMNS } from "app/admin/data-access/routes/route.conf";
import { Route, routeFactory } from "app/admin/data-access/routes/route.model";
import { map, Observable, shareReplay, tap } from "rxjs";

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
    create: (item) =>
      this.crud.create(item).pipe(tap(() => this.invalidateCache())),
    update: (item) =>
      this.crud.update(item).pipe(tap(() => this.invalidateCache())),
    archive: (ids) =>
      this.crud.archive(ids).pipe(tap(() => this.invalidateCache())),
    restore: (ids) =>
      this.crud.restore(ids).pipe(tap(() => this.invalidateCache())),
    history: this.crud.history,
  };

  public readonly config = (payload: ActivatedRouteSnapshot) =>
    ROUTE_COLUMNS(payload);
  public readonly entityFactory = routeFactory;

  private _all$: Observable<Route[]> | null = null;

  public getAndCacheAll(): Observable<Route[]> {
    if (!this._all$) {
      this._all$ = this.crud.getAll().pipe(
        map((res) => res.rows ?? []),
        shareReplay(1),
      );
    }
    return this._all$;
  }

  private invalidateCache(): void {
    this._all$ = null;
  }
}
