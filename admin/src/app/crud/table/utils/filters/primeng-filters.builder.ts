import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FilterLevel } from "@crud/core/utils/table/filter-level.model";
import { isArray, isNil } from "@dwtechs/checkard";
import { TableLazyLoadEvent } from "primeng/table";

type TableLazyLoadEventFilters = TableLazyLoadEvent["filters"];

/**
 * Function to return the default filter value if define in the conf
 * @returns An object containing the default filters for the table
 */
export function getFilters(
  items: CrudItemOptions[],
  filterLevel: FilterLevel,
): TableLazyLoadEventFilters {
  // If there is an "archived" column, set its default filter to false
  // const archived = { value: false, matchMode: "equals" };
  // const initialFilters: TableLazyLoadEventFilters = items.some(
  //   (item) => item.key === "archived",
  // )
  //   ? { archived: filterLevel === "advanced" ? [archived] : archived }
  //   : {};
  return items.reduce((filters, item) => {
    if (item.columnOptions?.defaultFilter) {
      const filter = item.columnOptions.defaultFilter;
      return {
        // biome-ignore lint/performance/noAccumulatingSpread: this is the behavior we want
        ...filters,
        [item.key]:
          filterLevel === "advanced" && !isArray(filter) ? [filter] : filter,
      };
    }
    return filters;
  }, {});
}

export function applyDefaultFilters(
  currentFilters: TableLazyLoadEventFilters,
  defaultFilters: TableLazyLoadEventFilters,
): TableLazyLoadEventFilters {
  const newFilters = { ...currentFilters };
  for (const filter in defaultFilters) {
    const defaultFilterMeta = defaultFilters[filter];
    if (!defaultFilterMeta) continue;
    const eventFilterMeta = currentFilters?.[filter];
    const isArrayFilter = isArray(eventFilterMeta);
    // array filter (advanced filtering mode)
    if (isArrayFilter) {
      const hasValue = eventFilterMeta.some((v) => !isNil(v.value));
      if (hasValue) continue; // do nothing if any value is set
      newFilters[filter] = isArray(defaultFilterMeta)
        ? defaultFilterMeta
        : [defaultFilterMeta];
    } else {
      // simple object value (basic filtering mode)
      const hasValue = !isNil(eventFilterMeta?.value);
      if (hasValue) continue; // do nothing if value is set
      newFilters[filter] = defaultFilterMeta;
    }
  }
  return newFilters;
}
