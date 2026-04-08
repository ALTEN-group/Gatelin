import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from "@angular/core";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { isEqual } from "@crud/core/utils/arrays/is-equal.utils";
import { DATE_FORMAT } from "@crud/core/utils/dates/dates.utils";
import { SharedModule } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { FullHistoryRow, HistorizedData } from "./history.model";

@Component({
  selector: "crd-history",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"],
  imports: [TableModule, SharedModule, DatePipe, ButtonModule],
  encapsulation: ViewEncapsulation.None,
})
export class HistoryComponent<TData> {
  public readonly data = input.required<{
    rows: HistorizedData<TData>[];
    total: number;
  } | null>();

  public readonly config = input.required<CrudItemOptions[]>();

  public readonly rows = computed<FullHistoryRow<TData>[]>(() =>
    this.buildHistoryTable(),
  );

  public readonly selected = output<HistorizedData<TData>>();

  public readonly DATE_FORMAT = DATE_FORMAT;
  public selectedDate: string | null = null;

  public expandedRows: Record<string, boolean> = {};

  public showVersion(entry: HistorizedData<TData>) {
    this.selectedDate = entry.tstamp;
    this.selected.emit(entry);
  }

  private buildHistoryTable() {
    const rows = this.data()?.rows ?? [];
    return rows.map((row, rowIndex) => {
      const currentRow = row.val;
      const lastRow = rows[rowIndex + 1]?.val;
      const changes = [];
      for (const propKey in currentRow) {
        const change = this.buildChangesTable(
          propKey as keyof TData,
          currentRow,
          lastRow,
        );
        if (change) {
          changes.push(change);
        }
      }
      return { ...row, id: row.tstamp, changes };
    });
  }

  private buildChangesTable(
    propKey: keyof TData,
    currentRow: TData,
    lastRow: TData,
  ): FullHistoryRow<TData>["changes"][number] | null {
    const confItem = this.config().find((c) => c.key === propKey);
    const isHidden = confItem?.controlOptions?.hidden;
    if (!isHidden && confItem) {
      const label = confItem.label;
      const newValue = currentRow[propKey];
      const oldValue = lastRow ? lastRow[propKey] : undefined;
      return {
        propKey,
        label,
        oldValue,
        newValue,
        hasChanged: !isEqual(oldValue, newValue),
      };
    }
    return null;
  }
}
