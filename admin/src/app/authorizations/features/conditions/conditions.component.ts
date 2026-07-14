import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { InfoMessageComponent } from "@core/ui/info-message/info-message.component";
import { ConfigHelper, TableComponent } from "@dwtechs/ngx-crud-builder";
import { ConditionsService } from "app/authorizations/data-access/conditions/conditions.service";

@Component({
  selector: "adm-conditions",
  templateUrl: "./conditions.component.html",
  imports: [TableComponent, InfoMessageComponent],
  providers: [ConfigHelper],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConditionsComponent {
  private readonly conditionsService = inject(ConditionsService);
  private readonly configHelper = inject(ConfigHelper<ConditionsService>);

  public readonly config = this.configHelper.getConfig(this.conditionsService);
  public readonly entityFactory = this.conditionsService.entityFactory;
  public readonly httpCalls = this.conditionsService.httpCalls;
  public readonly tableInformation = TABLES.conditions;
}
