import { toSelectItems } from "@core/utils/primeng/to-select-items";
import { ConfBuilderPayload } from "@crud/core/models/conf-builder-payload.model";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { StrictCrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { INPUT_TYPES } from "@crud/core/models/input-type.model";
import { ARCHIVED_CONFIG } from "@crud/core/utils/confs/archived-config";
import { ID_CONFIG } from "@crud/core/utils/confs/id-config";
import {
	maxlength,
	minlength,
	required,
} from "@crud/form/utils/common.validators";
import { Resource } from "app/admin/data-access/resources/resource.model";
import { Service } from "app/admin/data-access/services/service.model";

export const RESOURCE_COLUMNS: (
	payload: ConfBuilderPayload,
) => StrictCrudItemOptions<Resource>[] = ({ data }) => [
	ID_CONFIG,
	{
		key: "serviceName",
		label: "Service",
		controlType: CONTROL_TYPES.MULTISELECT,
		options: toSelectItems<Service>(data.services, "name"),
		controlOptions: {
			validators: [required],
		},
	},
	{
		key: "name",
		label: "Nom",
		controlType: CONTROL_TYPES.INPUT,
		type: INPUT_TYPES.TEXT,
		controlOptions: {
			validators: [required, minlength(2), maxlength(20)],
		},
	},
  {
		key: "protected",
		label: "Protégé",
		controlType: CONTROL_TYPES.CHECKBOX,
	},
	...ARCHIVED_CONFIG,
];
