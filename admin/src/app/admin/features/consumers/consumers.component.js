import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { ConfigHelper, TableComponent } from "@dwtechs/crud-builder";
import { ConsumersService } from "app/admin/data-access/consumers/consumers.service";
/**
 * Component to display and manage API consumers
 */
let ConsumersComponent = class ConsumersComponent {
    constructor() {
        this.consumersService = inject(ConsumersService);
        this.configHelper = inject((ConfigHelper));
        this.config = this.configHelper.getConfig(this.consumersService);
        this.entityFactory = this.consumersService.entityFactory;
        this.httpCalls = this.consumersService.httpCalls;
        this.tableInformation = TABLES.consumers;
    }
};
ConsumersComponent = __decorate([
    Component({
        selector: "adm-consumers",
        templateUrl: "./consumers.component.html",
        imports: [TableComponent],
        providers: [ConfigHelper],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], ConsumersComponent);
export { ConsumersComponent };
//# sourceMappingURL=consumers.component.js.map