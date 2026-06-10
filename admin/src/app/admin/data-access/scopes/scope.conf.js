import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { buildAuditConfig } from "@core/utils/field-config/audit.config";
import { CORE_CONFIG } from "@core/utils/field-config/core.config";
import { buildIdNameAction } from "@core/utils/field-config/on-select-action.config";
import { toSelectItems } from "@core/utils/primeng/to-select-items";
import { CONTROL_TYPES, ID_CONFIG, INPUT_TYPES, maxlength, minlength, required, } from "@dwtechs/crud-builder";
export const SCOPE_COLUMNS = ({ data }) => [
    ID_CONFIG,
    CORE_CONFIG,
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
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
            validators: [required, minlength(1), maxlength(50)],
        },
    },
    ...buildArchivedConfig(),
    ...buildAuditConfig(),
];
//# sourceMappingURL=scope.conf.js.map