import { computed, inject, Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRouteSnapshot } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { AdminEntity } from "@core/app-config/app.entities";
import { Calls, CrudRepository } from "@dwtechs/crud-builder";
import { CONSUMER_COLUMNS } from "app/consumers/data-access/consumers/consumer.conf";
import {
  Consumer,
  consumerFactory,
} from "app/consumers/data-access/consumers/consumer.model";

const consumersApi: AdminEntity = "consumers";

/**
 * Service to manage API consumers
 */
@Injectable({
  providedIn: "root",
})
export class ConsumersService {
  private readonly aclsService = inject(AclService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly acls = computed(() =>
    this.aclsService.getEntityAcls(consumersApi),
  );
  private readonly crud = new CrudRepository<Consumer>().with({
    endpoint: consumersApi,
  });

  public readonly httpCalls: Calls<Consumer> = {
    get: this.crud.get,
    archive: this.crud.archive,
    restore: this.crud.restore,
    getHistory: this.crud.getHistory,
  };

  public readonly config = (payload: ActivatedRouteSnapshot) =>
    CONSUMER_COLUMNS(payload, this.acls(), this.sanitizer);
  public readonly entityFactory = consumerFactory;
}
