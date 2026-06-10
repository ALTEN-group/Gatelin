import { __decorate } from "tslib";
import { effect, inject, Injectable, signal } from "@angular/core";
import { APP_CONFIG } from "@core/app-config/app-config.token";
let ThemeService = class ThemeService {
    constructor() {
        this.storageKeys = inject(APP_CONFIG).storageKeys;
        this._theme = signal("light");
        this.theme = this._theme.asReadonly();
        this._setTheme = effect(() => {
            this.applyTheme(this._theme());
        });
        this.init();
    }
    toggleTheme() {
        this._theme.set(this._theme() === "dark" ? "light" : "dark");
    }
    init() {
        const storedTheme = localStorage.getItem(this.storageKeys.THEME);
        const theme = this.validateTheme(storedTheme) ? storedTheme : "light";
        this._theme.set(theme);
    }
    applyTheme(theme) {
        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(theme);
        localStorage.setItem(this.storageKeys.THEME, theme);
    }
    validateTheme(theme) {
        return theme === "dark" || theme === "light";
    }
};
ThemeService = __decorate([
    Injectable({ providedIn: "root" })
], ThemeService);
export { ThemeService };
//# sourceMappingURL=theme.service.js.map