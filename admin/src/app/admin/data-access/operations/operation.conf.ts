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
