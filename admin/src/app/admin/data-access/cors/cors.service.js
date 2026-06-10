import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
import { CrudRepository } from "@dwtechs/crud-builder";
import { CORS_COLUMNS } from "app/admin/data-access/cors/cors.conf";
import { corsFactory } from "app/admin/data-access/cors/cors.model";
const corsEndpoint = "cors";
let CorsService = class CorsService {
    constructor() {
        this.crud = new CrudRepository().with({
            endpoint: corsEndpoint,
        });
        this.httpCalls = {
            get: this.crud.get,
            create: this.crud.create,
            update: this.crud.update,
            archive: this.crud.archive,
            restore: this.crud.restore,
            getHistory: this.crud.getHistory,
        };
        this.config = CORS_COLUMNS();
        this.entityFactory = corsFactory;
    }
};
CorsService = __decorate([
    Injectable({
        providedIn: "root",
    })
], CorsService);
export { CorsService };
//# sourceMappingURL=cors.service.js.map