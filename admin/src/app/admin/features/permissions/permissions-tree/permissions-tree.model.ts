import { Permission } from "app/admin/data-access/permissions/permission.model";

export interface ServiceNodeData {
  type: "service";
  id: number;
  name: string;
}

export interface ResourceNodeData {
  type: "resource";
  id: number;
  name: string;
}

export interface RouteNodeData {
  type: "route";
  id: number;
  name: string;
  operationIds: number[];
  rolePerms: Record<number, Permission>;
  availableFields: string[];
  availableScopes: string[];
  availableConditions: { id: number; name: string; color: string | null }[];
}

export type PermTreeNodeData =
  | ServiceNodeData
  | ResourceNodeData
  | RouteNodeData;
