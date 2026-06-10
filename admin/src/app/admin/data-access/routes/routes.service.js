import { __decorate } from "tslib";
import { Injectable, inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { CrudRepository } from "@dwtechs/crud-builder";
import { ROUTE_COLUMNS } from "app/admin/data-access/routes/route.conf";
import { routeFactory } from "app/admin/data-access/routes/route.model";
const routesApi = "routes";
/**
 * Service to manage gateway routes
 */
let RoutesService = class RoutesService {
    constructor() {
        this.sanitizer = inject(DomSanitizer);
        this.crud = new CrudRepository().with({
            endpoint: routesApi,
        });
        this.httpCalls = {
            get: this.crud.get,
            create: this.crud.create,
            update: this.crud.update,
            archive: this.crud.archive,
            restore: this.crud.restore,
            getHistory: this.crud.getHistory,
        };
        this.config = (payload) => ROUTE_COLUMNS(payload, this.sanitizer);
        this.entityFactory = routeFactory;
    }
    getAndCacheAll() {
        return this.crud.getAndCacheAll();
    }
};
RoutesService = __decorate([
    Injectable({
        providedIn: "root",
    })
], RoutesService);
export { RoutesService };
//# sourceMappingURL=routes.service.js.map