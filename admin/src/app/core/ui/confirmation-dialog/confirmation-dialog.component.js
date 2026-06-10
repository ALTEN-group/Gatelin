import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
let ConfirmationDialogComponent = class ConfirmationDialogComponent {
    constructor() {
        this.config = inject(DynamicDialogConfig);
        this.ref = inject(DynamicDialogRef);
    }
    get message() {
        return this.config.data.message;
    }
    accept() {
        this.ref.close(true);
    }
    reject() {
        this.ref.close(false);
    }
};
ConfirmationDialogComponent = __decorate([
    Component({
        selector: "shared-confirmation-dialog",
        changeDetection: ChangeDetectionStrategy.OnPush,
        templateUrl: "./confirmation-dialog.component.html",
        styleUrls: ["./confirmation-dialog.component.scss"],
        imports: [DialogModule, ButtonModule],
    })
], ConfirmationDialogComponent);
export { ConfirmationDialogComponent };
//# sourceMappingURL=confirmation-dialog.component.js.map