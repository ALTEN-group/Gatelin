import { NgComponentOutlet } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
} from "@angular/core";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { CheckboxCellRendererComponent } from "@crud/core/ui/table-cell/cell-renderers/checkbox-renderer";
import { DateCellRendererComponent } from "@crud/core/ui/table-cell/cell-renderers/date-renderer";
import { FilesCellRendererComponent } from "@crud/core/ui/table-cell/cell-renderers/files-renderer";
import { GroupCellRendererComponent } from "@crud/core/ui/table-cell/cell-renderers/group-renderer";
import { MultiselectCellRendererComponent } from "@crud/core/ui/table-cell/cell-renderers/multiselect-renderer";
import { SelectCellRendererComponent } from "@crud/core/ui/table-cell/cell-renderers/select-renderer";

@Component({
	selector: "tbl-table-cell",
	templateUrl: "./table-cell.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		DateCellRendererComponent,
		CheckboxCellRendererComponent,
		FilesCellRendererComponent,
		MultiselectCellRendererComponent,
		SelectCellRendererComponent,
		GroupCellRendererComponent,
		NgComponentOutlet,
	],
})
export class TableCellComponent {
	public readonly cellValue = input.required<unknown>();
	public readonly options = input.required<CrudItemOptions>();

	public readonly ControlTypes = CONTROL_TYPES;

	public readonly customCellRenderer = computed(
		() => this.options().columnOptions?.customCellRenderer,
	);

	public readonly customRenderedValue = computed(() => {
		const renderer = this.customCellRenderer();
		if (!renderer) return null;
		return renderer(this.cellValue());
	});
}
