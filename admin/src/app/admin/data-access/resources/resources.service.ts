import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { RESOURCE_COLUMNS } from "app/admin/data-access/resources/resource.conf";
import {
  Resource,
  resourceFactory,
} from "app/admin/data-access/resources/resource.model";
import { Observable } from "rxjs";

const resourcesEndpoint: string = "gateway/resources";

@Injectable({
  providedIn: "root",
})
export class ResourcesService {
  private readonly crud = new CrudRepository<Resource>().with({
    endpoint: resourcesEndpoint,
  });

  public readonly httpCalls: Calls<Resource> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    history: this.crud.history,
  };

  public readonly config = (payload: ActivatedRouteSnapshot) =>
    RESOURCE_COLUMNS(payload);
  public readonly entityFactory = resourceFactory;

  public getAndCacheAll(): Observable<Resource[]> {
    return this.crud.getAndCacheAll();
  }
}
