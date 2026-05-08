import { CrudItemBase } from "@dwtechs/crud-builder";

export function getHistoryFor(
  row: CrudItemBase & { locked?: boolean; core?: boolean },
): boolean {
  return !row.locked && !row.core;
}
