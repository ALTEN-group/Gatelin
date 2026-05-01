import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Calls, CrudRepository } from "@dwtechs/crud-builder";
import { CONDITION_COLUMNS } from "app/admin/data-access/conditions/condition.conf";
import {
  Condition,
  conditionFactory,
} from "app/admin/data-access/conditions/condition.model";

const conditionsEndpoint: string = "conditions";

@Injectable({
  providedIn: "root",
})
export class ConditionsService {
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
    CONDITION_COLUMNS(payload);
  public readonly entityFactory = conditionFactory;
}
