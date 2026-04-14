import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { TableComponent } from "@table/table.component";
import { ColorsService } from "app/admin/data-access/colors/colors.service";

@Component({
	selector: "adm-colors",
	templateUrl: "./colors.component.html",
	imports: [TableComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorsComponent {
	private readonly colorsService = inject(ColorsService);

	public readonly config = this.colorsService.config;

	public readonly entityFactory = this.colorsService.entityFactory;

	public readonly httpCalls = this.colorsService.httpCalls;

	public readonly tableInformation = TABLES.colors;
}
