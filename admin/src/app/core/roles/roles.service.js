import { __decorate } from "tslib";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { catchError, map, of, tap } from "rxjs";
let RolesService = class RolesService {
    constructor() {
        this.http = inject(HttpClient);
        this.apiPrefix = inject(APP_CONFIG).apiGateway;
        this.endPoint = `${this.apiPrefix}roles/`;
        // Roles cache
        this._roles = null;
        this.httpSearch = (payload) => this.http.post(`${this.endPoint}search`, payload ?? {});
    }
    get roles() {
        return this._roles ?? [];
    }
    storeRoles(roles) {
        this._roles = roles;
    }
    resetRoles() {
        this._roles = null;
    }
    getAll() {
        if (this._roles)
            return of(this._roles);
        return this.httpSearch().pipe(map((res) => res.rows), tap((roles) => this.storeRoles(roles)), catchError(() => of([])));
    }
};
RolesService = __decorate([
    Injectable({ providedIn: "root" })
], RolesService);
export { RolesService };
//# sourceMappingURL=roles.service.js.map