import { __decorate } from "tslib";
import { Injectable, inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { CrudRepository } from "@dwtechs/crud-builder";
import { buildOperationColumns } from "app/admin/data-access/operations/operation.conf";
import { operationFactory, } from "app/admin/data-access/operations/operation.model";
const operationsEndpoint = "operations";
let OperationsService = class OperationsService {
    constructor() {
        this.sanitizer = inject(DomSanitizer);
        this.crud = new CrudRepository().with({
            endpoint: operationsEndpoint,
        });
        this.httpCalls = {
            get: this.crud.get,
            create: this.crud.create,
            update: this.crud.update,
            archive: this.crud.archive,
            restore: this.crud.restore,
            getHistory: this.crud.getHistory,
        };
        this.config = buildOperationColumns(this.sanitizer);
        this.entityFactory = operationFactory;
    }
    getAndCacheAll() {
        return this.crud.getAndCacheAll();
    }
};
OperationsService = __decorate([
    Injectable({
        providedIn: "root",
    })
], OperationsService);
export { OperationsService };
//# sourceMappingURL=operations.service.js.map