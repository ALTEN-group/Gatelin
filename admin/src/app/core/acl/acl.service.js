import { __decorate } from "tslib";
import { Injectable, signal } from "@angular/core";
import { BASE_ACLS } from "@core/app-config/app.acls";
let AclService = class AclService {
    constructor() {
        this._accessLevels = signal({});
        this.accessLevels = this._accessLevels.asReadonly();
        this._areAclResolved = signal(false);
        this.areAclResolved = this._areAclResolved.asReadonly();
    }
    hasAccess(functionality, operation) {
        if (!functionality)
            return true;
        const funcAcls = this.accessLevels()[functionality];
        if (!funcAcls)
            return false;
        if (operation)
            return funcAcls[operation] || false;
        return funcAcls.get || false;
    }
    storeAccessLevels(userPermissions) {
        if (this._accessLevels().size)
            return;
        const acls = this.buildAcls(userPermissions);
        this._accessLevels.set(acls);
        this._areAclResolved.set(true);
    }
    resetAccessLevels() {
        this._accessLevels.set({});
    }
    buildAcls(userPermissions) {
        const userAcls = {};
        for (const functionality in BASE_ACLS) {
            userAcls[functionality] = {};
            const routes = BASE_ACLS[functionality];
            for (const route in routes) {
                const routeId = routes[route];
                const hasPermission = userPermissions.some((perm) => perm.route === routeId);
                // transform routeId to access true/false
                userAcls[functionality][route] = hasPermission;
            }
        }
        return userAcls;
    }
};
AclService = __decorate([
    Injectable({ providedIn: "root" })
], AclService);
export { AclService };
//# sourceMappingURL=acl.service.js.map