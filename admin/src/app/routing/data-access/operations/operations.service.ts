import {
  computed,
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { AclService } from "@core/acl/acl.service";
import { AdminEntity } from "@core/app-config/app.entities";
import { Calls, CrudRepository } from "@dwtechs/ngx-crud-builder";
import { buildOperationColumns } from "app/routing/data-access/operations/operation.conf";
import {
  Operation,
  operationFactory,
} from "app/routing/data-access/operations/operation.model";
import { Observable } from "rxjs";

const operationsEndpoint: AdminEntity = "operations";

@Injectable({
  providedIn: "root",
})
export class OperationsService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly aclsService = inject(AclService);
  private readonly injector = inject(Injector);

  private readonly acls = computed(() =>
    this.aclsService.getEntityAcls(operationsEndpoint),
  );

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

  public readonly config = computed(() =>
    runInInjectionContext(this.injector, () =>
      buildOperationColumns(this.sanitizer, this.acls()),
    ),
  );
  public readonly entityFactory = operationFactory;

  public getAndCacheAll(): Observable<Operation[]> {
    return this.crud.getAndCacheAll();
  }
}
