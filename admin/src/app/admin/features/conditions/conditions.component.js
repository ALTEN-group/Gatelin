import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { InfoMessageComponent } from "@core/ui/info-message/info-message.component";
import { ConfigHelper, TableComponent } from "@dwtechs/crud-builder";
import { ConditionsService } from "app/admin/data-access/conditions/conditions.service";
let ConditionsComponent = class ConditionsComponent {
    constructor() {
        this.conditionsService = inject(ConditionsService);
        this.configHelper = inject((ConfigHelper));
        this.config = this.configHelper.getConfig(this.conditionsService);
        this.entityFactory = this.conditionsService.entityFactory;
        this.httpCalls = this.conditionsService.httpCalls;
        this.tableInformation = TABLES.conditions;
    }
};
ConditionsComponent = __decorate([
    Component({
        selector: "adm-conditions",
        templateUrl: "./conditions.component.html",
        styleUrl: "./conditions.component.scss",
        imports: [TableComponent, InfoMessageComponent],
        providers: [ConfigHelper],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], ConditionsComponent);
export { ConditionsComponent };
//# sourceMappingURL=conditions.component.js.map