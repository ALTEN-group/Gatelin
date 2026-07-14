import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { TableComponent } from "@dwtechs/ngx-crud-builder";
import { MethodsService } from "app/routing/data-access/methods/methods.service";

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
}
