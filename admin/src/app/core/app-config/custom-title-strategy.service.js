import { __decorate } from "tslib";
import { Injectable, inject } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { TitleStrategy } from "@angular/router";
import { APP_CONFIG } from "@core/app-config/app-config.token";
let CustomTitleStrategyService = class CustomTitleStrategyService extends TitleStrategy {
    constructor() {
        super(...arguments);
        this.title = inject(Title);
        this.APP_TITLE = inject(APP_CONFIG).title;
    }
    updateTitle(snapshot) {
        const title = this.buildTitle(snapshot);
        if (title) {
            this.title.setTitle(`${this.APP_TITLE} - ${title}`);
        }
    }
};
CustomTitleStrategyService = __decorate([
    Injectable({
        providedIn: "root",
    })
], CustomTitleStrategyService);
export { CustomTitleStrategyService };
//# sourceMappingURL=custom-title-strategy.service.js.map