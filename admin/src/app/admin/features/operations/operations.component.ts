import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { TableComponent } from "@dwtechs/crud-builder";
import { OperationsService } from "app/admin/data-access/operations/operations.service";

@Component({
  selector: "adm-operations",
  templateUrl: "./operations.component.html",
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationsComponent {
  private readonly operationsService = inject(OperationsService);

  public readonly config = this.operationsService.config;

  public readonly entityFactory = this.operationsService.entityFactory;

  public readonly httpCalls = this.operationsService.httpCalls;

  public readonly tableInformation = TABLES.operations;
}
