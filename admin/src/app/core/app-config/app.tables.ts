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
};

export const TABLES: Record<AppTable, TableInfo> = {
  routes: {
    label: $localize`:@@TableLabels_Route:Route`,
    title: $localize`:@@TableLabels_Routes:Routes`,
    key: "routes",
    functionalityKey: "routes",
  },
  consumers: {
    label: $localize`:@@TableLabels_Consumer:Consumer`,
    title: $localize`:@@TableLabels_Consumers:Consumers`,
    key: "consumers",
    functionalityKey: "consumers",
  },
  services: {
    label: $localize`:@@TableLabels_Service:Service`,
    title: $localize`:@@TableLabels_Services:Services`,
    key: "services",
    functionalityKey: "services",
  },
  resources: {
    label: $localize`:@@TableLabels_Resource:Resource`,
    title: $localize`:@@TableLabels_Resources:Resources`,
    key: "resources",
    functionalityKey: "resources",
  },
  cors: {
    label: $localize`:@@TableLabels_Cors:CORS`,
    title: $localize`:@@TableLabels_CorsPlural:CORS`,
    key: "cors",
    functionalityKey: "cors",
  },
  operations: {
    label: $localize`:@@TableLabels_Operation:Opération`,
    title: $localize`:@@TableLabels_Operations:Opérations`,
    key: "operations",
    functionalityKey: "operations",
  },
  fields: {
    label: $localize`:@@TableLabels_Field:Champ`,
    title: $localize`:@@TableLabels_Fields:Champs`,
    key: "fields",
    functionalityKey: "fields",
  },
  scopes: {
    label: $localize`:@@TableLabels_Scope:Scope`,
    title: $localize`:@@TableLabels_Scopes:Scopes`,
    key: "scopes",
    functionalityKey: "scopes",
  },
} as const;
