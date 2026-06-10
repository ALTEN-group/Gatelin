import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
import { CrudRepository } from "@dwtechs/crud-builder";
import { RESOURCE_COLUMNS } from "app/admin/data-access/resources/resource.conf";
import { resourceFactory, } from "app/admin/data-access/resources/resource.model";
const resourcesEndpoint = "resources";
let ResourcesService = class ResourcesService {
    constructor() {
        this.crud = new CrudRepository().with({
            endpoint: resourcesEndpoint,
        });
        this.httpCalls = {
            get: this.crud.get,
            create: this.crud.create,
            update: this.crud.update,
            archive: this.crud.archive,
            restore: this.crud.restore,
            getHistory: this.crud.getHistory,
        };
        this.config = (payload) => RESOURCE_COLUMNS(payload);
        this.entityFactory = resourceFactory;
    }
    getAndCacheAll() {
        return this.crud.getAndCacheAll();
    }
};
ResourcesService = __decorate([
    Injectable({
        providedIn: "root",
    })
], ResourcesService);
export { ResourcesService };
//# sourceMappingURL=resources.service.js.map