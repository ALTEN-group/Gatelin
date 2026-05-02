import { inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRouteSnapshot } from "@angular/router";
import { ARCHIVED_CONFIG } from "@core/utils/field-config/archived.config";
import { AUDIT_CONFIG } from "@core/utils/field-config/audit.config";
import { buildColorCellRenderer } from "@core/utils/renderers/color.renderer";
import {
  CONTROL_TYPES,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  minlength,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";
import { Condition } from "app/admin/data-access/conditions/condition.model";
import { Field } from "app/admin/data-access/fields/field.model";

const OP_OPTIONS = [
  { label: "=", value: "=" },
  { label: "!=", value: "!=" },
  { label: "<", value: "<" },
  { label: ">", value: ">" },
  { label: "<=", value: "<=" },
  { label: ">=", value: ">=" },
];

export const CONDITION_COLUMNS: (
  payload: ActivatedRouteSnapshot,
) => StrictCrudItemOptions<Condition>[] = ({ data }) => {
  const sanitizer = inject(DomSanitizer);
  return [
    ID_CONFIG,
    {
      key: "name",
      label: "Name",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      controlOptions: {
        validators: [required, minlength(1), maxlength(100)],
      },
    },
    {
      key: "fieldId",
      label: "Field",
      controlType: CONTROL_TYPES.SELECT,
      options: (data.fields as Field[]).map((f: Field) => ({
        label: `${f.resourceName}.${f.name}`,
        value: f.id,
      })),
      controlOptions: {
        validators: [required],
      },
      columnOptions: {
        isHardHidden: true,
      },
    },
    {
      key: "fieldName",
      label: "Field",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      options: (data.fields as Field[]).map((f: Field) => ({
        label: f.name,
        value: f.name,
      })),
      controlOptions: {
        hidden: true,
      },
      columnOptions: {
        filterType: CONTROL_TYPES.MULTISELECT,
      },
    },
    {
      key: "op",
      label: "Operator",
      controlType: CONTROL_TYPES.SELECT,
      options: OP_OPTIONS,
      controlOptions: {
        validators: [required],
      },
      columnOptions: {
        filterType: CONTROL_TYPES.SELECT,
      },
    },
    {
      key: "value",
      label: "Value",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      controlOptions: {
        validators: [required, minlength(1), maxlength(255)],
      },
    },
    {
      key: "color",
      label: "Color",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      columnOptions: {
        customCellRenderer: buildColorCellRenderer(sanitizer),
      },
    },
    ...ARCHIVED_CONFIG,
    ...AUDIT_CONFIG,
  ];
};
