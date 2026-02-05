import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

export interface Api extends ArchiveInfo {
	id: number | null;
	serviceId: number;
	name: string;
}

export const apiFactory = (): Api => ({
	id: null,
	serviceId: 0,
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
