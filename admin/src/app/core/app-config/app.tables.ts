import { ArchiveInfo, FilterLevel } from "@dwtechs/crud-builder";

const tableKeys = [
  "routes",
  "consumers",
  "services",
  "resources",
  "cors",
  "operations",
  "methods",
  "fields",
  "scopes",
  "roles",
  "colors",
  "permissions",
  "applications",
] as const; // Extend as needed

type AppTable = (typeof tableKeys)[number];

type TableInfo = {
  label: string;
  title: string;
  key: AppTable;
  functionalityKey: string;
  editionDialogSize: "xs" | "s" | "m" | "l";
  customRowStyles: (row: ArchiveInfo) => { [key: string]: string };
  filterLevel: FilterLevel;
};

const defaultRowStyles = (row: ArchiveInfo) => {
  return {
    opacity: row.archived ? "0.2" : (row as any).locked ? "0.5" : "1",
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
    filterLevel: "advanced",
  },
  consumers: {
    label: $localize`:@@TableLabels_Consumer:Consumer`,
    title: $localize`:@@TableLabels_Consumers:Consumers`,
    key: "consumers",
    functionalityKey: "consumers",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
    filterLevel: "advanced",
  },
  services: {
    label: $localize`:@@TableLabels_Service:Service`,
    title: $localize`:@@TableLabels_Services:Services`,
    key: "services",
    functionalityKey: "services",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
    filterLevel: "advanced",
  },
  resources: {
    label: $localize`:@@TableLabels_Resource:Resource`,
    title: $localize`:@@TableLabels_Resources:Resources`,
    key: "resources",
    functionalityKey: "resources",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
    filterLevel: "advanced",
  },
  cors: {
    label: $localize`:@@TableLabels_Cors:CORS`,
    title: $localize`:@@TableLabels_CorsPlural:CORS`,
    key: "cors",
    functionalityKey: "cors",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
    filterLevel: "advanced",
  },
  operations: {
    label: $localize`:@@TableLabels_Operation:Opération`,
    title: $localize`:@@TableLabels_Operations:Opérations`,
    key: "operations",
    functionalityKey: "operations",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
    filterLevel: "advanced",
  },
  methods: {
    label: $localize`:@@TableLabels_Method:Method`,
    title: $localize`:@@TableLabels_Methods:Methods`,
    key: "methods",
    functionalityKey: "methods",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
    filterLevel: "advanced",
  },
  fields: {
    label: $localize`:@@TableLabels_Field:Field`,
    title: $localize`:@@TableLabels_Fields:Fields`,
    key: "fields",
    functionalityKey: "fields",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
    filterLevel: "advanced",
  },
  scopes: {
    label: $localize`:@@TableLabels_Scope:Scope`,
    title: $localize`:@@TableLabels_Scopes:Scopes`,
    key: "scopes",
    functionalityKey: "scopes",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
    filterLevel: "advanced",
  },
  roles: {
    label: $localize`:@@TableLabels_Role:Role`,
    title: $localize`:@@TableLabels_Roles:Roles`,
    key: "roles",
    functionalityKey: "roles",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
    filterLevel: "advanced",
  },
  colors: {
    label: $localize`:@@TableLabels_Color:Color`,
    title: $localize`:@@TableLabels_Colors:Colors`,
    key: "colors",
    functionalityKey: "colors",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
    filterLevel: "advanced",
  },
  permissions: {
    label: $localize`:@@TableLabels_Permission:Permission`,
    title: $localize`:@@TableLabels_Permissions:Permissions`,
    key: "permissions",
    functionalityKey: "permissions",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
    filterLevel: "advanced",
  },
  applications: {
    label: $localize`:@@TableLabels_Application:Application`,
    title: $localize`:@@TableLabels_Applications:Applications`,
    key: "applications",
    functionalityKey: "applications",
    editionDialogSize: "s",
    customRowStyles: defaultRowStyles,
    filterLevel: "advanced",
  },
} as const;
