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
  protected: boolean;
}

export interface OperationNodeData {
  type: "operation";
  id: number;
  routeId: number;
  routeName: string;
  routeProtected: boolean;
  name: string;
  color: string | null;
  perm: Permission | undefined;
  availableFields: string[];
  availableScopes: string[];
  availableConditions: { id: number; name: string; color: string | null }[];
}

export type PermTreeNodeData =
  | ServiceNodeData
  | ResourceNodeData
  | RouteNodeData
  | OperationNodeData;
