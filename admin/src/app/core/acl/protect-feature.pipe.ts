import { inject, Pipe, PipeTransform } from "@angular/core";
import { AclService } from "@core/acl/acl.service";

@Pipe({
  name: "hasAccess",
})
export class ProtectFeaturePipe implements PipeTransform {
  private readonly aclService = inject(AclService);

  transform(
    functionalityKey: string | undefined,
    operation: number | undefined,
  ): boolean {
    return this.aclService.resolveAccess(functionalityKey, operation);
  }
}
