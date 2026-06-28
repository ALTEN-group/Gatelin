import {
  computed,
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from "@angular/core";
import { AclService } from "@core/acl/acl.service";
import { AdminEntity } from "@core/app-config/app.entities";
import { Calls, CrudRepository } from "@dwtechs/crud-builder";
import { CORS_COLUMNS } from "app/authorizations/data-access/cors/cors.conf";
import { Cors, corsFactory } from "app/authorizations/data-access/cors/cors.model";

const corsEndpoint: AdminEntity = "cors";

@Injectable({
  providedIn: "root",
})
export class CorsService {
  private readonly aclsService = inject(AclService);
  private readonly injector = inject(Injector);
  private readonly acls = computed(() =>
    this.aclsService.getEntityAcls(corsEndpoint),
  );
  private readonly crud = new CrudRepository<Cors>().with({
    endpoint: corsEndpoint,
  });

  public readonly httpCalls: Calls<Cors> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    getHistory: this.crud.getHistory,
  };

  public readonly config = computed(() =>
    runInInjectionContext(this.injector, () => CORS_COLUMNS(this.acls())),
  );
  public readonly entityFactory = corsFactory;
}
