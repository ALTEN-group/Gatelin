import { SelectItem } from "@openng/optimus-ui/api";

/**
 * Get a list of SelectItems from a list of item
 * @param items list of item to map
 * @param keyoflabel key of the label property
 * @returns a list of select item
 */
export function toSelectItems<T extends { id: number | null }>(
  items: T[],
  keyoflabel: keyof T,
  extraKeys?: (keyof T)[],
): (SelectItem & { extraData?: Partial<T> })[] {
  return (items ?? [])
    .map((item: T) => ({
      value: item.id,
      label: item[keyoflabel] as string,
      color: (item as any).color || null,
      extraData: extraKeys?.reduce(
        (acc, key) => {
          acc[key] = item[key];
          return acc;
        },
        {} as Partial<T>,
      ),
    }))
    .toSorted(
      (a: SelectItem, b: SelectItem) =>
        a.label?.localeCompare(b.label ?? "") ?? 0,
    );
}

export function toNamesSelectOptions<T extends { name: string }>(items: T[]) {
  return items
    .map((item: T) => ({
      label: item.name,
      value: item.name,
    }))
    .toSorted(
      (a: SelectItem, b: SelectItem) =>
        a.label?.localeCompare(b.label ?? "") ?? 0,
    );
}
