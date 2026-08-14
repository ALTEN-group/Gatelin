import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    signal,
    ViewEncapsulation,
} from "@angular/core";
import { rxResource, takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import {
    CONTROL_TYPES,
    CrudItemOptions,
    EditionDialogComponent,
    RowsAndCount,
} from "@dwtechs/ngx-crud-builder";
import { TreeNode } from "@openng/optimus-ui/api";
import { Checkbox } from "@openng/optimus-ui/checkbox";
import { Chip } from "@openng/optimus-ui/chip";
import { SelectModule } from "@openng/optimus-ui/select";
import { TableLazyLoadEvent } from "@openng/optimus-ui/table";
import { TreeTableModule } from "@openng/optimus-ui/treetable";
import { Condition } from "app/authorizations/data-access/conditions/condition.model";
import { FieldsService } from "app/authorizations/data-access/fields/fields.service";
import {
    Permission,
    permissionFactory,
} from "app/authorizations/data-access/permissions/permission.model";
import { PermissionsService } from "app/authorizations/data-access/permissions/permissions.service";
import { GatewayRole } from "app/authorizations/data-access/roles/role.model";
import { Scope } from "app/authorizations/data-access/scopes/scope.model";
import { Operation } from "app/routing/data-access/operations/operation.model";
import { Route } from "app/routing/data-access/routes/route.model";
import { of, tap } from "rxjs";
import { OperationNodeData, PermTreeNodeData } from "./permissions-tree.model";

type PermResourceEntry = { name: string; routes: Route[] };
type PermServiceEntry = {
  name: string;
  resources: Map<number, PermResourceEntry>;
};

@Component({
  selector: "adm-permissions-tree",
  templateUrl: "./permissions-tree.component.html",
  styleUrl: "./permissions-tree.component.scss",
  imports: [
    TreeTableModule,
    Checkbox,
    FormsModule,
    SelectModule,
    Chip,
    EditionDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PermissionsTreeComponent {
  // ── injections ────────────────────────────────────────────────────────────
  private readonly permissionsService = inject(PermissionsService);
  private readonly aclsService = inject(AclService);
  private readonly fieldsService = inject(FieldsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  // ── private data (route snapshot) ─────────────────────────────────────────
  private readonly routes: Route[] = this.route.snapshot.data["routes"] ?? [];
  private readonly operationColorById: Map<number, string | null> = new Map(
    ((this.route.snapshot.data["operations"] as Operation[]) ?? [])
      .filter((o) => o.id !== null)
      .map((o) => [o.id as number, o.color]),
  );
  private readonly operationNameById: Map<number, string> = new Map(
    ((this.route.snapshot.data["operations"] as Operation[]) ?? [])
      .filter((o) => o.id !== null)
      .map((o) => [o.id as number, o.name]),
  );
  private readonly scopesByRoute: Map<number, string[]> = (() => {
    const map = new Map<number, string[]>();
    for (const s of (this.route.snapshot.data["scopes"] as Scope[]) ?? []) {
      if (s.routeId === null || s.archived) continue;
      const names = map.get(s.routeId) ?? [];
      names.push(s.name);
      map.set(s.routeId, names);
    }
    return map;
  })();

  private readonly allConditions: {
    id: number;
    name: string;
    color: string | null;
  }[] = ((this.route.snapshot.data["conditions"] as Condition[]) ?? [])
    .filter((c) => c.id !== null && !c.archived)
    .map((c) => ({ id: c.id as number, name: c.name, color: c.color }));

  // ── public data (template-facing) ─────────────────────────────────────────
  public readonly roles: GatewayRole[] =
    this.route.snapshot.data["roles"] ?? [];
  public readonly conditionById: Map<
    number,
    { name: string; color: string | null }
  > = new Map(
    this.allConditions.map((c) => [c.id, { name: c.name, color: c.color }]),
  );

  // ── private resource ──────────────────────────────────────────────────────
  private readonly permissionsResource = rxResource<
    RowsAndCount<Permission>,
    number | null
  >({
    params: () => this.selectedRoleId(),
    stream: ({ params: roleId }) => {
      if (roleId === null) return of({ rows: [], total: 0 });
      return this.permissionsService.getByRole(roleId, {
        first: 0,
        rows: 10000,
      } as TableLazyLoadEvent);
    },
  });

  // ── public state ──────────────────────────────────────────────────────────
  public readonly selectedRole = signal<GatewayRole | null>(
    (() => {
      const qp = this.route.snapshot.queryParamMap.get("roleId");
      const routeRoleId = qp
        ? Number(qp)
        : ((this.route.snapshot.data["roleId"] as number | undefined) ?? null);
      return (
        this.roles.find((r) => r.id === routeRoleId) ?? this.roles[0] ?? null
      );
    })(),
  );
  public readonly selectedRoleId = computed(
    () => this.selectedRole()?.id ?? null,
  );
  public readonly isLoading = this.permissionsResource.isLoading;
  public readonly treeNodes = computed<TreeNode<PermTreeNodeData>[]>(() => {
    const perms = this.permissionsResource.value()?.rows ?? [];
    return this.buildTree(
      this.routes,
      perms,
      this.scopesByRoute,
      this.allConditions,
      this.operationColorById,
      this.operationNameById,
    );
  });

  // ── dialog state ──────────────────────────────────────────────────────────
  private readonly editingOriginalPerm = signal<Permission | null>(null);
  public readonly editedPermEntry = signal<Permission>(permissionFactory());
  public readonly dialogVisible = signal(false);
  public readonly dialogHeader = signal("");
  public readonly dialogConfig = signal<CrudItemOptions[]>([]);
  public readonly dialogLoading = signal(false);
  public readonly dialogFeatures = {
    create: false,
    update: true,
    archive: false,
    getHistory: false,
    updateFiles: false,
    restore: false,
  };

  // ── public methods ────────────────────────────────────────────────────────
  public onRoleSelect(role: GatewayRole | null): void {
    this.selectedRole.set(role);
  }

  public onToggleOperation(
    nodeData: OperationNodeData,
    checked: boolean,
  ): void {
    const role = this.selectedRole();
    if (role?.id === null || role?.id === undefined) return;
    const { create, update } = this.permissionsService.httpCalls;

    if (checked) {
      if (nodeData.perm) {
        // Row exists but was inactive — flip it back on
        if (!update) return;
        update({ ...nodeData.perm, active: true })
          .pipe(
            tap((res) => {
              const saved = res.rows[0];
              if (saved?.routeId !== null && saved?.routeId !== undefined)
                this.aclsService.updateFieldsForRoute(
                  saved.routeId,
                  saved.fields,
                );
            }),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe(() => this.permissionsResource.reload());
      } else {
        // No row yet — create it active
        if (!create) return;
        const perm: Permission = {
          ...permissionFactory(role.id),
          routeId: nodeData.routeId,
          operationId: nodeData.id as any,
          active: true,
        };
        create(perm)
          .pipe(
            tap((res) => {
              const saved = res.rows[0];
              if (saved?.routeId !== null && saved?.routeId !== undefined)
                this.aclsService.updateFieldsForRoute(
                  saved.routeId,
                  saved.fields,
                );
            }),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe(() => this.permissionsResource.reload());
      }
    } else {
      // Deactivate — preserve all configuration
      if (!nodeData.perm?.id || !update) return;
      update({ ...nodeData.perm, active: false })
        .pipe(
          tap((res) => {
            const saved = res.rows[0];
            if (saved?.routeId !== null && saved?.routeId !== undefined)
              this.aclsService.updateFieldsForRoute(
                saved.routeId,
                saved.fields,
              );
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => this.permissionsResource.reload());
    }
  }

  public onEditOperation(nodeData: OperationNodeData): void {
    if (!nodeData.perm) return;
    this.editingOriginalPerm.set(nodeData.perm);
    this.dialogHeader.set(`${nodeData.routeName} - ${nodeData.name}`);
    this.editedPermEntry.set({ ...nodeData.perm });
    this.dialogLoading.set(true);
    this.fieldsService
      .getSchemaFields(nodeData.resourceName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (schema) => {
          const fields = this.pickFieldsForOperation(
            nodeData.methodNames,
            schema,
          );
          this.dialogConfig.set([
            // Dont display fields if none are available for this operation
            ...(fields.length
              ? [
                  {
                    key: "fields",
                    label: "Fields",
                    controlType: CONTROL_TYPES.MULTISELECT,
                    options: fields.map((f) => ({ label: f, value: f })),
                  } satisfies CrudItemOptions,
                ]
              : []),
            {
              key: "scopes",
              label: "Scopes",
              controlType: CONTROL_TYPES.MULTISELECT,
              options: nodeData.availableScopes.map((s) => ({
                label: s,
                value: s,
              })),
            },
            {
              key: "conditionId",
              label: "Conditions",
              controlType: CONTROL_TYPES.MULTISELECT,
              options: nodeData.availableConditions.map((c) => ({
                label: c.name,
                value: c.id,
              })),
            },
          ]);
          this.dialogLoading.set(false);
          this.dialogVisible.set(true);
        },
        error: () => this.dialogLoading.set(false),
      });
  }

  public onPermSaved(savedEntry: Permission | null): void {
    const original = this.editingOriginalPerm();
    if (!savedEntry || !original) return;
    const { update } = this.permissionsService.httpCalls;
    if (!update) return;
    const merged: Permission = {
      ...original,
      fields: savedEntry.fields?.length ? savedEntry.fields : null,
      scopes: savedEntry.scopes?.length ? savedEntry.scopes : null,
      conditionId: savedEntry.conditionId?.length
        ? savedEntry.conditionId
        : null,
    };
    update(merged)
      .pipe(
        tap((res) => {
          const saved = res.rows[0];
          if (saved?.routeId !== null && saved?.routeId !== undefined)
            this.aclsService.updateFieldsForRoute(saved.routeId, saved.fields);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.dialogVisible.set(false);
        this.permissionsResource.reload();
      });
  }

  // ── private methods ───────────────────────────────────────────────────────
  private pickFieldsForOperation(
    methodNames: string[],
    schema: { create: string[]; update: string[] },
  ): string[] {
    const methods = methodNames.map((m) => m.toUpperCase());
    if (methods.includes("POST")) return schema.create;
    if (methods.some((m) => m === "PUT" || m === "PATCH")) return schema.update;
    return [];
  }

  private buildTree(
    routes: Route[],
    perms: Permission[],
    scopesByRoute: Map<number, string[]>,
    allConditions: { id: number; name: string; color: string | null }[],
    operationColorById: Map<number, string | null>,
    operationNameById: Map<number, string>,
  ): TreeNode<PermTreeNodeData>[] {
    const permMap = this.buildPermMap(perms);
    const serviceMap = this.groupRoutesByServiceAndResource(routes);

    return Array.from(serviceMap.entries()).map(([serviceId, svc]) => ({
      data: { type: "service" as const, id: serviceId, name: svc.name },
      expanded: true,
      children: Array.from(svc.resources.entries()).map(
        ([resourceId, res]) => ({
          data: { type: "resource" as const, id: resourceId, name: res.name },
          expanded: true,
          children: res.routes
            .filter((r): r is Route & { id: number } => r.id !== null)
            .map((r) =>
              this.buildRouteNode(
                r,
                permMap,
                scopesByRoute,
                allConditions,
                operationColorById,
                operationNameById,
              ),
            ),
        }),
      ),
    }));
  }

  // Build routeId → operationId → Permission map
  // (perms are already scoped to the selected role by the resource loader)
  private buildPermMap(
    perms: Permission[],
  ): Map<number, Map<number, Permission>> {
    const permMap = new Map<number, Map<number, Permission>>();
    for (const p of perms) {
      if (p.routeId === null || p.operationId === null) continue;
      const routeEntry =
        permMap.get(p.routeId) ?? new Map<number, Permission>();
      permMap.set(p.routeId, routeEntry);
      const opIds = Array.isArray(p.operationId)
        ? p.operationId
        : [Number(p.operationId)];
      for (const opId of opIds) {
        routeEntry.set(opId, p);
      }
    }
    return permMap;
  }

  // Group routes: serviceId → resourceId → routes[]
  private groupRoutesByServiceAndResource(
    routes: Route[],
  ): Map<number, PermServiceEntry> {
    const serviceMap = new Map<number, PermServiceEntry>();
    for (const route of routes) {
      if (
        route.id === null ||
        route.serviceId === null ||
        route.resourceId === null
      )
        continue;

      const svc = serviceMap.get(route.serviceId) ?? {
        name: route.serviceName,
        resources: new Map<number, PermResourceEntry>(),
      };
      serviceMap.set(route.serviceId, svc);

      const resource = svc.resources.get(route.resourceId) ?? {
        name: route.resourceName,
        routes: [],
      };
      svc.resources.set(route.resourceId, resource);
      resource.routes.push(route);
    }
    return serviceMap;
  }

  private buildRouteNode(
    route: Route & { id: number },
    permMap: Map<number, Map<number, Permission>>,
    scopesByRoute: Map<number, string[]>,
    allConditions: { id: number; name: string; color: string | null }[],
    operationColorById: Map<number, string | null>,
    operationNameById: Map<number, string>,
  ): TreeNode<PermTreeNodeData> {
    const sortedOpIds = [...route.operationId].sort((a, b) => a - b);
    const routePerms = permMap.get(route.id);
    const availableScopes = scopesByRoute.get(route.id) ?? [];
    return {
      data: {
        type: "route" as const,
        id: route.id,
        name: route.name,
        protected: route.protected,
      },
      expanded: true,
      children: sortedOpIds.map((opId) => ({
        data: {
          type: "operation" as const,
          id: opId,
          routeId: route.id,
          routeName: route.name,
          routeProtected: route.protected,
          name: operationNameById.get(opId) ?? "",
          color: operationColorById.get(opId) ?? null,
          perm: routePerms?.get(opId),
          resourceName: route.resourceName,
          methodNames: route.methodNames,
          availableScopes,
          availableConditions: allConditions,
        },
        leaf: true,
      })),
    };
  }
}
