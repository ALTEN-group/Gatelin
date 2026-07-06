import { inject, Injectable, signal } from "@angular/core";
import { AclsMapping } from "@core/acl/acls.model";
import { ENTITY_ROUTE_MAPPING } from "@core/app-config/app.acls";
import { AdminEntity } from "@core/app-config/app.entities";
import { Permission } from "@core/auth/auth.dto";
import { SchemaService } from "@core/schema/schema.service";
import { Calls } from "@dwtechs/crud-builder";
import { catchError, map, Observable, of, tap } from "rxjs";

@Injectable({ providedIn: "root" })
export class AclService {
  private readonly schemaService = inject(SchemaService);

  private readonly _accessLevels = signal<AclsMapping | undefined>(undefined);
  public readonly accessLevels = this._accessLevels.asReadonly();

  private readonly _areAclResolved = signal(false);
  public readonly areAclResolved = this._areAclResolved.asReadonly();

  public hasAccess(
    functionality: AdminEntity | undefined,
    operation: keyof Calls<unknown> | undefined,
  ): boolean {
    if (!functionality) return true;
    const accessLevels = this.accessLevels();
    if (!accessLevels) return false;
    const funcAcls = accessLevels[functionality];
    if (!funcAcls) return false;
    if (operation)
      return funcAcls[operation as keyof typeof funcAcls]?.allowed || false;
    return funcAcls.get?.allowed || false;
  }

  public storeAccessLevels(userPermissions: Permission[]): void {
    const acls = this.buildAcls(userPermissions);
    this._accessLevels.set(acls);
    this._areAclResolved.set(true);
  }

  public resetAccessLevels(): void {
    this._accessLevels.set(undefined);
  }

  public updateFieldsForRoute(routeId: number, fields: string[] | null): void {
    const accessLevels = this._accessLevels();
    if (!accessLevels) return;
    for (const entity in ENTITY_ROUTE_MAPPING) {
      const adminEntity = entity as AdminEntity;
      const routeOps = ENTITY_ROUTE_MAPPING[adminEntity];
      for (const op in routeOps) {
        const opKey = op as keyof typeof routeOps;
        if (routeOps[opKey] !== routeId) continue;
        const entityAcl = accessLevels[adminEntity];
        if (!entityAcl) return;
        const opAcl = entityAcl[opKey as keyof typeof entityAcl];
        if (!opAcl) return;
        this._accessLevels.set({
          ...accessLevels,
          [adminEntity]: {
            ...entityAcl,
            [opKey]: { ...opAcl, fields: fields ?? [] },
          },
        });
        return;
      }
    }
  }

  public enrichAclWithSchema(
    functionality: AdminEntity | undefined,
  ): Observable<void> {
    if (!functionality) return of(undefined);

    const accessLevels = this._accessLevels();
    if (!accessLevels) return of(undefined);

    const entityAcl = accessLevels[functionality];
    if (!entityAcl) return of(undefined);

    const routeOps = ENTITY_ROUTE_MAPPING[functionality];
    // Only enrich operations that are declared in ENTITY_ROUTE_MAPPING for this entity.
    const opsToEnrich = (
      [
        { op: "create", schemaOp: "INSERT" },
        { op: "update", schemaOp: "UPDATE" },
      ] as const
    ).filter(({ op }) => routeOps[op] !== undefined);

    if (opsToEnrich.length === 0) return of(undefined);

    return this.schemaService.get(functionality).pipe(
      tap((rows) => {
        let updatedEntityAcl = { ...entityAcl };

        for (const { op, schemaOp } of opsToEnrich) {
          const operationAcl = entityAcl[op];
          if (!operationAcl) continue;

          const permissionFields = operationAcl.fields ?? [];
          const schemaFields = rows
            .filter((row) =>
              row.operations.some((v) => v.toUpperCase() === schemaOp),
            )
            .map((row) => row.key);

          // Schema is the baseline; permission fields (length > 0) override it.
          const finalFields =
            permissionFields.length > 0 ? permissionFields : schemaFields;
          updatedEntityAcl = {
            ...updatedEntityAcl,
            [op]: { ...operationAcl, fields: finalFields },
          };
        }

        this._accessLevels.set({
          ...accessLevels,
          [functionality]: updatedEntityAcl,
        });
      }),
      map(() => undefined),
      catchError(() => of(undefined)),
    );
  }

  public getEntityAcls(
    functionality: AdminEntity,
  ): AclsMapping[keyof AclsMapping] | undefined {
    const accessLevels = this.accessLevels();
    if (!accessLevels) return undefined;
    return accessLevels[functionality];
  }

  private buildAcls(userPermissions: Permission[]): AclsMapping {
    const userAcls = {} as AclsMapping;
    for (const functionality in ENTITY_ROUTE_MAPPING) {
      const adminEntity = functionality as AdminEntity;
      userAcls[adminEntity] = {};
      const routes = ENTITY_ROUTE_MAPPING[adminEntity];
      for (const route in routes) {
        const routeId = routes[route as keyof typeof routes];
        const permission = userPermissions.find(
          (perm) => perm.route === routeId,
        );
        // transform routeId to access true/false
        userAcls[adminEntity][route as keyof typeof routes] = {
          allowed: !!permission,
          operations: permission?.operations || [],
          fields: permission?.fields || [],
        };
      }
    }
    return userAcls;
  }
}
