import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
import { CrudRepository } from "@dwtechs/crud-builder";
import { SCOPE_COLUMNS } from "app/admin/data-access/scopes/scope.conf";
import { scopeFactory } from "app/admin/data-access/scopes/scope.model";
const scopesEndpoint = "scopes";
let ScopesService = class ScopesService {
    constructor() {
        this.crud = new CrudRepository().with({
            endpoint: scopesEndpoint,
        });
        this.httpCalls = {
            get: this.crud.get,
            create: this.crud.create,
            update: this.crud.update,
            archive: this.crud.archive,
            restore: this.crud.restore,
            getHistory: this.crud.getHistory,
        };
        this.config = (payload) => SCOPE_COLUMNS(payload);
        this.entityFactory = scopeFactory;
    }
    getAndCacheAll() {
        return this.crud.getAndCacheAll();
    }
};
ScopesService = __decorate([
    Injectable({
        providedIn: "root",
    })
], ScopesService);
export { ScopesService };
//# sourceMappingURL=scopes.service.js.map