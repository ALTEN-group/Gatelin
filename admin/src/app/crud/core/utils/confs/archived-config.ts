import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { StrictCrudItemOptions } from "@crud/core/models/crud-item-options.model";

export class ArchiveInfo {
  updatedAt: Date | null = null;
  updaterId: number | null = null;
  updaterName: string | null = null;
  createdAt: Date | null = null;
  creatorId: number | null = null;
  creatorName: string | null = null;
  archived = false;
  archivedAt: Date | null = null;
}

export const ARCHIVED_CONFIG: StrictCrudItemOptions<ArchiveInfo>[] = [
  {
    key: "archived",
    controlType: CONTROL_TYPES.CHECKBOX,
    label: $localize`:@@Shared_ArchivedComment:Archived`,
    columnOptions: {
      tooltip: (cellValue) => {
        return cellValue ? "Archived" : "Active";
      },
    },
    controlOptions: {
      hidden: true,
    },
  },
  {
    key: "archivedAt",
    controlType: CONTROL_TYPES.DATE,
    label: $localize`:@@Shared_ArchivedAtComment:Archived At`,
    columnOptions: {
      isSoftHidden: true,
    },
    controlOptions: {
      hidden: true,
    },
  },
];
