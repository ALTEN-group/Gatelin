import { Injectable, signal } from "@angular/core";
import { BASE_ACLS } from "@core/app-config/app.acls";
import { Permission, Role } from "@core/roles/role.class";
import { Acls } from "@crud/core/utils/acls/acls.model";
import { Calls } from "@crud/core/utils/crud-service/crud.model";

@Injectable({ providedIn: "root" })
export class AclService {
  private _accessLevels = signal<Acls>({});
  public readonly accessLevels = this._accessLevels.asReadonly();

  private readonly _areAclResolved = signal(false);
  public readonly areAclResolved = this._areAclResolved.asReadonly();

  public hasAccess(
    functionality: string | undefined,
    operation: keyof Calls<unknown> | undefined,
  ): boolean {
    if (!functionality) return true;
    const funcAcls = this.accessLevels()[functionality];
    if (!funcAcls) return false;
    if (operation) {
      return funcAcls[operation as keyof typeof funcAcls] || false;
    }
    return funcAcls.get || false;
  }

  public storeAccessLevels(userRoleIds: number[], roles: Role[]): void {
    if (this._accessLevels().size) return;
    const userPermissions = roles
      .filter(
        (role) => typeof role.id === "number" && userRoleIds.includes(role.id),
      )
      .flatMap((role) => role.permissions);
    const acls = this.buildAcls(userPermissions);
    this._accessLevels.set(acls);
    this._areAclResolved.set(true);
  }

  public resetAccessLevels(): void {
    this._accessLevels.set({});
  }

  private buildAcls(userPermissions: Permission[]): Acls {
    const userAcls: Acls = {};
    for (const functionality in BASE_ACLS) {
      userAcls[functionality] = {};
      const routes = BASE_ACLS[functionality];
      for (const route in routes) {
        const routeId = routes[route as keyof typeof routes];
        const hasPermission = userPermissions.some(
          (perm) => perm.route === routeId,
        );
        // transform routeId to access true/false
        userAcls[functionality][route as keyof typeof routes] = hasPermission;
      }
    }
    return userAcls;
  }
}
