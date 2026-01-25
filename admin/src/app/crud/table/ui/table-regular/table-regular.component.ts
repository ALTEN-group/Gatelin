import { NgStyle, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  effect,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { TableCellComponent } from "@crud/core/ui/table-cell/table-cell.component";
import { TableFilterCellPrimeComponent } from "@crud/core/ui/table-filter-cell-prime/table-filter-cell-prime.component";
import { TableFilterCellComponent } from "@crud/core/ui/table-filter-cell/table-filter-cell.component";
import { CrudFeatures } from "@crud/core/utils/table/crud-loader.class";
import { FilterLevel } from "@crud/core/utils/table/filter-level.model";
import { TableColumn } from "@crud/core/utils/table/table-column.model";
import { ColumnResizeEvent } from "@crud/table/utils/views/table-config.model";
import { TableActionsCellComponent } from "@table/ui/table-actions-cell/table-actions-cell.component";
import { TableCellTooltipComponent } from "@table/ui/table-cell-tooltip/table-cell-tooltip.component";
import { ColWidthPipe } from "@table/ui/table-regular/col-width.pipe";
import { buildContextMenu } from "@table/ui/table-regular/context-menu.builder";
import { FirstRowPipe } from "@table/utils/pipes/first-row.pipe";
import { LastRowPipe } from "@table/utils/pipes/last-row.pipe";
import { FilterMetadata } from "primeng/api";
import { ContextMenuModule } from "primeng/contextmenu";
import {
  Table,
  TableColResizeEvent,
  TableLazyLoadEvent,
  TableModule,
} from "primeng/table";
import { Tooltip } from "primeng/tooltip";

@Component({
  selector: "tbl-table-regular",
  templateUrl: "./table-regular.component.html",
  imports: [
    TableModule,
    FirstRowPipe,
    LastRowPipe,
    NgStyle,
    TableActionsCellComponent,
    TableFilterCellComponent,
    TableFilterCellPrimeComponent,
    ContextMenuModule,
    ColWidthPipe,
    NgTemplateOutlet,
    TableCellComponent,
    TableCellTooltipComponent,
    Tooltip,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRegularComponent<TData> {
  public readonly dataTable = viewChild(Table);

  // TODO: rows number could be computed to take all the screen height

  public readonly columns = input.required<TableColumn[]>();
  public readonly data = input.required<TData[]>();
  public readonly total = input.required<number>();
  public readonly selectable = input.required<boolean>();
  public readonly clickableRows = input.required<boolean>();
  public readonly lazy = input.required<boolean>();
  public readonly features = input.required<CrudFeatures>();
  public readonly functionalityKey = input.required<string | undefined>();
  public readonly selectedEntries = model.required<TData[]>();
  public readonly filterable = input.required<boolean>();
  public readonly defaultFilters = input.required({
    transform: (filters) =>
      filters as { [key: string]: FilterMetadata | FilterMetadata[] },
  });
  public readonly sortable = input.required<boolean>();
  public readonly defaultSort = input.required<{
    field: string;
    order: 1 | -1;
  }>();
  public readonly paginator = input.required<boolean>();
  public readonly filterLevel = input.required<FilterLevel>();
  public readonly customRowStyles = input.required<
    ((row: TData) => Record<string, string>) | undefined
  >();
  public readonly customActionsTemplate = input.required<
    TemplateRef<unknown> | undefined
  >();
  public readonly isContextMenuEnabled = input.required<boolean>();
  public readonly entityId = input.required<string>();
  public readonly stateStorage = input.required<"local" | "session">();
  public readonly areColumnsResizable = input.required<boolean>();

  public rightClickedEntry: TData | null = null;

  public readonly contextMenuItems = computed(() => buildContextMenu(this));

  readonly selectedEntriesChange = output<TData[]>();
  readonly lazyLoaded = output<TableLazyLoadEvent>();
  readonly archived = output<number>();
  readonly cellClicked = output<{
    row: TData;
    mode: "read" | "write";
  }>();
  public readonly columnResized = output<ColumnResizeEvent>();

  public readonly lastUpdateTime = signal(0);

  public readonly totalCount = computed(() => this.total() ?? 0);

  public readonly sortField = computed(() => this.defaultSort().field);
  public readonly sortOrder = computed<1 | -1>(() => this.defaultSort().order);

  public readonly visibleColumns = computed(() =>
    this.columns().filter((col) => col.isVisible),
  );

  // Handle sorting manually to be able to synchronize with stateStorage
  readonly sortEffect = effect(() => {
    const table = this.dataTable();
    if (!table) {
      return;
    }
    const { field, order } = this.defaultSort();
    table.sortField = field;
    table.sortOrder = order;
  });

  public trackCol(col: TableColumn) {
    return col;
  }

  public onLazyLoad(event: TableLazyLoadEvent): void {
    this.lazyLoaded.emit(event);
    this.lastUpdateTime.set(Date.now());
  }

  public onCellClick(rowData: TData, col: TableColumn) {
    if (!this.clickableRows() || col.controlType === CONTROL_TYPES.CUSTOM) {
      return;
    }
    const mode = this.features().update ? "write" : "read";
    this.cellClicked.emit({ row: rowData, mode });
  }

  public onActionClick(rowData: TData, mode: "read" | "write") {
    this.cellClicked.emit({ row: rowData, mode });
  }

  public onColumnResized(event: TableColResizeEvent) {
    const colKey = event.element.getAttribute("data-colkey") ?? "";
    if (!colKey) return;
    // Emit the resize event
    const newWidthPx = event.element.offsetWidth;
    const resizeEvent: ColumnResizeEvent = {
      colKey,
      newWidthPx,
    };
    this.columnResized.emit(resizeEvent);
  }
}
