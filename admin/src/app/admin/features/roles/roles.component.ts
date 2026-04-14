import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { ConfigHelper } from "@crud/core/utils/crud-service/config.helper";
import { TableComponent } from "@table/table.component";
import { GatewayRolesService } from "app/admin/data-access/roles/roles.service";

@Component({
	selector: "adm-roles",
	templateUrl: "./roles.component.html",
	imports: [TableComponent],
	providers: [ConfigHelper],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent {
	private readonly gatewayRolesService = inject(GatewayRolesService);
	private readonly configHelper = inject(ConfigHelper<GatewayRolesService>);

	public readonly config = this.configHelper.getConfig(this.gatewayRolesService);

	public readonly entityFactory = this.gatewayRolesService.entityFactory;

	public readonly httpCalls = this.gatewayRolesService.httpCalls;

	public readonly tableInformation = TABLES.roles;
}
