import { defaultArchivedConfig } from "@core/utils/archived-config/archived-config";
import {
  CONTROL_TYPES,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  minlength,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";
import { GatewayApplication } from "app/admin/data-access/applications/application.model";

export function buildApplicationColumns(): StrictCrudItemOptions<GatewayApplication>[] {
  return [
    ID_CONFIG,
    {
      key: "name",
      label: $localize`:@@Applications_Name:Name`,
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      controlOptions: {
        validators: [required, minlength(1), maxlength(50)],
      },
    },
    {
      key: "description",
      label: $localize`:@@Applications_Description:Description`,
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      controlOptions: {
        validators: [maxlength(100)],
      },
    },
    ...defaultArchivedConfig(),
  ];
}
