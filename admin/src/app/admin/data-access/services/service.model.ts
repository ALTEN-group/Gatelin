import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

export interface Service extends ArchiveInfo {
  id: number | null;
  name: string;
  locked: boolean;
}

export const serviceFactory = (): Service => ({
  id: null,
  name: "",
  locked: false,
  ...new ArchiveInfo(),
});
