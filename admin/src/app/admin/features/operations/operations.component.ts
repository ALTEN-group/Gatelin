import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { disabledRowRenderer } from "@core/utils/renderers/disabled.renderer";
import { TableComponent } from "@dwtechs/crud-builder";
import { Operation } from "app/admin/data-access/operations/operation.model";
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

  public readonly rowStyles = (row: Operation) =>
    disabledRowRenderer(row, !!this.httpCalls.update);
}
