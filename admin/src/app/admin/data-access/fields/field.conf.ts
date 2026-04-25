import { ActivatedRouteSnapshot } from "@angular/router";
import { defaultArchivedConfig } from "@core/utils/archived-config/archived-config";
import { toSelectItems } from "@core/utils/primeng/to-select-items";
import {
  CONTROL_TYPES,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  minlength,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";
import { Field } from "app/admin/data-access/fields/field.model";
import { Resource } from "app/admin/data-access/resources/resource.model";
import { Service } from "app/admin/data-access/services/service.model";

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
    key: "serviceName",
    label: "Service",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    options: data.services.map((s: Service) => ({
      label: s.name,
      value: s.name,
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
    label: "Name",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      validators: [required, minlength(1), maxlength(50)],
    },
  },
  {
    key: "locked",
    label: "Locked",
    controlType: CONTROL_TYPES.CHECKBOX,
  },
  ...defaultArchivedConfig(),
];
