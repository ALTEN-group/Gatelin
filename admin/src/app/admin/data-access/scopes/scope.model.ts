import { ArchiveInfo } from "@altengroup/crud-builder";

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
