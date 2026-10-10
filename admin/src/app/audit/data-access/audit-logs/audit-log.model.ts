import { ArchiveInfo } from "@dwtechs/ngx-crud-builder";

/**
 * One audited write, as returned by POST /gatelin/audit/search
 * (log.audit view, see src/entities/audit.js and src/middlewares/mappers/audit-changes.js).
 * Extends ArchiveInfo only to satisfy the table's entity contract: the audit log has no such columns.
 */
export interface AuditLog extends ArchiveInfo {
  id: number | null;
  tstamp: Date | null;
  tableName: string;
  action: string;
  userId: number | null;
  userName: string;
  recordId: number | null;
  changes: string;
}

/** Read-only grid: the factory only satisfies the table's required input. */
export const auditLogFactory = (): AuditLog => ({
  id: null,
  tstamp: null,
  tableName: "",
  action: "",
  userId: null,
  userName: "",
  recordId: null,
  changes: "",
  ...new ArchiveInfo(),
});
