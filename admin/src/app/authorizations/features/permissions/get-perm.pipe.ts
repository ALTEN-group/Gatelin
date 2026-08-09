import { Pipe, PipeTransform } from "@angular/core";
import { Permission } from "app/authorizations/data-access/permissions/permission.model";
import { PermTreeNodeData } from "app/authorizations/features/permissions/permissions-tree.model";

@Pipe({
  name: "getPerm",
})
export class GetPermPipe implements PipeTransform {
  transform(
    nodeData: PermTreeNodeData,
    _roleId: number | null,
  ): Permission | undefined {
    if (nodeData.type !== "operation") return undefined;
    return nodeData.perm;
  }
}
