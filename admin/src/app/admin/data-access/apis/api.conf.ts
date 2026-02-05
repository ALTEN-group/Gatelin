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
import { Api } from "app/admin/data-access/apis/api.model";
import { Service } from "app/admin/data-access/services/service.model";

export const API_COLUMNS: (
	payload: ConfBuilderPayload,
) => StrictCrudItemOptions<Api>[] = ({ data }) => [
	ID_CONFIG,
	{
		key: "serviceId",
		label: "Service",
		controlType: CONTROL_TYPES.SELECT,
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
		key: "createdAt",
		label: "Créé le",
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
		label: "Créé par",
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
		label: "Modifié le",
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
		label: "Modifié par",
		controlType: CONTROL_TYPES.INPUT,
		type: INPUT_TYPES.TEXT,
		controlOptions: {
			hidden: true,
		},
		columnOptions: {
			isSoftHidden: true,
		},
	},
	...ARCHIVED_CONFIG,
];
