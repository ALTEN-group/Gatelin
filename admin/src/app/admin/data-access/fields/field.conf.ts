import {
  CONTROL_TYPES,
  createArchivedConfig,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  minlength,
  required,
  StrictCrudItemOptions,
} from "@altengroup/crud-builder";
import { ActivatedRouteSnapshot } from "@angular/router";
import { toSelectItems } from "@core/utils/primeng/to-select-items";
import { Field } from "app/admin/data-access/fields/field.model";
import { Resource } from "app/admin/data-access/resources/resource.model";

export const FIELD_COLUMNS: (
  payload: ActivatedRouteSnapshot,
) => StrictCrudItemOptions<Field>[] = ({ data }) => [
  ID_CONFIG,
  {
    key: "resourceId",
    label: "Resource",
    controlType: CONTROL_TYPES.SELECT,
    options: toSelectItems<Resource>(data.resources, "name"),
    controlOptions: {
      validators: [required],
    },
    columnOptions: {
      isHardHidden: true,
    },
  },
  {
    key: "resourceName",
    label: "Resource",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    options: data.resources.map((r: Resource) => ({
      label: r.name,
      value: r.name,
    })),
    controlOptions: {
      hidden: true,
    },
    columnOptions: {
      filterType: CONTROL_TYPES.MULTISELECT,
    },
  },
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
    key: "locked",
    label: "Verrouillé",
    controlType: CONTROL_TYPES.CHECKBOX,
  },
  ...createArchivedConfig(),
];
