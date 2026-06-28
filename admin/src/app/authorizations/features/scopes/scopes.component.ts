import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TABLES } from "@core/app-config/app.tables";
import { InfoMessageComponent } from "@core/ui/info-message/info-message.component";
import { ConfigHelper, TableComponent } from "@dwtechs/crud-builder";
import { ScopesService } from "app/authorizations/data-access/scopes/scopes.service";

@Component({
  selector: "adm-scopes",
  templateUrl: "./scopes.component.html",
  styleUrl: "./scopes.component.scss",
  imports: [TableComponent, InfoMessageComponent],
  providers: [ConfigHelper],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScopesComponent {
  public readonly scopesService = inject(ScopesService);
  private readonly configHelper = inject(ConfigHelper<ScopesService>);

  public readonly config = this.configHelper.getConfig(this.scopesService);
  public readonly entityFactory = this.scopesService.entityFactory;
  public readonly tableInformation = TABLES.scopes;
}
