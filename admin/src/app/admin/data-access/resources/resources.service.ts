import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { RESOURCE_COLUMNS } from "app/admin/data-access/resources/resource.conf";
import {
  Resource,
  resourceFactory,
} from "app/admin/data-access/resources/resource.model";
import { map, Observable, shareReplay, tap } from "rxjs";

const resourcesEndpoint: string = "gateway/resources";

@Injectable({
  providedIn: "root",
})
export class ResourcesService {
  private readonly crud = new CrudRepository<Resource>().with({
    endpoint: resourcesEndpoint,
  });

  public readonly httpCalls: Calls<Resource> = {
    get: this.crud.get,
    create: (item) => this.crud.create(item).pipe(tap(() => this.invalidateCache())),
    update: (item) => this.crud.update(item).pipe(tap(() => this.invalidateCache())),
    archive: (ids) => this.crud.archive(ids).pipe(tap(() => this.invalidateCache())),
    restore: (ids) => this.crud.restore(ids).pipe(tap(() => this.invalidateCache())),
    history: this.crud.history,
  };

  public readonly config = (payload: ActivatedRouteSnapshot) =>
    RESOURCE_COLUMNS(payload);
  public readonly entityFactory = resourceFactory;

  private _all$: Observable<Resource[]> | null = null;

  public getAndCacheAll(): Observable<Resource[]> {
    if (!this._all$) {
      this._all$ = this.crud.getAll().pipe(map((res) => res.rows ?? []), shareReplay(1));
    }
    return this._all$;
  }

  private invalidateCache(): void {
    this._all$ = null;
  }
}
