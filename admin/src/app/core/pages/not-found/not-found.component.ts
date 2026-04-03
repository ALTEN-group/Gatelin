import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CardModule } from "primeng/card";

@Component({
  selector: "adm-not-found",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./not-found.component.html",
  imports: [CardModule],
})
export class NotFoundComponent {}
