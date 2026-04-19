import { ArchiveInfo } from "@dwtechs/crud-builder";

export interface Method extends ArchiveInfo {
  id: number | null;
  name: string;
  color: string | null;
}

export const methodFactory = (): Method => ({
  id: null,
  name: "",
  color: null,
  creatorId: null,
  creatorName: null,
  createdAt: null,
  updaterId: null,
  updaterName: null,
  updatedAt: null,
  archivedAt: null,
  archived: false,
});
