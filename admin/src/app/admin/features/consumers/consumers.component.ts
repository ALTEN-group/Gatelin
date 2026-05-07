import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { disabledRowRenderer } from "@core/utils/renderers/disabled.renderer";
import { ConfigHelper, TableComponent } from "@dwtechs/crud-builder";
import { Consumer } from "app/admin/data-access/consumers/consumer.model";
import { ConsumersService } from "app/admin/data-access/consumers/consumers.service";

/**
 * Component to display and manage API consumers
 */
@Component({
  selector: "adm-consumers",
  templateUrl: "./consumers.component.html",
  imports: [TableComponent],
  providers: [ConfigHelper],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsumersComponent {
  private readonly consumersService = inject(ConsumersService);
  private readonly configHelper = inject(ConfigHelper<ConsumersService>);

  public readonly config = this.configHelper.getConfig(this.consumersService);

  public readonly entityFactory = this.consumersService.entityFactory;

  public readonly httpCalls = this.consumersService.httpCalls;

  public readonly tableInformation = TABLES.consumers;

  public readonly rowStyles = (row: Consumer) =>
    disabledRowRenderer(row, !!this.httpCalls.update);
}
