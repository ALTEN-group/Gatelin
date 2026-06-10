import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, computed, inject, } from "@angular/core";
import { ThemeService } from "@core/ui/theme-toggle-button/theme.service";
let ThemeToggleButtonComponent = class ThemeToggleButtonComponent {
    constructor() {
        this.themeService = inject(ThemeService);
        this.isDarkMode = computed(() => this.themeService.theme() === "dark");
    }
    toggleMode() {
        this.themeService.toggleTheme();
    }
};
ThemeToggleButtonComponent = __decorate([
    Component({
        selector: "adm-theme-toggle-button",
        changeDetection: ChangeDetectionStrategy.OnPush,
        templateUrl: "./theme-toggle-button.component.html",
        styleUrls: ["./theme-toggle-button.component.scss"],
    })
], ThemeToggleButtonComponent);
export { ThemeToggleButtonComponent };
//# sourceMappingURL=theme-toggle-button.component.js.map