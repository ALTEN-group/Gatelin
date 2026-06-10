import { __decorate } from "tslib";
import { inject, Injectable } from "@angular/core";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { LocalStorageService } from "@core/utils/local-storage/local-storage.service";
let TokenService = class TokenService {
    constructor() {
        this.localStorageService = inject(LocalStorageService);
        this.keys = inject(APP_CONFIG).storageKeys;
        this.accessTokenKey = this.keys.TOKEN;
        this.refreshTokenKey = this.keys.REFRESH_TOKEN;
    }
    saveAccessToken(accessToken) {
        this.localStorageService.setItem(this.accessTokenKey, accessToken);
    }
    getAccessToken() {
        return this.localStorageService.getItem(this.accessTokenKey);
    }
    deleteAccessToken() {
        this.localStorageService.removeItem(this.accessTokenKey);
    }
    getRefreshToken() {
        return this.localStorageService.getItem(this.refreshTokenKey);
    }
    saveRefreshToken(refreshToken) {
        this.localStorageService.setItem(this.refreshTokenKey, refreshToken);
    }
    deleteRefreshToken() {
        this.localStorageService.removeItem(this.refreshTokenKey);
    }
};
TokenService = __decorate([
    Injectable({
        providedIn: "root",
    })
], TokenService);
export { TokenService };
//# sourceMappingURL=token.service.js.map