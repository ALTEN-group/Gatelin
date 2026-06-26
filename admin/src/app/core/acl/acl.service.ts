import { Injectable, signal } from "@angular/core";
import { Acls } from "@core/acl/acls.model";
import { BASE_ACLS } from "@core/app-config/app.acls";
import { Permission } from "@core/auth/auth.dto";
import { Calls } from "@dwtechs/crud-builder";

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
    if (operation) return funcAcls[operation as keyof typeof funcAcls] || false;
    return funcAcls.get || false;
  }

  public storeAccessLevels(userPermissions: Permission[]): void {
    if (this._accessLevels().size) return;
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
