import { SelectItem } from "primeng/api";

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
  return (items ?? []).map((item: T) => ({
    value: item.id,
    label: item[keyoflabel] as string,
    extraData: extraKeys?.reduce(
      (acc, key) => {
        acc[key] = item[key];
        return acc;
      },
      {} as Partial<T>,
    ),
  }));
}
