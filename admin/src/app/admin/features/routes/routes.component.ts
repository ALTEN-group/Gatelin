import { ConfigHelper, TableComponent } from "@altengroup/crud-builder";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { RoutesService } from "app/admin/data-access/routes/routes.service";

/**
 * Component to display and manage gateway routes
 */
@Component({
  selector: "adm-routes",
  templateUrl: "./routes.component.html",
  imports: [TableComponent],
  providers: [ConfigHelper],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutesComponent {
  private readonly routesService = inject(RoutesService);
  private readonly configHelper = inject(ConfigHelper<RoutesService>);

  public readonly config = this.configHelper.getConfig(this.routesService);

  public readonly entityFactory = this.routesService.entityFactory;

  public readonly httpCalls = this.routesService.httpCalls;

  public readonly tableInformation = TABLES.routes;
}
