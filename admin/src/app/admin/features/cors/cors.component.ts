import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { disabledRowRenderer } from "@core/utils/renderers/disabled.renderer";
import { TableComponent } from "@dwtechs/crud-builder";
import { Cors } from "app/admin/data-access/cors/cors.model";
import { CorsService } from "app/admin/data-access/cors/cors.service";

@Component({
  selector: "adm-cors",
  templateUrl: "./cors.component.html",
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorsComponent {
  private readonly corsService = inject(CorsService);

  public readonly config = this.corsService.config;

  public readonly entityFactory = this.corsService.entityFactory;

  public readonly httpCalls = this.corsService.httpCalls;

  public readonly tableInformation = TABLES.cors;

  public readonly rowStyles = (row: Cors) =>
    disabledRowRenderer(row, !!this.httpCalls.update);
}
