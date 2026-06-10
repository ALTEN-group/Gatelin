import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal, ViewEncapsulation, } from "@angular/core";
import { rxResource, takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CONTROL_TYPES, EditionDialogComponent, } from "@dwtechs/crud-builder";
import { permissionFactory, } from "app/admin/data-access/permissions/permission.model";
import { PermissionsService } from "app/admin/data-access/permissions/permissions.service";
import { Checkbox } from "primeng/checkbox";
import { Chip } from "primeng/chip";
import { SelectModule } from "primeng/select";
import { TreeTableModule } from "primeng/treetable";
import { of } from "rxjs";
import { GetPermPipe } from "./get-perm.pipe";
let PermissionsTreeComponent = class PermissionsTreeComponent {
    constructor() {
        // ── injections ────────────────────────────────────────────────────────────
        this.permissionsService = inject(PermissionsService);
        this.destroyRef = inject(DestroyRef);
        this.route = inject(ActivatedRoute);
        // ── private data (route snapshot) ─────────────────────────────────────────
        this.routes = this.route.snapshot.data["routes"] ?? [];
        this.fieldsByResource = (() => {
            const map = new Map();
            for (const f of this.route.snapshot.data["fields"] ?? []) {
                if (f.resourceId === null || f.archived)
                    continue;
                const names = map.get(f.resourceId) ?? [];
                names.push(f.name);
                map.set(f.resourceId, names);
            }
            return map;
        })();
        this.scopesByRoute = (() => {
            const map = new Map();
            for (const s of this.route.snapshot.data["scopes"] ?? []) {
                if (s.routeId === null || s.archived)
                    continue;
                const names = map.get(s.routeId) ?? [];
                names.push(s.name);
                map.set(s.routeId, names);
            }
            return map;
        })();
        this.allConditions = (this.route.snapshot.data["conditions"] ?? [])
            .filter((c) => c.id !== null && !c.archived)
            .map((c) => ({ id: c.id, name: c.name, color: c.color }));
        // ── public data (template-facing) ─────────────────────────────────────────
        this.roles = this.route.snapshot.data["roles"] ?? [];
        this.conditionById = new Map(this.allConditions.map((c) => [c.id, { name: c.name, color: c.color }]));
        // ── private resource ──────────────────────────────────────────────────────
        this.permissionsResource = rxResource({
            params: () => this.selectedRoleId(),
            stream: ({ params: roleId }) => {
                if (roleId === null)
                    return of({ rows: [], total: 0 });
                return this.permissionsService.getByRole(roleId, {
                    first: 0,
                    rows: 10000,
                });
            },
        });
        // ── public state ──────────────────────────────────────────────────────────
        this.selectedRole = signal((() => {
            const qp = this.route.snapshot.queryParamMap.get("roleId");
            const routeRoleId = qp
                ? Number(qp)
                : (this.route.snapshot.data["roleId"] ?? null);
            return (this.roles.find((r) => r.id === routeRoleId) ?? this.roles[0] ?? null);
        })());
        this.selectedRoleId = computed(() => this.selectedRole()?.id ?? null);
        this.isLoading = this.permissionsResource.isLoading;
        this.treeNodes = computed(() => {
            const perms = this.permissionsResource.value()?.rows ?? [];
            return this.buildTree(this.routes, perms, this.fieldsByResource, this.scopesByRoute, this.allConditions);
        });
        // ── dialog state ──────────────────────────────────────────────────────────
        this.editingOriginalPerm = signal(null);
        this.editedPermEntry = signal(permissionFactory());
        this.dialogVisible = signal(false);
        this.dialogHeader = signal("");
        this.dialogConfig = signal([]);
        this.dialogFeatures = {
            create: false,
            update: true,
            archive: false,
            getHistory: false,
            updateFiles: false,
            restore: false,
        };
    }
    // ── public methods ────────────────────────────────────────────────────────
    onRoleSelect(role) {
        this.selectedRole.set(role);
    }
    onToggle(nodeData, checked) {
        if (nodeData.type !== "route")
            return;
        const role = this.selectedRole();
        if (role?.id === null || role?.id === undefined)
            return;
        const { create, archive } = this.permissionsService.httpCalls;
        if (checked) {
            if (!create)
                return;
            const perm = {
                ...permissionFactory(role.id),
                routeId: nodeData.id,
                operationId: nodeData.operationIds,
            };
            create(perm)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => this.permissionsResource.reload());
        }
        else {
            if (!archive)
                return;
            const existingPerm = nodeData.rolePerms[role.id];
            if (!existingPerm?.id)
                return;
            archive([existingPerm.id])
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => this.permissionsResource.reload());
        }
    }
    onRowClick(nodeData) {
        if (nodeData.type !== "route")
            return;
        const roleId = this.selectedRoleId();
        if (roleId === null)
            return;
        const perm = nodeData.rolePerms[roleId];
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
    onPermSaved(savedEntry) {
        const original = this.editingOriginalPerm();
        if (!savedEntry || !original)
            return;
        const { update } = this.permissionsService.httpCalls;
        if (!update)
            return;
        const merged = {
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
    buildTree(routes, perms, fieldsByResource, scopesByRoute, allConditions) {
        // Build routeId → { roleId: Permission } map from existing permissions
        const permMap = new Map();
        for (const p of perms) {
            if (p.routeId === null || p.roleId === null)
                continue;
            let entry = permMap.get(p.routeId);
            if (!entry) {
                entry = {};
                permMap.set(p.routeId, entry);
            }
            entry[p.roleId] = p;
        }
        const serviceMap = new Map();
        for (const route of routes) {
            if (route.id === null ||
                route.serviceId === null ||
                route.resourceId === null)
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
            data: { type: "service", id: serviceId, name: svc.name },
            expanded: true,
            children: Array.from(svc.resources.entries()).map(([resourceId, res]) => ({
                data: {
                    type: "resource",
                    id: resourceId,
                    name: res.name,
                },
                expanded: true,
                children: res.routes
                    .filter((r) => r.id !== null)
                    .map((r) => ({
                    data: {
                        type: "route",
                        id: r.id,
                        name: r.name,
                        operationIds: r.operationId,
                        rolePerms: permMap.get(r.id) ?? {},
                        availableFields: r.resourceId !== null
                            ? (fieldsByResource.get(r.resourceId) ?? [])
                            : [],
                        availableScopes: scopesByRoute.get(r.id) ?? [],
                        availableConditions: allConditions,
                    },
                    leaf: true,
                })),
            })),
        }));
    }
};
PermissionsTreeComponent = __decorate([
    Component({
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
], PermissionsTreeComponent);
export { PermissionsTreeComponent };
//# sourceMappingURL=permissions-tree.component.js.map