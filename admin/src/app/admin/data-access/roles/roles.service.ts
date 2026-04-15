import { Injectable } from "@angular/core";
import { Calls, CrudRepository } from "@dwtechs/crud-builder";
import { ROLE_COLUMNS } from "app/admin/data-access/roles/role.conf";
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

  public readonly config = ROLE_COLUMNS;
  public readonly entityFactory = gatewayRoleFactory;

  public getAndCacheAll(): Observable<GatewayRole[]> {
    return this.crud.getAndCacheAll();
  }
}
