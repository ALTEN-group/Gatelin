import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
  untracked,
} from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { Calls, ConfigHelper, TableComponent } from "@dwtechs/crud-builder";
import {
  Permission,
  permissionFactory,
} from "app/admin/data-access/permissions/permission.model";
import { PermissionsService } from "app/admin/data-access/permissions/permissions.service";
import { TableLazyLoadEvent } from "primeng/table";

@Component({
  selector: "adm-permissions",
  templateUrl: "./permissions.component.html",
  imports: [TableComponent],
  providers: [ConfigHelper],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsComponent {
  private readonly permissionsService = inject(PermissionsService);
  private readonly configHelper = inject(ConfigHelper<PermissionsService>);

  public readonly roleId = input.required<number>();

  private readonly reloadTrigger = signal(0);
  public readonly forceReload = this.reloadTrigger.asReadonly();

  public readonly config = this.configHelper.getConfig(this.permissionsService);

  // Closure captures roleId signal — reads current value at call time
  public readonly permHttpCalls: Calls<Permission> = {
    get: (e: TableLazyLoadEvent) =>
      this.permissionsService.getByRole(this.roleId(), e),
    create: this.permissionsService.httpCalls.create,
    update: this.permissionsService.httpCalls.update,
    archive: this.permissionsService.httpCalls.archive,
  };

  // Factory pre-fills roleId with the currently selected role
  public readonly entityFactory = (): Permission =>
    permissionFactory(this.roleId());

  public readonly tableInformation = TABLES.permissions;

  constructor() {
    // Reload permissions table whenever the selected role changes
    effect(() => {
      this.roleId();
      untracked(() => this.reloadTrigger.update((c) => c + 1));
    });
  }
}
