import { inject, Pipe, PipeTransform } from "@angular/core";
import { AclService } from "@core/acl/acl.service";
import { AdminEntity } from "@core/app-config/app.entities";
import { Calls } from "@dwtechs/crud-builder";

@Pipe({
  name: "hasAccess",
})
export class ProtectFeaturePipe implements PipeTransform {
  private readonly aclService = inject(AclService);

  transform(
    functionalityKey: AdminEntity | undefined,
    operation: keyof Calls<unknown> | undefined,
  ): boolean {
    return this.aclService.hasAccess(functionalityKey, operation);
  }
}
