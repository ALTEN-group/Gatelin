import { TableRegularComponent } from "@table/ui/table-regular/table-regular.component";
import { MenuItem } from "primeng/api";

export function buildContextMenu<TData>(
  tableRegular: TableRegularComponent<TData>,
): MenuItem[] {
  if (!tableRegular.isContextMenuEnabled()) return [];

  const seeItem = {
    label: "Visualiser",
    icon: "pi pi-fw pi-eye",
    command: () => {
      if (!tableRegular.rightClickedEntry) {
        return;
      }
      tableRegular.cellClicked.emit({
        row: tableRegular.rightClickedEntry,
        mode: "read",
      });
    },
  };

  const items = [seeItem];

  const editItem = {
    label: "Modifier",
    icon: "pi pi-fw pi-pencil",
    command: () => {
      if (!tableRegular.rightClickedEntry) {
        return;
      }
      tableRegular.cellClicked.emit({
        row: tableRegular.rightClickedEntry,
        mode: "write",
      });
    },
  };

  if (tableRegular.features().update) {
    items.push(editItem);
  }

  return items;
}
