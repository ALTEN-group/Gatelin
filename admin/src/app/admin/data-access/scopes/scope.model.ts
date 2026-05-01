import { ArchiveInfo } from "@dwtechs/crud-builder";

export interface Scope extends ArchiveInfo {
  id: number | null;
  routeId: number | null;
  routeName: string;
  resourceName: string;
  name: string;
  core: boolean;
}

export const scopeFactory = (): Scope => ({
  id: null,
  routeId: null,
  routeName: "",
  resourceName: "",
  name: "",
  core: false,
  ...new ArchiveInfo(),
});
