import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "@openng/optimus-ui/button";
import { CardModule } from "@openng/optimus-ui/card";
import { Tooltip } from "@openng/optimus-ui/tooltip";

@Component({
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
export class HomeCardComponent {
  public readonly title = input.required<string>();
  public readonly value = input.required<number | null>();
  public readonly icon = input<string>();
  public readonly severity = input<"info" | "warn" | "error" | "success">();
  public readonly tooltip = input<string>();
  public readonly description = input<string>();
  public readonly route = input<string>();
}
