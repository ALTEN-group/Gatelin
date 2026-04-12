import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { StrictCrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { INPUT_TYPES } from "@crud/core/models/input-type.model";
import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

export const AUDIT_CONFIG: StrictCrudItemOptions<ArchiveInfo>[] = [
  {
    key: "createdAt",
    label: $localize`:@@Shared_CreatedAtComment:Créé le`,
    controlType: CONTROL_TYPES.DATE,
    controlOptions: {
      hidden: true,
    },
    columnOptions: {
      isSoftHidden: true,
    },
  },
  {
    key: "creatorName",
    label: $localize`:@@Shared_CreatorNameComment:Créé par`,
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      hidden: true,
    },
    columnOptions: {
      isSoftHidden: true,
    },
  },
  {
    key: "updatedAt",
    label: $localize`:@@Shared_UpdatedAtComment:Modifié le`,
    controlType: CONTROL_TYPES.DATE,
    controlOptions: {
      hidden: true,
    },
    columnOptions: {
      isSoftHidden: true,
    },
  },
  {
    key: "updaterName",
    label: $localize`:@@Shared_UpdaterNameComment:Modifié par`,
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      hidden: true,
    },
    columnOptions: {
      isSoftHidden: true,
    },
  },
];
