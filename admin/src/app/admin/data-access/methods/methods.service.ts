import { Injectable, inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Calls, CrudRepository } from "@dwtechs/crud-builder";
import { buildMethodColumns } from "app/admin/data-access/methods/method.conf";
import {
  Method,
  methodFactory,
} from "app/admin/data-access/methods/method.model";
import { Observable } from "rxjs";

const methodsEndpoint: string = "methods";

@Injectable({
  providedIn: "root",
})
export class MethodsService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly crud = new CrudRepository<Method>().with({
    endpoint: methodsEndpoint,
  });

  public readonly httpCalls: Calls<Method> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
  };

  public readonly config = buildMethodColumns(this.sanitizer);
  public readonly entityFactory = methodFactory;

  public getAndCacheAll(): Observable<Method[]> {
    return this.crud.getAndCacheAll();
  }
}
