import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

export interface Resource extends ArchiveInfo {
	id: number | null;
	serviceId: number | null;
	serviceName: string;
	name: string;
	protected: boolean;
}

export const resourceFactory = (): Resource => ({
	id: null,
	serviceId: null,
	serviceName: "",
	name: "",
	protected: false,
	...new ArchiveInfo(),
});
