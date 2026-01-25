import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { StrictCrudItemOptions } from "@crud/core/models/crud-item-options.model";

export class ArchiveInfo {
  archived = false;
  archivedAt: Date | null = null;
}

export const ARCHIVED_CONFIG: StrictCrudItemOptions<ArchiveInfo>[] = [
  {
    key: "archived",
    controlType: CONTROL_TYPES.CHECKBOX,
    label: $localize`:@@Shared_ArchivedComment:Désactivé`,
    columnOptions: {
      isSoftHidden: true,
      customCellRenderer: (cellValue) => {
        return cellValue
          ? '<span class="red">Désactivé</span>'
          : '<span class="green">Actif</span>';
      },
      tooltip: (cellValue) => {
        return cellValue ? "Désactivé" : "Actif";
      },
    },
    controlOptions: {
      hidden: true,
    },
  },
  {
    key: "archivedAt",
    controlType: CONTROL_TYPES.DATE,
    label: $localize`:@@Shared_ArchivedAtComment:Désactivé le`,
    columnOptions: {
      isSoftHidden: true,
    },
    controlOptions: {
      hidden: true,
    },
  },
];
