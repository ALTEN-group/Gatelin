import { Injectable, signal } from "@angular/core";
import { OperationLevel } from "@core/roles/operation-level.enum";
import { Role } from "@core/roles/role.class";
import { Functionality } from "@core/roles/role.model";

type AccessLevels = Map<string, number>;
const initialAccessLevels: AccessLevels = new Map<string, number>();

@Injectable({ providedIn: "root" })
export class AclService {
  private _accessLevels = signal<AccessLevels>(initialAccessLevels);
  public readonly accessLevels = this._accessLevels.asReadonly();

  private readonly _areAclResolved = signal(false);
  public readonly areAclResolved = this._areAclResolved.asReadonly();

  public resolveAccess(
    functionality: string | undefined,
    operation?: OperationLevel,
  ): boolean {
    if (!functionality) return true;
    if (!this._accessLevels().size) return false;
    const accessLevel = this._accessLevels().get(functionality);
    const hasFunctionality = accessLevel !== undefined;
    // If no operation is provided, user has access to the functionality.
    if (!operation) return hasFunctionality;
    // If operation is provided, we must check that user has a superior access.
    const hasSufficientRight = accessLevel && accessLevel >= operation;

    return Boolean(hasSufficientRight);
  }

  public storeAccessLevels(
    userRoleIds: number[],
    roles: Role[],
    functionalities: Functionality[],
  ): void {
    if (this._accessLevels().size) return;
    const userPermissions = roles
      .filter(
        (role) => typeof role.id === "number" && userRoleIds.includes(role.id),
      )
      .map((role) => role.permissions);
    const userAccessMap = this.buildAccessLevels(
      userPermissions,
      functionalities,
    );
    this._accessLevels.set(userAccessMap);
    this._areAclResolved.set(true);
  }

  public resetAccessLevels(): void {
    this._accessLevels.update((acl) => {
      acl.clear();
      return acl;
    });
  }

  private buildAccessLevels(
    userPermissions: { [key: number]: number }[],
    functionalities: Functionality[],
  ) {
    const userAccessMap = userPermissions.reduce((acc, curr) => {
      Object.entries(curr).forEach(([key, value]) => {
        const functionality =
          functionalities.find((f) => f.id.toString() === key)?.key || key;
        // if functionality already exists, keep the highest access level
        if (acc.has(functionality)) {
          const existingValue = acc.get(functionality) as number;
          if (value > existingValue) {
            acc.set(functionality, value);
          }
          return;
        }
        acc.set(functionality, value);
      });
      return acc;
    }, new Map<string, number>());
    return userAccessMap;
  }
}
