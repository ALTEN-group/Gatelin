import { Injectable, inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Calls, CrudRepository } from "@dwtechs/crud-builder";
import { buildRoleColumns } from "app/admin/data-access/roles/role.conf";
import {
  GatewayRole,
  gatewayRoleFactory,
} from "app/admin/data-access/roles/role.model";
import { Observable } from "rxjs";

const rolesEndpoint: string = "gateway/roles";

@Injectable({
  providedIn: "root",
})
export class GatewayRolesService {
  private readonly sanitizer = inject(DomSanitizer);
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

  public readonly config = buildRoleColumns(this.sanitizer);
  public readonly entityFactory = gatewayRoleFactory;

  public getAndCacheAll(): Observable<GatewayRole[]> {
    return this.crud.getAndCacheAll();
  }
}
