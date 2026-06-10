import { __decorate } from "tslib";
import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { Tooltip } from "primeng/tooltip";
let HomeCardComponent = class HomeCardComponent {
    constructor() {
        this.title = input.required();
        this.value = input.required();
        this.icon = input();
        this.severity = input();
        this.tooltip = input();
        this.description = input();
        this.route = input();
    }
};
HomeCardComponent = __decorate([
    Component({
        selector: "app-home-card",
        changeDetection: ChangeDetectionStrategy.OnPush,
        imports: [CardModule, RouterLink, Tooltip, ButtonModule, NgClass],
        styleUrls: ["./home-card.component.scss"],
        template: `
    <p-card [header]="title()"
      [pTooltip]="tooltip()"
      [ngClass]="severity() ? 'card-' + severity() : ''">
      <span class="card-value">{{ value() ?? "---" }}</span>
      @if (description()) {
        <div class="card-description">{{ description() }}</div>
      }
      <ng-template #footer>
        @if (route()) {
          <p-button [routerLink]="route()"
            label="Voir plus"
            [link]="true"
          />
        }
      </ng-template>
    </p-card>
    `,
    })
], HomeCardComponent);
export { HomeCardComponent };
//# sourceMappingURL=home-card.component.js.map