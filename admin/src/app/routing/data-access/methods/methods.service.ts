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
import { Calls, CrudRepository } from "@dwtechs/crud-builder";
import { buildMethodColumns } from "app/routing/data-access/methods/method.conf";
import {
  Method,
  methodFactory,
} from "app/routing/data-access/methods/method.model";
import { Observable } from "rxjs";

const methodsEndpoint: AdminEntity = "methods";

@Injectable({
  providedIn: "root",
})
export class MethodsService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly aclsService = inject(AclService);
  private readonly injector = inject(Injector);
  private readonly acls = computed(() =>
    this.aclsService.getEntityAcls(methodsEndpoint),
  );
  private readonly crud = new CrudRepository<Method>().with({
    endpoint: methodsEndpoint,
  });

  public readonly httpCalls: Calls<Method> = {
    get: this.crud.get,
    update: this.crud.update,
  };

  public readonly config = computed(() =>
    runInInjectionContext(this.injector, () =>
      buildMethodColumns(this.sanitizer, this.acls()),
    ),
  );
  public readonly entityFactory = methodFactory;

  public getAndCacheAll(): Observable<Method[]> {
    return this.crud.getAndCacheAll();
  }
}
