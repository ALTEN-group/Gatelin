import { __decorate } from "tslib";
import { TitleCasePipe } from "@angular/common";
import { Injectable } from "@angular/core";
let SnackbarService = class SnackbarService {
    constructor(messageService) {
        this.messageService = messageService;
    }
    displayError(message = "Une erreur est survenue") {
        this.show({
            severity: "error",
            detail: message,
            key: "topRight",
        });
    }
    displaySuccess() {
        this.show({
            key: "bottomCenter",
            severity: "success",
            closable: false,
        });
    }
    displayInfo(message) {
        this.show({
            detail: message,
            key: "bottomCenter",
        });
    }
    show(messageConfig) {
        if (!messageConfig.key) {
            if (!messageConfig.severity) {
                messageConfig.severity = "info";
            }
            if (!messageConfig.summary) {
                messageConfig.summary = TitleCasePipe.prototype.transform(messageConfig.severity);
            }
        }
        this.messageService.add(messageConfig);
    }
};
SnackbarService = __decorate([
    Injectable({ providedIn: "root" })
], SnackbarService);
export { SnackbarService };
//# sourceMappingURL=snackbar.service.js.map