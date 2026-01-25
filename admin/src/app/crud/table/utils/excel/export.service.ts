import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { ExcelParams } from "@crud/core/models/excel.model";
import { Repository } from "@crud/core/utils/crud-service/crud.model";
import { NO_ROWS_AND_COUNT } from "@crud/core/utils/crud-service/no-rows";
import { CellTextContent } from "@crud/core/utils/table/cell-text-content.class";
import { TableColumn } from "@crud/core/utils/table/table-column.model";
import { TableStateService } from "@crud/core/utils/table/table-state.service";
import { Export } from "@dwtechs/csvx";
import { ExcelService } from "@table/utils/excel/excel.service";
import { LocationInterceptorService } from "@table/utils/excel/location-interceptor.service";
import { TableColumnsStorage } from "@table/utils/views/table-columns.storage";
import saveAs from "file-saver";
import {
  catchError,
  delay,
  map,
  Observable,
  of,
  retry,
  switchMap,
  tap,
  throwError,
} from "rxjs";

export interface ExportOptions {
  format: "csv" | "xls";
  selection: "all" | "filtered";
}

@Injectable()
export class ExportService<TData extends { id: number }> {
  private readonly locationInterceptorService = inject(
    LocationInterceptorService,
  );
  private readonly excelService = inject(ExcelService);
  private readonly state = inject(TableStateService);
  private readonly tableViewsService = inject(TableColumnsStorage);
  private readonly http = inject(HttpClient);

  public readonly isExportingData = signal(false);

  private readonly columns = this.tableViewsService.activeColumns;

  private readonly params = computed(() => this.state.state().currentParams);
  private getCall: Repository<TData>["get"] = () => of(NO_ROWS_AND_COUNT);

  public export(
    options: ExportOptions,
    getCall: Repository<TData>["get"],
  ): Observable<boolean> {
    this.state.setCurrentTime();
    this.getCall = getCall ?? (() => of(NO_ROWS_AND_COUNT));
    const { format, selection } = options;
    if (format === "csv") {
      return this.exportCsv(selection);
    }
    return this.exportToXls(selection);
  }

  private exportToXls(selection: "all" | "filtered") {
    this.isExportingData.set(true);
    const columns = this.columns()
      .filter((col) => this.shouldExportColumn(selection, col))
      .reduce(
        (acc, curr) => {
          acc[curr.key] = curr;
          return acc;
        },
        {} as ExcelParams["columns"],
      );
    return this.exportXls(
      selection,
      {
        columns,
        fileName: this.state.state().fileName,
        sheetName: this.state.state().entityLabel,
      },
      this.state.state().excelExportMode,
    );
  }
  /**
   * Return true if a column should be exported.
   * In all mode, we export all columns that are not hard hidden.
   * In filtered mode, we export all visibles column.
   * A column will never be exported if ignoreOnExport is true
   * @param selection the export mode
   * @param col the column that we want to check
   * @returns true if the column should be exported
   */
  private shouldExportColumn(
    selection: "all" | "filtered",
    col: TableColumn,
  ): boolean {
    return (
      !col.ignoreOnExport &&
      ((selection === "filtered" && col.isVisible) ||
        (selection === "all" && !col.isHardHidden))
    );
  }

  private exportXls(
    selection: "all" | "filtered",
    excelParams: ExcelParams,
    exportMode: "local" | "server",
  ) {
    const params = this.params();
    if (!params) return of(false);
    const payload =
      selection === "filtered"
        ? params
        : {
            ...params,
            rows: undefined,
            first: undefined,
            last: undefined,
            filters: {},
          };

    const serverCall$ = this.getCall({
      ...payload,
      excel: excelParams,
    }).pipe(
      map(() => this.locationInterceptorService.consumeLocation()),
      switchMap((location: string | undefined) => {
        if (!location) throw of(throwError(() => {}));
        return this.tryDownloadXls(location);
      }),
      tap(() => {
        this.isExportingData.set(false);
      }),
      map(() => true),
      catchError(() => of(false)),
    );

    const localCall$ = (
      this.state.state().lazy
        ? this.getCall(payload)
        : of({ rows: this.state.state().data })
    ).pipe(
      switchMap((res) =>
        this.excelService.generateExcel(res.rows, excelParams),
      ),
    );

    if (exportMode === "local") {
      return localCall$;
    }
    this.locationInterceptorService.enableLocationHeaderWaiting();
    return serverCall$;
  }
  /**
   * Downloads an Excel file from the given location and saves it locally.
   * If the file is not found, it retries the download up to 5 times with a
   * 2 second delay between each try.
   *
   * @param location the URL of the Excel file to download
   * @returns an Observable that emits nothing
   * @throws an error if the file is not found after the maximum number of retries
   */
  private tryDownloadXls(location: string) {
    const delayBetweenTries = 2000;
    const maxRetry = 5;
    return this.http.get(location, { responseType: "blob" }).pipe(
      delay(delayBetweenTries),
      tap((data) => {
        if (!data) {
          throw throwError(data);
        }
        const blob = new Blob([data], {
          type: data.type,
        });
        const fileName = location.split("/").pop();
        saveAs(blob, fileName);
      }),
      retry(maxRetry),
    );
  }

  private exportCsv(selection: "all" | "filtered"): Observable<boolean> {
    const { fileName } = this.state.state();
    const columns = this.columns();
    return this.getCall({
      rows: null,
      filters: selection === "filtered" ? this.params()?.filters : undefined,
    }).pipe(
      tap((data) => {
        if (!data) return;
        let customLabels = {};
        const visibleColumns =
          selection === "filtered"
            ? columns.filter((item) => item.isVisible)
            : columns;
        for (const param of visibleColumns) {
          customLabels = { ...customLabels, [param.key]: param.label };
        }
        const array = data.rows.map((item: TData) => {
          const arrayItems: { [key: string]: string } = {};
          for (const key of Object.keys(item)) {
            const control = visibleColumns.find((item) => item.key === key);
            if (control) {
              const stringItem = new CellTextContent({
                cellValue: item[key as keyof TData],
                options: control,
              }).value;
              arrayItems[key] = (stringItem as string) ?? "";
            }
          }
          return arrayItems;
        });
        Export.data(fileName, array, {
          separator: ";",
          customLabels,
        });
      }),
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
