import {
  CONTROL_TYPES,
  createArchivedConfig,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  minlength,
  required,
  StrictCrudItemOptions
} from "@altengroup/crud-builder";
import { Operation } from "app/admin/data-access/operations/operation.model";

export const OPERATION_COLUMNS: StrictCrudItemOptions<Operation>[] = [
  ID_CONFIG,
  {
    key: "name",
    label: "Nom",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      validators: [required, minlength(1), maxlength(50)],
    },
  },
  {
    key: "description",
    label: "Description",
    controlType: CONTROL_TYPES.TEXTAREA,
    controlOptions: {
      validators: [maxlength(1000)],
      minWidth: "100%",
    },
  },
  ...createArchivedConfig(),
];
