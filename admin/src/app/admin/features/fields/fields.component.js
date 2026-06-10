import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject, viewChild, } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { InfoMessageComponent } from "@core/ui/info-message/info-message.component";
import { ConfigHelper, TableComponent } from "@dwtechs/crud-builder";
import { FieldsService } from "app/admin/data-access/fields/fields.service";
let FieldsComponent = class FieldsComponent {
    constructor() {
        this.fieldsService = inject(FieldsService);
        this.configHelper = inject((ConfigHelper));
        this.config = this.configHelper.getConfig(this.fieldsService);
        this.entityFactory = this.fieldsService.entityFactory;
        this.tableInformation = TABLES.fields;
        this.table = viewChild.required(TableComponent);
    }
};
FieldsComponent = __decorate([
    Component({
        selector: "adm-fields",
        templateUrl: "./fields.component.html",
        styleUrl: "./fields.component.scss",
        imports: [TableComponent, InfoMessageComponent],
        providers: [ConfigHelper],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], FieldsComponent);
export { FieldsComponent };
//# sourceMappingURL=fields.component.js.map