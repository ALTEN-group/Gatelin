import { computed, Injectable } from "@angular/core";
import { AdminEntity } from "@core/app-config/app.entities";
import { Calls, CrudRepository } from "@dwtechs/ngx-crud-builder";
import { AUDIT_LOG_COLUMNS } from "app/audit/data-access/audit-logs/audit-log.conf";
import {
  AuditLog,
  auditLogFactory,
} from "app/audit/data-access/audit-logs/audit-log.model";

const auditEndpoint: AdminEntity = "audit";

/**
 * Read-only service for the audit log: search only, no create/update/archive/history calls.
 */
@Injectable({
  providedIn: "root",
})
export class AuditLogsService {
  private readonly crud = new CrudRepository<AuditLog>().with({
    endpoint: auditEndpoint,
  });

  public readonly httpCalls: Calls<AuditLog> = {
    get: this.crud.get,
  };

  public readonly config = computed(() => AUDIT_LOG_COLUMNS());
  public readonly entityFactory = auditLogFactory;
}
