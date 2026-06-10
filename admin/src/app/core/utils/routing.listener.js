import { __decorate } from "tslib";
import { Injectable, inject } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { SidenavService } from "@core/ui/sidenav/sidenav.service";
import { filter, map } from "rxjs";
const loginUrl = "/login";
let RoutingListener = class RoutingListener {
    constructor() {
        this.router = inject(Router);
        this.sidenavService = inject(SidenavService);
        this.navigationEnd$ = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));
        this.navigationStart$ = this.router.events.pipe(filter((event) => event instanceof NavigationStart));
        this.routeManager$ = this.navigationEnd$.pipe(this.sidenavService.setActiveUrl());
        this.isLoginPage$ = this.routeManager$.pipe(map((event) => event.url.includes(loginUrl)));
    }
};
RoutingListener = __decorate([
    Injectable({ providedIn: "root" })
], RoutingListener);
export { RoutingListener };
//# sourceMappingURL=routing.listener.js.map