import { Injectable } from "@angular/core";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { CORS_COLUMNS } from "app/admin/data-access/cors/cors.conf";
import { Cors, corsFactory } from "app/admin/data-access/cors/cors.model";

const corsEndpoint: string = "gateway/cors";

@Injectable({
  providedIn: "root",
})
export class CorsService {
  private readonly crud = new CrudRepository<Cors>().with({
    endpoint: corsEndpoint,
  });

  public readonly httpCalls: Calls<Cors> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    history: this.crud.history,
  };

  public readonly config = CORS_COLUMNS;
  public readonly entityFactory = corsFactory;
}
