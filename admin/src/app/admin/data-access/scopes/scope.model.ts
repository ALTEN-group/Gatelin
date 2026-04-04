import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

export interface Scope extends ArchiveInfo {
  id: number | null;
  routeId: number | null;
  name: string;
}

export const scopeFactory = (): Scope => ({
  id: null,
  routeId: null,
  name: "",
  ...new ArchiveInfo(),
});
