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
  editionDialogSize: "xs" | "s" | "m" | "l"; // Optional size configuration for edition dialog
};

export const TABLES: Record<AppTable, TableInfo> = {
  routes: {
    label: $localize`:@@TableLabels_Route:Route`,
    title: $localize`:@@TableLabels_Routes:Routes`,
    key: "routes",
    functionalityKey: "routes",
    editionDialogSize: "m",
  },
  consumers: {
    label: $localize`:@@TableLabels_Consumer:Consumer`,
    title: $localize`:@@TableLabels_Consumers:Consumers`,
    key: "consumers",
    functionalityKey: "consumers",
    editionDialogSize: "s",
  },
  services: {
    label: $localize`:@@TableLabels_Service:Service`,
    title: $localize`:@@TableLabels_Services:Services`,
    key: "services",
    functionalityKey: "services",
    editionDialogSize: "s",
  },
  resources: {
    label: $localize`:@@TableLabels_Resource:Resource`,
    title: $localize`:@@TableLabels_Resources:Resources`,
    key: "resources",
    functionalityKey: "resources",
    editionDialogSize: "s",
  },
  cors: {
    label: $localize`:@@TableLabels_Cors:CORS`,
    title: $localize`:@@TableLabels_CorsPlural:CORS`,
    key: "cors",
    functionalityKey: "cors",
    editionDialogSize: "s",
  },
  operations: {
    label: $localize`:@@TableLabels_Operation:Opération`,
    title: $localize`:@@TableLabels_Operations:Opérations`,
    key: "operations",
    functionalityKey: "operations",
    editionDialogSize: "s",
  },
  fields: {
    label: $localize`:@@TableLabels_Field:Field`,
    title: $localize`:@@TableLabels_Fields:Fields`,
    key: "fields",
    functionalityKey: "fields",
    editionDialogSize: "s",
  },
  scopes: {
    label: $localize`:@@TableLabels_Scope:Scope`,
    title: $localize`:@@TableLabels_Scopes:Scopes`,
    key: "scopes",
    functionalityKey: "scopes",
    editionDialogSize: "s",
  },
} as const;
