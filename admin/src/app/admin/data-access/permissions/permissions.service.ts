import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Calls, CrudRepository, RowsAndCount } from "@dwtechs/crud-builder";
import { PERMISSION_COLUMNS } from "app/admin/data-access/permissions/permission.conf";
import { Permission } from "app/admin/data-access/permissions/permission.model";
import { TableLazyLoadEvent } from "primeng/table";
import { Observable } from "rxjs";

const permissionsEndpoint: string = "permissions";

@Injectable({
  providedIn: "root",
})
export class PermissionsService {
  private readonly crud = new CrudRepository<Permission>().with({
    endpoint: permissionsEndpoint,
  });

  public readonly httpCalls: Calls<Permission> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
  };

  public readonly config = (payload: ActivatedRouteSnapshot) =>
    PERMISSION_COLUMNS(payload);

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
