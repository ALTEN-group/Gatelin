import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { buildAuditConfig } from "@core/utils/field-config/audit.config";
import { buildIdNameAction } from "@core/utils/field-config/on-select-action.config";
import { toNamesSelectOptions, toSelectItems, } from "@core/utils/primeng/to-select-items";
import { buildActiveCellRenderer } from "@core/utils/renderers/active.renderer";
import { buildColorCellRenderer } from "@core/utils/renderers/color.renderer";
import { CONTROL_TYPES, ID_CONFIG, INPUT_TYPES, maxlength, minlength, required, } from "@dwtechs/crud-builder";
export const buildRoleColumns = (sanitizer, { data }) => [
    ID_CONFIG,
    {
        key: "appId",
        label: $localize `:@@Roles_Application:Application`,
        controlType: CONTROL_TYPES.SELECT,
        options: toSelectItems(data.applications, "name"),
        controlOptions: {
            validators: [required],
            action: buildIdNameAction("appName", data.applications, "name"),
        },
        columnOptions: {
            isHardHidden: true,
        },
    },
    {
        key: "appName",
        label: $localize `:@@Roles_Application:Application`,
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        options: toNamesSelectOptions(data.applications),
        controlOptions: {
            hidden: true,
        },
        columnOptions: {
            filterType: CONTROL_TYPES.MULTISELECT,
        },
    },
    {
        key: "name",
        label: $localize `:@@Roles_Name:Name`,
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
            validators: [required, minlength(1), maxlength(50)],
        },
    },
    {
        key: "description",
        label: $localize `:@@Roles_Description:Description`,
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
            validators: [maxlength(100)],
        },
    },
    {
        key: "color",
        label: $localize `:@@Roles_Color:Couleur`,
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        columnOptions: {
            customCellRenderer: buildColorCellRenderer(sanitizer),
        },
    },
    {
        key: "active",
        label: $localize `:@@Roles_Active:Active`,
        controlType: CONTROL_TYPES.CHECKBOX,
        columnOptions: {
            customCellRenderer: buildActiveCellRenderer(),
        },
    },
    ...buildArchivedConfig(),
    ...buildAuditConfig(),
];
//# sourceMappingURL=role.conf.js.map