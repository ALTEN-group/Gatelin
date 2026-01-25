import { Injectable } from "@angular/core";
import { ExcelParams } from "@crud/core/models/excel.model";
import {
  formatDate,
  isValidDateString,
} from "@crud/core/utils/dates/dates.utils";
import { CellTextContent } from "@crud/core/utils/table/cell-text-content.class";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { catchError, from, map, of, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ExcelService<T> {
  public generateExcel(data: (T & object)[], excelParams: ExcelParams) {
    const workbook = new ExcelJS.Workbook();

    const { fileName, sheetName, columns } = excelParams;
    const worksheet = workbook.addWorksheet(sheetName);
    // Add headers
    const headers: string[] = [];
    for (const col in columns) {
      headers.push(columns[col].label);
    }
    worksheet.addRow(headers);
    // Add data
    for (const item of data) {
      const row = [];
      for (const col in columns) {
        const cellValue = item[col as keyof T];
        let renderedValue = new CellTextContent({
          cellValue,
          options: columns[col],
        }).value;

        if (isValidDateString(cellValue)) {
          renderedValue = formatDate(renderedValue as string);
        }

        row.push(renderedValue);
      }
      worksheet.addRow(row);
    }
    return from(workbook.xlsx.writeBuffer()).pipe(
      tap((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${fileName}.xlsx`);
      }),
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
