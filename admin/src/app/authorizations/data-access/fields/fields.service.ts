import { computed, inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { AdminEntity } from "@core/app-config/app.entities";
import { Calls, CrudRepository } from "@dwtechs/crud-builder";
import { FIELD_COLUMNS } from "app/authorizations/data-access/fields/field.conf";
import { Field, fieldFactory } from "app/authorizations/data-access/fields/field.model";
import { Observable } from "rxjs";

const fieldsEndpoint: AdminEntity = "fields";

@Injectable({
  providedIn: "root",
})
export class FieldsService {
  private readonly aclsService = inject(AclService);
  private readonly acls = computed(() =>
    this.aclsService.getEntityAcls(fieldsEndpoint),
  );
  private readonly crud = new CrudRepository<Field>().with({
    endpoint: fieldsEndpoint,
  });

  public readonly httpCalls: Calls<Field> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    getHistory: this.crud.getHistory,
  };

  public readonly config = (payload: ActivatedRouteSnapshot) =>
    FIELD_COLUMNS(payload, this.acls());
  public readonly entityFactory = fieldFactory;

  public getAndCacheAll(): Observable<Field[]> {
    return this.crud.getAndCacheAll();
  }
}
