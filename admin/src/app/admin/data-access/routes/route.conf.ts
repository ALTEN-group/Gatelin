import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { StrictCrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { INPUT_TYPES } from "@crud/core/models/input-type.model";
import { ID_CONFIG } from "@crud/core/utils/confs/id-config";
import { Route } from "app/admin/data-access/routes/route.model";

export const ROUTE_COLUMNS: StrictCrudItemOptions<Route>[] = [
  ID_CONFIG,
  {
    key: "route",
    label: "Route",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
  },
  {
    key: "service",
    label: "Service",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
  },
  {
    key: "description",
    label: "Description",
    controlType: CONTROL_TYPES.TEXTAREA,
  },
  {
    key: "pattern",
    label: "Pattern",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
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
    ],
  },
  {
    key: "jwt",
    label: "JWT",
    controlType: CONTROL_TYPES.CHECKBOX,
  },
  {
    key: "createdAt",
    label: "Créé le",
    controlType: CONTROL_TYPES.DATE,
  },
  {
    key: "creatorName",
    label: "Créé par",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
  },
  {
    key: "updatedAt",
    label: "Modifié le",
    controlType: CONTROL_TYPES.DATE,
  },
  {
    key: "updaterName",
    label: "Modifié par",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
  },
];
