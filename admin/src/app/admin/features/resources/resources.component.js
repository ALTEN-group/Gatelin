import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject, viewChild, } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { ConfigHelper, TableComponent } from "@dwtechs/crud-builder";
import { ResourcesService } from "app/admin/data-access/resources/resources.service";
let ResourcesComponent = class ResourcesComponent {
    constructor() {
        this.resourcesService = inject(ResourcesService);
        this.configHelper = inject((ConfigHelper));
        this.config = this.configHelper.getConfig(this.resourcesService);
        this.entityFactory = this.resourcesService.entityFactory;
        this.httpCalls = this.resourcesService.httpCalls;
        this.tableInformation = TABLES.resources;
        this.table = viewChild.required(TableComponent);
    }
};
ResourcesComponent = __decorate([
    Component({
        selector: "adm-resources",
        templateUrl: "./resources.component.html",
        imports: [TableComponent],
        providers: [ConfigHelper],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], ResourcesComponent);
export { ResourcesComponent };
//# sourceMappingURL=resources.component.js.map