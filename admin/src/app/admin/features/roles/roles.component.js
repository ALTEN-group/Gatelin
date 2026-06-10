import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { TABLES } from "@core/app-config/app.tables";
import { ConfigHelper, provideCrudLabels, TableComponent, } from "@dwtechs/crud-builder";
import { GatewayRolesService } from "app/admin/data-access/roles/roles.service";
import { AppPaths } from "app/app.routes";
import { ButtonModule } from "primeng/button";
let RolesComponent = class RolesComponent {
    constructor() {
        this.gatewayRolesService = inject(GatewayRolesService);
        this.configHelper = inject((ConfigHelper));
        this.router = inject(Router);
        this.config = this.configHelper.getConfig(this.gatewayRolesService);
        this.entityFactory = this.gatewayRolesService.entityFactory;
        this.httpCalls = this.gatewayRolesService.httpCalls;
        this.tableInformation = TABLES.roles;
    }
    goToPermissions(role) {
        this.router.navigate([AppPaths.PERMISSIONS], {
            queryParams: { roleId: role.id },
        });
    }
};
RolesComponent = __decorate([
    Component({
        selector: "adm-roles",
        templateUrl: "./roles.component.html",
        imports: [TableComponent, ButtonModule],
        providers: [
            ConfigHelper,
            provideCrudLabels({ tableControl: { actionsColumnHeader: "Permissions" } }),
        ],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], RolesComponent);
export { RolesComponent };
//# sourceMappingURL=roles.component.js.map