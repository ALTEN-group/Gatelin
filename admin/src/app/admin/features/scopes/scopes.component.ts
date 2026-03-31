import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { ConfigHelper } from "@crud/core/utils/crud-service/config.helper";
import { TableComponent } from "@table/table.component";
import { ScopesService } from "app/admin/data-access/scopes/scopes.service";

@Component({
	selector: "adm-scopes",
	templateUrl: "./scopes.component.html",
	imports: [TableComponent],
	providers: [ConfigHelper],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScopesComponent {
	private readonly scopesService = inject(ScopesService);
	private readonly configHelper = inject(ConfigHelper<ScopesService>);

	public readonly config = this.configHelper.getConfig(this.scopesService);

	public readonly entityFactory = this.scopesService.entityFactory;

	public readonly httpCalls = this.scopesService.httpCalls;

	public readonly tableInformation = TABLES.scopes;
}
