import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component } from "@angular/core";
let InfoMessageComponent = class InfoMessageComponent {
};
InfoMessageComponent = __decorate([
    Component({
        selector: "app-info-message",
        changeDetection: ChangeDetectionStrategy.OnPush,
        styleUrl: "./info-message.component.scss",
        template: `<p class="info-message"><ng-content /></p>`,
    })
], InfoMessageComponent);
export { InfoMessageComponent };
//# sourceMappingURL=info-message.component.js.map