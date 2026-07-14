import { ArchiveInfo } from "@dwtechs/ngx-crud-builder";

export interface Scope extends ArchiveInfo {
  id: number | null;
  routeId: number | null;
  routeName: string;
  resourceId: number | null;
  resourceName: string;
  name: string;
  core: boolean;
}

export const scopeFactory = (): Scope => ({
  id: null,
  routeId: null,
  routeName: "",
  resourceId: null,
  resourceName: "",
  name: "",
  core: false,
  ...new ArchiveInfo(),
});
