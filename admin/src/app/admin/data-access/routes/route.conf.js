import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { buildAuditConfig } from "@core/utils/field-config/audit.config";
import { CORE_CONFIG } from "@core/utils/field-config/core.config";
import { buildIdNameAction, buildIdsNamesAction, } from "@core/utils/field-config/on-select-action.config";
import { PROTECTED_CONFIG } from "@core/utils/field-config/protected.config";
import { toNamesSelectOptions, toSelectItems, } from "@core/utils/primeng/to-select-items";
import { buildColoredChipsCellRenderer } from "@core/utils/renderers/colored-chips.renderer";
import { CONTROL_TYPES, ID_CONFIG, INPUT_TYPES, maxlength, minlength, required, } from "@dwtechs/crud-builder";
export const ROUTE_COLUMNS = ({ data }, sanitizer) => {
    return [
        ID_CONFIG,
        {
            key: "serviceId",
            label: "Service",
            controlType: CONTROL_TYPES.SELECT,
            options: toSelectItems(data.services, "name"),
            controlOptions: {
                validators: [required],
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
            options: toNamesSelectOptions(data.services),
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
                validators: [required],
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
            options: toNamesSelectOptions(data.resources),
            controlOptions: {
                hidden: true,
            },
            columnOptions: {
                filterType: CONTROL_TYPES.MULTISELECT,
            },
        },
        {
            key: "pattern",
            label: "Pattern",
            controlType: CONTROL_TYPES.INPUT,
            type: INPUT_TYPES.TEXT,
            controlOptions: {
                validators: [minlength(1), maxlength(40)],
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
            controlType: CONTROL_TYPES.MULTISELECT,
            options: toNamesSelectOptions(data.operations),
            controlOptions: {
                hidden: true,
            },
            columnOptions: {
                customCellRenderer: buildColoredChipsCellRenderer(sanitizer, (name) => {
                    const op = data.operations.find((o) => o.name === name);
                    return op ? { label: op.name, color: op.color } : undefined;
                }),
                tooltip: (value) => value.join(", "),
            },
        },
        {
            key: "name",
            label: "Name",
            controlType: CONTROL_TYPES.INPUT,
            type: INPUT_TYPES.TEXT,
            controlOptions: {
                validators: [required, maxlength(50)],
            },
        },
        {
            key: "description",
            label: "Description",
            controlType: CONTROL_TYPES.INPUT,
            type: INPUT_TYPES.TEXT,
            controlOptions: {
                validators: [required, maxlength(100)],
            },
        },
        {
            key: "methodIds",
            label: "Methods",
            controlType: CONTROL_TYPES.MULTISELECT,
            options: toSelectItems(data.methods, "name"),
            controlOptions: {
                validators: [required],
                action: buildIdsNamesAction("methodNames", data.methods, "name"),
            },
            columnOptions: {
                isHardHidden: true,
            },
        },
        {
            key: "methodNames",
            label: "Methods",
            controlType: CONTROL_TYPES.SELECT,
            options: toNamesSelectOptions(data.methods),
            controlOptions: {
                hidden: true,
            },
            columnOptions: {
                filterType: CONTROL_TYPES.MULTISELECT,
                customCellRenderer: buildColoredChipsCellRenderer(sanitizer, (name) => {
                    const method = data.methods.find((m) => m.name === name);
                    return method
                        ? { label: method.name, color: method.color }
                        : undefined;
                }),
                tooltip: (value) => value.join(", "),
            },
        },
        PROTECTED_CONFIG,
        CORE_CONFIG,
        ...buildArchivedConfig(),
        ...buildAuditConfig(),
    ];
};
//# sourceMappingURL=route.conf.js.map