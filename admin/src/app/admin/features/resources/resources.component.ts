import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { ConfigHelper } from "@crud/core/utils/crud-service/config.helper";
import { TableComponent } from "@table/table.component";
import { ResourcesService } from "app/admin/data-access/resources/resources.service";

@Component({
  selector: "adm-resources",
  templateUrl: "./resources.component.html",
  imports: [TableComponent],
  providers: [ConfigHelper],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesComponent {
  private readonly resourcesService = inject(ResourcesService);
  private readonly configHelper = inject(ConfigHelper<ResourcesService>);

  public readonly config = this.configHelper.getConfig(this.resourcesService);

  public readonly entityFactory = this.resourcesService.entityFactory;

  public readonly httpCalls = this.resourcesService.httpCalls;

  public readonly tableInformation = TABLES.resources;
}
