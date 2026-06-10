import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
import { CrudRepository } from "@dwtechs/crud-builder";
import { CONSUMER_COLUMNS } from "app/admin/data-access/consumers/consumer.conf";
import { consumerFactory, } from "app/admin/data-access/consumers/consumer.model";
const consumersApi = "consumers";
/**
 * Service to manage API consumers
 */
let ConsumersService = class ConsumersService {
    constructor() {
        this.crud = new CrudRepository().with({
            endpoint: consumersApi,
        });
        this.httpCalls = {
            get: this.crud.get,
            archive: this.crud.archive,
            restore: this.crud.restore,
            getHistory: this.crud.getHistory,
        };
        this.config = (payload) => CONSUMER_COLUMNS(payload);
        this.entityFactory = consumerFactory;
    }
};
ConsumersService = __decorate([
    Injectable({
        providedIn: "root",
    })
], ConsumersService);
export { ConsumersService };
//# sourceMappingURL=consumers.service.js.map