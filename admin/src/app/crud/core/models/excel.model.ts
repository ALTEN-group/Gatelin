import { TableColumn } from "@crud/core/utils/table/table-column.model";

export interface ExcelParams {
  columns: Record<string, TableColumn>;
  fileName: string;
  sheetName: string;
}
