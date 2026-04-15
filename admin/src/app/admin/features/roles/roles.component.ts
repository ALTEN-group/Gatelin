import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { TableComponent } from "@table/table.component";
import { GatewayRole } from "app/admin/data-access/roles/role.model";
import { GatewayRolesService } from "app/admin/data-access/roles/roles.service";
import { PermissionsComponent } from "app/admin/features/permissions/permissions.component";

@Component({
	selector: "adm-roles",
	templateUrl: "./roles.component.html",
	imports: [TableComponent, PermissionsComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent {
	private readonly gatewayRolesService = inject(GatewayRolesService);

	public readonly config = this.gatewayRolesService.config;

	public readonly entityFactory = this.gatewayRolesService.entityFactory;

	public readonly httpCalls = this.gatewayRolesService.httpCalls;

	public readonly tableInformation = TABLES.roles;

	public selectedRole = signal<GatewayRole | null>(null);

	public onRoleClick(role: GatewayRole): void {
		this.selectedRole.set(role);
	}
}
