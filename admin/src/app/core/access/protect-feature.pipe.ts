import { Pipe, PipeTransform, inject } from "@angular/core";
import { AccessLevelsService } from "@core/access/access-levels.service";

@Pipe({
  name: "hasAccess",
})
export class ProtectFeaturePipe implements PipeTransform {
  private readonly accessControl = inject(AccessLevelsService);

  transform(
    functionalityKey: string | undefined,
    operation: number | undefined,
  ): boolean {
    return this.accessControl.userHasAccess(functionalityKey, operation);
  }
}
