import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject, viewChild, } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { ConfigHelper, TableComponent } from "@dwtechs/crud-builder";
import { ServicesService } from "app/admin/data-access/services/services.service";
let ServicesComponent = class ServicesComponent {
    constructor() {
        this.servicesService = inject(ServicesService);
        this.configHelper = inject((ConfigHelper));
        this.config = this.configHelper.getConfig(this.servicesService);
        this.entityFactory = this.servicesService.entityFactory;
        this.httpCalls = this.servicesService.httpCalls;
        this.tableInformation = TABLES.services;
        this.table = viewChild.required(TableComponent);
    }
};
ServicesComponent = __decorate([
    Component({
        selector: "adm-services",
        templateUrl: "./services.component.html",
        imports: [TableComponent],
        providers: [ConfigHelper],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], ServicesComponent);
export { ServicesComponent };
//# sourceMappingURL=services.component.js.map