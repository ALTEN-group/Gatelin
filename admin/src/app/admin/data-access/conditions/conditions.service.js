import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
import { CrudRepository } from "@dwtechs/crud-builder";
import { CONDITION_COLUMNS } from "app/admin/data-access/conditions/condition.conf";
import { conditionFactory, } from "app/admin/data-access/conditions/condition.model";
const conditionsEndpoint = "conditions";
let ConditionsService = class ConditionsService {
    constructor() {
        this.crud = new CrudRepository().with({
            endpoint: conditionsEndpoint,
        });
        this.httpCalls = {
            get: this.crud.get,
            create: this.crud.create,
            update: this.crud.update,
            archive: this.crud.archive,
            restore: this.crud.restore,
            getHistory: this.crud.getHistory,
        };
        this.config = (payload) => CONDITION_COLUMNS(payload);
        this.entityFactory = conditionFactory;
    }
    getAndCacheAll() {
        return this.crud.getAndCacheAll();
    }
};
ConditionsService = __decorate([
    Injectable({
        providedIn: "root",
    })
], ConditionsService);
export { ConditionsService };
//# sourceMappingURL=conditions.service.js.map