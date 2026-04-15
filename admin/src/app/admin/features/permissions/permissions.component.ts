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
  imports: [TableComponent, SelectModule, FormsModule],
  providers: [ConfigHelper],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsComponent {
  private readonly permissionsService = inject(PermissionsService);
  private readonly configHelper = inject(ConfigHelper<PermissionsService>);
  private readonly route = inject(ActivatedRoute);

  /** roleId from query params or static route data, null means show select */
  private readonly routeRoleId: number | null = (() => {
    const qp = this.route.snapshot.queryParamMap.get("roleId");
    if (qp) return Number(qp);
    return (this.route.snapshot.data["roleId"] as number | undefined) ?? null;
  })();

  public readonly showRoleSelect = this.routeRoleId === null;

  public readonly roles: GatewayRole[] =
    this.route.snapshot.data["roles"] ?? [];
  public readonly selectedRole = signal<GatewayRole | null>(null);

  public readonly roleId = computed(
    () => this.routeRoleId ?? this.selectedRole()?.id ?? null,
  );

  private readonly reloadTrigger = signal(0);
  public readonly forceReload = this.reloadTrigger.asReadonly();

  public readonly config = this.configHelper.getConfig(this.permissionsService);

  public readonly permHttpCalls: Calls<Permission> = {
    get: (e: TableLazyLoadEvent) => {
      const id = this.roleId();
      return this.permissionsService.getByRole(id!, e);
    },
    create: this.permissionsService.httpCalls.create,
    update: this.permissionsService.httpCalls.update,
    archive: this.permissionsService.httpCalls.archive,
  };

  public readonly entityFactory = (): Permission =>
    permissionFactory(this.roleId());

  public readonly tableInformation = TABLES.permissions;

  public onRoleSelect(role: GatewayRole): void {
    this.selectedRole.set(role);
    this.reloadTrigger.update((c) => c + 1);
  }
}
