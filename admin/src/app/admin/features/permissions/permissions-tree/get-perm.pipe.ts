import { Pipe, PipeTransform } from "@angular/core";
import { Permission } from "app/admin/data-access/permissions/permission.model";
import { PermTreeNodeData } from "app/admin/features/permissions/permissions-tree/permissions-tree.model";

@Pipe({
  name: "getPerm",
})
export class GetPermPipe implements PipeTransform {
  transform(
    nodeData: PermTreeNodeData,
    roleId: number | null,
  ): Permission | undefined {
    if (nodeData.type !== "route" || roleId === null) return undefined;
    return nodeData.rolePerms[roleId];
  }
}
