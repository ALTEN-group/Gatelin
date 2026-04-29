import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { ConfigHelper, TableComponent } from "@dwtechs/crud-builder";
import { Resource } from "app/admin/data-access/resources/resource.model";
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

  public readonly table = viewChild.required(TableComponent);

  public onRowClicked(row: Resource): void {
    const table = this.table();
    table.editedEntry = { ...row };
    table.isCreation.set(false);
    table.isReadonly.set(row.core);
    table.isEntryEditionDialogDisplayed.set(true);
  }
}
