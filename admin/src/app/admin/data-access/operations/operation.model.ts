import { ArchiveInfo } from "@dwtechs/crud-builder";

export interface Operation extends ArchiveInfo {
  id: number | null;
  name: string;
  description: string;
  color: string | null;
}

export const operationFactory = (): Operation => ({
  id: null,
  name: "",
  description: "",
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
