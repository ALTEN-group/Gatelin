import { ID_CONFIG } from "@dwtechs/ngx-crud-builder";

// ID column that is also the grid's default sort (ascending), so rows have a stable order
export const ID_SORTED_CONFIG: typeof ID_CONFIG = {
  ...ID_CONFIG,
  columnOptions: {
    ...ID_CONFIG.columnOptions,
    defaultSortField: true,
    defaultSortOrder: 1,
  },
};
