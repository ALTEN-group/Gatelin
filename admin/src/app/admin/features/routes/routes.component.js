import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject, viewChild, } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { ConfigHelper, TableComponent } from "@dwtechs/crud-builder";
import { RoutesService } from "app/admin/data-access/routes/routes.service";
/**
 * Component to display and manage gateway routes
 */
let RoutesComponent = class RoutesComponent {
    constructor() {
        this.routesService = inject(RoutesService);
        this.configHelper = inject((ConfigHelper));
        this.config = this.configHelper.getConfig(this.routesService);
        this.entityFactory = this.routesService.entityFactory;
        this.httpCalls = this.routesService.httpCalls;
        this.tableInformation = TABLES.routes;
        this.table = viewChild.required(TableComponent);
    }
};
RoutesComponent = __decorate([
    Component({
        selector: "adm-routes",
        templateUrl: "./routes.component.html",
        imports: [TableComponent],
        providers: [ConfigHelper],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], RoutesComponent);
export { RoutesComponent };
//# sourceMappingURL=routes.component.js.map