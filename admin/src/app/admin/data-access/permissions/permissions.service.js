import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
import { CrudRepository } from "@dwtechs/crud-builder";
import { PERMISSION_COLUMNS } from "app/admin/data-access/permissions/permission.conf";
const permissionsEndpoint = "permissions";
let PermissionsService = class PermissionsService {
    constructor() {
        this.crud = new CrudRepository().with({
            endpoint: permissionsEndpoint,
        });
        this.httpCalls = {
            get: this.crud.get,
            create: this.crud.create,
            update: this.crud.update,
            archive: this.crud.archive,
        };
        this.config = (payload) => PERMISSION_COLUMNS(payload);
    }
    getByRole(roleId, event) {
        if (roleId === null)
            return this.crud.get(event);
        return this.crud.get({
            ...event,
            filters: {
                ...event.filters,
                roleId: { value: roleId, matchMode: "equals" },
            },
        });
    }
    getAll() {
        return this.crud.getAll();
    }
};
PermissionsService = __decorate([
    Injectable({
        providedIn: "root",
    })
], PermissionsService);
export { PermissionsService };
//# sourceMappingURL=permissions.service.js.map