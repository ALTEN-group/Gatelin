import { computed, inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { AdminEntity } from "@core/app-config/app.entities";
import { Calls, CrudRepository } from "@dwtechs/crud-builder";
import { CONDITION_COLUMNS } from "app/authorizations/data-access/conditions/condition.conf";
import {
  Condition,
  conditionFactory,
} from "app/authorizations/data-access/conditions/condition.model";
import { Observable } from "rxjs";

const conditionsEndpoint: AdminEntity = "conditions";

@Injectable({
  providedIn: "root",
})
export class ConditionsService {
  private readonly aclsService = inject(AclService);
  private readonly acls = computed(() =>
    this.aclsService.getEntityAcls(conditionsEndpoint),
  );
  private readonly crud = new CrudRepository<Condition>().with({
    endpoint: conditionsEndpoint,
  });

  public readonly httpCalls: Calls<Condition> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    getHistory: this.crud.getHistory,
  };

  public readonly config = (payload: ActivatedRouteSnapshot) =>
    CONDITION_COLUMNS(payload, this.acls());
  public readonly entityFactory = conditionFactory;

  public getAndCacheAll(): Observable<Condition[]> {
    return this.crud.getAndCacheAll();
  }
}
