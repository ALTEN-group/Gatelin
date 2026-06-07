import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-info-message",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./info-message.component.scss",
  template: `<p class="info-message"><ng-content /></p>`,
})
export class InfoMessageComponent {}
