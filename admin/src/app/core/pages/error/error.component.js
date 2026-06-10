import { __decorate } from "tslib";
import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ErrorTranslatePipe } from "@core/pages/error/error-translate.pipe";
import { CardModule } from "primeng/card";
import { map } from "rxjs";
let ErrorComponent = class ErrorComponent {
    constructor() {
        this.route = inject(ActivatedRoute);
        this.code$ = this.route.params.pipe(map(({ code }) => code));
    }
};
ErrorComponent = __decorate([
    Component({
        selector: "adm-error",
        changeDetection: ChangeDetectionStrategy.OnPush,
        templateUrl: "./error.component.html",
        styleUrls: ["./error.component.scss"],
        imports: [CardModule, AsyncPipe, ErrorTranslatePipe],
    })
], ErrorComponent);
export { ErrorComponent };
//# sourceMappingURL=error.component.js.map