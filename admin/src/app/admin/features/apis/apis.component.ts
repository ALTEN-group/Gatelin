import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TABLES } from "@core/app-config/app.tables";
import { TableComponent } from "@table/table.component";
import { ApisService } from "app/admin/data-access/apis/apis.service";

@Component({
	selector: "adm-apis",
	templateUrl: "./apis.component.html",
	imports: [TableComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApisComponent {
	private readonly apisService = inject(ApisService);
	private readonly route = inject(ActivatedRoute);

	public readonly config = this.apisService.config({
		data: { services: this.route.snapshot.data.services },
	});

	public readonly entityFactory = this.apisService.entityFactory;

	public readonly httpCalls = this.apisService.httpCalls;

	public readonly tableInformation = TABLES.apis;
}
