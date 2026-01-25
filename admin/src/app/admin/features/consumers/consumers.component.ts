import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { RolesService } from "@core/roles/roles.service";
import { TableComponent } from "@table/table.component";
import { ConsumersService } from "app/admin/data-access/consumers/consumers.service";

/**
 * Component to display and manage API consumers
 */
@Component({
  selector: "adm-consumers",
  templateUrl: "./consumers.component.html",
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsumersComponent {
  private readonly consumersService = inject(ConsumersService);
  private readonly rolesService = inject(RolesService);

  public readonly config = this.consumersService.config({
    data: { roles: this.rolesService.roles },
  });

  public readonly entityFactory = this.consumersService.entityFactory;

  public readonly httpCalls = this.consumersService.httpCalls;

  public readonly tableInformation = TABLES.consumers;
}
