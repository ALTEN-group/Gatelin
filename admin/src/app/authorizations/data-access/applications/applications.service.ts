import {
  computed,
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from "@angular/core";
import { AclService } from "@core/acl/acl.service";
import { AdminEntity } from "@core/app-config/app.entities";
import { Calls, CrudRepository } from "@dwtechs/ngx-crud-builder";
import { buildApplicationColumns } from "app/authorizations/data-access/applications/application.conf";
import {
  GatewayApplication,
  gatewayApplicationFactory,
} from "app/authorizations/data-access/applications/application.model";
import { Observable } from "rxjs";

const applicationsEndpoint: AdminEntity = "applications";

@Injectable({
  providedIn: "root",
})
export class GatewayApplicationsService {
  private readonly aclsService = inject(AclService);
  private readonly injector = inject(Injector);
  private readonly acls = computed(() =>
    this.aclsService.getEntityAcls(applicationsEndpoint),
  );
  private readonly crud = new CrudRepository<GatewayApplication>().with({
    endpoint: applicationsEndpoint,
  });

  public readonly httpCalls: Calls<GatewayApplication> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    getHistory: this.crud.getHistory,
  };

  public readonly config = computed(() =>
    runInInjectionContext(this.injector, () =>
      buildApplicationColumns(this.acls()),
    ),
  );
  public readonly entityFactory = gatewayApplicationFactory;

  public getAndCacheAll(): Observable<GatewayApplication[]> {
    return this.crud.getAndCacheAll();
  }
}
