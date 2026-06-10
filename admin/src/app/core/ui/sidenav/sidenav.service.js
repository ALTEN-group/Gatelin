import { __decorate } from "tslib";
import { computed, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { fromEvent, tap } from "rxjs";
import { debounceTime } from "rxjs/operators";
let SidenavService = class SidenavService {
    constructor() {
        this.appConfig = inject(APP_CONFIG);
        this.baseSideNavItems = this.appConfig.sidenavItems;
        this._expanded = signal(true);
        this._pinned = signal(true);
        this._isMobileDisplay = signal(false);
        this._activeUrl = signal(null);
        this.activeUrl = this._activeUrl.asReadonly();
        this._alertKeys = signal(new Set());
        this.alertKeys = this._alertKeys.asReadonly();
        this.resize$ = fromEvent(window, "resize").pipe(debounceTime(150), takeUntilDestroyed());
        this.isExpanded = computed(() => this._expanded() || this._pinned());
        this.updateMobileState();
        this.resize$.subscribe(() => this.updateMobileState());
    }
    updateMobileState() {
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth <= 768;
        if (isMobile !== this._isMobileDisplay()) {
            this._isMobileDisplay.set(isMobile);
            if (isMobile) {
                this._pinned.set(false);
                this._expanded.set(false);
            }
            else {
                this._pinned.set(true);
                this._expanded.set(true);
            }
        }
    }
    setActiveUrl() {
        return tap((event) => this._activeUrl.set(event.url));
    }
    addAlertKey(key) {
        this._alertKeys.update((keys) => {
            keys.add(key);
            return new Set(keys);
        });
    }
    removeAlertKey(key) {
        this._alertKeys.update((keys) => {
            keys.delete(key);
            return new Set(keys);
        });
    }
    getExpanded() {
        return this.isExpanded();
    }
    getPinned() {
        return this._pinned();
    }
    getMobileDisplay() {
        return this._isMobileDisplay();
    }
    toggleExpanded() {
        this._expanded.update((val) => !val);
    }
    setExpanded(expanded) {
        this._expanded.set(expanded);
    }
    togglePinned() {
        this._pinned.update((val) => !val);
    }
};
SidenavService = __decorate([
    Injectable({
        providedIn: "root",
    })
], SidenavService);
export { SidenavService };
//# sourceMappingURL=sidenav.service.js.map