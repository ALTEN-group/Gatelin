import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { ConfigHelper, TableComponent } from "@dwtechs/crud-builder";
import { Service } from "app/admin/data-access/services/service.model";
import { ServicesService } from "app/admin/data-access/services/services.service";

@Component({
  selector: "adm-services",
  templateUrl: "./services.component.html",
  imports: [TableComponent],
  providers: [ConfigHelper],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  private readonly servicesService = inject(ServicesService);
  private readonly configHelper = inject(ConfigHelper<ServicesService>);

  public readonly config = this.configHelper.getConfig(this.servicesService);

  public readonly entityFactory = this.servicesService.entityFactory;

  public readonly httpCalls = this.servicesService.httpCalls;

  public readonly tableInformation = TABLES.services;

  public readonly table = viewChild.required(TableComponent);

  public onRowClicked(row: Service): void {
    const table = this.table();
    table.editedEntry = { ...row };
    table.isCreation.set(false);
    table.isReadonly.set(row.locked);
    table.isEntryEditionDialogDisplayed.set(true);
  }
}
