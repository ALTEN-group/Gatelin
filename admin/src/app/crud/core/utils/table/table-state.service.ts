import { computed, Injectable, signal } from "@angular/core";
import { RowsAndCount } from "@crud/core/utils/crud-service/dto.model";
import { ExcelExportMode } from "@crud/core/utils/table/export-mode.model";
import { TableLazyLoadEvent } from "primeng/table";

export interface TableState<TData> {
  currentTime: number;
  currentParams: TableLazyLoadEvent | undefined;
  data: TData[];
  entityLabel: string;
  excelExportMode: ExcelExportMode;
  fileName: string;
  lazy: boolean;
  total: number;
}

@Injectable()
export class TableStateService<TData> {
  private readonly currentTime = signal(Date.now());
  private readonly currentParams = signal<TableLazyLoadEvent | undefined>(
    undefined,
  );
  private readonly data = signal<TData[]>([]);
  private readonly entityLabel = signal("");
  private readonly excelExportMode = signal<ExcelExportMode>("server");
  private readonly lazy = signal(true);
  private readonly total = signal(0);

  private readonly fileName = computed(
    () => `${this.entityLabel().toLowerCase()}_${this.currentTime()}`,
  );

  public readonly state = computed<TableState<TData>>(() => {
    return {
      currentTime: this.currentTime(),
      currentParams: this.currentParams(),
      data: this.data(),
      entityLabel: this.entityLabel(),
      excelExportMode: this.excelExportMode(),
      fileName: this.fileName(),
      lazy: this.lazy(),
      total: this.total(),
    };
  });

  public setStaticInformation(payload: {
    lazy: boolean;
    entityLabel: string;
    excelExportMode: ExcelExportMode;
  }) {
    this.lazy.set(payload.lazy);
    this.entityLabel.set(payload.entityLabel);
    this.excelExportMode.set(payload.excelExportMode);
  }

  public setCurrentTime() {
    this.currentTime.set(Date.now());
  }

  public setParams(params: TableLazyLoadEvent | undefined) {
    this.currentParams.set(params);
  }

  public setData(res: RowsAndCount<TData>) {
    this.total.set(res.total);
    this.data.set(res.rows);
  }
}
