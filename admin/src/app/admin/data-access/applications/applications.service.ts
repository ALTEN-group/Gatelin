import { Injectable } from "@angular/core";
import { Calls, CrudRepository } from "@dwtechs/crud-builder";
import { buildApplicationColumns } from "app/admin/data-access/applications/application.conf";
import {
    GatewayApplication,
    gatewayApplicationFactory,
} from "app/admin/data-access/applications/application.model";
import { Observable } from "rxjs";

const applicationsEndpoint: string = "gateway/applications";

@Injectable({
  providedIn: "root",
})
export class GatewayApplicationsService {
  private readonly crud = new CrudRepository<GatewayApplication>().with({
    endpoint: applicationsEndpoint,
  });

  public readonly httpCalls: Calls<GatewayApplication> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    getHistory: this.crud.getHistory,
  };

  public readonly config = buildApplicationColumns();
  public readonly entityFactory = gatewayApplicationFactory;

  public getAndCacheAll(): Observable<GatewayApplication[]> {
    return this.crud.getAndCacheAll();
  }
}
