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
import { Operation } from "app/admin/data-access/operations/operation.model";
import { Resource } from "app/admin/data-access/resources/resource.model";
import { Route } from "app/admin/data-access/routes/route.model";
import { Service } from "app/admin/data-access/services/service.model";
import { METHODS } from "http";

export const ROUTE_COLUMNS: (
	payload: ConfBuilderPayload,
) => StrictCrudItemOptions<Route>[] = ({ data }) => [
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
		key: "operationId",
		label: "Operation",
		controlType: CONTROL_TYPES.SELECT,
		options: toSelectItems<Operation>(data.operations, "name"),
		controlOptions: {
			validators: [required],
		},
		columnOptions: {
			isHardHidden: true,
		},
	},
	{
		key: "operationName",
		label: "Operation",
		controlType: CONTROL_TYPES.INPUT,
		type: INPUT_TYPES.TEXT,
		options: data.operations.map((o: Operation) => ({
			label: o.name,
			value: o.name,
		})),
		controlOptions: {
			hidden: true,
		},
		columnOptions: {
			filterType: CONTROL_TYPES.MULTISELECT,
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
		options: METHODS.map((m) => ({
			label: m,
			value: m,
		})),
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
