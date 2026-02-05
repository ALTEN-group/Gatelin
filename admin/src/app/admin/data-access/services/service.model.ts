import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

export interface Service extends ArchiveInfo {
	id: number | null;
	name: string;
}

export const serviceFactory = (): Service => ({
	id: null,
	name: "",
	creatorId: null,
	creatorName: null,
	createdAt: null,
	updaterId: null,
	updaterName: null,
	updatedAt: null,
	archivedAt: null,
	archived: false,
});
