import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";

export function getDefaultSort(items: CrudItemOptions[]): {
  field: string;
  order: 1 | -1;
} {
  return items.reduce<{ field: string; order: 1 | -1 }>(
    (acc, item) => {
      if (item.columnOptions?.defaultSortField) {
        acc.field = item.key;
        acc.order = item.columnOptions.defaultSortOrder ?? 1;
      }
      return acc;
    },
    { field: "", order: 1 },
  );
}

export function applyDefaultSort(
  currentSort: {
    field: string | string[] | null | undefined;
    order: number | null | undefined;
  },
  defaultSort: { field: string; order: 1 | -1 },
): { field: string; order: 1 | -1 } {
  if (
    (!currentSort || !currentSort.field) &&
    defaultSort &&
    defaultSort.field
  ) {
    return defaultSort;
  }
  return currentSort as { field: string; order: 1 | -1 };
}
