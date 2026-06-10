import { inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { buildIdNameAction, buildIdsNamesAction, } from "@core/utils/field-config/on-select-action.config";
import { toSelectItems } from "@core/utils/primeng/to-select-items";
import { buildColoredChipsCellRenderer } from "@core/utils/renderers/colored-chips.renderer";
import { CONTROL_TYPES, ID_CONFIG, INPUT_TYPES, required, } from "@dwtechs/crud-builder";
export const PERMISSION_COLUMNS = ({ data }) => {
    const sanitizer = inject(DomSanitizer);
    const operationLookup = (name) => {
        const op = data.operations.find((o) => o.name === name);
        return op ? { label: op.name, color: op.color } : undefined;
    };
    const conditionLookup = (name) => {
        const cond = data.conditions.find((c) => c.name === String(name));
        return cond ? { label: cond.name, color: cond.color } : undefined;
    };
    return [
        ID_CONFIG,
        {
            key: "serviceId",
            label: "Service",
            controlType: CONTROL_TYPES.SELECT,
            options: toSelectItems(data.services, "name"),
            controlOptions: {
                action: buildIdNameAction("serviceName", data.services, "name"),
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
            options: data.services.map((s) => ({
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
            options: toSelectItems(data.resources, "name"),
            controlOptions: {
                action: buildIdNameAction("resourceName", data.resources, "name"),
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
            options: data.resources.map((r) => ({
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
            key: "routeId",
            label: "Route",
            controlType: CONTROL_TYPES.SELECT,
            options: toSelectItems(data.routes, "name"),
            controlOptions: {
                validators: [required],
                action: buildIdNameAction("routeName", data.routes, "name"),
            },
            columnOptions: {
                isHardHidden: true,
            },
        },
        {
            key: "routeName",
            label: "Route",
            controlType: CONTROL_TYPES.INPUT,
            type: INPUT_TYPES.TEXT,
            options: data.routes.map((r) => ({
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
            label: "Operations",
            controlType: CONTROL_TYPES.MULTISELECT,
            options: toSelectItems(data.operations, "name"),
            controlOptions: {
                validators: [required],
                action: buildIdsNamesAction("operationName", data.operations, "name"),
            },
            columnOptions: {
                isHardHidden: true,
            },
        },
        {
            key: "operationName",
            label: "Operations",
            controlType: CONTROL_TYPES.INPUT,
            type: INPUT_TYPES.TEXT,
            options: data.operations.map((o) => ({
                label: o.name,
                value: o.name,
            })),
            controlOptions: {
                hidden: true,
            },
            columnOptions: {
                filterType: CONTROL_TYPES.MULTISELECT,
                customCellRenderer: buildColoredChipsCellRenderer(sanitizer, operationLookup),
            },
        },
        {
            key: "fields",
            label: "Fields",
            controlType: CONTROL_TYPES.TEXTAREA,
            controlOptions: {
                hidden: true,
            },
            columnOptions: {
                valueAsChip: true,
                defaultWidth: "200px",
            },
        },
        {
            key: "scopes",
            label: "Scopes",
            controlType: CONTROL_TYPES.TEXTAREA,
            controlOptions: {
                hidden: true,
            },
            columnOptions: {
                valueAsChip: true,
                defaultWidth: "200px",
            },
        },
        {
            key: "conditionId",
            label: "Conditions",
            controlType: CONTROL_TYPES.MULTISELECT,
            options: toSelectItems(data.conditions, "name"),
            controlOptions: {
                action: buildIdsNamesAction("conditionName", data.conditions, "name"),
            },
        },
        {
            key: "conditionName",
            label: "Conditions",
            controlType: CONTROL_TYPES.INPUT,
            type: INPUT_TYPES.TEXT,
            options: data.conditions.map((c) => ({
                label: c.name,
                value: c.name,
            })),
            controlOptions: {
                hidden: true,
            },
            columnOptions: {
                filterType: CONTROL_TYPES.MULTISELECT,
                customCellRenderer: buildColoredChipsCellRenderer(sanitizer, conditionLookup),
                defaultWidth: "200px",
            },
        },
    ];
};
//# sourceMappingURL=permission.conf.js.map