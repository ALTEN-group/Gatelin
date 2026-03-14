import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { TableComponent } from "@table/table.component";
import { ConsumersService } from "app/admin/data-access/consumers/consumers.service";
import { ConfigHelper } from "app/admin/features/routes/config.helper";

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
}
