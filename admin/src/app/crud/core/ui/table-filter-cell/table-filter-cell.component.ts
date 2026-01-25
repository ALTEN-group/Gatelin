import { NgTemplateOutlet } from "@angular/common";
import { Component, inject, input, linkedSignal, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import {
  DATE_FORMAT_CALENDAR,
  getMidnightTimeStamp,
} from "@crud/core/utils/dates/dates.utils";
import { FilterLevel } from "@crud/core/utils/table/filter-level.model";
import { TableColumn } from "@crud/core/utils/table/table-column.model";
import { isArray } from "@dwtechs/checkard";
import { FilterService, SharedModule } from "primeng/api";
import { DatePickerModule } from "primeng/datepicker";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { SelectModule } from "primeng/select";
import { SliderModule } from "primeng/slider";
import { Table, TableModule } from "primeng/table";

@Component({
  selector: "crd-table-filter-cell",
  templateUrl: "./table-filter-cell.component.html",
  styleUrls: ["./table-filter-cell.component.scss"],
  imports: [
    TableModule,
    SharedModule,
    DatePickerModule,
    FormsModule,
    NgTemplateOutlet,
    SelectModule,
    MultiSelectModule,
    InputTextModule,
    SliderModule,
  ],
})
export class TableFilterCellComponent implements OnInit {
  private readonly filterService = inject(FilterService);

  readonly col = input.required<TableColumn>();
  readonly dt = input.required<Table>();
  readonly filterLevel = input.required<FilterLevel>();

  public ControlType = CONTROL_TYPES;
  public dateRange: Date[] = [];
  public DATE_FORMAT = DATE_FORMAT_CALENDAR;

  public numberRange: [min: number, max: number] = [0, 200];

  get options() {
    return this.col().options || [];
  }

  public filterValue = linkedSignal(() => {
    const filterMeta = this.dt().filters?.[this.col().key];
    return isArray(filterMeta) ? filterMeta[0].value : filterMeta?.value;
  });

  ngOnInit(): void {
    const col = this.col();
    const isDateControl = col.controlType === CONTROL_TYPES.DATE;
    if (isDateControl) {
      this.initDateRangeFilter();
    }
  }

  private initDateRangeFilter() {
    this.filterService.register(
      "dateRange",
      (cellValue: Date | string, filterValue: unknown): boolean => {
        return this.dateRangeFilter(cellValue, filterValue);
      },
    );
  }

  /**
   * /!\ This method will be triggered when filtering the table without lazy-loading ONLY
   */
  private dateRangeFilter(
    cellValue: Date | string,
    filterValue: unknown,
  ): boolean {
    if (!filterValue) {
      return true;
    }

    if (!cellValue) {
      return false;
    }

    const from: Date = this.dateRange[0];
    const to: Date = this.dateRange[1];
    const fromTimeStamp = getMidnightTimeStamp(from) as number;
    const cellTimeStamp = getMidnightTimeStamp(cellValue) as number;

    if (!to) {
      return cellTimeStamp >= fromTimeStamp;
    }

    const toTimeStamp = getMidnightTimeStamp(to) as number;

    return fromTimeStamp <= cellTimeStamp && toTimeStamp >= cellTimeStamp;
  }
}
