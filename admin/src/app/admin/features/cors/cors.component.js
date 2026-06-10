import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { InfoMessageComponent } from "@core/ui/info-message/info-message.component";
import { TableComponent } from "@dwtechs/crud-builder";
import { CorsService } from "app/admin/data-access/cors/cors.service";
let CorsComponent = class CorsComponent {
    constructor() {
        this.corsService = inject(CorsService);
        this.config = this.corsService.config;
        this.entityFactory = this.corsService.entityFactory;
        this.httpCalls = this.corsService.httpCalls;
        this.tableInformation = TABLES.cors;
    }
};
CorsComponent = __decorate([
    Component({
        selector: "adm-cors",
        templateUrl: "./cors.component.html",
        imports: [TableComponent, InfoMessageComponent],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], CorsComponent);
export { CorsComponent };
//# sourceMappingURL=cors.component.js.map