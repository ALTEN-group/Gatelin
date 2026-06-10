import { inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { buildAuditConfig } from "@core/utils/field-config/audit.config";
import { buildIdNameAction } from "@core/utils/field-config/on-select-action.config";
import { buildColorCellRenderer } from "@core/utils/renderers/color.renderer";
import { CONTROL_TYPES, ID_CONFIG, INPUT_TYPES, maxlength, minlength, required, } from "@dwtechs/crud-builder";
const OP_OPTIONS = [
    { label: "=", value: "=" },
    { label: "!=", value: "!=" },
    { label: "<", value: "<" },
    { label: ">", value: ">" },
    { label: "<=", value: "<=" },
    { label: ">=", value: ">=" },
];
export const CONDITION_COLUMNS = ({ data }) => {
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
            options: data.fields
                .map((f) => ({
                label: `${f.resourceName}.${f.name}`,
                value: f.id,
            }))
                .toSorted((a, b) => a.label?.localeCompare(b.label ?? "") ?? 0),
            controlOptions: {
                validators: [required],
                action: buildIdNameAction("fieldName", data.fields, "name"),
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
            options: data.fields
                .map((f) => ({
                label: `${f.resourceName}.${f.name}`,
                value: f.name,
            }))
                .toSorted((a, b) => a.label?.localeCompare(b.label ?? "") ?? 0),
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
        ...buildArchivedConfig(),
        ...buildAuditConfig(),
    ];
};
//# sourceMappingURL=condition.conf.js.map