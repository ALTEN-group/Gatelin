import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { CONSUMER_COLUMNS } from "app/admin/data-access/consumers/consumer.conf";
import {
  Consumer,
  consumerFactory,
} from "app/admin/data-access/consumers/consumer.model";

const consumersApi: string = "gateway/consumers";

/**
 * Service to manage API consumers
 */
@Injectable({
  providedIn: "root",
})
export class ConsumersService {
  private readonly crud = new CrudRepository<Consumer>().with({
    endpoint: consumersApi,
  });

  public readonly httpCalls: Calls<Consumer> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    history: this.crud.history,
  };

  public readonly config = (payload: ActivatedRouteSnapshot) =>
    CONSUMER_COLUMNS(payload);
  public readonly entityFactory = consumerFactory;
}
