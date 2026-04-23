import { ArchiveInfo } from "@dwtechs/crud-builder";

export interface Field extends ArchiveInfo {
  id: number | null;
  resourceId: number | null;
  resourceName: string;
  serviceName: string;
  name: string;
  locked: boolean;
}

export const fieldFactory = (): Field => ({
  id: null,
  resourceId: null,
  resourceName: "",
  serviceName: "",
  name: "",
  locked: false,
  ...new ArchiveInfo(),
});
