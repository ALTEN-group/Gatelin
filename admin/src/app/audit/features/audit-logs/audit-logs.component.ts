import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { TableComponent } from "@dwtechs/ngx-crud-builder";
import { AuditLogsService } from "app/audit/data-access/audit-logs/audit-logs.service";

/**
 * Read-only audit log of every tracked change (who changed what, when)
 */
@Component({
  selector: "adm-audit-logs",
  templateUrl: "./audit-logs.component.html",
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogsComponent {
  private readonly auditLogsService = inject(AuditLogsService);

  public readonly config = this.auditLogsService.config;

  public readonly entityFactory = this.auditLogsService.entityFactory;

  public readonly httpCalls = this.auditLogsService.httpCalls;

  public readonly tableInformation = TABLES.audit;
}
