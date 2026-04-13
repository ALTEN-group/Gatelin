import { ArchiveInfo } from "@altengroup/crud-builder";

export interface Field extends ArchiveInfo {
  id: number | null;
  resourceId: number | null;
  resourceName: string;
  name: string;
  locked: boolean;
}

export const fieldFactory = (): Field => ({
  id: null,
  resourceId: null,
  resourceName: "",
  name: "",
  locked: false,
  ...new ArchiveInfo(),
});
