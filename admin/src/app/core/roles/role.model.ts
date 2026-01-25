import { OperationLevel } from "@core/roles/operation-level.enum";
import { Role } from "./role.class";

export interface RolesPayload {
  rows: Role[];
  total: number;
}

export interface Functionality {
  id: number;
  appId: number;
  name: string;
  description: string;
  key: string; // TODO: union type in frontend?
}

export type OperationKey = "read" | "write" | "add_archive" | "delete";

export interface Operation {
  id: OperationLevel;
  name: string;
  description: string;
  key: OperationKey;
}

export interface Permission {
  roleId?: number;
  functionalityKey: number;
  operationId: OperationLevel;
}

export const OperationIcon: Record<OperationKey, string> = {
  read: "pi pi-eye",
  write: "pi pi-pencil",
  add_archive: "pi pi-plus",
  delete: "pi pi-trash",
};
