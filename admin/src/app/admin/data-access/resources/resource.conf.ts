import { ActivatedRouteSnapshot } from "@angular/router";
import { ARCHIVED_CONFIG } from "@core/utils/field-config/archived.config";
import { AUDIT_CONFIG } from "@core/utils/field-config/audit.config";
import { CORE_CONFIG } from "@core/utils/field-config/core.config";
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
import { Resource } from "app/admin/data-access/resources/resource.model";
import { Service } from "app/admin/data-access/services/service.model";

export const RESOURCE_COLUMNS: (
  payload: ActivatedRouteSnapshot,
) => StrictCrudItemOptions<Resource>[] = ({ data }) => [
  ID_CONFIG,
  {
    key: "serviceId",
    label: "Service",
    controlType: CONTROL_TYPES.SELECT,
    options: toSelectItems<Service>(data.services, "name"),
    controlOptions: {
      validators: [required],
    },
    columnOptions: {
      isHardHidden: true,
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
      validators: [required, minlength(2), maxlength(20)],
    },
  },
  CORE_CONFIG,
  ...ARCHIVED_CONFIG,
  ...AUDIT_CONFIG,
];
