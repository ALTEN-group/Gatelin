import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { TABLES } from "@core/app-config/app.tables";
import {
  ConfigHelper,
  provideCrudLabels,
  TableComponent,
} from "@dwtechs/crud-builder";
import { GatewayRole } from "app/authorizations/data-access/roles/role.model";
import { GatewayRolesService } from "app/authorizations/data-access/roles/roles.service";
import { AppPaths } from "app/app.routes";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "adm-roles",
  templateUrl: "./roles.component.html",
  imports: [TableComponent, ButtonModule],
  providers: [
    ConfigHelper,
    provideCrudLabels({ tableControl: { actionsColumnHeader: "Permissions" } }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent {
  private readonly gatewayRolesService = inject(GatewayRolesService);
  private readonly configHelper = inject(ConfigHelper<GatewayRolesService>);
  private readonly router = inject(Router);

  public readonly config = this.configHelper.getConfig(
    this.gatewayRolesService,
  );

  public readonly entityFactory = this.gatewayRolesService.entityFactory;

  public readonly httpCalls = this.gatewayRolesService.httpCalls;

  public readonly tableInformation = TABLES.roles;

  public goToPermissions(role: GatewayRole): void {
    this.router.navigate([AppPaths.PERMISSIONS], {
      queryParams: { roleId: role.id },
    });
  }
}
