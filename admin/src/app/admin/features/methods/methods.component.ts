import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { disabledRowRenderer } from "@core/utils/renderers/disabled.renderer";
import { TableComponent } from "@dwtechs/crud-builder";
import { Method } from "app/admin/data-access/methods/method.model";
import { MethodsService } from "app/admin/data-access/methods/methods.service";

@Component({
  selector: "adm-methods",
  templateUrl: "./methods.component.html",
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MethodsComponent {
  private readonly methodsService = inject(MethodsService);

  public readonly config = this.methodsService.config;

  public readonly entityFactory = this.methodsService.entityFactory;

  public readonly httpCalls = this.methodsService.httpCalls;

  public readonly tableInformation = TABLES.methods;

  public readonly rowStyles = (row: Method) =>
    disabledRowRenderer(row, !!this.httpCalls.update);
}
