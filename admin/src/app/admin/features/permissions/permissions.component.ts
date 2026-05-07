import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TABLES } from "@core/app-config/app.tables";
import { disabledRowRenderer } from "@core/utils/renderers/disabled.renderer";
import { Calls, ConfigHelper, TableComponent } from "@dwtechs/crud-builder";
import {
  Permission,
  permissionFactory,
} from "app/admin/data-access/permissions/permission.model";
import { PermissionsService } from "app/admin/data-access/permissions/permissions.service";
import { GatewayRole } from "app/admin/data-access/roles/role.model";
import { SelectModule } from "primeng/select";
import { TableLazyLoadEvent } from "primeng/table";

@Component({
  selector: "adm-permissions",
  templateUrl: "./permissions.component.html",
  styleUrl: "./permissions.component.scss",
  imports: [TableComponent, SelectModule, FormsModule],
  providers: [ConfigHelper],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsComponent {
  private readonly permissionsService = inject(PermissionsService);
  private readonly configHelper = inject(ConfigHelper<PermissionsService>);
  private readonly route = inject(ActivatedRoute);

  public readonly roles: GatewayRole[] =
    this.route.snapshot.data["roles"] ?? [];

  public readonly selectedRole = signal<GatewayRole | null>(
    (() => {
      const qp = this.route.snapshot.queryParamMap.get("roleId");
      const routeRoleId = qp
        ? Number(qp)
        : ((this.route.snapshot.data["roleId"] as number | undefined) ?? null);
      return this.roles.find((r) => r.id === routeRoleId) ?? null;
    })(),
  );

  public readonly roleId = computed(() => this.selectedRole()?.id ?? null);

  private readonly reloadTrigger = signal(0);
  public readonly forceReload = this.reloadTrigger.asReadonly();

  public readonly config = this.configHelper.getConfig(this.permissionsService);

  public readonly permHttpCalls: Calls<Permission> = {
    get: (e: TableLazyLoadEvent) =>
      this.permissionsService.getByRole(this.roleId(), e),
    create: this.permissionsService.httpCalls.create,
    update: this.permissionsService.httpCalls.update,
    archive: this.permissionsService.httpCalls.archive,
  };

  public readonly entityFactory = (): Permission =>
    permissionFactory(this.roleId());

  public readonly tableInformation = TABLES.permissions;

  public onRoleSelect(role: GatewayRole | null): void {
    this.selectedRole.set(role);
    this.reloadTrigger.update((c) => c + 1);
  }

  public readonly rowStyles = (row: Permission) =>
    disabledRowRenderer(row, !!this.permHttpCalls.update);
}
