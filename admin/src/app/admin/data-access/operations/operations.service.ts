import { Injectable } from "@angular/core";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { OPERATION_COLUMNS } from "app/admin/data-access/operations/operation.conf";
import {
  Operation,
  operationFactory,
} from "app/admin/data-access/operations/operation.model";
import { map, Observable, shareReplay, tap } from "rxjs";

const operationsEndpoint: string = "gateway/operations";

@Injectable({
  providedIn: "root",
})
export class OperationsService {
  private readonly crud = new CrudRepository<Operation>().with({
    endpoint: operationsEndpoint,
  });

  public readonly httpCalls: Calls<Operation> = {
    get: this.crud.get,
    create: (item) => this.crud.create(item).pipe(tap(() => this.invalidateCache())),
    update: (item) => this.crud.update(item).pipe(tap(() => this.invalidateCache())),
    archive: (ids) => this.crud.archive(ids).pipe(tap(() => this.invalidateCache())),
    restore: (ids) => this.crud.restore(ids).pipe(tap(() => this.invalidateCache())),
    history: this.crud.history,
  };

  public readonly config = OPERATION_COLUMNS;
  public readonly entityFactory = operationFactory;

  private _all$: Observable<Operation[]> | null = null;

  public getAndCacheAll(): Observable<Operation[]> {
    if (!this._all$) {
      this._all$ = this.crud.getAll().pipe(map((res) => res.rows ?? []), shareReplay(1));
    }
    return this._all$;
  }

  private invalidateCache(): void {
    this._all$ = null;
  }
}
