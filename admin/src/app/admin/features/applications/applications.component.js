import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { TableComponent } from "@dwtechs/crud-builder";
import { GatewayApplicationsService } from "app/admin/data-access/applications/applications.service";
let ApplicationsComponent = class ApplicationsComponent {
    constructor() {
        this.gatewayApplicationsService = inject(GatewayApplicationsService);
        this.config = this.gatewayApplicationsService.config;
        this.entityFactory = this.gatewayApplicationsService.entityFactory;
        this.httpCalls = this.gatewayApplicationsService.httpCalls;
        this.tableInformation = TABLES.applications;
    }
};
ApplicationsComponent = __decorate([
    Component({
        selector: "adm-applications",
        templateUrl: "./applications.component.html",
        imports: [TableComponent],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], ApplicationsComponent);
export { ApplicationsComponent };
//# sourceMappingURL=applications.component.js.map