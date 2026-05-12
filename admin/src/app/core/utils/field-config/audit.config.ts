import { inject } from "@angular/core";
import {
  ArchiveInfo,
  createAuditConfig,
  CRUD_LABELS,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";

export function buildAuditConfig(): StrictCrudItemOptions<ArchiveInfo>[] {
  const labels = inject(CRUD_LABELS);
  return createAuditConfig(labels.auditConfig);
}
