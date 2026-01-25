import {
  Component,
  computed,
  inject,
  input,
  output,
  Signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TableLoadingService } from "@crud/core/utils/loading/table-loading.service";
import { TableColumn } from "@crud/core/utils/table/table-column.model";
import { ExportOptions } from "@table/utils/excel/export.service";
import { SelectItem, SharedModule } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { RippleModule } from "primeng/ripple";
import { SelectButtonModule } from "primeng/selectbutton";

@Component({
  selector: "tbl-export-dialog",
  templateUrl: "./export-dialog.component.html",
  styleUrls: ["./export-dialog.component.scss"],
  imports: [
    DialogModule,
    SharedModule,
    CardModule,
    SelectButtonModule,
    FormsModule,
    ButtonModule,
    RippleModule,
  ],
})
export class ExportDialogComponent {
  private readonly loadingService = inject(TableLoadingService);

  public readonly visible = input.required<boolean>();
  public readonly cols = input.required<TableColumn[]>();
  public readonly isExcelExportEnabled = input.required<boolean>();
  public readonly isCsvExportEnabled = input.required<boolean>();

  public readonly hide = output<void>();
  public readonly export = output<ExportOptions>();

  public readonly formats: Signal<SelectItem[]> = computed(() => [
    { label: "CSV", value: "csv", disabled: !this.isCsvExportEnabled() },
    { label: "Excel", value: "xls", disabled: !this.isExcelExportEnabled() },
  ]);

  public readonly selectionOptions: SelectItem[] = [
    { label: $localize`:@@exportDialog_AllData:Tout`, value: "all" },
    {
      label: $localize`:@@exportDialog_CurrentSelection:Sélection`,
      value: "filtered",
    },
  ];

  public format: "csv" | "xls" = "csv";
  public selection: "all" | "filtered" = "all";

  public isLoading = this.loadingService.isLoading;

  public onHide(): void {
    this.format = "csv";
    this.hide.emit();
  }

  public onExport(): void {
    this.export.emit({ format: this.format, selection: this.selection });
  }
}
