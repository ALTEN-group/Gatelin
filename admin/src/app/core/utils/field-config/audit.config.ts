import {
  ArchiveInfo,
  CONTROL_TYPES,
  INPUT_TYPES,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";

export const AUDIT_CONFIG: StrictCrudItemOptions<ArchiveInfo>[] = [
  {
    key: "createdAt",
    label: "Créé le",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: { hidden: true },
    columnOptions: { isSoftHidden: true },
  },
  {
    key: "creatorName",
    label: "Créé par",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: { hidden: true },
    columnOptions: { isSoftHidden: true },
  },
  {
    key: "updatedAt",
    label: "Modifié le",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: { hidden: true },
    columnOptions: { isSoftHidden: true },
  },
  {
    key: "updaterName",
    label: "Modifié par",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: { hidden: true },
    columnOptions: { isSoftHidden: true },
  },
];
