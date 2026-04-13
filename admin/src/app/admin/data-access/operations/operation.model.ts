import { ArchiveInfo } from "@altengroup/crud-builder";

export interface Operation extends ArchiveInfo {
  id: number | null;
  name: string;
  description: string;
}

export const operationFactory = (): Operation => ({
  id: null,
  name: "",
  description: "",
  creatorId: null,
  creatorName: null,
  createdAt: null,
  updaterId: null,
  updaterName: null,
  updatedAt: null,
  archivedAt: null,
  archived: false,
});
