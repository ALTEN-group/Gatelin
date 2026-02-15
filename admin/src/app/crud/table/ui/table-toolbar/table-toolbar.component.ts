import { Component, computed, input, model, output } from "@angular/core";
import { ProtectFeatureDirective } from "@core/acl/protect-feature.directive";
import { CrudItemBase } from "@crud/core/models/crud-item-base.class";
import { CrudFeatures } from "@crud/core/utils/table/crud-loader.class";
import { TableColumn } from "@crud/core/utils/table/table-column.model";
import { ExportDialogComponent } from "@table/ui/export-dialog/export-dialog.component";
import { ExportOptions } from "@table/utils/excel/export.service";
import { SharedModule } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ButtonGroupModule } from "primeng/buttongroup";
import { FileUploadModule } from "primeng/fileupload";
import { ToolbarModule } from "primeng/toolbar";

@Component({
  selector: "tbl-table-toolbar",
  templateUrl: "./table-toolbar.component.html",
  styleUrls: ["./table-toolbar.component.scss"],
  imports: [
    ToolbarModule,
    SharedModule,
    ButtonModule,
    ProtectFeatureDirective,
    FileUploadModule,
    ExportDialogComponent,
    ButtonGroupModule,
  ],
})
export class TableToolbarComponent<TData extends CrudItemBase> {
  public readonly selectedEntries = input.required<TData[]>();
  public readonly features = input.required<CrudFeatures>();
  public readonly selectable = input.required<boolean>();
  public readonly areColumnsConfigurable = input.required<boolean>();
  public readonly functionalityKey = input.required<string | undefined>();
  public readonly tableTitle = input.required<string>();
  public readonly cols = input.required<TableColumn[]>();
  public readonly isExcelExportEnabled = input.required<boolean>();
  public readonly isCsvExportEnabled = input.required<boolean>();
  public readonly isExportDialogVisible = model.required<boolean>();
  public readonly isExportingData = input(false);

  public readonly archiveManyClicked = output<void>();
  public readonly restoreMultipleClicked = output<void>();
  public readonly manageColumnsClicked = output<void>();
  public readonly newClicked = output<void>();
  public readonly refreshDataClicked = output<void>();
  public readonly exportClicked = output<ExportOptions>();

  public readonly isExportEnabled = computed(() => {
    return (
      (this.isExcelExportEnabled() || this.isCsvExportEnabled()) &&
      !this.isExportingData()
    );
  });

  public readonly isToolbarDisplayed = computed(() => {
    const { archive: deleteFeature, create, restore } = this.features();
    const canMultiDelete = deleteFeature && this.selectable();
    return this.areColumnsConfigurable() || canMultiDelete || create || restore;
  });

  public onDeleteMultiple(): void {
    this.archiveManyClicked.emit();
  }

  public onRestoreMultiple(): void {
    this.restoreMultipleClicked.emit();
  }

  public manageColumns(): void {
    this.manageColumnsClicked.emit();
  }

  public onNew(): void {
    this.newClicked.emit();
  }
}
