import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "adm-maintenance",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./maintenance.component.html",
  styleUrls: ["./maintenance.component.scss"],
})
export class MaintenanceComponent {}
