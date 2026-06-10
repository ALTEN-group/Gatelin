import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
import { CrudRepository } from "@dwtechs/crud-builder";
import { buildApplicationColumns } from "app/admin/data-access/applications/application.conf";
import { gatewayApplicationFactory, } from "app/admin/data-access/applications/application.model";
const applicationsEndpoint = "applications";
let GatewayApplicationsService = class GatewayApplicationsService {
    constructor() {
        this.crud = new CrudRepository().with({
            endpoint: applicationsEndpoint,
        });
        this.httpCalls = {
            get: this.crud.get,
            create: this.crud.create,
            update: this.crud.update,
            archive: this.crud.archive,
            restore: this.crud.restore,
            getHistory: this.crud.getHistory,
        };
        this.config = buildApplicationColumns();
        this.entityFactory = gatewayApplicationFactory;
    }
    getAndCacheAll() {
        return this.crud.getAndCacheAll();
    }
};
GatewayApplicationsService = __decorate([
    Injectable({
        providedIn: "root",
    })
], GatewayApplicationsService);
export { GatewayApplicationsService };
//# sourceMappingURL=applications.service.js.map