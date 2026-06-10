import { __decorate } from "tslib";
import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { TokenService } from "@core/auth/token.service";
import { of, pipe } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
let AuthenticationService = class AuthenticationService {
    constructor() {
        this.http = inject(HttpClient);
        this.router = inject(Router);
        this.route = inject(ActivatedRoute);
        this.tokenService = inject(TokenService);
        this.aclService = inject(AclService);
        this.apiPrefix = inject(APP_CONFIG).apiGateway;
        this.apiUsers = inject(APP_CONFIG).apiUsers;
        this.sessionApi = `${this.apiPrefix}sessions`;
        this.meApi = `${this.apiUsers}users/me`;
        this._isAuthenticated = signal(false);
        this.isAuthenticated = this._isAuthenticated.asReadonly();
        this._user = signal(undefined);
        this.user = this._user.asReadonly();
    }
    login(email, pwd) {
        if (!email || !pwd)
            return of(false);
        const payload = { email, pwd };
        return this.http.post(this.sessionApi, payload).pipe(tap((res) => {
            const { accessToken, refreshToken, permissions } = res;
            this.saveTokens(accessToken, refreshToken);
            this.authenticate();
            this.aclService.storeAccessLevels(permissions);
        }), this.getUserBasics(), tap(() => this.redirectToApp()), map(() => true), catchError(() => of(false)));
    }
    logout() {
        return this.http.delete(this.sessionApi, {}).pipe(tap(() => {
            this.tokenService.deleteAccessToken();
            this.tokenService.deleteRefreshToken();
            this.resetCurrentUser();
            this.redirectToLogin();
        }), catchError(() => of()));
    }
    refreshToken() {
        const refreshToken = this.tokenService.getRefreshToken();
        if (refreshToken)
            return this.http
                .put(this.sessionApi, {
                refreshToken,
            })
                .pipe(tap((res) => {
                const { accessToken, refreshToken, permissions } = res ?? {};
                if (!accessToken || !refreshToken)
                    return;
                this.saveTokens(accessToken, refreshToken);
                this.authenticate();
                this.aclService.resetAccessLevels();
                if (permissions)
                    this.aclService.storeAccessLevels(permissions);
            }), map((res) => !!res), catchError(() => {
                return of(false);
            }));
        return of(false);
    }
    updateUser(nickname, firstName, lastName) {
        this._user.update((u) => ({ ...u, nickname, firstName, lastName }));
    }
    // Get user basics info
    getUserBasics() {
        return pipe(switchMap(() => this.getAccount()));
    }
    getAccount() {
        return this.http.get(this.meApi).pipe(tap((res) => {
            const { nickname, firstName, lastName } = res;
            this.updateUser(nickname, firstName, lastName);
        }), map(() => this._user() ?? null), catchError(() => {
            return of(null);
        }));
    }
    redirectToLogin() {
        this.router.navigate(["/login"], {
            queryParams: { returnUrl: this.router.url },
        });
    }
    redirectToApp() {
        const returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");
        if (returnUrl)
            this.router.navigate([returnUrl]);
        else
            this.router.navigate(["/"]);
    }
    resetCurrentUser() {
        this._isAuthenticated.set(false);
        this._user.set(undefined);
        this.aclService.resetAccessLevels();
    }
    saveTokens(accessToken, refreshToken) {
        this.tokenService.saveAccessToken(accessToken);
        this.tokenService.saveRefreshToken(refreshToken);
    }
    authenticate() {
        this._isAuthenticated.set(true);
    }
};
AuthenticationService = __decorate([
    Injectable({
        providedIn: "root",
    })
], AuthenticationService);
export { AuthenticationService };
//# sourceMappingURL=auth.service.js.map