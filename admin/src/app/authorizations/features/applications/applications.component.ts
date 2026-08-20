import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { TableComponent } from "@dwtechs/ngx-crud-builder";
import { GatelinApplicationsService } from "app/authorizations/data-access/applications/applications.service";

@Component({
  selector: "adm-applications",
  templateUrl: "./applications.component.html",
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationsComponent {
  private readonly gatelinApplicationsService = inject(
    GatelinApplicationsService,
  );

  public readonly config = this.gatelinApplicationsService.config;

  public readonly entityFactory = this.gatelinApplicationsService.entityFactory;

  public readonly httpCalls = this.gatelinApplicationsService.httpCalls;

  public readonly tableInformation = TABLES.applications;
}
