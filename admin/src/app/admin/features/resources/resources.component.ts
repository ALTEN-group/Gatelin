import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TABLES } from "@core/app-config/app.tables";
import { TableComponent } from "@table/table.component";
import { ResourcesService } from "app/admin/data-access/resources/resources.service";

@Component({
	selector: "adm-resources",
	templateUrl: "./resources.component.html",
	imports: [TableComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesComponent {
	private readonly resourcesService = inject(ResourcesService);
	private readonly route = inject(ActivatedRoute);

	public readonly config = this.resourcesService.config({
		data: { services: this.route.snapshot.data.services },
	});

	public readonly entityFactory = this.resourcesService.entityFactory;

	public readonly httpCalls = this.resourcesService.httpCalls;

	public readonly tableInformation = TABLES.resources;
}
