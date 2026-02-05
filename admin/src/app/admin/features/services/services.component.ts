import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { TableComponent } from "@table/table.component";
import { ServicesService } from "app/admin/data-access/services/services.service";

@Component({
	selector: "adm-services",
	templateUrl: "./services.component.html",
	imports: [TableComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
	private readonly servicesService = inject(ServicesService);

	public readonly config = this.servicesService.config;

	public readonly entityFactory = this.servicesService.entityFactory;

	public readonly httpCalls = this.servicesService.httpCalls;

	public readonly tableInformation = TABLES.services;
}
