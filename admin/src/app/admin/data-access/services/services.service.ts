import { Injectable } from "@angular/core";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { SERVICE_COLUMNS } from "app/admin/data-access/services/service.conf";
import {
  Service,
  serviceFactory,
} from "app/admin/data-access/services/service.model";
import { map, Observable, shareReplay, tap } from "rxjs";

const servicesApi: string = "gateway/services";

@Injectable({
  providedIn: "root",
})
export class ServicesService {
  private readonly crud = new CrudRepository<Service>().with({
    endpoint: servicesApi,
  });

  public readonly httpCalls: Calls<Service> = {
    get: this.crud.get,
    create: (item) => this.crud.create(item).pipe(tap(() => this.invalidateCache())),
    update: (item) => this.crud.update(item).pipe(tap(() => this.invalidateCache())),
    archive: (ids) => this.crud.archive(ids).pipe(tap(() => this.invalidateCache())),
    restore: (ids) => this.crud.restore(ids).pipe(tap(() => this.invalidateCache())),
    history: this.crud.history,
  };

  public readonly config = SERVICE_COLUMNS;
  public readonly entityFactory = serviceFactory;

  private _all$: Observable<Service[]> | null = null;

  public getAndCacheAll(): Observable<Service[]> {
    if (!this._all$) {
      this._all$ = this.crud.getAll().pipe(map((res) => res.rows ?? []), shareReplay(1));
    }
    return this._all$;
  }

  private invalidateCache(): void {
    this._all$ = null;
  }
}
