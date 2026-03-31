import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

export interface Scope extends ArchiveInfo {
	id: number | null;
	routeId: number | null;
	routeName: string;
	value: string;
	locked: boolean;
}

export const scopeFactory = (): Scope => ({
	id: null,
	routeId: null,
	routeName: "",
	value: "",
	locked: false,
	...new ArchiveInfo(),
});
