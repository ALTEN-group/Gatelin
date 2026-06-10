import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation, } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
let HomeComponent = class HomeComponent {
    constructor() {
        this.areNotifsEnabled = inject(APP_CONFIG).env.msNotifEnabled;
        this.kpis = [
            {
                title: "Total Users",
                value: 1245,
                icon: "pi pi-users",
                severity: "info",
                tooltip: "Number of registered users",
            },
            {
                title: "Active Sessions",
                value: 342,
                icon: "pi pi-clock",
                severity: "success",
                tooltip: "Number of active sessions",
            },
            {
                title: "Pending Orders",
                value: 27,
                icon: "pi pi-shopping-cart",
                severity: "warn",
                tooltip: "Number of orders pending fulfillment",
            },
        ];
        this.shortcuts = [
            {
                label: "Gestion des utilisateurs",
                icon: "pi pi-user-edit",
                route: "/accounts/users",
            },
            {
                label: "Démo formulaires",
                icon: "pi pi-file",
                route: "/form-demo",
            },
            {
                label: "Gestion des évènements",
                icon: "pi pi-chart-line",
                route: "/events",
            },
        ];
        this.actions = [
            {
                title: "Notifications en attente",
                value: 5,
                icon: "pi pi-bell",
                route: "/notifications",
                severity: "warn",
            },
            {
                title: "Compléter le profil utilisateur",
                value: null,
                icon: "pi pi-user",
                route: "/user/profile",
                severity: "warn",
            },
            {
                title: "Evènements non complets",
                value: 3,
                icon: "pi pi-exclamation-triangle",
                route: "/events",
                severity: "error",
            },
        ];
    }
};
HomeComponent = __decorate([
    Component({
        selector: "adm-home",
        changeDetection: ChangeDetectionStrategy.OnPush,
        templateUrl: "./home.component.html",
        styleUrls: ["./home.component.scss"],
        imports: [ButtonModule, FormsModule, CardModule],
        encapsulation: ViewEncapsulation.None,
    })
], HomeComponent);
export { HomeComponent };
//# sourceMappingURL=home.component.js.map