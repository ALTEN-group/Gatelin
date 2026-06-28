import { computed, inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { AdminEntity } from "@core/app-config/app.entities";
import { Calls, CrudRepository } from "@dwtechs/crud-builder";
import { SCOPE_COLUMNS } from "app/authorizations/data-access/scopes/scope.conf";
import { Scope, scopeFactory } from "app/authorizations/data-access/scopes/scope.model";
import { Observable } from "rxjs";

const scopesEndpoint: AdminEntity = "scopes";

@Injectable({
  providedIn: "root",
})
export class ScopesService {
  private readonly aclsService = inject(AclService);
  private readonly acls = computed(() =>
    this.aclsService.getEntityAcls(scopesEndpoint),
  );
  private readonly crud = new CrudRepository<Scope>().with({
    endpoint: scopesEndpoint,
  });

  public readonly httpCalls: Calls<Scope> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    getHistory: this.crud.getHistory,
  };

  public readonly config = (payload: ActivatedRouteSnapshot) =>
    SCOPE_COLUMNS(payload, this.acls());
  public readonly entityFactory = scopeFactory;

  public getAndCacheAll(): Observable<Scope[]> {
    return this.crud.getAndCacheAll();
  }
}
