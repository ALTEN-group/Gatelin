import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { TableComponent } from "@dwtechs/crud-builder";
import { OperationsService } from "app/admin/data-access/operations/operations.service";
let OperationsComponent = class OperationsComponent {
    constructor() {
        this.operationsService = inject(OperationsService);
        this.config = this.operationsService.config;
        this.entityFactory = this.operationsService.entityFactory;
        this.httpCalls = this.operationsService.httpCalls;
        this.tableInformation = TABLES.operations;
    }
};
OperationsComponent = __decorate([
    Component({
        selector: "adm-operations",
        templateUrl: "./operations.component.html",
        imports: [TableComponent],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], OperationsComponent);
export { OperationsComponent };
//# sourceMappingURL=operations.component.js.map