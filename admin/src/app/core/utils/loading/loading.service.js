import { __decorate } from "tslib";
import { Injectable, signal } from "@angular/core";
let LoadingService = class LoadingService {
    constructor() {
        this.defaultMode = "bar";
        this._isLoading = signal(false);
        this._mode = signal(this.defaultMode);
        this.isLoading = this._isLoading.asReadonly();
        this.mode = this._mode.asReadonly();
    }
    start(mode = this.defaultMode) {
        this._mode.set(mode);
        this._isLoading.set(true);
    }
    stop() {
        this._isLoading.set(false);
    }
};
LoadingService = __decorate([
    Injectable({
        providedIn: "root",
    })
], LoadingService);
export { LoadingService };
//# sourceMappingURL=loading.service.js.map