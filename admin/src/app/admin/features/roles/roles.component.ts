import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { TABLES } from "@core/app-config/app.tables";
import { TableComponent } from "@dwtechs/crud-builder";
import { GatewayRole } from "app/admin/data-access/roles/role.model";
import { GatewayRolesService } from "app/admin/data-access/roles/roles.service";
import { AppPaths } from "app/app.routes";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "adm-roles",
  templateUrl: "./roles.component.html",
  imports: [TableComponent, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent {
  private readonly gatewayRolesService = inject(GatewayRolesService);
  private readonly router = inject(Router);

  public readonly config = this.gatewayRolesService.config;

  public readonly entityFactory = this.gatewayRolesService.entityFactory;

  public readonly httpCalls = this.gatewayRolesService.httpCalls;

  public readonly tableInformation = TABLES.roles;

  public goToPermissions(role: GatewayRole): void {
    this.router.navigate([AppPaths.PERMISSIONS], {
      queryParams: { roleId: role.id },
    });
  }
}
