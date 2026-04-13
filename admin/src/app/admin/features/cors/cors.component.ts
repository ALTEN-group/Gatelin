import { TableComponent } from "@altengroup/crud-builder";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
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
}
