import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { buildAuditConfig } from "@core/utils/field-config/audit.config";
import { CONTROL_TYPES, ID_CONFIG, INPUT_TYPES, maxlength, minlength, required, } from "@dwtechs/crud-builder";
export const CORS_COLUMNS = () => [
    ID_CONFIG,
    {
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
            validators: [required, minlength(1), maxlength(50)],
            minWidth: "100%",
        },
    },
    {
        key: "description",
        label: "Description",
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
            validators: [maxlength(100)],
        },
    },
    {
        key: "credentials",
        label: "Credentials",
        controlType: CONTROL_TYPES.CHECKBOX,
        controlOptions: {},
    },
    ...buildArchivedConfig(),
    ...buildAuditConfig(),
];
//# sourceMappingURL=cors.conf.js.map