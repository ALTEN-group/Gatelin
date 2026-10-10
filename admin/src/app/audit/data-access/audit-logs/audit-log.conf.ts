import {
  CONTROL_TYPES,
  INPUT_TYPES,
  StrictCrudItemOptions,
} from "@dwtechs/ngx-crud-builder";
import { AuditLog } from "app/audit/data-access/audit-logs/audit-log.model";

const DEFAULT_PERIOD_DAYS = 7;

// log.history.tableName values of the audited tables (db/liquibase/gatelin/versions/05-trig).
const AUDITED_TABLES = [
  { label: "Route", value: "route" },
  { label: "Route operation", value: "route_operation" },
  { label: "Route method", value: "route_method" },
  { label: "Service", value: "service" },
  { label: "Resource", value: "resource" },
  { label: "Operation", value: "operation" },
  { label: "Method", value: "method" },
  { label: "CORS", value: "cors" },
  { label: "Field", value: "field" },
  { label: "Scope", value: "scope" },
  { label: "Role", value: "role" },
  { label: "Permission", value: "permission" },
  { label: "Permission condition", value: "permission_condition" },
  { label: "Application", value: "application" },
  { label: "Condition", value: "condition" },
];

const ACTIONS = ["INSERT", "UPDATE", "ARCHIVE", "RESTORE", "DELETE"].map(
  (value) => ({ label: value, value }),
);

const startOfPeriod = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - DEFAULT_PERIOD_DAYS);
  return d;
};

const readonlyControl = { disabled: true };

export const AUDIT_LOG_COLUMNS: () => StrictCrudItemOptions<AuditLog>[] =
  () => [
    {
      key: "id",
      label: "ID",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      columnOptions: { isHardHidden: true },
      controlOptions: { hidden: true, disabled: true },
    },
    {
      key: "tstamp",
      label: "Date",
      controlType: CONTROL_TYPES.DATE,
      columnOptions: {
        defaultWidth: "170px",
        dateFormat: "yyyy-MM-dd HH:mm:ss",
        defaultSortField: true,
        defaultSortOrder: -1,
        defaultFilter: { value: startOfPeriod(), matchMode: "dateAfter" },
      },
      controlOptions: {
        ...readonlyControl,
        dateShowTime: true,
        dateShowSeconds: true,
      },
    },
    {
      key: "userName",
      label: "User",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      columnOptions: { defaultWidth: "140px" },
      controlOptions: readonlyControl,
    },
    {
      key: "userId",
      label: "User ID",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.NUMBER,
      columnOptions: { defaultWidth: "90px", isSoftHidden: true },
      controlOptions: readonlyControl,
    },
    {
      key: "action",
      label: "Action",
      controlType: CONTROL_TYPES.SELECT,
      options: ACTIONS,
      columnOptions: { defaultWidth: "110px" },
      controlOptions: readonlyControl,
    },
    {
      key: "tableName",
      label: "Entity",
      controlType: CONTROL_TYPES.SELECT,
      options: AUDITED_TABLES,
      columnOptions: { defaultWidth: "170px" },
      controlOptions: readonlyControl,
    },
    {
      key: "recordId",
      label: "Record ID",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.NUMBER,
      columnOptions: { defaultWidth: "100px" },
      controlOptions: readonlyControl,
    },
    {
      key: "changes",
      label: "Changes",
      controlType: CONTROL_TYPES.TEXTAREA,
      columnOptions: {
        defaultWidth: "420px",
        filterable: false,
        sortable: false,
      },
      controlOptions: readonlyControl,
    },
  ];
