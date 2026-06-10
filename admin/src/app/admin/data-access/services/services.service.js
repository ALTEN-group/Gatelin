import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
import { CrudRepository } from "@dwtechs/crud-builder";
import { buildServiceColumns } from "app/admin/data-access/services/service.conf";
import { serviceFactory, } from "app/admin/data-access/services/service.model";
import { map, shareReplay, tap } from "rxjs";
const servicesApi = "services";
let ServicesService = class ServicesService {
    constructor() {
        this.crud = new CrudRepository().with({
            endpoint: servicesApi,
        });
        this.httpCalls = {
            get: this.crud.get,
            create: (item) => this.crud.create(item).pipe(tap(() => this.invalidateCache())),
            update: (item) => this.crud.update(item).pipe(tap(() => this.invalidateCache())),
            archive: (ids) => this.crud.archive(ids).pipe(tap(() => this.invalidateCache())),
            restore: (ids) => this.crud.restore(ids).pipe(tap(() => this.invalidateCache())),
            getHistory: this.crud.getHistory,
        };
        this.config = (payload) => buildServiceColumns(payload);
        this.entityFactory = serviceFactory;
        this._all$ = null;
    }
    getAndCacheAll() {
        if (!this._all$) {
            this._all$ = this.crud.getAll().pipe(map((res) => res.rows ?? []), shareReplay(1));
        }
        return this._all$;
    }
    invalidateCache() {
        this._all$ = null;
    }
};
ServicesService = __decorate([
    Injectable({
        providedIn: "root",
    })
], ServicesService);
export { ServicesService };
//# sourceMappingURL=services.service.js.map