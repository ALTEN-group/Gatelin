import { ValidatorFn } from "@angular/forms";

export interface TableCtrlConfig {
  /**
   * Table row edition mode: row will enable dialog edition, cell will enable the inline-cell edition
   * In "cell" mode, users can edit individual cells directly within the table.
   * In "row" mode, users edit an entire row at once through a dialog interface.
   * /!\ Cell edition is only possible for INPUT, SELECT and MULTISELECT control types for now.
   * @default "cell"
   */
  editionMode: "row" | "cell";
  /** Enables filtering */
  filterable: boolean;
  /** Enables sorting */
  sortable: boolean;
  /** Enables selection */
  selectable: boolean;
  /** Callback to trigger when a cell is clicked */
  onCellClicked: (entry: {
    row: unknown;
    index: number;
    mode: "read" | "write";
  }) => unknown;
  /** Columns keys in sorted order */
  sortedColumnKeys: string[];
  /** Is header hidden */
  isHeaderHidden: boolean;
  /** Validator function for the whole form when editing in row mode */
  groupValidator: ValidatorFn;
  /** Indicates whether deletion of rows is enabled */
  isDeletionEnabled: boolean;
  /** Indicates whether creation of new rows is enabled */
  isCreationEnabled: boolean;
}
