import { Injectable, inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Calls, CrudRepository } from "@dwtechs/crud-builder";
import { buildOperationColumns } from "app/admin/data-access/operations/operation.conf";
import {
  Operation,
  operationFactory,
} from "app/admin/data-access/operations/operation.model";
import { Observable } from "rxjs";

const operationsEndpoint: string = "gateway/operations";

@Injectable({
  providedIn: "root",
})
export class OperationsService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly crud = new CrudRepository<Operation>().with({
    endpoint: operationsEndpoint,
  });

  public readonly httpCalls: Calls<Operation> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    getHistory: this.crud.getHistory,
  };

  public readonly config = buildOperationColumns(this.sanitizer);
  public readonly entityFactory = operationFactory;

  public getAndCacheAll(): Observable<Operation[]> {
    return this.crud.getAndCacheAll();
  }
}
