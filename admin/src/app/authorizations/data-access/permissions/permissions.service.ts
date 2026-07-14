import { computed, inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { AdminEntity } from "@core/app-config/app.entities";
import { Calls, CrudRepository, RowsAndCount } from "@dwtechs/ngx-crud-builder";
import { PERMISSION_COLUMNS } from "app/authorizations/data-access/permissions/permission.conf";
import { Permission } from "app/authorizations/data-access/permissions/permission.model";
import { TableLazyLoadEvent } from "primeng/table";
import { Observable } from "rxjs";

const permissionsEndpoint: AdminEntity = "permissions";

@Injectable({
  providedIn: "root",
})
export class PermissionsService {
  private readonly aclsService = inject(AclService);
  private readonly acls = computed(() =>
    this.aclsService.getEntityAcls(permissionsEndpoint),
  );
  private readonly crud = new CrudRepository<Permission>().with({
    endpoint: permissionsEndpoint,
  });

  public readonly httpCalls: Calls<Permission> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
  };

  public readonly config = (payload: ActivatedRouteSnapshot) =>
    PERMISSION_COLUMNS(payload, this.acls());

  public getByRole(
    roleId: number | null,
    event: TableLazyLoadEvent,
  ): Observable<RowsAndCount<Permission>> {
    if (roleId === null) return this.crud.get(event);
    return this.crud.get({
      ...event,
      filters: {
        ...event.filters,
        roleId: { value: roleId, matchMode: "equals" },
      },
    });
  }

  public getAll(): Observable<RowsAndCount<Permission>> {
    return this.crud.getAll();
  }
}
