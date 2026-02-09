import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

export interface Api extends ArchiveInfo {
	id: number | null;
	serviceName: string;
	name: string;
	protected: boolean;
}

export const apiFactory = (): Api => ({
	id: null,
	serviceName: "",
	name: "",
	protected: false,
	...new ArchiveInfo(),
});
