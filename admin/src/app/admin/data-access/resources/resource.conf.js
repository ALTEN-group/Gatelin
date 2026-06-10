import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { buildAuditConfig } from "@core/utils/field-config/audit.config";
import { CORE_CONFIG } from "@core/utils/field-config/core.config";
import { buildIdNameAction } from "@core/utils/field-config/on-select-action.config";
import { toSelectItems } from "@core/utils/primeng/to-select-items";
import { CONTROL_TYPES, ID_CONFIG, INPUT_TYPES, maxlength, minlength, required, } from "@dwtechs/crud-builder";
export const RESOURCE_COLUMNS = ({ data }) => [
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
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
            validators: [required, minlength(2), maxlength(20)],
        },
    },
    CORE_CONFIG,
    ...buildArchivedConfig(),
    ...buildAuditConfig(),
];
//# sourceMappingURL=resource.conf.js.map