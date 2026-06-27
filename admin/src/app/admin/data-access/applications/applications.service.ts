import { computed, inject, Injectable } from "@angular/core";
import { AclService } from "@core/acl/acl.service";
import { AdminEntity } from "@core/app-config/app.entities";
import { Calls, CrudRepository } from "@dwtechs/crud-builder";
import { buildApplicationColumns } from "app/admin/data-access/applications/application.conf";
import {
  GatewayApplication,
  gatewayApplicationFactory,
} from "app/admin/data-access/applications/application.model";
import { Observable } from "rxjs";

const applicationsEndpoint: AdminEntity = "applications";

@Injectable({
  providedIn: "root",
})
export class GatewayApplicationsService {
  private readonly aclsService = inject(AclService);
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

  public readonly config = computed(() => buildApplicationColumns(this.acls()));
  public readonly entityFactory = gatewayApplicationFactory;

  public getAndCacheAll(): Observable<GatewayApplication[]> {
    return this.crud.getAndCacheAll();
  }
}
