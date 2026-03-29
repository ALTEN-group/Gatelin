import { Injectable } from "@angular/core";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { OPERATION_COLUMNS } from "app/admin/data-access/operations/operation.conf";
import {
  Operation,
  operationFactory,
} from "app/admin/data-access/operations/operation.model";
import { map, Observable } from "rxjs";

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
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    history: this.crud.history,
  };

  public readonly config = OPERATION_COLUMNS;
  public readonly entityFactory = operationFactory;

  public getAndCacheAll(): Observable<Operation[]> {
    return this.crud.getAll().pipe(map((res) => res.rows ?? []));
  }
}
