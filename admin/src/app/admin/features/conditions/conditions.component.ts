import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { ConfigHelper, TableComponent } from "@dwtechs/crud-builder";
import { ConditionsService } from "app/admin/data-access/conditions/conditions.service";

@Component({
  selector: "adm-conditions",
  templateUrl: "./conditions.component.html",
  styleUrl: "./conditions.component.scss",
  imports: [TableComponent],
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
