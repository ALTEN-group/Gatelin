import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { InfoMessageComponent } from "@core/ui/info-message/info-message.component";
import { ConfigHelper, TableComponent } from "@dwtechs/ngx-crud-builder";
import { FieldsService } from "app/authorizations/data-access/fields/fields.service";

@Component({
  selector: "adm-fields",
  templateUrl: "./fields.component.html",
  styleUrl: "./fields.component.scss",
  imports: [TableComponent, InfoMessageComponent],
  providers: [ConfigHelper],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsComponent {
  public readonly fieldsService = inject(FieldsService);
  private readonly configHelper = inject(ConfigHelper<FieldsService>);

  public readonly config = this.configHelper.getConfig(this.fieldsService);
  public readonly entityFactory = this.fieldsService.entityFactory;
  public readonly tableInformation = TABLES.fields;

  public readonly table = viewChild.required(TableComponent);
}
