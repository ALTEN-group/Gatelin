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
import { Route } from "app/admin/data-access/routes/route.model";

export const ROUTE_COLUMNS: StrictCrudItemOptions<Route>[] = [
	ID_CONFIG,
	{
		key: "serviceName",
		label: "Service",
		controlType: CONTROL_TYPES.INPUT,
		type: INPUT_TYPES.TEXT,
		controlOptions: {
			validators: [required, minlength(2), maxlength(10)],
		},
	},
  {
		key: "resourceName",
		label: "Resource",
		controlType: CONTROL_TYPES.INPUT,
		type: INPUT_TYPES.TEXT,
		controlOptions: {
			validators: [required, minlength(2), maxlength(20)],
		},
	},
	{
		key: "operationName",
		label: "Operation",
		controlType: CONTROL_TYPES.INPUT,
		type: INPUT_TYPES.TEXT,
		controlOptions: {
			validators: [required, minlength(2), maxlength(20)],
		},
	},
	{
		key: "description",
		label: "Description",
		controlType: CONTROL_TYPES.TEXTAREA,
		controlOptions: {
			validators: [required, maxlength(100)],
		},
	},
	{
		key: "pattern",
		label: "Pattern",
		controlType: CONTROL_TYPES.INPUT,
		type: INPUT_TYPES.TEXT,
		controlOptions: {
			validators: [required, minlength(1), maxlength(40)],
		},
	},
	{
		key: "methods",
		label: "Méthodes",
		controlType: CONTROL_TYPES.MULTISELECT,
		options: [
			{ label: "GET", value: "GET" },
			{ label: "POST", value: "POST" },
			{ label: "PUT", value: "PUT" },
			{ label: "PATCH", value: "PATCH" },
			{ label: "DELETE", value: "DELETE" },
			{ label: "OPTIONS", value: "OPTIONS" },
		],
		controlOptions: {
			validators: [required],
		},
	},
	{
		key: "jwt",
		label: "JWT",
		controlType: CONTROL_TYPES.CHECKBOX,
	},
	{
		key: "protected",
		label: "Protégé",
		controlType: CONTROL_TYPES.CHECKBOX,
	},
	...ARCHIVED_CONFIG,
];
