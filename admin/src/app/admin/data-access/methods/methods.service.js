import { __decorate } from "tslib";
import { Injectable, inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { CrudRepository } from "@dwtechs/crud-builder";
import { buildMethodColumns } from "app/admin/data-access/methods/method.conf";
import { methodFactory, } from "app/admin/data-access/methods/method.model";
const methodsEndpoint = "methods";
let MethodsService = class MethodsService {
    constructor() {
        this.sanitizer = inject(DomSanitizer);
        this.crud = new CrudRepository().with({
            endpoint: methodsEndpoint,
        });
        this.httpCalls = {
            get: this.crud.get,
            update: this.crud.update,
        };
        this.config = buildMethodColumns(this.sanitizer);
        this.entityFactory = methodFactory;
    }
    getAndCacheAll() {
        return this.crud.getAndCacheAll();
    }
};
MethodsService = __decorate([
    Injectable({
        providedIn: "root",
    })
], MethodsService);
export { MethodsService };
//# sourceMappingURL=methods.service.js.map