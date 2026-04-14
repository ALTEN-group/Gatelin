import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

export interface Color extends ArchiveInfo {
  id: number | null;
  name: string;
  code: string;
}

export const colorFactory = (): Color => ({
  id: null,
  name: "",
  code: "",
  ...new ArchiveInfo(),
});
