import { Type } from "@angular/core";
import { SafeHtml } from "@angular/platform-browser";
import { ControlType } from "@crud/core/models/control-type.model";
import { FilterMetadata } from "primeng/api";

export class ColumnOptions {
  /** Defines if the column is sortable or not */
  sortable?: boolean;
  /** Specifies a default value for the filter*/
  defaultFilter?: FilterMetadata | FilterMetadata[];
  /** Should the column be sorted by default when landing on the table */
  defaultSortField?: boolean;
  /** Should the column be sorted ascending (1) or descending (-1) */
  defaultSortOrder?: -1 | 1;
  /** Defines if the column is filterable or not */
  filterable?: boolean;
  /** Specifies a specific control type for the filter input */
  filterType?: ControlType;
  /** Custom tooltip renderer for the column cells */
  tooltip?: (cellValue: unknown) => SafeHtml;
  /** If set to true, the column will be hidden but can be unhidden in column management */
  isSoftHidden?: boolean;
  /** If set to true, the column will be hidden in the table and in the column management dialog */
  isHardHidden?: boolean;
  /** Specifies a custom renderer for datatable cells
   * TODO: allow to use a custom component as renderer
   * Warning: be careful when using this prop, as it can lead to performance issues
   * Along with xss security issues if the renderer returns unsafe HTML
   */
  customCellRenderer?: (cellValue: unknown) => string;
  /** Specifies a custom component for datatable cells -- Works for CUSTOM controlType */
  customComponent?: Type<unknown>;
  /** If true and the value is an array, each item will be displayed as a chip. Default true */
  valueAsChip?: boolean;
  /** Cell will be centered */
  centered?: boolean;
  /** Maximal width of the column. If not defined, will default to 150px */
  defaultWidth?: string;
  /* Should column be frozen (false by default)
    As default is left frozen, the frozen columns should be the first ones
  */
  isFrozen?: boolean;
  /** Specifies if the column should be ignore on export */
  ignoreOnExport?: boolean;
  /** If the column should have a different label that the main label defined in CrudItemOptions */
  label?: string;
  /** If the edition of this cell should be disabled in inline-cell edition mode */
  isCellEditionDisabled?: boolean;
}
