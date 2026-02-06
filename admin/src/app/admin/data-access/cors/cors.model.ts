import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

export interface Cors extends ArchiveInfo {
	id: number | null;
	name: string;
}

export const corsFactory = (): Cors => ({
	id: null,
	name: "",
	...new ArchiveInfo(),
});
