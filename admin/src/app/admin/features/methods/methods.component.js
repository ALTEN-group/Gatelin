import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { TableComponent } from "@dwtechs/crud-builder";
import { MethodsService } from "app/admin/data-access/methods/methods.service";
let MethodsComponent = class MethodsComponent {
    constructor() {
        this.methodsService = inject(MethodsService);
        this.config = this.methodsService.config;
        this.entityFactory = this.methodsService.entityFactory;
        this.httpCalls = this.methodsService.httpCalls;
        this.tableInformation = TABLES.methods;
    }
};
MethodsComponent = __decorate([
    Component({
        selector: "adm-methods",
        templateUrl: "./methods.component.html",
        imports: [TableComponent],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], MethodsComponent);
export { MethodsComponent };
//# sourceMappingURL=methods.component.js.map