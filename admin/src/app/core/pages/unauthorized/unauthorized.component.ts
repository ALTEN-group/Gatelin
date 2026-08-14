import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CardModule } from "@openng/optimus-ui/card";

@Component({
  selector: "adm-unauthorized",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./unauthorized.component.html",
  imports: [CardModule],
})
export class UnauthorizedComponent {}
