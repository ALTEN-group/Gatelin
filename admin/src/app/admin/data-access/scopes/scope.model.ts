import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

export interface Scope extends ArchiveInfo {
  id: number | null;
  routeId: number | null;
  routeName: string;
  name: string;
}

export const scopeFactory = (): Scope => ({
  id: null,
  routeId: null,
  routeName: "",
  name: "",
  ...new ArchiveInfo(),
});
