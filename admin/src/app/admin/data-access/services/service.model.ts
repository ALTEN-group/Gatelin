import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

export interface Service extends ArchiveInfo {
	id: number | null;
	name: string;
}

export const serviceFactory = (): Service => ({
	id: null,
	name: "",
	...new ArchiveInfo(),
});
