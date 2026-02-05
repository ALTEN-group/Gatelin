import { FilterLevel } from "@crud/core/utils/table/filter-level.model";

const tableKeys = ["routes", "consumers", "services", "apis"] as const; // Extend as needed

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
		lazy: false,
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
		lazy: false,
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
		lazy: false,
		clickableRows: false,
		protectDeletion: false,
		canAccessItemFromUrl: false,
		filterLevel: "advanced",
	},
	apis: {
		label: $localize`:@@TableLabels_Api:API`,
		title: $localize`:@@TableLabels_Apis:APIs`,
		key: "apis",
		functionalityKey: "apis",
		selectable: true,
		isExcelExportEnabled: true,
		lazy: false,
		clickableRows: false,
		protectDeletion: false,
		canAccessItemFromUrl: false,
		filterLevel: "advanced",
	},
} as const;
