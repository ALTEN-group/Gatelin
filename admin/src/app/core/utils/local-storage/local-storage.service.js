import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
let LocalStorageService = class LocalStorageService {
    getItem(key) {
        return localStorage.getItem(key);
    }
    setItem(key, data) {
        localStorage.setItem(key, data);
    }
    removeItem(key) {
        localStorage.removeItem(key);
    }
};
LocalStorageService = __decorate([
    Injectable({
        providedIn: "root",
    })
], LocalStorageService);
export { LocalStorageService };
//# sourceMappingURL=local-storage.service.js.map