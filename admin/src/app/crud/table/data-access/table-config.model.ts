import { TableColumn } from "@crud/core/utils/table/table-column.model";

export class TableConfig {
  id: number | null = null;
  name = "";
  component = "";
  conf: ColumnConfig[] = [];
  isDefault = false;
  isActive = false;

  constructor(
    component: string,
    name: string = $localize`:@@Table_DefaultViewName:Default`,
  ) {
    this.component = component;
    this.name = name;
    this.isActive = true;
  }
}

export interface ExtendedTableConfig extends TableConfig {
  columns: TableColumn[];
}

export type ColumnConfig = Pick<
  TableColumn,
  "key" | "isVisible" | "defaultWidth"
>;
