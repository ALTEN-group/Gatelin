import { computed, inject, Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRouteSnapshot } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { AdminEntity } from "@core/app-config/app.entities";
import { Calls, CrudRepository } from "@dwtechs/crud-builder";
import { buildRoleColumns } from "app/admin/data-access/roles/role.conf";
import {
  GatewayRole,
  gatewayRoleFactory,
} from "app/admin/data-access/roles/role.model";
import { Observable } from "rxjs";

const rolesEndpoint: AdminEntity = "roles";

@Injectable({
  providedIn: "root",
})
export class GatewayRolesService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly aclsService = inject(AclService);
  private readonly acls = computed(() =>
    this.aclsService.getEntityAcls(rolesEndpoint),
  );
  private readonly crud = new CrudRepository<GatewayRole>().with({
    endpoint: rolesEndpoint,
  });

  public readonly httpCalls: Calls<GatewayRole> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    getHistory: this.crud.getHistory,
  };

  public readonly config = (payload: ActivatedRouteSnapshot) =>
    buildRoleColumns(this.sanitizer, payload, this.acls());
  public readonly entityFactory = gatewayRoleFactory;

  public getAndCacheAll(): Observable<GatewayRole[]> {
    return this.crud.getAndCacheAll();
  }
}
