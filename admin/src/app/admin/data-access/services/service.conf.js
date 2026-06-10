import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { buildAuditConfig } from "@core/utils/field-config/audit.config";
import { CORE_CONFIG } from "@core/utils/field-config/core.config";
import { CONTROL_TYPES, ID_CONFIG, INPUT_TYPES, maxlength, minlength, required, } from "@dwtechs/crud-builder";
export const buildServiceColumns = (_route) => [
    ID_CONFIG,
    {
        key: "name",
        label: $localize `:@@Services_Name:Name`,
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
            validators: [required, minlength(1), maxlength(30)],
        },
    },
    {
        key: "pattern",
        label: $localize `:@@Services_Pattern:Pattern`,
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
            validators: [minlength(1), maxlength(20)],
        },
    },
    CORE_CONFIG,
    ...buildArchivedConfig(),
    ...buildAuditConfig(),
];
//# sourceMappingURL=service.conf.js.map