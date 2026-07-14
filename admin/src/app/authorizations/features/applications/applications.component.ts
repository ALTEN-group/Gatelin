import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { TableComponent } from "@dwtechs/ngx-crud-builder";
import { GatewayApplicationsService } from "app/authorizations/data-access/applications/applications.service";

@Component({
  selector: "adm-applications",
  templateUrl: "./applications.component.html",
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationsComponent {
  private readonly gatewayApplicationsService = inject(
    GatewayApplicationsService,
  );

  public readonly config = this.gatewayApplicationsService.config;

  public readonly entityFactory = this.gatewayApplicationsService.entityFactory;

  public readonly httpCalls = this.gatewayApplicationsService.httpCalls;

  public readonly tableInformation = TABLES.applications;
}
