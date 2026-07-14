import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { ConfigHelper, TableComponent } from "@dwtechs/ngx-crud-builder";
import { ConsumersService } from "app/consumers/data-access/consumers/consumers.service";

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
