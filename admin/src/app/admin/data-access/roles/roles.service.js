import { __decorate } from "tslib";
import { Injectable, inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { CrudRepository } from "@dwtechs/crud-builder";
import { buildRoleColumns } from "app/admin/data-access/roles/role.conf";
import { gatewayRoleFactory, } from "app/admin/data-access/roles/role.model";
const rolesEndpoint = "roles";
let GatewayRolesService = class GatewayRolesService {
    constructor() {
        this.sanitizer = inject(DomSanitizer);
        this.crud = new CrudRepository().with({
            endpoint: rolesEndpoint,
        });
        this.httpCalls = {
            get: this.crud.get,
            create: this.crud.create,
            update: this.crud.update,
            archive: this.crud.archive,
            restore: this.crud.restore,
            getHistory: this.crud.getHistory,
        };
        this.config = (payload) => buildRoleColumns(this.sanitizer, payload);
        this.entityFactory = gatewayRoleFactory;
    }
    getAndCacheAll() {
        return this.crud.getAndCacheAll();
    }
};
GatewayRolesService = __decorate([
    Injectable({
        providedIn: "root",
    })
], GatewayRolesService);
export { GatewayRolesService };
//# sourceMappingURL=roles.service.js.map