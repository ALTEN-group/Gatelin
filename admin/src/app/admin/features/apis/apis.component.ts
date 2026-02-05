import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { TableComponent } from "@table/table.component";
import { ApisService } from "app/admin/data-access/apis/apis.service";
import { ServicesService } from "app/admin/data-access/services/services.service";

@Component({
	selector: "adm-apis",
	templateUrl: "./apis.component.html",
	imports: [TableComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApisComponent {
	private readonly apisService = inject(ApisService);
	private readonly servicesService = inject(ServicesService);

	public readonly config = this.apisService.config({
		data: { services: [] }, // TODO
	});

	public readonly entityFactory = this.apisService.entityFactory;

	public readonly httpCalls = this.apisService.httpCalls;

	public readonly tableInformation = TABLES.apis;
}
