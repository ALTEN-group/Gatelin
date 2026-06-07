import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { InfoMessageComponent } from "@core/ui/info-message/info-message.component";
import { TableComponent } from "@dwtechs/crud-builder";
import { CorsService } from "app/admin/data-access/cors/cors.service";

@Component({
  selector: "adm-cors",
  templateUrl: "./cors.component.html",
  imports: [TableComponent, InfoMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorsComponent {
  private readonly corsService = inject(CorsService);

  public readonly config = this.corsService.config;

  public readonly entityFactory = this.corsService.entityFactory;

  public readonly httpCalls = this.corsService.httpCalls;

  public readonly tableInformation = TABLES.cors;
}
