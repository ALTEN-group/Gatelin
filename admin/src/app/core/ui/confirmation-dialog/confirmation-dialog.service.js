import { __decorate } from "tslib";
import { DestroyRef, Injectable, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DialogService } from "primeng/dynamicdialog";
import { ConfirmationDialogComponent } from "./confirmation-dialog.component";
const DEFAULT_MESSAGE = "Êtes-vous sûr de vouloir poursuivre ?";
let ConfirmationDialogService = class ConfirmationDialogService {
    constructor() {
        this.dialogService = inject(DialogService);
        this.destroyRef = inject(DestroyRef);
    }
    confirm(message = DEFAULT_MESSAGE) {
        const ref = this.dialogService.open(ConfirmationDialogComponent, {
            header: "Confirmation",
            data: {
                message,
            },
        });
        return ref.onClose.pipe(takeUntilDestroyed(this.destroyRef));
    }
};
ConfirmationDialogService = __decorate([
    Injectable({
        providedIn: "root",
    })
], ConfirmationDialogService);
export { ConfirmationDialogService };
//# sourceMappingURL=confirmation-dialog.service.js.map