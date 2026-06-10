import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { InfoMessageComponent } from "@core/ui/info-message/info-message.component";
import { ConfigHelper, TableComponent } from "@dwtechs/crud-builder";
import { ScopesService } from "app/admin/data-access/scopes/scopes.service";
let ScopesComponent = class ScopesComponent {
    constructor() {
        this.scopesService = inject(ScopesService);
        this.configHelper = inject((ConfigHelper));
        this.config = this.configHelper.getConfig(this.scopesService);
        this.entityFactory = this.scopesService.entityFactory;
        this.tableInformation = TABLES.scopes;
    }
};
ScopesComponent = __decorate([
    Component({
        selector: "adm-scopes",
        templateUrl: "./scopes.component.html",
        styleUrl: "./scopes.component.scss",
        imports: [TableComponent, InfoMessageComponent],
        providers: [ConfigHelper],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], ScopesComponent);
export { ScopesComponent };
//# sourceMappingURL=scopes.component.js.map