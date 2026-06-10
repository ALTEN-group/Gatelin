import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, computed, inject, output, ViewEncapsulation, } from "@angular/core";
import { AuthenticationService } from "@core/auth/auth.service";
import { ThemeToggleButtonComponent } from "@core/ui/theme-toggle-button/theme-toggle-button.component";
import { SharedModule } from "primeng/api";
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from "primeng/button";
import { MenuModule } from "primeng/menu";
let NavbarComponent = class NavbarComponent {
    constructor() {
        this.authenticationService = inject(AuthenticationService);
        this.themeToggled = output();
        this.userMenuItems = computed(() => [
            {
                label: "Logout",
                icon: "pi pi-fw pi-power-off",
                command: () => this.logout(),
            },
        ]);
        this.portrait = computed(() => {
            const portrait = this.currentUser()?.portrait;
            return portrait ? `data:image/jpeg;base64, ${portrait}` : "";
        });
        this.isAuthenticated = this.authenticationService.isAuthenticated;
        this.currentUser = this.authenticationService.user;
    }
    get userName() {
        if (this.isAuthenticated() && this.currentUser()) {
            const { firstName, lastName } = this.currentUser() ?? {};
            return lastName ? `${firstName} ${lastName}` : "";
        }
        return "";
    }
    logout() {
        this.authenticationService.logout().subscribe();
    }
};
NavbarComponent = __decorate([
    Component({
        selector: "adm-navbar",
        changeDetection: ChangeDetectionStrategy.OnPush,
        templateUrl: "./navbar.component.html",
        styleUrls: ["./navbar.component.scss"],
        imports: [
            ThemeToggleButtonComponent,
            ButtonModule,
            BadgeModule,
            MenuModule,
            SharedModule,
        ],
        encapsulation: ViewEncapsulation.None,
    })
], NavbarComponent);
export { NavbarComponent };
//# sourceMappingURL=navbar.component.js.map