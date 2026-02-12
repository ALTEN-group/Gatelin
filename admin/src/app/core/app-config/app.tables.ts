import { FilterLevel } from "@crud/core/utils/table/filter-level.model";

const tableKeys = [
	"routes",
	"consumers",
	"services",
	"resources",
	"cors",
	"operations",
] as const; // Extend as needed

type AppTable = (typeof tableKeys)[number];

type TableInfo = {
	label: string;
	title: string;
	key: AppTable;
	functionalityKey: string;
	selectable: boolean;
	isExcelExportEnabled: boolean;
	lazy: boolean;
	clickableRows: boolean;
	protectDeletion: boolean;
	canAccessItemFromUrl: boolean;
	filterLevel: FilterLevel;
};

export const TABLES: Record<AppTable, TableInfo> = {
	routes: {
		label: $localize`:@@TableLabels_Route:Route`,
		title: $localize`:@@TableLabels_Routes:Routes`,
		key: "routes",
		functionalityKey: "routes",
		selectable: true,
		isExcelExportEnabled: true,
		lazy: true,
		clickableRows: false,
		protectDeletion: false,
		canAccessItemFromUrl: false,
		filterLevel: "advanced",
	},
	consumers: {
		label: $localize`:@@TableLabels_Consumer:Consumer`,
		title: $localize`:@@TableLabels_Consumers:Consumers`,
		key: "consumers",
		functionalityKey: "consumers",
		selectable: true,
		isExcelExportEnabled: true,
		lazy: true,
		clickableRows: false,
		protectDeletion: false,
		canAccessItemFromUrl: false,
		filterLevel: "advanced",
	},
	services: {
		label: $localize`:@@TableLabels_Service:Service`,
		title: $localize`:@@TableLabels_Services:Services`,
		key: "services",
		functionalityKey: "services",
		selectable: true,
		isExcelExportEnabled: true,
		lazy: true,
		clickableRows: false,
		protectDeletion: false,
		canAccessItemFromUrl: false,
		filterLevel: "advanced",
	},
	resources: {
		label: $localize`:@@TableLabels_Resource:Resource`,
		title: $localize`:@@TableLabels_Resources:Resources`,
		key: "resources",
		functionalityKey: "resources",
		selectable: true,
		isExcelExportEnabled: true,
		lazy: true,
		clickableRows: false,
		protectDeletion: false,
		canAccessItemFromUrl: false,
		filterLevel: "advanced",
	},
	cors: {
		label: $localize`:@@TableLabels_Cors:CORS`,
		title: $localize`:@@TableLabels_CorsPlural:CORS`,
		key: "cors",
		functionalityKey: "cors",
		selectable: true,
		isExcelExportEnabled: true,
		lazy: true,
		clickableRows: false,
		protectDeletion: false,
		canAccessItemFromUrl: false,
		filterLevel: "advanced",
	},
	operations: {
		label: $localize`:@@TableLabels_Operation:Opération`,
		title: $localize`:@@TableLabels_Operations:Opérations`,
		key: "operations",
		functionalityKey: "operations",
		selectable: true,
		isExcelExportEnabled: true,
		lazy: false,
		clickableRows: false,
		protectDeletion: false,
		canAccessItemFromUrl: false,
		filterLevel: "advanced",
	},
} as const;
