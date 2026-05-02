import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from "@angular/core";
import { rxResource, takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RowsAndCount } from "@dwtechs/crud-builder";
import {
  Permission,
  permissionFactory,
} from "app/admin/data-access/permissions/permission.model";
import { PermissionsService } from "app/admin/data-access/permissions/permissions.service";
import { GatewayRole } from "app/admin/data-access/roles/role.model";
import { Route } from "app/admin/data-access/routes/route.model";
import { TreeNode } from "primeng/api";
import { Checkbox } from "primeng/checkbox";
import { SelectModule } from "primeng/select";
import { TableLazyLoadEvent } from "primeng/table";
import { TreeTableModule } from "primeng/treetable";
import { of } from "rxjs";

interface ServiceNodeData {
  type: "service";
  id: number;
  name: string;
}

interface ResourceNodeData {
  type: "resource";
  id: number;
  name: string;
}

interface RouteNodeData {
  type: "route";
  id: number;
  name: string;
  operationIds: number[];
  rolePerms: Record<number, Permission>;
}

export type PermTreeNodeData =
  | ServiceNodeData
  | ResourceNodeData
  | RouteNodeData;

@Component({
  selector: "adm-permissions-tree",
  templateUrl: "./permissions-tree.component.html",
  styleUrl: "./permissions-tree.component.scss",
  imports: [TreeTableModule, Checkbox, FormsModule, SelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsTreeComponent {
  private readonly permissionsService = inject(PermissionsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  readonly roles: GatewayRole[] = this.route.snapshot.data["roles"] ?? [];
  readonly routes: Route[] = this.route.snapshot.data["routes"] ?? [];

  readonly selectedRole = signal<GatewayRole | null>(
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
  readonly selectedRoleId = computed(() => this.selectedRole()?.id ?? null);

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

  readonly isLoading = this.permissionsResource.isLoading;

  readonly treeNodes = computed<TreeNode<PermTreeNodeData>[]>(() => {
    const perms = this.permissionsResource.value()?.rows ?? [];
    return this.buildTree(this.routes, perms);
  });

  private buildTree(
    routes: Route[],
    perms: Permission[],
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
              },
              leaf: true,
            })),
        }),
      ),
    }));
  }

  getPerm(nodeData: PermTreeNodeData): Permission | undefined {
    if (nodeData.type !== "route") return undefined;
    const roleId = this.selectedRoleId();
    if (roleId === null) return undefined;
    return nodeData.rolePerms[roleId];
  }

  onRoleSelect(role: GatewayRole | null): void {
    this.selectedRole.set(role);
  }

  onToggle(nodeData: PermTreeNodeData, checked: boolean): void {
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
}
