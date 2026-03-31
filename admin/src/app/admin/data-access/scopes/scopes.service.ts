import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { SCOPE_COLUMNS } from "app/admin/data-access/scopes/scope.conf";
import { Scope, scopeFactory } from "app/admin/data-access/scopes/scope.model";

const scopesEndpoint: string = "gateway/scopes";

@Injectable({
	providedIn: "root",
})
export class ScopesService {
	private readonly crud = new CrudRepository<Scope>().with({
		endpoint: scopesEndpoint,
	});

	public readonly httpCalls: Calls<Scope> = {
		get: this.crud.get,
		create: this.crud.create,
		update: this.crud.update,
		archive: this.crud.archive,
		restore: this.crud.restore,
		history: this.crud.history,
	};

	public readonly config = (payload: ActivatedRouteSnapshot) =>
		SCOPE_COLUMNS(payload);
	public readonly entityFactory = scopeFactory;
}
