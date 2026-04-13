import { ConfigHelper, TableComponent } from "@altengroup/crud-builder";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { FieldsService } from "app/admin/data-access/fields/fields.service";

@Component({
  selector: "adm-fields",
  templateUrl: "./fields.component.html",
  imports: [TableComponent],
  providers: [ConfigHelper],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsComponent {
  private readonly fieldsService = inject(FieldsService);
  private readonly configHelper = inject(ConfigHelper<FieldsService>);

  public readonly config = this.configHelper.getConfig(this.fieldsService);

  public readonly entityFactory = this.fieldsService.entityFactory;

  public readonly httpCalls = this.fieldsService.httpCalls;

  public readonly tableInformation = TABLES.fields;
}
