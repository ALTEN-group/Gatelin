import { Component, input, output } from "@angular/core";
import { ProtectFeatureDirective } from "@core/access/protect-feature.directive";
import { CrudFeatures } from "@crud/core/utils/table/crud-loader.class";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "tbl-table-actions-cell",
  templateUrl: "./table-actions-cell.component.html",
  styleUrls: ["./table-actions-cell.component.scss"],
  imports: [ButtonModule, ProtectFeatureDirective, TooltipModule],
})
export class TableActionsCellComponent {
  readonly features = input.required<CrudFeatures>();
  public readonly functionalityKey = input<string>();

  readonly editClicked = output();
  readonly deleteClicked = output();

  public onEdit(): void {
    this.editClicked.emit();
  }

  public onDelete(): void {
    this.deleteClicked.emit();
  }
}
