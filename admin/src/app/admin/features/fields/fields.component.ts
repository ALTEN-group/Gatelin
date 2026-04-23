import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TABLES } from "@core/app-config/app.tables";
import { Calls, ConfigHelper, TableComponent } from "@dwtechs/crud-builder";
import { GatewayApplication } from "app/admin/data-access/applications/application.model";
import { Field } from "app/admin/data-access/fields/field.model";
import { FieldsService } from "app/admin/data-access/fields/fields.service";
import { Service } from "app/admin/data-access/services/service.model";
import { SelectModule } from "primeng/select";
import { TableLazyLoadEvent } from "primeng/table";

@Component({
  selector: "adm-fields",
  templateUrl: "./fields.component.html",
  styleUrl: "./fields.component.scss",
  imports: [TableComponent, SelectModule, FormsModule],
  providers: [ConfigHelper],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsComponent {
  private readonly fieldsService = inject(FieldsService);
  private readonly configHelper = inject(ConfigHelper<FieldsService>);
  private readonly route = inject(ActivatedRoute);

  public readonly applications: GatewayApplication[] =
    this.route.snapshot.data["applications"] ?? [];
  private readonly services: Service[] =
    this.route.snapshot.data["services"] ?? [];

  public readonly selectedApp = signal<GatewayApplication | null>(null);
  private readonly reloadTrigger = signal(0);
  public readonly forceReload = this.reloadTrigger.asReadonly();

  public readonly config = this.configHelper.getConfig(this.fieldsService);
  public readonly entityFactory = this.fieldsService.entityFactory;
  public readonly tableInformation = TABLES.fields;

  public readonly httpCalls: Calls<Field> = {
    ...this.fieldsService.httpCalls,
    get: (event: TableLazyLoadEvent) => {
      const app = this.selectedApp();
      if (app) {
        const serviceNames = this.services
          .filter((s) => s.appId === app.id)
          .map((s) => s.name);
        return this.fieldsService.httpCalls.get!({
          ...event,
          filters: {
            ...event?.filters,
            serviceName: [{ value: serviceNames, matchMode: "in" }],
          },
        });
      }
      return this.fieldsService.httpCalls.get!(event);
    },
  };

  public onAppSelect(): void {
    this.reloadTrigger.update((c) => c + 1);
  }
}
