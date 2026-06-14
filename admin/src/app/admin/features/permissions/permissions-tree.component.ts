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
import {
  CONTROL_TYPES,
  EditionDialogComponent,
  RowsAndCount,
} from "@dwtechs/crud-builder";
import { Condition } from "app/admin/data-access/conditions/condition.model";
import { Field } from "app/admin/data-access/fields/field.model";
import {
  Permission,
  permissionFactory,
} from "app/admin/data-access/permissions/permission.model";
import { PermissionsService } from "app/admin/data-access/permissions/permissions.service";
import { GatewayRole } from "app/admin/data-access/roles/role.model";
import { Route } from "app/admin/data-access/routes/route.model";
import { Scope } from "app/admin/data-access/scopes/scope.model";
import { TreeNode } from "primeng/api";
import { Checkbox } from "primeng/checkbox";
import { Chip } from "primeng/chip";
import { SelectModule } from "primeng/select";
import { TableLazyLoadEvent } from "primeng/table";
import { TreeTableModule } from "primeng/treetable";
import { of } from "rxjs";
import { GetPermPipe } from "./get-perm.pipe";
import { PermTreeNodeData } from "./permissions-tree.model";

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
    GetPermPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PermissionsTreeComponent {
  // ── injections ────────────────────────────────────────────────────────────
  private readonly permissionsService = inject(PermissionsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  // ── private data (route snapshot) ─────────────────────────────────────────
  private readonly routes: Route[] = this.route.snapshot.data["routes"] ?? [];
  private readonly fieldsByResource: Map<number, string[]> = (() => {
    const map = new Map<number, string[]>();
    for (const f of (this.route.snapshot.data["fields"] as Field[]) ?? []) {
      if (f.resourceId === null || f.archived) continue;
      const names = map.get(f.resourceId) ?? [];
      names.push(f.name);
      map.set(f.resourceId, names);
    }
    return map;
  })();

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
      this.fieldsByResource,
      this.scopesByRoute,
      this.allConditions,
    );
  });

  // ── dialog state ──────────────────────────────────────────────────────────
  private readonly editingOriginalPerm = signal<Permission | null>(null);
  public readonly editedPermEntry = signal<Permission>(permissionFactory());
  public readonly dialogVisible = signal(false);
  public readonly dialogHeader = signal("");
  public readonly dialogConfig = signal<
    {
      key: string;
      label: string;
      controlType: (typeof CONTROL_TYPES)[keyof typeof CONTROL_TYPES];
      options?: { label: string; value: unknown }[];
    }[]
  >([]);
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

  public onToggle(nodeData: PermTreeNodeData, checked: boolean): void {
    if (nodeData.type !== "route") return;
    const role = this.selectedRole();
    if (role?.id === null || role?.id === undefined) return;

    const { create, archive } = this.permissionsService.httpCalls;

    if (checked) {
      if (!create) return;
      const perm: Permission = {
        ...permissionFactory(role.id),
        routeId: nodeData.id,
        operationId: nodeData.operationIds,
      };
      create(perm)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.permissionsResource.reload());
    } else {
      if (!archive) return;
      const existingPerm = nodeData.rolePerms[role.id];
      if (!existingPerm?.id) return;
      archive([existingPerm.id])
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.permissionsResource.reload());
    }
  }

  public onRowClick(nodeData: PermTreeNodeData): void {
    if (nodeData.type !== "route") return;
    const roleId = this.selectedRoleId();
    if (roleId === null) return;
    const perm = nodeData.rolePerms[roleId];
    if (!nodeData.protected && !perm) return;
    this.editingOriginalPerm.set(perm);
    this.dialogHeader.set(nodeData.name);
    this.dialogConfig.set([
      {
        key: "fields",
        label: "Fields",
        controlType: CONTROL_TYPES.MULTISELECT,
        options: nodeData.availableFields.map((f) => ({ label: f, value: f })),
      },
      {
        key: "scopes",
        label: "Scopes",
        controlType: CONTROL_TYPES.MULTISELECT,
        options: nodeData.availableScopes.map((s) => ({ label: s, value: s })),
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
    this.editedPermEntry.set({ ...perm });
    this.dialogVisible.set(true);
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.dialogVisible.set(false);
        this.permissionsResource.reload();
      });
  }

  // ── private methods ───────────────────────────────────────────────────────
  private buildTree(
    routes: Route[],
    perms: Permission[],
    fieldsByResource: Map<number, string[]>,
    scopesByRoute: Map<number, string[]>,
    allConditions: { id: number; name: string; color: string | null }[],
  ): TreeNode<PermTreeNodeData>[] {
    // Build routeId → { roleId: Permission } map from existing permissions
    const permMap = new Map<number, Record<number, Permission>>();
    for (const p of perms) {
      if (p.routeId === null || p.roleId === null) continue;
      let entry = permMap.get(p.routeId);
      if (!entry) {
        entry = {};
        permMap.set(p.routeId, entry);
      }
      entry[p.roleId] = p;
    }

    // Group routes: serviceId → resourceId → routes[]
    type ResourceEntry = { name: string; routes: Route[] };
    type ServiceEntry = { name: string; resources: Map<number, ResourceEntry> };
    const serviceMap = new Map<number, ServiceEntry>();

    for (const route of routes) {
      if (
        route.id === null ||
        route.serviceId === null ||
        route.resourceId === null
      )
        continue;

      let svc = serviceMap.get(route.serviceId);
      if (!svc) {
        svc = { name: route.serviceName, resources: new Map() };
        serviceMap.set(route.serviceId, svc);
      }

      let resource = svc.resources.get(route.resourceId);
      if (!resource) {
        resource = { name: route.resourceName, routes: [] };
        svc.resources.set(route.resourceId, resource);
      }
      resource.routes.push(route);
    }

    return Array.from(serviceMap.entries()).map(([serviceId, svc]) => ({
      data: { type: "service" as const, id: serviceId, name: svc.name },
      expanded: true,
      children: Array.from(svc.resources.entries()).map(
        ([resourceId, res]) => ({
          data: {
            type: "resource" as const,
            id: resourceId,
            name: res.name,
          },
          expanded: true,
          children: res.routes
            .filter((r): r is Route & { id: number } => r.id !== null)
            .map((r) => ({
              data: {
                type: "route" as const,
                id: r.id,
                name: r.name,
                operationIds: r.operationId,
                rolePerms: permMap.get(r.id) ?? {},
                availableFields:
                  r.resourceId !== null
                    ? (fieldsByResource.get(r.resourceId) ?? [])
                    : [],
                availableScopes: scopesByRoute.get(r.id) ?? [],
                availableConditions: allConditions,
                protected: r.protected,
              },
              leaf: true,
            })),
        }),
      ),
    }));
  }
}
