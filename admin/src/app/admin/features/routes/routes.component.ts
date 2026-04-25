import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { ConfigHelper, TableComponent } from "@dwtechs/crud-builder";
import { Route } from "app/admin/data-access/routes/route.model";
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

  public readonly table = viewChild.required(TableComponent);

  public onRowClicked(row: Route): void {
    const table = this.table();
    table.editedEntry = { ...row };
    table.isCreation.set(false);
    table.isReadonly.set(row.locked);
    table.isEntryEditionDialogDisplayed.set(true);
  }
}
