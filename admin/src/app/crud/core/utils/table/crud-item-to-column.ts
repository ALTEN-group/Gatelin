import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { TableColumn } from "@crud/core/utils/table/table-column.model";

/**
 * Converts a CRUD item configuration into a table column configuration.
 *
 * @param item - The CRUD item options containing field configuration and display settings
 * @param storedConfig - Optional array of stored column configurations with visibility settings.
 *                       Defaults to an empty array if not provided.
 *
 * @returns A TableColumn object with merged configuration including:
 *          - Column visibility based on stored config or hidden flags
 *          - Cell renderer for displaying values
 *          - Tooltip configuration
 *          - Filter and sort settings
 *          - All original item and column options
 *
 * @remarks
 * - Visibility priority: stored config > soft/hard hidden flags
 * - Uses CellRenderer to format cell values and tooltips
 * - Filterable and sortable are enabled by default unless explicitly disabled
 * - Filter type defaults to the item's control type if not specified
 */
export function crudItemToColumn(
  item: CrudItemOptions,
  storedConfig: Pick<TableColumn, "key" | "isVisible">[] = [],
): TableColumn {
  const columnOptions = item.columnOptions || {};
  const isHidden = columnOptions.isSoftHidden || columnOptions.isHardHidden;
  const isVisible =
    // biome-ignore lint/suspicious/noDoubleEquals: key may be number or string
    storedConfig.find((col) => col.key == item.key)?.isVisible ?? !isHidden;
  return {
    ...item,
    ...columnOptions,
    key: item.key.toString(),
    isVisible,
    filterable: columnOptions.filterable !== false,
    sortable: columnOptions.sortable !== false,
    filterType: columnOptions.filterType ?? item.controlType,
  };
}
