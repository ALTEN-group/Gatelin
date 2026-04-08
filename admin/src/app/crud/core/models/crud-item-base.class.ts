import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";
import { IdInfo } from "@crud/core/utils/confs/id-config";

export class CrudItemBase implements IdInfo, ArchiveInfo {
  id: number | null = null;
  archived = false;
  archivedAt: Date | null = null;
  updatedAt: Date | null = null;
  updaterId: number | null = null;
  updaterName: string | null = null;
  createdAt: Date | null = null;
  creatorId: number | null = null;
  creatorName: string | null = null;
}
