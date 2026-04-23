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
import { Resource } from "app/admin/data-access/resources/resource.model";
import { Scope } from "app/admin/data-access/scopes/scope.model";
import { ScopesService } from "app/admin/data-access/scopes/scopes.service";
import { Service } from "app/admin/data-access/services/service.model";
import { SelectModule } from "primeng/select";
import { TableLazyLoadEvent } from "primeng/table";

@Component({
  selector: "adm-scopes",
  templateUrl: "./scopes.component.html",
  styleUrl: "./scopes.component.scss",
  imports: [TableComponent, SelectModule, FormsModule],
  providers: [ConfigHelper],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScopesComponent {
  private readonly scopesService = inject(ScopesService);
  private readonly configHelper = inject(ConfigHelper<ScopesService>);
  private readonly route = inject(ActivatedRoute);

  public readonly applications: GatewayApplication[] =
    this.route.snapshot.data["applications"] ?? [];
  private readonly services: Service[] =
    this.route.snapshot.data["services"] ?? [];
  private readonly resources: Resource[] =
    this.route.snapshot.data["resources"] ?? [];

  public readonly selectedApp = signal<GatewayApplication | null>(null);
  private readonly reloadTrigger = signal(0);
  public readonly forceReload = this.reloadTrigger.asReadonly();

  public readonly config = this.configHelper.getConfig(this.scopesService);
  public readonly entityFactory = this.scopesService.entityFactory;
  public readonly tableInformation = TABLES.scopes;

  public readonly httpCalls: Calls<Scope> = {
    ...this.scopesService.httpCalls,
    get: (event: TableLazyLoadEvent) => {
      const app = this.selectedApp();
      if (app) {
        const serviceIds = new Set(
          this.services
            .filter((s) => s.appId === app.id)
            .map((s) => s.id),
        );
        const resourceNames = this.resources
          .filter((r) => serviceIds.has(r.serviceId))
          .map((r) => r.name);
        return this.scopesService.httpCalls.get!({
          ...event,
          filters: {
            ...event?.filters,
            resourceName: [{ value: resourceNames, matchMode: "in" }],
          },
        });
      }
      return this.scopesService.httpCalls.get!(event);
    },
  };

  public onAppSelect(): void {
    this.reloadTrigger.update((c) => c + 1);
  }
}
