import { computed, inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { AdminEntity } from "@core/app-config/app.entities";
import { Calls, CrudRepository } from "@dwtechs/crud-builder";
import { buildServiceColumns } from "app/routing/data-access/services/service.conf";
import {
  Service,
  serviceFactory,
} from "app/routing/data-access/services/service.model";
import { map, Observable, shareReplay, tap } from "rxjs";

const servicesApi: AdminEntity = "services";

@Injectable({
  providedIn: "root",
})
export class ServicesService {
  private readonly aclsService = inject(AclService);
  private readonly acls = computed(() =>
    this.aclsService.getEntityAcls(servicesApi),
  );
  private readonly crud = new CrudRepository<Service>().with({
    endpoint: servicesApi,
  });

  public readonly httpCalls: Calls<Service> = {
    get: this.crud.get,
    create: (item) =>
      this.crud.create(item).pipe(tap(() => this.invalidateCache())),
    update: (item) =>
      this.crud.update(item).pipe(tap(() => this.invalidateCache())),
    archive: (ids) =>
      this.crud.archive(ids).pipe(tap(() => this.invalidateCache())),
    restore: (ids) =>
      this.crud.restore(ids).pipe(tap(() => this.invalidateCache())),
    getHistory: this.crud.getHistory,
  };

  public readonly config = (payload: ActivatedRouteSnapshot) =>
    buildServiceColumns(payload, this.acls());
  public readonly entityFactory = serviceFactory;

  private _all$: Observable<Service[]> | null = null;

  public getAndCacheAll(): Observable<Service[]> {
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
