import { ArchiveInfo } from "@dwtechs/crud-builder";

const tableKeys = [
  "routes",
  "consumers",
  "services",
  "resources",
  "cors",
  "operations",
  "fields",
  "scopes",
] as const; // Extend as needed

type AppTable = (typeof tableKeys)[number];

type TableInfo = {
  label: string;
  title: string;
  key: AppTable;
  functionalityKey: string;
  editionDialogSize: "xs" | "s" | "m" | "l";
  customRowStyles: (row: ArchiveInfo) => { [key: string]: string };
};

const defaultRowStyles = (row: ArchiveInfo) => {
  console.log(row, row.archived ? "archived-row" : "");
  return {
    opacity: row.archived ? "0.2" : "1",
  };
};

export const TABLES: Record<AppTable, TableInfo> = {
  routes: {
    label: $localize`:@@TableLabels_Route:Route`,
    title: $localize`:@@TableLabels_Routes:Routes`,
    key: "routes",
    functionalityKey: "routes",
    editionDialogSize: "m",
    customRowStyles: defaultRowStyles,
  },
  consumers: {
    label: $localize`:@@TableLabels_Consumer:Consumer`,
    title: $localize`:@@TableLabels_Consumers:Consumers`,
    key: "consumers",
    functionalityKey: "consumers",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
  },
  services: {
    label: $localize`:@@TableLabels_Service:Service`,
    title: $localize`:@@TableLabels_Services:Services`,
    key: "services",
    functionalityKey: "services",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
  },
  resources: {
    label: $localize`:@@TableLabels_Resource:Resource`,
    title: $localize`:@@TableLabels_Resources:Resources`,
    key: "resources",
    functionalityKey: "resources",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
  },
  cors: {
    label: $localize`:@@TableLabels_Cors:CORS`,
    title: $localize`:@@TableLabels_CorsPlural:CORS`,
    key: "cors",
    functionalityKey: "cors",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
  },
  operations: {
    label: $localize`:@@TableLabels_Operation:Opération`,
    title: $localize`:@@TableLabels_Operations:Opérations`,
    key: "operations",
    functionalityKey: "operations",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
  },
  fields: {
    label: $localize`:@@TableLabels_Field:Field`,
    title: $localize`:@@TableLabels_Fields:Fields`,
    key: "fields",
    functionalityKey: "fields",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
  },
  scopes: {
    label: $localize`:@@TableLabels_Scope:Scope`,
    title: $localize`:@@TableLabels_Scopes:Scopes`,
    key: "scopes",
    functionalityKey: "scopes",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
  },
} as const;
