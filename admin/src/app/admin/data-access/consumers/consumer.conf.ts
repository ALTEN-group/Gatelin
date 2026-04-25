import { ActivatedRouteSnapshot } from "@angular/router";
import { Role } from "@core/roles/role.class";
import {
  CONTROL_TYPES,
  createArchivedConfig,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  minlength,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";
import { Consumer } from "app/admin/data-access/consumers/consumer.model";

const ROLE_STYLE_ID = "role-chip-styles";

function injectRoleStyles(roles: Role[]): void {
  let styleEl = document.getElementById(ROLE_STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = ROLE_STYLE_ID;
    document.head.appendChild(styleEl);
  }
  const chipRules = roles
    .filter((r) => r.color)
    .map(
      (r) =>
        `.role-color-${r.id}{background-color:${r.color}!important;color:#fff!important;display:block!important;margin-bottom:2px;}`,
    )
    .join("");
  // Allow the cell wrapper span to expand vertically
  const cellRule = `tbl-table-cell>span:has(.p-chip){white-space:normal!important;overflow:visible!important;}`;
  styleEl.textContent = chipRules + cellRule;
}

export const CONSUMER_COLUMNS: (
  payload: ActivatedRouteSnapshot,
) => StrictCrudItemOptions<Consumer>[] = ({ data }) => {
  const activeRoles = (data.roles as Role[]).filter((role) => !role.archived);
  injectRoleStyles(activeRoles);
  return [
    ID_CONFIG,
    {
      key: "userId",
      label: "User ID",
      controlType: CONTROL_TYPES.INPUT,
      columnOptions: {
        defaultWidth: "80px",
      },
      type: INPUT_TYPES.TEXT,
      controlOptions: {
        validators: [required, minlength(3), maxlength(30)],
      },
    },
    {
      key: "nickname",
      label: "Nom",
      controlType: CONTROL_TYPES.INPUT,
      columnOptions: {
        defaultWidth: "100px",
      },
      type: INPUT_TYPES.TEXT,
      controlOptions: {
        validators: [required, minlength(3), maxlength(30)],
      },
    },
    {
      key: "accessToken",
      label: "Access Token",
      controlType: CONTROL_TYPES.TEXTAREA,
      columnOptions: {
        defaultWidth: "100px",
      },
      controlOptions: {
        validators: [required, minlength(28), maxlength(8000)],
      },
    },
    {
      key: "refreshToken",
      label: "Refresh Token",
      controlType: CONTROL_TYPES.TEXTAREA,
      columnOptions: {
        defaultWidth: "100px",
      },
      controlOptions: {
        validators: [required, minlength(28), maxlength(8000)],
      },
    },
    {
      key: "roles",
      label: "Rôles",
      controlType: CONTROL_TYPES.MULTISELECT,
      options: activeRoles.map((r) => ({
        value: r.id,
        label: r.name,
        styleClass: `role-color-${r.id}`,
      })),
      columnOptions: {
        customCellRenderer: (cellValue: unknown) => {
          if (!Array.isArray(cellValue) || cellValue.length === 0) return "";
          return (cellValue as number[])
            .map((id) => {
              const role = activeRoles.find((r) => r.id === id);
              if (!role) return "";
              return `<span class="role-color-${role.id} p-chip" style="display:block;margin-bottom:2px;">${role.name}</span>`;
            })
            .join("");
        },
      },
      controlOptions: {
        validators: [required],
      },
    },
    ...createArchivedConfig({
      label: "Actif",
      labelAt: "Archivé le",
      archived: "Archivé",
      active: "Actif",
    }),
  ];
};
