import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
import { CrudRepository } from "@dwtechs/crud-builder";
import { FIELD_COLUMNS } from "app/admin/data-access/fields/field.conf";
import { fieldFactory } from "app/admin/data-access/fields/field.model";
const fieldsEndpoint = "fields";
let FieldsService = class FieldsService {
    constructor() {
        this.crud = new CrudRepository().with({
            endpoint: fieldsEndpoint,
        });
        this.httpCalls = {
            get: this.crud.get,
            create: this.crud.create,
            update: this.crud.update,
            archive: this.crud.archive,
            restore: this.crud.restore,
            getHistory: this.crud.getHistory,
        };
        this.config = (payload) => FIELD_COLUMNS(payload);
        this.entityFactory = fieldFactory;
    }
    getAndCacheAll() {
        return this.crud.getAndCacheAll();
    }
};
FieldsService = __decorate([
    Injectable({
        providedIn: "root",
    })
], FieldsService);
export { FieldsService };
//# sourceMappingURL=fields.service.js.map